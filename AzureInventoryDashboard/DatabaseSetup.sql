-- Azure Inventory Dashboard - Database Setup Script
-- Run this script in SQL Server Management Studio or sqlcmd if EF migrations don't work

-- Create database
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'AzureInventoryDB')
BEGIN
    CREATE DATABASE AzureInventoryDB;
    PRINT 'Database AzureInventoryDB created successfully.';
END
ELSE
BEGIN
    PRINT 'Database AzureInventoryDB already exists.';
END
GO

USE AzureInventoryDB;
GO

-- Create Users table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
BEGIN
    CREATE TABLE Users (
        Id INT PRIMARY KEY IDENTITY(1,1),
        Username NVARCHAR(100) NOT NULL UNIQUE,
        PasswordHash NVARCHAR(MAX) NOT NULL,
        Email NVARCHAR(200) NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        LastLoginAt DATETIME2 NULL,
        IsActive BIT NOT NULL DEFAULT 1
    );
    PRINT 'Users table created.';
END
GO

-- Create Customers table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Customers')
BEGIN
    CREATE TABLE Customers (
        Id INT PRIMARY KEY IDENTITY(1,1),
        Name NVARCHAR(200) NOT NULL,
        TenantId NVARCHAR(100) NOT NULL,
        ClientId NVARCHAR(100) NOT NULL,
        ClientSecret NVARCHAR(MAX) NOT NULL,
        SubscriptionId NVARCHAR(100) NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        LastSyncedAt DATETIME2 NULL,
        IsActive BIT NOT NULL DEFAULT 1
    );
    PRINT 'Customers table created.';
END
GO

-- Create AzureResources table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'AzureResources')
BEGIN
    CREATE TABLE AzureResources (
        Id INT PRIMARY KEY IDENTITY(1,1),
        CustomerId INT NOT NULL,
        ResourceId NVARCHAR(500) NOT NULL UNIQUE,
        Name NVARCHAR(200) NOT NULL,
        Type NVARCHAR(100) NOT NULL,
        ResourceGroup NVARCHAR(200) NULL,
        Location NVARCHAR(100) NULL,
        SubscriptionId NVARCHAR(100) NULL,
        Tags NVARCHAR(MAX) NULL,
        Properties NVARCHAR(MAX) NULL,
        DiscoveredAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        LastUpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        FOREIGN KEY (CustomerId) REFERENCES Customers(Id) ON DELETE CASCADE
    );
    PRINT 'AzureResources table created.';
END
GO

-- Create VirtualMachineDetails table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'VirtualMachineDetails')
BEGIN
    CREATE TABLE VirtualMachineDetails (
        Id INT PRIMARY KEY IDENTITY(1,1),
        AzureResourceId INT NOT NULL,
        VmSize NVARCHAR(100) NULL,
        OsType NVARCHAR(100) NULL,
        OsVersion NVARCHAR(200) NULL,
        Disks NVARCHAR(MAX) NULL,
        NetworkInterfaces NVARCHAR(MAX) NULL,
        NetworkSecurityGroups NVARCHAR(MAX) NULL,
        HasPublicIp BIT NOT NULL DEFAULT 0,
        PublicIpAddress NVARCHAR(MAX) NULL,
        BackupEnabled BIT NOT NULL DEFAULT 0,
        BackupVaultName NVARCHAR(200) NULL,
        ProvisioningState NVARCHAR(MAX) NULL,
        PowerState NVARCHAR(MAX) NULL,
        LastUpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        FOREIGN KEY (AzureResourceId) REFERENCES AzureResources(Id) ON DELETE CASCADE
    );
    PRINT 'VirtualMachineDetails table created.';
END
GO

-- Create indexes for better performance
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Users_Username')
BEGIN
    CREATE INDEX IX_Users_Username ON Users(Username);
    PRINT 'Index IX_Users_Username created.';
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_AzureResources_CustomerId')
BEGIN
    CREATE INDEX IX_AzureResources_CustomerId ON AzureResources(CustomerId);
    PRINT 'Index IX_AzureResources_CustomerId created.';
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_AzureResources_Type')
BEGIN
    CREATE INDEX IX_AzureResources_Type ON AzureResources(Type);
    PRINT 'Index IX_AzureResources_Type created.';
END
GO

-- Insert default admin user
-- Password: Admin@123 (BCrypt hash)
IF NOT EXISTS (SELECT * FROM Users WHERE Username = 'admin')
BEGIN
    INSERT INTO Users (Username, PasswordHash, Email, CreatedAt, IsActive)
    VALUES (
        'admin',
        '$2a$11$YourBCryptHashHere', -- This will be replaced by EF migration with actual BCrypt hash
        'admin@azureinventory.local',
        GETUTCDATE(),
        1
    );
    PRINT 'Default admin user created. Username: admin, Password: Admin@123';
    PRINT 'IMPORTANT: Change the default password after first login!';
END
ELSE
BEGIN
    PRINT 'Admin user already exists.';
END
GO

-- Display summary
PRINT '========================================';
PRINT 'Database setup completed successfully!';
PRINT '========================================';
PRINT '';
PRINT 'Tables created:';
PRINT '  - Users';
PRINT '  - Customers';
PRINT '  - AzureResources';
PRINT '  - VirtualMachineDetails';
PRINT '';
PRINT 'Default credentials:';
PRINT '  Username: admin';
PRINT '  Password: Admin@123';
PRINT '';
PRINT 'Next steps:';
PRINT '  1. Run the application: dotnet run';
PRINT '  2. Navigate to: https://localhost:5001';
PRINT '  3. Login with admin credentials';
PRINT '  4. CHANGE THE DEFAULT PASSWORD!';
PRINT '  5. Add your first customer';
PRINT '';
PRINT '========================================';
GO
