# Quick Setup Guide - Azure Inventory Dashboard

This guide will help you get the Azure Inventory Dashboard up and running quickly.

## Step-by-Step Setup

### 1. Prerequisites Check

Before starting, ensure you have:
- [ ] Windows machine (or Linux/Mac with SQL Server)
- [ ] .NET 8.0 SDK installed ([Download here](https://dotnet.microsoft.com/download))
- [ ] SQL Server Express installed ([Download here](https://www.microsoft.com/en-us/sql-server/sql-server-downloads))
- [ ] Azure tenant access with ability to create app registrations

### 2. Verify .NET Installation

Open a command prompt or terminal and run:

```bash
dotnet --version
```

You should see version 8.0 or higher.

### 3. Verify SQL Server

Check if SQL Server Express is running:

**Windows:**
1. Press `Win + R`, type `services.msc`, press Enter
2. Look for "SQL Server (SQLEXPRESS)" in the list
3. Ensure it's running (Status: Running)

**Alternative:** Try connecting with this command:
```bash
sqlcmd -S .\SQLEXPRESS -E -Q "SELECT @@VERSION"
```

### 4. Download/Clone the Project

If you haven't already:
```bash
git clone <repository-url>
cd AzureInventoryDashboard
```

### 5. Configure Database Connection

Open `appsettings.json` and verify the connection string:

**For Windows Authentication (default):**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.\\SQLEXPRESS;Database=AzureInventoryDB;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
  }
}
```

**For SQL Authentication:**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.\\SQLEXPRESS;Database=AzureInventoryDB;User Id=sa;Password=YourPassword;TrustServerCertificate=True;MultipleActiveResultSets=true"
  }
}
```

### 6. Install NuGet Packages

```bash
dotnet restore
```

### 7. Create Database

Install EF Core tools if you haven't:
```bash
dotnet tool install --global dotnet-ef
```

Create the database:
```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

You should see output like:
```
Build succeeded.
Applying migration '20250116_InitialCreate'.
Done.
```

### 8. Run the Application

```bash
dotnet run
```

Or with hot reload:
```bash
dotnet watch run
```

### 9. Access the Dashboard

Open your browser and navigate to:
```
https://localhost:5001
```

**Default Login:**
- Username: `admin`
- Password: `Admin@123`

### 10. Add Your First Customer

After logging in:

1. Click **"Add New Customer"**
2. Fill in the form (see Azure Setup below)
3. Click **"Create Customer"**
4. Click **"Sync Resources"** to discover Azure resources

---

## Azure App Registration Setup

### For Each Customer Tenant:

#### 1. Create App Registration

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory**
3. Click **App registrations** → **New registration**
4. Name: `Azure Inventory Dashboard`
5. Supported account types: **Accounts in this organizational directory only**
6. Click **Register**

#### 2. Note the IDs

From the **Overview** page, copy:
- **Application (client) ID** → This is your `Client ID`
- **Directory (tenant) ID** → This is your `Tenant ID`

#### 3. Create Client Secret

1. Go to **Certificates & secrets**
2. Click **New client secret**
3. Description: `Dashboard Access`
4. Expires: Choose duration (recommend 24 months)
5. Click **Add**
6. **IMMEDIATELY COPY THE VALUE** (you can't see it again!)

#### 4. Assign Azure Permissions

**Option A: Subscription Level**
1. Go to **Subscriptions**
2. Select your subscription
3. Click **Access control (IAM)**
4. Click **Add** → **Add role assignment**
5. Role: **Reader**
6. Members: Search for `Azure Inventory Dashboard`
7. Click **Review + assign**

Repeat for **Monitoring Reader** role.

**Option B: Resource Group Level**
1. Go to your **Resource Group**
2. Click **Access control (IAM)**
3. Add **Reader** and **Monitoring Reader** roles
4. Assign to `Azure Inventory Dashboard` app

#### 5. Get Subscription ID (Optional)

1. Go to **Subscriptions**
2. Copy the **Subscription ID**

---

## First Customer Configuration

When adding your first customer in the dashboard, use:

| Field | Value |
|-------|-------|
| Customer Name | Your company name (e.g., "Contoso Ltd") |
| Tenant ID | From step 2 above |
| Client ID | From step 2 above |
| Client Secret | From step 3 above |
| Subscription ID | From step 5 above (optional) |

---

## Troubleshooting

### "Cannot connect to database"

**Solution 1:** Verify SQL Server is running
```bash
# Windows: Check services
services.msc
# Look for "SQL Server (SQLEXPRESS)"
```

**Solution 2:** Update connection string
Try `Server=localhost\\SQLEXPRESS` or `Server=(localdb)\\MSSQLLocalDB`

**Solution 3:** Enable TCP/IP
1. Open "SQL Server Configuration Manager"
2. SQL Server Network Configuration → Protocols for SQLEXPRESS
3. Enable TCP/IP
4. Restart SQL Server service

### "Login failed for user"

If using SQL authentication:
1. Open SQL Server Management Studio (SSMS)
2. Connect to `.\SQLEXPRESS`
3. Security → Logins → Right-click `sa` → Properties
4. Set password
5. Server Properties → Security → Enable "SQL Server and Windows Authentication mode"
6. Restart SQL Server

### "Could not find a part of the path"

Make sure you're in the correct directory:
```bash
cd AzureInventoryDashboard
```

### Azure Sync Returns "Unauthorized"

1. Verify app registration has Reader role
2. Check client secret hasn't expired
3. Verify tenant ID and client ID are correct
4. Wait a few minutes after assigning permissions (Azure propagation delay)

### No Metrics Showing

1. Ensure VM is running (stopped VMs don't generate metrics)
2. Add "Monitoring Reader" role to app registration
3. Enable Azure diagnostics on VMs
4. Wait 5-10 minutes for metrics to populate

---

## Next Steps

After successful setup:

1. **Change Default Password**
   - Create a new user management page
   - Or manually update the password in the database

2. **Add More Customers**
   - Repeat Azure setup for each tenant
   - Add them via the Customers page

3. **Schedule Regular Syncs**
   - Consider adding a background job (Hangfire, Quartz.NET)
   - Or use Windows Task Scheduler to call sync endpoint

4. **Customize Dashboard**
   - Modify `wwwroot/css/site.css` for theme changes
   - Add more resource types in `Services/AzureService.cs`
   - Create additional reports and views

5. **Backup Database**
   ```bash
   # Create backup directory
   mkdir C:\Backups

   # Backup command (run in SSMS or sqlcmd)
   BACKUP DATABASE AzureInventoryDB
   TO DISK = 'C:\Backups\AzureInventoryDB.bak'
   ```

---

## Production Deployment

For production deployment:

1. **Use Production SQL Server**
   - Update connection string
   - Enable SSL/TLS
   - Implement connection pooling

2. **Secure Secrets**
   - Use Azure Key Vault or similar
   - Encrypt client secrets in database
   - Use managed identities where possible

3. **Enable HTTPS**
   - Already configured in the app
   - Use proper SSL certificates

4. **Add Logging**
   - Configure Serilog or similar
   - Send logs to Azure Application Insights

5. **Deploy to Azure App Service**
   - Create App Service plan
   - Deploy code
   - Update connection strings
   - Configure authentication

---

## Support & Resources

- **Entity Framework Core Docs:** https://docs.microsoft.com/ef/core/
- **Azure SDK for .NET:** https://docs.microsoft.com/dotnet/azure/
- **ASP.NET Core MVC:** https://docs.microsoft.com/aspnet/core/mvc/
- **Chart.js Documentation:** https://www.chartjs.org/docs/

---

## Quick Command Reference

```bash
# Restore packages
dotnet restore

# Build project
dotnet build

# Run application
dotnet run

# Watch mode (hot reload)
dotnet watch run

# Create migration
dotnet ef migrations add MigrationName

# Update database
dotnet ef database update

# Rollback migration
dotnet ef database update PreviousMigrationName

# Remove last migration
dotnet ef migrations remove
```

---

**You're all set! Happy monitoring! 🚀**
