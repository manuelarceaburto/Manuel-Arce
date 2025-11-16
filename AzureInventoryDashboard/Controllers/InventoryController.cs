using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AzureInventoryDashboard.Data;
using AzureInventoryDashboard.Models.ViewModels;

namespace AzureInventoryDashboard.Controllers;

[Authorize]
public class InventoryController : Controller
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<InventoryController> _logger;

    public InventoryController(ApplicationDbContext context, ILogger<InventoryController> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<IActionResult> Index(int customerId)
    {
        var customer = await _context.Customers
            .Include(c => c.Resources)
            .FirstOrDefaultAsync(c => c.Id == customerId);

        if (customer == null)
        {
            return NotFound();
        }

        var resources = await _context.AzureResources
            .Where(r => r.CustomerId == customerId)
            .OrderBy(r => r.Type)
            .ThenBy(r => r.Name)
            .ToListAsync();

        var resourceCounts = resources
            .GroupBy(r => r.Type)
            .ToDictionary(g => g.Key, g => g.Count());

        var model = new InventoryViewModel
        {
            CustomerName = customer.Name,
            CustomerId = customer.Id,
            LastSyncedAt = customer.LastSyncedAt,
            TotalResources = resources.Count,
            ResourceCounts = resourceCounts,
            VirtualMachineCount = resourceCounts.GetValueOrDefault("Microsoft.Compute/virtualMachines", 0),
            VirtualNetworkCount = resourceCounts.GetValueOrDefault("Microsoft.Network/virtualNetworks", 0),
            StorageAccountCount = resourceCounts.GetValueOrDefault("Microsoft.Storage/storageAccounts", 0),
            SqlDatabaseCount = resourceCounts.GetValueOrDefault("Microsoft.Sql/servers/databases", 0),
            SqlManagedInstanceCount = resourceCounts.GetValueOrDefault("Microsoft.Sql/managedInstances", 0),
            NetworkSecurityGroupCount = resourceCounts.GetValueOrDefault("Microsoft.Network/networkSecurityGroups", 0),
            PublicIpCount = resourceCounts.GetValueOrDefault("Microsoft.Network/publicIPAddresses", 0),
            LoadBalancerCount = resourceCounts.GetValueOrDefault("Microsoft.Network/loadBalancers", 0),
            AppServiceCount = resourceCounts.GetValueOrDefault("Microsoft.Web/sites", 0),
            KeyVaultCount = resourceCounts.GetValueOrDefault("Microsoft.KeyVault/vaults", 0),
            RecentResources = resources.OrderByDescending(r => r.DiscoveredAt).Take(10).ToList()
        };

        return View(model);
    }

    [HttpGet]
    public async Task<IActionResult> GetResourceChartData(int customerId)
    {
        var resourceCounts = await _context.AzureResources
            .Where(r => r.CustomerId == customerId)
            .GroupBy(r => r.Type)
            .Select(g => new { type = g.Key, count = g.Count() })
            .OrderByDescending(x => x.count)
            .Take(10)
            .ToListAsync();

        return Json(resourceCounts);
    }
}
