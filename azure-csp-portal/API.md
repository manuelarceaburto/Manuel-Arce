# Azure CSP Management Portal - API Documentation

Base URL: `http://localhost:3001/api`

## Authentication

Currently, the API does not require authentication. For production, implement JWT-based authentication.

---

## Customers API

### Get All Customers

**GET** `/customers`

Returns a list of all customers.

**Response:**
```json
[
  {
    "id": "6547abc123def456",
    "name": "Contoso Ltd",
    "tenant_id": "tenant-123-456",
    "status": "active",
    "azure_subscriptions": [
      {
        "subscription_id": "sub-123",
        "name": "Production",
        "state": "Enabled"
      }
    ],
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

### Get Customer by ID

**GET** `/customers/:id`

**Parameters:**
- `id` (path) - Customer ID

**Response:** Single customer object

### Create Customer

**POST** `/customers`

**Request Body:**
```json
{
  "name": "Contoso Ltd",
  "tenant_id": "tenant-123-456",
  "status": "active",
  "azure_subscriptions": [
    {
      "subscription_id": "sub-123",
      "name": "Production",
      "state": "Enabled"
    }
  ]
}
```

**Response:** Created customer object (201)

### Update Customer

**PUT** `/customers/:id`

**Parameters:**
- `id` (path) - Customer ID

**Request Body:** Partial customer object

**Response:** Updated customer object

### Delete Customer

**DELETE** `/customers/:id`

**Parameters:**
- `id` (path) - Customer ID

**Response:** 204 No Content

---

## Azure Resources API

### Get All Resources

**GET** `/azure/resources`

**Query Parameters:**
- `customer_id` (optional) - Filter by customer
- `type` (optional) - Filter by resource type
- `region` (optional) - Filter by region
- `status` (optional) - Filter by status (running, stopped, deallocated)

**Response:**
```json
[
  {
    "id": "6547abc123def456",
    "resource_id": "/subscriptions/sub-123/resourceGroups/rg-prod/providers/Microsoft.Compute/virtualMachines/vm-web-01",
    "name": "vm-web-01",
    "type": "Microsoft.Compute/virtualMachines",
    "region": "eastus",
    "resource_group": "rg-prod",
    "status": "running",
    "monthly_cost": 150.00,
    "tags": {
      "environment": "production",
      "app": "web"
    },
    "customer_id": "6547abc123def456",
    "subscription_id": "sub-123",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

### Get Resource by ID

**GET** `/azure/resources/:id`

**Parameters:**
- `id` (path) - Resource ID

**Response:** Single resource object

### Get Resources by Customer

**GET** `/azure/resources/customer/:customerId`

**Parameters:**
- `customerId` (path) - Customer ID

**Response:** Array of resource objects

### Sync Resources

**POST** `/azure/sync`

Syncs resources from Azure Resource Manager.

**Request Body:**
```json
{
  "customer_id": "6547abc123def456"  // Optional, omit to sync all customers
}
```

**Response:**
```json
{
  "message": "Sync completed successfully"
}
```

---

## Microsoft 365 API

### Users

#### Get All Users

**GET** `/m365/users`

**Query Parameters:**
- `customer_id` (optional) - Filter by customer

**Response:**
```json
[
  {
    "id": "6547abc123def456",
    "email": "john.doe@contoso.com",
    "display_name": "John Doe",
    "licenses": ["sku-id-1", "sku-id-2"],
    "last_sign_in": "2024-01-01T00:00:00.000Z",
    "status": "active",
    "customer_id": "6547abc123def456",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

#### Sync Users

**POST** `/m365/users/sync`

**Request Body:**
```json
{
  "customer_id": "6547abc123def456"  // Optional
}
```

### Licenses

#### Get All Licenses

**GET** `/m365/licenses`

**Query Parameters:**
- `customer_id` (optional) - Filter by customer

**Response:**
```json
[
  {
    "id": "6547abc123def456",
    "sku_id": "sku-123",
    "name": "Office 365 E3",
    "assigned_count": 50,
    "available_count": 10,
    "cost": 22.00,
    "customer_id": "6547abc123def456",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

#### Get License Optimizations

**GET** `/m365/licenses/optimizations`

**Query Parameters:**
- `customer_id` (optional) - Filter by customer

**Response:**
```json
[
  {
    "license_name": "Office 365 E3",
    "total_assigned": 50,
    "total_available": 10,
    "unused_count": 10,
    "potential_savings": 220.00,
    "recommendation": "Consider reducing license count by 10 unused licenses to save $220.00/month."
  }
]
```

#### Sync Licenses

**POST** `/m365/licenses/sync`

### SharePoint Sites

#### Get All Sites

**GET** `/m365/sharepoint`

**Query Parameters:**
- `customer_id` (optional)

**Response:**
```json
[
  {
    "id": "6547abc123def456",
    "url": "https://contoso.sharepoint.com/sites/team",
    "storage_used": 15.5,
    "owner": "John Doe",
    "activity_score": 75,
    "customer_id": "6547abc123def456",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

#### Sync SharePoint Sites

**POST** `/m365/sharepoint/sync`

### Teams

#### Get All Teams

**GET** `/m365/teams`

**Query Parameters:**
- `customer_id` (optional)

**Response:**
```json
[
  {
    "id": "6547abc123def456",
    "name": "Sales Team",
    "member_count": 25,
    "channel_count": 5,
    "activity": 150,
    "customer_id": "6547abc123def456",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

#### Sync Teams

**POST** `/m365/teams/sync`

### Exchange Mailboxes

#### Get All Mailboxes

**GET** `/m365/exchange`

**Query Parameters:**
- `customer_id` (optional)

**Response:**
```json
[
  {
    "id": "6547abc123def456",
    "email": "john.doe@contoso.com",
    "size_gb": 8.5,
    "item_count": 5000,
    "archive_enabled": true,
    "customer_id": "6547abc123def456",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

#### Sync Mailboxes

**POST** `/m365/exchange/sync`

### Intune Devices

#### Get All Devices

**GET** `/m365/intune`

**Query Parameters:**
- `customer_id` (optional)

**Response:**
```json
[
  {
    "id": "6547abc123def456",
    "device_name": "LAPTOP-001",
    "os": "Windows 11",
    "compliance_status": "compliant",
    "last_sync": "2024-01-01T00:00:00.000Z",
    "customer_id": "6547abc123def456",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

#### Sync Devices

**POST** `/m365/intune/sync`

---

## Dashboard API

### Get Dashboard Metrics

**GET** `/dashboard/metrics`

**Query Parameters:**
- `customer_id` (optional) - Filter by customer

**Response:**
```json
{
  "total_customers": 5,
  "total_azure_resources": 150,
  "total_m365_users": 250,
  "total_monthly_cost": 12500.00,
  "resources_by_status": {
    "running": 100,
    "stopped": 30,
    "deallocated": 20
  },
  "resources_by_type": {
    "Microsoft.Compute/virtualMachines": 50,
    "Microsoft.Storage/storageAccounts": 30,
    "Microsoft.Web/sites": 25,
    "Microsoft.Sql/servers/databases": 20
  }
}
```

---

## Health Check

### Get Health Status

**GET** `/health`

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Invalid request data"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "Detailed error message (in development mode)"
}
```

---

## Rate Limiting

Currently, there is no rate limiting. Implement rate limiting for production use.

## CORS

CORS is configured to allow requests from the frontend origin specified in the environment variable `CORS_ORIGIN`.

## Pagination

Pagination is not currently implemented. For production, add pagination to endpoints returning large datasets.

**Suggested implementation:**
```
GET /api/customers?page=1&limit=20
```

---

## Webhooks (Future Enhancement)

Future versions may include webhooks for real-time notifications of resource changes.

## Best Practices

1. Always filter by customer_id when possible to reduce response size
2. Use sync endpoints during off-peak hours for better performance
3. Cache frequently accessed data on the client side
4. Implement retry logic for sync operations
5. Monitor API response times and optimize slow endpoints

---

For more information, see the [main documentation](README.md).
