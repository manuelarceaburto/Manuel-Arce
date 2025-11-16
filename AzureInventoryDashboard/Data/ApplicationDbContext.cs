using Microsoft.EntityFrameworkCore;
using AzureInventoryDashboard.Models;

namespace AzureInventoryDashboard.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Customer> Customers { get; set; } = null!;
    public DbSet<AzureResource> AzureResources { get; set; } = null!;
    public DbSet<VirtualMachineDetails> VirtualMachineDetails { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure relationships
        modelBuilder.Entity<Customer>()
            .HasMany(c => c.Resources)
            .WithOne(r => r.Customer)
            .HasForeignKey(r => r.CustomerId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<AzureResource>()
            .HasIndex(r => r.ResourceId)
            .IsUnique();

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Username)
            .IsUnique();

        // Seed default admin user (password: Admin@123)
        modelBuilder.Entity<User>().HasData(
            new User
            {
                Id = 1,
                Username = "admin",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                Email = "admin@azureinventory.local",
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            }
        );
    }
}
