using System.ComponentModel.DataAnnotations;

namespace AzureInventoryDashboard.Models;

public class Customer
{
    [Key]
    public int Id { get; set; }

    [Required]
    [StringLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string TenantId { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string ClientId { get; set; } = string.Empty;

    [Required]
    public string ClientSecret { get; set; } = string.Empty;

    [StringLength(100)]
    public string? SubscriptionId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? LastSyncedAt { get; set; }

    public bool IsActive { get; set; } = true;

    // Navigation property
    public ICollection<AzureResource> Resources { get; set; } = new List<AzureResource>();
}
