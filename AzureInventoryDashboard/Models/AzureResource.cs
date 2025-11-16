using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AzureInventoryDashboard.Models;

public class AzureResource
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int CustomerId { get; set; }

    [Required]
    [StringLength(500)]
    public string ResourceId { get; set; } = string.Empty;

    [Required]
    [StringLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string Type { get; set; } = string.Empty;

    [StringLength(200)]
    public string? ResourceGroup { get; set; }

    [StringLength(100)]
    public string? Location { get; set; }

    [StringLength(100)]
    public string? SubscriptionId { get; set; }

    public string? Tags { get; set; } // JSON string

    public string? Properties { get; set; } // JSON string with additional properties

    public DateTime DiscoveredAt { get; set; } = DateTime.UtcNow;

    public DateTime LastUpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    [ForeignKey("CustomerId")]
    public Customer Customer { get; set; } = null!;
}
