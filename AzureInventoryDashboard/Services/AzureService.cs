using Azure.Core;
using Azure.Identity;
using Azure.ResourceManager;
using Azure.ResourceManager.Compute;
using Azure.ResourceManager.Monitor;
using Azure.ResourceManager.Monitor.Models;
using Azure.ResourceManager.Network;
using Azure.ResourceManager.RecoveryServicesBackup;
using Azure.ResourceManager.Resources;
using AzureInventoryDashboard.Data;
using AzureInventoryDashboard.Models;
using AzureInventoryDashboard.Models.ViewModels;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace AzureInventoryDashboard.Services;

public class AzureService : IAzureService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<AzureService> _logger;

    public AzureService(ApplicationDbContext context, ILogger<AzureService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<(bool success, string message, int resourceCount)> SyncCustomerResourcesAsync(Customer customer)
    {
        try
        {
            var credential = new ClientSecretCredential(
                customer.TenantId,
                customer.ClientId,
                customer.ClientSecret
            );

            var armClient = new ArmClient(credential);
            var subscriptions = armClient.GetSubscriptions();

            int totalResourceCount = 0;

            await foreach (var subscription in subscriptions)
            {
                _logger.LogInformation($"Syncing resources for subscription: {subscription.Data.DisplayName}");

                var resources = subscription.GetGenericResourcesAsync();

                await foreach (var resource in resources)
                {
                    try
                    {
                        var existingResource = await _context.AzureResources
                            .FirstOrDefaultAsync(r => r.ResourceId == resource.Id.ToString());

                        var tags = resource.Data.Tags != null
                            ? JsonSerializer.Serialize(resource.Data.Tags)
                            : null;

                        if (existingResource != null)
                        {
                            existingResource.Name = resource.Data.Name;
                            existingResource.Type = resource.Data.ResourceType.ToString();
                            existingResource.Location = resource.Data.Location?.Name;
                            existingResource.SubscriptionId = subscription.Id.SubscriptionId;
                            existingResource.Tags = tags;
                            existingResource.LastUpdatedAt = DateTime.UtcNow;
                        }
                        else
                        {
                            var newResource = new AzureResource
                            {
                                CustomerId = customer.Id,
                                ResourceId = resource.Id.ToString(),
                                Name = resource.Data.Name,
                                Type = resource.Data.ResourceType.ToString(),
                                ResourceGroup = resource.Id.ResourceGroupName,
                                Location = resource.Data.Location?.Name,
                                SubscriptionId = subscription.Id.SubscriptionId,
                                Tags = tags,
                                DiscoveredAt = DateTime.UtcNow,
                                LastUpdatedAt = DateTime.UtcNow
                            };

                            _context.AzureResources.Add(newResource);
                        }

                        totalResourceCount++;

                        // Sync VM details if this is a virtual machine
                        if (resource.Data.ResourceType.ToString().Contains("Microsoft.Compute/virtualMachines", StringComparison.OrdinalIgnoreCase))
                        {
                            await SyncVirtualMachineDetailsAsync(armClient, resource.Id.ToString(), subscription.Id.SubscriptionId!);
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError($"Error syncing resource {resource.Data.Name}: {ex.Message}");
                    }
                }
            }

            customer.LastSyncedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return (true, $"Successfully synced {totalResourceCount} resources", totalResourceCount);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error syncing customer {customer.Name}: {ex.Message}");
            return (false, $"Error: {ex.Message}", 0);
        }
    }

    private async Task SyncVirtualMachineDetailsAsync(ArmClient armClient, string resourceId, string subscriptionId)
    {
        try
        {
            var vmResourceId = new ResourceIdentifier(resourceId);
            var vm = armClient.GetVirtualMachineResource(vmResourceId);
            var vmData = await vm.GetAsync();

            var azureResource = await _context.AzureResources
                .FirstOrDefaultAsync(r => r.ResourceId == resourceId);

            if (azureResource == null) return;

            var vmDetails = await _context.VirtualMachineDetails
                .FirstOrDefaultAsync(v => v.AzureResourceId == azureResource.Id);

            // Get power state
            var instanceView = await vm.InstanceViewAsync();
            var powerState = instanceView.Value.Statuses?
                .FirstOrDefault(s => s.Code?.StartsWith("PowerState/") == true)?
                .Code?.Replace("PowerState/", "");

            // Get NICs
            var nics = new List<string>();
            var hasPublicIp = false;
            string? publicIpAddress = null;

            if (vmData.Value.Data.NetworkProfile?.NetworkInterfaces != null)
            {
                foreach (var nicRef in vmData.Value.Data.NetworkProfile.NetworkInterfaces)
                {
                    if (nicRef.Id != null)
                    {
                        nics.Add(nicRef.Id.Name);

                        try
                        {
                            var nicResource = armClient.GetNetworkInterfaceResource(nicRef.Id);
                            var nicData = await nicResource.GetAsync();

                            foreach (var ipConfig in nicData.Value.Data.IPConfigurations)
                            {
                                if (ipConfig.PublicIPAddress != null)
                                {
                                    hasPublicIp = true;
                                    var pipResource = armClient.GetPublicIPAddressResource(ipConfig.PublicIPAddress.Id);
                                    var pipData = await pipResource.GetAsync();
                                    publicIpAddress = pipData.Value.Data.IPAddress;
                                }
                            }
                        }
                        catch (Exception ex)
                        {
                            _logger.LogWarning($"Error getting NIC details: {ex.Message}");
                        }
                    }
                }
            }

            // Get Disks
            var disks = new List<string>();
            if (vmData.Value.Data.StorageProfile?.OSDisk != null)
            {
                disks.Add($"OS Disk: {vmData.Value.Data.StorageProfile.OSDisk.Name}");
            }
            if (vmData.Value.Data.StorageProfile?.DataDisks != null)
            {
                foreach (var disk in vmData.Value.Data.StorageProfile.DataDisks)
                {
                    disks.Add($"Data Disk: {disk.Name}");
                }
            }

            // Check backup status (simplified - would need more complex logic in production)
            bool backupEnabled = false;
            string? backupVaultName = null;

            if (vmDetails != null)
            {
                vmDetails.VmSize = vmData.Value.Data.HardwareProfile?.VmSize;
                vmDetails.OsType = vmData.Value.Data.StorageProfile?.OSDisk?.OSType?.ToString();
                vmDetails.Disks = JsonSerializer.Serialize(disks);
                vmDetails.NetworkInterfaces = JsonSerializer.Serialize(nics);
                vmDetails.HasPublicIp = hasPublicIp;
                vmDetails.PublicIpAddress = publicIpAddress;
                vmDetails.BackupEnabled = backupEnabled;
                vmDetails.BackupVaultName = backupVaultName;
                vmDetails.ProvisioningState = vmData.Value.Data.ProvisioningState;
                vmDetails.PowerState = powerState;
                vmDetails.LastUpdatedAt = DateTime.UtcNow;
            }
            else
            {
                var newVmDetails = new VirtualMachineDetails
                {
                    AzureResourceId = azureResource.Id,
                    VmSize = vmData.Value.Data.HardwareProfile?.VmSize,
                    OsType = vmData.Value.Data.StorageProfile?.OSDisk?.OSType?.ToString(),
                    Disks = JsonSerializer.Serialize(disks),
                    NetworkInterfaces = JsonSerializer.Serialize(nics),
                    HasPublicIp = hasPublicIp,
                    PublicIpAddress = publicIpAddress,
                    BackupEnabled = backupEnabled,
                    BackupVaultName = backupVaultName,
                    ProvisioningState = vmData.Value.Data.ProvisioningState,
                    PowerState = powerState,
                    LastUpdatedAt = DateTime.UtcNow
                };

                _context.VirtualMachineDetails.Add(newVmDetails);
            }

            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error syncing VM details: {ex.Message}");
        }
    }

    public async Task<List<VirtualMachineViewModel>> GetVirtualMachinesAsync(int customerId)
    {
        var vms = await _context.AzureResources
            .Where(r => r.CustomerId == customerId && r.Type.Contains("Microsoft.Compute/virtualMachines"))
            .Include(r => r.Customer)
            .ToListAsync();

        var vmViewModels = new List<VirtualMachineViewModel>();

        foreach (var vm in vms)
        {
            var vmDetails = await _context.VirtualMachineDetails
                .FirstOrDefaultAsync(v => v.AzureResourceId == vm.Id);

            var vmViewModel = new VirtualMachineViewModel
            {
                ResourceId = vm.Id,
                Name = vm.Name,
                ResourceGroup = vm.ResourceGroup ?? "",
                Location = vm.Location ?? "",
                VmSize = vmDetails?.VmSize,
                OsType = vmDetails?.OsType,
                PowerState = vmDetails?.PowerState,
                HasPublicIp = vmDetails?.HasPublicIp ?? false,
                PublicIpAddress = vmDetails?.PublicIpAddress,
                BackupEnabled = vmDetails?.BackupEnabled ?? false
            };

            if (vmDetails?.Disks != null)
            {
                vmViewModel.Disks = JsonSerializer.Deserialize<List<string>>(vmDetails.Disks) ?? new List<string>();
            }

            if (vmDetails?.NetworkInterfaces != null)
            {
                vmViewModel.NetworkInterfaces = JsonSerializer.Deserialize<List<string>>(vmDetails.NetworkInterfaces) ?? new List<string>();
            }

            vmViewModels.Add(vmViewModel);
        }

        return vmViewModels;
    }

    public async Task<VirtualMachineMetricsViewModel> GetVirtualMachineMetricsAsync(int customerId, int resourceId)
    {
        var resource = await _context.AzureResources
            .Include(r => r.Customer)
            .FirstOrDefaultAsync(r => r.Id == resourceId && r.CustomerId == customerId);

        if (resource == null)
        {
            throw new Exception("Virtual machine not found");
        }

        var vmDetails = await _context.VirtualMachineDetails
            .FirstOrDefaultAsync(v => v.AzureResourceId == resource.Id);

        var vmViewModel = new VirtualMachineViewModel
        {
            ResourceId = resource.Id,
            Name = resource.Name,
            ResourceGroup = resource.ResourceGroup ?? "",
            Location = resource.Location ?? "",
            VmSize = vmDetails?.VmSize,
            OsType = vmDetails?.OsType,
            PowerState = vmDetails?.PowerState,
            HasPublicIp = vmDetails?.HasPublicIp ?? false,
            PublicIpAddress = vmDetails?.PublicIpAddress,
            BackupEnabled = vmDetails?.BackupEnabled ?? false
        };

        if (vmDetails?.Disks != null)
        {
            vmViewModel.Disks = JsonSerializer.Deserialize<List<string>>(vmDetails.Disks) ?? new List<string>();
        }

        if (vmDetails?.NetworkInterfaces != null)
        {
            vmViewModel.NetworkInterfaces = JsonSerializer.Deserialize<List<string>>(vmDetails.NetworkInterfaces) ?? new List<string>();
        }

        // Get metrics from Azure Monitor
        var metrics = new List<MetricData>();

        try
        {
            var credential = new ClientSecretCredential(
                resource.Customer.TenantId,
                resource.Customer.ClientId,
                resource.Customer.ClientSecret
            );

            var armClient = new ArmClient(credential);
            var vmResourceId = new ResourceIdentifier(resource.ResourceId);
            var vm = armClient.GetVirtualMachineResource(vmResourceId);

            var endTime = DateTime.UtcNow;
            var startTime = endTime.AddHours(-24);

            var metricNames = new[] { "Percentage CPU", "Network In Total", "Network Out Total", "Disk Read Bytes", "Disk Write Bytes" };

            foreach (var metricName in metricNames)
            {
                try
                {
                    var metricsResult = await vm.GetMonitorMetricsAsync(
                        new MonitorMetricsQueryOptions(
                            new[] { metricName },
                            new MonitorTimeSpan(startTime, endTime)
                        )
                        {
                            Granularity = TimeSpan.FromHours(1),
                            Aggregations = { MonitorMetricAggregationType.Average, MonitorMetricAggregationType.Minimum, MonitorMetricAggregationType.Maximum }
                        }
                    );

                    var metricData = new MetricData
                    {
                        MetricName = metricName,
                        Values = new List<MetricValue>()
                    };

                    foreach (var metric in metricsResult.Value.Metrics)
                    {
                        metricData.Unit = metric.Unit;

                        foreach (var timeseries in metric.Timeseries)
                        {
                            foreach (var dataPoint in timeseries.Data)
                            {
                                metricData.Values.Add(new MetricValue
                                {
                                    Timestamp = dataPoint.TimeStamp,
                                    Average = dataPoint.Average,
                                    Minimum = dataPoint.Minimum,
                                    Maximum = dataPoint.Maximum
                                });
                            }
                        }
                    }

                    metrics.Add(metricData);
                }
                catch (Exception ex)
                {
                    _logger.LogWarning($"Error getting metric {metricName}: {ex.Message}");
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting VM metrics: {ex.Message}");
        }

        return new VirtualMachineMetricsViewModel
        {
            VmDetails = vmViewModel,
            Metrics = metrics
        };
    }
}
