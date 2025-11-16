using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AzureInventoryDashboard.Data;
using AzureInventoryDashboard.Models;
using AzureInventoryDashboard.Models.ViewModels;
using AzureInventoryDashboard.Services;

namespace AzureInventoryDashboard.Controllers;

[Authorize]
public class CustomerController : Controller
{
    private readonly ApplicationDbContext _context;
    private readonly IAzureService _azureService;
    private readonly ILogger<CustomerController> _logger;

    public CustomerController(
        ApplicationDbContext context,
        IAzureService azureService,
        ILogger<CustomerController> logger)
    {
        _context = context;
        _azureService = azureService;
        _logger = logger;
    }

    public async Task<IActionResult> Index()
    {
        var customers = await _context.Customers
            .Select(c => new CustomerViewModel
            {
                Id = c.Id,
                Name = c.Name,
                TenantId = c.TenantId,
                ClientId = c.ClientId,
                ClientSecret = "********",
                SubscriptionId = c.SubscriptionId,
                LastSyncedAt = c.LastSyncedAt,
                ResourceCount = c.Resources.Count
            })
            .ToListAsync();

        return View(customers);
    }

    [HttpGet]
    public IActionResult Create()
    {
        return View();
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(CustomerViewModel model)
    {
        if (!ModelState.IsValid)
        {
            return View(model);
        }

        var customer = new Customer
        {
            Name = model.Name,
            TenantId = model.TenantId,
            ClientId = model.ClientId,
            ClientSecret = model.ClientSecret,
            SubscriptionId = model.SubscriptionId,
            CreatedAt = DateTime.UtcNow,
            IsActive = true
        };

        _context.Customers.Add(customer);
        await _context.SaveChangesAsync();

        TempData["SuccessMessage"] = $"Customer '{customer.Name}' added successfully!";
        return RedirectToAction(nameof(Index));
    }

    [HttpGet]
    public async Task<IActionResult> Edit(int id)
    {
        var customer = await _context.Customers.FindAsync(id);
        if (customer == null)
        {
            return NotFound();
        }

        var model = new CustomerViewModel
        {
            Id = customer.Id,
            Name = customer.Name,
            TenantId = customer.TenantId,
            ClientId = customer.ClientId,
            ClientSecret = customer.ClientSecret,
            SubscriptionId = customer.SubscriptionId
        };

        return View(model);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(int id, CustomerViewModel model)
    {
        if (id != model.Id)
        {
            return NotFound();
        }

        if (!ModelState.IsValid)
        {
            return View(model);
        }

        var customer = await _context.Customers.FindAsync(id);
        if (customer == null)
        {
            return NotFound();
        }

        customer.Name = model.Name;
        customer.TenantId = model.TenantId;
        customer.ClientId = model.ClientId;
        customer.ClientSecret = model.ClientSecret;
        customer.SubscriptionId = model.SubscriptionId;

        await _context.SaveChangesAsync();

        TempData["SuccessMessage"] = $"Customer '{customer.Name}' updated successfully!";
        return RedirectToAction(nameof(Index));
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Delete(int id)
    {
        var customer = await _context.Customers.FindAsync(id);
        if (customer == null)
        {
            return NotFound();
        }

        customer.IsActive = false;
        await _context.SaveChangesAsync();

        TempData["SuccessMessage"] = $"Customer '{customer.Name}' deleted successfully!";
        return RedirectToAction(nameof(Index));
    }

    [HttpPost]
    public async Task<IActionResult> SyncResources(int id)
    {
        var customer = await _context.Customers.FindAsync(id);
        if (customer == null)
        {
            return Json(new { success = false, message = "Customer not found" });
        }

        var (success, message, resourceCount) = await _azureService.SyncCustomerResourcesAsync(customer);

        return Json(new { success, message, resourceCount });
    }
}
