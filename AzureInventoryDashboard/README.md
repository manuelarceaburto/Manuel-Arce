# Azure Inventory Dashboard

A comprehensive ASP.NET Core MVC web application for managing and monitoring Azure resources across multiple customer tenants. Features include local authentication, Azure resource synchronization, detailed VM monitoring, and performance metrics visualization.

## Features

- **Local Authentication**: Secure login with SQL Server Express using BCrypt password hashing
- **Multi-Tenant Support**: Manage multiple Azure customers with separate credentials
- **Azure Resource Discovery**: Automatic synchronization of Azure resources using Azure SDK
- **Inventory Dashboard**: Visual representation of resources with charts and statistics
- **Virtual Machine Monitoring**: Detailed VM information including disks, NICs, NSGs, and public IPs
- **Performance Metrics**: Azure Monitor integration for CPU, network, and disk metrics
- **Dark Theme**: Modern, eye-friendly dark UI theme

## Technology Stack

- **Framework**: ASP.NET Core 8.0 MVC
- **Database**: SQL Server Express with Entity Framework Core
- **Authentication**: Cookie-based authentication with BCrypt
- **Azure SDK**: Azure.ResourceManager, Azure.Monitor
- **Frontend**: Razor Views, Chart.js for visualizations
- **Styling**: Custom CSS with dark theme

## Prerequisites

- .NET 8.0 SDK or later
- SQL Server Express (LocalDB or full instance)
- Azure tenant(s) with app registrations configured
- Visual Studio 2022 or VS Code (optional)

## Installation & Setup

### 1. Install SQL Server Express

Download and install SQL Server Express from [Microsoft's website](https://www.microsoft.com/en-us/sql-server/sql-server-downloads).

For Windows authentication, the default connection string should work:
```
Server=.\\SQLEXPRESS;Database=AzureInventoryDB;Trusted_Connection=True;TrustServerCertificate=True
```

### 2. Clone the Repository

```bash
git clone <repository-url>
cd AzureInventoryDashboard
```

### 3. Configure Connection String

Edit `appsettings.json` and update the connection string if needed:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.\\SQLEXPRESS;Database=AzureInventoryDB;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
  }
}
```

**For SQL authentication**, use:
```
Server=.\\SQLEXPRESS;Database=AzureInventoryDB;User Id=YourUsername;Password=YourPassword;TrustServerCertificate=True
```

### 4. Install Dependencies

```bash
dotnet restore
```

### 5. Create Database

Run Entity Framework migrations to create the database:

```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

This will create:
- `AzureInventoryDB` database
- All required tables (Users, Customers, AzureResources, VirtualMachineDetails)
- Default admin user (username: `admin`, password: `Admin@123`)

### 6. Run the Application

```bash
dotnet run
```

Or use Visual Studio:
1. Open the project in Visual Studio
2. Press F5 to run

The application will start at `https://localhost:5001` (or the port shown in console).

### 7. First Login

Navigate to `https://localhost:5001` and login with:
- **Username**: `admin`
- **Password**: `Admin@123`

**Important**: Change the default password after first login!

## Azure App Registration Setup

To sync Azure resources, you need to create an App Registration for each customer tenant:

### 1. Create App Registration

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** → **App registrations**
3. Click **New registration**
4. Enter a name (e.g., "Azure Inventory Dashboard")
5. Select **Accounts in this organizational directory only**
6. Click **Register**

### 2. Create Client Secret

1. In the app registration, go to **Certificates & secrets**
2. Click **New client secret**
3. Enter a description and expiration period
4. Click **Add**
5. **Copy the secret value immediately** (you won't be able to see it again)

### 3. Assign Permissions

The app registration needs the following Azure RBAC roles:

1. Go to **Subscriptions** (or specific resource groups)
2. Click **Access control (IAM)**
3. Click **Add** → **Add role assignment**
4. Select **Reader** role
5. Search for your app registration name
6. Click **Save**

For VM metrics, also assign:
- **Monitoring Reader** role

### 4. Note the Following Information

You'll need these values when adding a customer:
- **Tenant ID**: Found in Azure AD overview
- **Client ID (Application ID)**: Found in app registration overview
- **Client Secret**: The value you copied earlier
- **Subscription ID** (optional): Found in Subscriptions

## Usage Guide

### Adding a Customer

1. Login to the dashboard
2. Click **"Add New Customer"** or navigate to **Customers** → **Add Customer**
3. Fill in the form:
   - Customer Name
   - Azure Tenant ID
   - App Registration Client ID
   - Client Secret
   - Subscription ID (optional)
4. Click **"Create Customer"**

### Syncing Azure Resources

1. From the home page or customer list, click **"Sync Resources"**
2. Wait for the sync to complete (may take a few minutes for large environments)
3. View the discovered resource count

### Viewing Inventory

1. Click on a customer card or **"View Inventory"**
2. See resource statistics and charts
3. Navigate to specific resource types

### Monitoring Virtual Machines

1. From the inventory dashboard, click **"View Virtual Machines"**
2. See all VMs with details:
   - Name, resource group, location
   - VM size, OS type, power state
   - Public IP status
   - Backup status
   - Attached disks and NICs
3. Click **"View Metrics"** on any VM to see performance data

## Database Schema

### Users Table
- Id, Username, PasswordHash, Email, CreatedAt, LastLoginAt, IsActive

### Customers Table
- Id, Name, TenantId, ClientId, ClientSecret, SubscriptionId, CreatedAt, LastSyncedAt, IsActive

### AzureResources Table
- Id, CustomerId, ResourceId, Name, Type, ResourceGroup, Location, SubscriptionId, Tags, Properties, DiscoveredAt, LastUpdatedAt

### VirtualMachineDetails Table
- Id, AzureResourceId, VmSize, OsType, Disks, NetworkInterfaces, NetworkSecurityGroups, HasPublicIp, PublicIpAddress, BackupEnabled, BackupVaultName, ProvisioningState, PowerState, LastUpdatedAt

## Security Considerations

1. **Change Default Password**: Change the admin password immediately after first login
2. **Secure Client Secrets**: Client secrets are stored in the database - consider encryption at rest
3. **HTTPS Only**: Always use HTTPS in production
4. **Connection Strings**: Never commit connection strings with credentials to source control
5. **Access Control**: Limit database access to the application service account only
6. **Regular Updates**: Keep NuGet packages updated for security patches

## Troubleshooting

### Database Connection Issues

If you see "Cannot connect to database" errors:

1. Verify SQL Server Express is running:
   ```bash
   services.msc
   # Look for "SQL Server (SQLEXPRESS)" and ensure it's running
   ```

2. Check connection string in `appsettings.json`

3. Try SQL Server Configuration Manager:
   - Enable TCP/IP protocol
   - Restart SQL Server service

### Azure Sync Issues

If resource sync fails:

1. Verify app registration has correct permissions
2. Check client secret hasn't expired
3. Verify tenant ID, client ID, and subscription ID are correct
4. Check application logs for detailed error messages

### Missing Metrics

If VM metrics don't appear:

1. Ensure VM is running
2. Verify app registration has "Monitoring Reader" role
3. Check that Azure diagnostics is enabled on the VM
4. Metrics may take time to populate for new VMs

## Development

### Adding New Features

The application follows standard ASP.NET Core MVC patterns:

- **Models**: `Models/` directory
- **Views**: `Views/` directory
- **Controllers**: `Controllers/` directory
- **Services**: `Services/` directory
- **Data**: `Data/` directory (DbContext)

### Running Migrations

When you modify models:

```bash
dotnet ef migrations add YourMigrationName
dotnet ef database update
```

### Adding New Resource Types

To add support for new Azure resource types:

1. Update `AzureService.cs` to handle the new type
2. Create view models in `Models/ViewModels/`
3. Add controllers and views as needed
4. Update the inventory dashboard to display the new type

## License

Copyright © 2025 - Crazure Consulting

## Support

For issues or questions, please contact your system administrator or refer to the project documentation.
