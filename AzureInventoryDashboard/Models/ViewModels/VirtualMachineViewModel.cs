namespace AzureInventoryDashboard.Models.ViewModels;

public class VirtualMachineViewModel
{
    public int ResourceId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string ResourceGroup { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string? VmSize { get; set; }
    public string? OsType { get; set; }
    public string? PowerState { get; set; }
    public bool HasPublicIp { get; set; }
    public string? PublicIpAddress { get; set; }
    public bool BackupEnabled { get; set; }
    public List<string> Disks { get; set; } = new();
    public List<string> NetworkInterfaces { get; set; } = new();
    public List<string> NetworkSecurityGroups { get; set; } = new();
}

public class VirtualMachineMetricsViewModel
{
    public VirtualMachineViewModel VmDetails { get; set; } = new();
    public List<MetricData> Metrics { get; set; } = new();
}

public class MetricData
{
    public string MetricName { get; set; } = string.Empty;
    public string Unit { get; set; } = string.Empty;
    public List<MetricValue> Values { get; set; } = new();
}

public class MetricValue
{
    public DateTime Timestamp { get; set; }
    public double? Average { get; set; }
    public double? Minimum { get; set; }
    public double? Maximum { get; set; }
}
