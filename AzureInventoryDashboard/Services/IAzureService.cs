using AzureInventoryDashboard.Models;
using AzureInventoryDashboard.Models.ViewModels;

namespace AzureInventoryDashboard.Services;

public interface IAzureService
{
    Task<(bool success, string message, int resourceCount)> SyncCustomerResourcesAsync(Customer customer);
    Task<List<VirtualMachineViewModel>> GetVirtualMachinesAsync(int customerId);
    Task<VirtualMachineMetricsViewModel> GetVirtualMachineMetricsAsync(int customerId, int resourceId);
}
