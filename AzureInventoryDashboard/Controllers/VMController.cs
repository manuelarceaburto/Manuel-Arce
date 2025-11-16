using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AzureInventoryDashboard.Services;

namespace AzureInventoryDashboard.Controllers;

[Authorize]
public class VMController : Controller
{
    private readonly IAzureService _azureService;
    private readonly ILogger<VMController> _logger;

    public VMController(IAzureService azureService, ILogger<VMController> logger)
    {
        _azureService = azureService;
        _logger = logger;
    }

    public async Task<IActionResult> Index(int customerId)
    {
        var vms = await _azureService.GetVirtualMachinesAsync(customerId);
        ViewData["CustomerId"] = customerId;
        return View(vms);
    }

    public async Task<IActionResult> Metrics(int customerId, int resourceId)
    {
        try
        {
            var model = await _azureService.GetVirtualMachineMetricsAsync(customerId, resourceId);
            ViewData["CustomerId"] = customerId;
            return View(model);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error loading VM metrics: {ex.Message}");
            TempData["ErrorMessage"] = "Error loading VM metrics: " + ex.Message;
            return RedirectToAction(nameof(Index), new { customerId });
        }
    }
}
