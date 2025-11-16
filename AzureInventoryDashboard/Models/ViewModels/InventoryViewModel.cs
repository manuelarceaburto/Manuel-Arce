namespace AzureInventoryDashboard.Models.ViewModels;

public class InventoryViewModel
{
    public string CustomerName { get; set; } = string.Empty;
    public int CustomerId { get; set; }
    public DateTime? LastSyncedAt { get; set; }
    public int TotalResources { get; set; }

    // Resource counts by type
    public Dictionary<string, int> ResourceCounts { get; set; } = new();

    // Common resource types
    public int VirtualMachineCount { get; set; }
    public int VirtualNetworkCount { get; set; }
    public int StorageAccountCount { get; set; }
    public int SqlDatabaseCount { get; set; }
    public int SqlManagedInstanceCount { get; set; }
    public int NetworkSecurityGroupCount { get; set; }
    public int PublicIpCount { get; set; }
    public int LoadBalancerCount { get; set; }
    public int AppServiceCount { get; set; }
    public int KeyVaultCount { get; set; }

    // Recent resources
    public List<AzureResource> RecentResources { get; set; } = new();
}
