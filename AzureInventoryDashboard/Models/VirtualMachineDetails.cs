using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AzureInventoryDashboard.Models;

public class VirtualMachineDetails
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int AzureResourceId { get; set; }

    [StringLength(100)]
    public string? VmSize { get; set; }

    [StringLength(100)]
    public string? OsType { get; set; }

    [StringLength(200)]
    public string? OsVersion { get; set; }

    public string? Disks { get; set; } // JSON array

    public string? NetworkInterfaces { get; set; } // JSON array

    public string? NetworkSecurityGroups { get; set; } // JSON array

    public bool HasPublicIp { get; set; }

    public string? PublicIpAddress { get; set; }

    public bool BackupEnabled { get; set; }

    [StringLength(200)]
    public string? BackupVaultName { get; set; }

    public string? ProvisioningState { get; set; }

    public string? PowerState { get; set; }

    public DateTime LastUpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    [ForeignKey("AzureResourceId")]
    public AzureResource AzureResource { get; set; } = null!;
}
