using System.ComponentModel.DataAnnotations;

namespace AzureInventoryDashboard.Models.ViewModels;

public class CustomerViewModel
{
    public int? Id { get; set; }

    [Required(ErrorMessage = "Customer name is required")]
    [Display(Name = "Customer Name")]
    [StringLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Tenant ID is required")]
    [Display(Name = "Azure Tenant ID")]
    [StringLength(100)]
    public string TenantId { get; set; } = string.Empty;

    [Required(ErrorMessage = "Client ID is required")]
    [Display(Name = "App Registration Client ID")]
    [StringLength(100)]
    public string ClientId { get; set; } = string.Empty;

    [Required(ErrorMessage = "Client Secret is required")]
    [Display(Name = "App Registration Client Secret")]
    [DataType(DataType.Password)]
    public string ClientSecret { get; set; } = string.Empty;

    [Display(Name = "Subscription ID (Optional)")]
    [StringLength(100)]
    public string? SubscriptionId { get; set; }

    public DateTime? LastSyncedAt { get; set; }

    public int ResourceCount { get; set; }
}
