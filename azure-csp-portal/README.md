# Azure CSP Management Portal

A comprehensive web application for managing multiple customer Azure and Microsoft 365 environments from a unified interface. Built for Cloud Service Providers (CSPs) to efficiently manage their customers' cloud resources and services.

## Features

### Multi-Tenant Customer Management
- Customer entity with name, tenant_id, status, and azure_subscriptions
- Customer selector dropdown in header with localStorage persistence
- Dashboard filtered by selected customer
- Support for "All Customers" aggregate view

### Azure Resource Management
- Real-time sync with Azure Resource Manager API
- Comprehensive resource tracking (resource_id, name, type, region, resource_group, status, monthly_cost, tags)
- Advanced filtering by customer, type, region, status, and tags
- Status indicators with color coding:
  - 🟢 Running (green)
  - 🟠 Stopped (orange)
  - ⚫ Deallocated (gray)
- Monthly cost tracking and aggregation

### Microsoft 365 Management
- M365 Dashboard with overview metrics
- **User Management**: Track M365 users with email, display_name, licenses, last_sign_in, and status
- **License Management**: Monitor license SKUs, assigned/available counts, and costs
- **SharePoint Sites**: Track storage usage, owners, and activity scores
- **Teams**: Monitor member counts, channel counts, and activity
- **Exchange Mailboxes**: View mailbox sizes, item counts, and archive status
- **Intune Devices**: Track device compliance, OS, and last sync times
- **License Optimization**: Get recommendations for unused licenses with potential cost savings
- Sync with Microsoft Graph API

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **React Router** for navigation
- **Axios** for API communication
- **Recharts** for data visualization
- Custom hooks for state management

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **Azure SDK** for Azure Resource Manager integration
- **Microsoft Graph SDK** for M365 integration

### DevOps
- **Docker** and Docker Compose for containerization
- **Nginx** for frontend serving and reverse proxy

## Project Structure

```
azure-csp-portal/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/          # Shared components
│   │   │   ├── azure/           # Azure resource components
│   │   │   ├── m365/            # M365 management components
│   │   │   └── dashboard/       # Dashboard components
│   │   ├── services/            # API service layer
│   │   ├── types/               # TypeScript type definitions
│   │   ├── hooks/               # Custom React hooks
│   │   └── App.tsx              # Main application component
│   ├── public/
│   ├── Dockerfile
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── models/              # MongoDB models
│   │   ├── routes/              # API routes
│   │   ├── services/            # Business logic
│   │   └── server.ts            # Express server
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml
```

## Getting Started

### Prerequisites
- Node.js 20+
- Docker and Docker Compose
- MongoDB (or use Docker)
- Azure subscription and service principal
- Microsoft 365 tenant and app registration

### Environment Setup

1. Clone the repository
2. Copy environment files:

**Backend** (`backend/.env`):
```bash
# Server Configuration
PORT=3001
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/azure-csp-portal

# Azure Configuration
AZURE_TENANT_ID=your-tenant-id
AZURE_CLIENT_ID=your-client-id
AZURE_CLIENT_SECRET=your-client-secret
AZURE_SUBSCRIPTION_ID=your-subscription-id

# Microsoft Graph Configuration
GRAPH_TENANT_ID=your-tenant-id
GRAPH_CLIENT_ID=your-client-id
GRAPH_CLIENT_SECRET=your-client-secret

# JWT Secret
JWT_SECRET=your-jwt-secret-key

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

**Frontend** (`frontend/.env`):
```bash
REACT_APP_API_URL=http://localhost:3001/api
```

### Running with Docker

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

### Running Locally (Development)

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

## Azure Setup

### Create Azure Service Principal

```bash
az ad sp create-for-rbac --name "azure-csp-portal" \
  --role "Reader" \
  --scopes /subscriptions/{subscription-id}
```

### Required Azure Permissions
- Reader role on subscriptions
- Cost Management Reader (for cost data)

## Microsoft 365 Setup

### App Registration

1. Go to Azure Portal → Azure Active Directory → App registrations
2. Create new registration
3. Add the following API permissions:
   - **Microsoft Graph**:
     - User.Read.All
     - Directory.Read.All
     - Sites.Read.All
     - Team.ReadBasic.All
     - MailboxSettings.Read
     - DeviceManagementManagedDevices.Read.All
4. Grant admin consent
5. Create a client secret

## API Endpoints

### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/:id` - Get customer by ID
- `POST /api/customers` - Create new customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Azure Resources
- `GET /api/azure/resources` - Get all resources (with filters)
- `GET /api/azure/resources/:id` - Get resource by ID
- `GET /api/azure/resources/customer/:customerId` - Get resources by customer
- `POST /api/azure/sync` - Sync resources from Azure

### Microsoft 365
- `GET /api/m365/users` - Get M365 users
- `GET /api/m365/licenses` - Get licenses
- `GET /api/m365/licenses/optimizations` - Get license optimization recommendations
- `GET /api/m365/sharepoint` - Get SharePoint sites
- `GET /api/m365/teams` - Get Teams
- `GET /api/m365/exchange` - Get Exchange mailboxes
- `GET /api/m365/intune` - Get Intune devices
- `POST /api/m365/{resource}/sync` - Sync specific M365 resource

### Dashboard
- `GET /api/dashboard/metrics` - Get dashboard metrics

## Data Models

### Customer
```typescript
{
  id: string
  name: string
  tenant_id: string
  status: 'active' | 'inactive' | 'suspended'
  azure_subscriptions: AzureSubscription[]
  created_at: Date
  updated_at: Date
}
```

### AzureResource
```typescript
{
  id: string
  resource_id: string
  name: string
  type: string
  region: string
  resource_group: string
  status: 'running' | 'stopped' | 'deallocated'
  monthly_cost: number
  tags: Record<string, string>
  customer_id: string
  subscription_id: string
  created_at: Date
  updated_at: Date
}
```

### M365User
```typescript
{
  id: string
  email: string
  display_name: string
  licenses: string[]
  last_sign_in: Date
  status: 'active' | 'inactive' | 'disabled'
  customer_id: string
  created_at: Date
  updated_at: Date
}
```

## License Optimization

The system automatically analyzes license usage and provides recommendations:

- Identifies unused licenses
- Calculates potential cost savings
- Provides actionable recommendations
- Tracks utilization rates
- Highlights opportunities for license reduction

## Security Considerations

- All API credentials should be stored securely
- Use Azure Key Vault for production secrets
- Implement proper authentication and authorization
- Enable HTTPS in production
- Regularly rotate credentials
- Follow principle of least privilege for Azure/M365 permissions

## Monitoring and Logging

- Morgan HTTP request logging
- MongoDB query logging
- Azure/M365 sync operation logging
- Error tracking and reporting

## Troubleshooting

### Common Issues

**MongoDB Connection Failed:**
- Ensure MongoDB is running
- Check connection string in .env
- Verify network connectivity

**Azure Sync Errors:**
- Verify service principal credentials
- Check Azure subscription access
- Ensure proper role assignments

**M365 Sync Errors:**
- Verify app registration permissions
- Check if admin consent is granted
- Validate client secret expiration

## Performance Optimization

- Database indexing on frequently queried fields
- Pagination for large datasets
- Caching for frequently accessed data
- Batch operations for bulk syncs
- Parallel API calls where possible

## Future Enhancements

- Real-time notifications for resource changes
- Advanced cost analytics and forecasting
- Automated resource tagging
- Custom reporting and exports
- Multi-language support
- Role-based access control (RBAC)
- Audit logging
- Scheduled sync jobs
- Email alerts for license optimization opportunities

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open a GitHub issue.

## Author

Manuel Arce - Bilingual Cloud Consultant & Azure Architect

---

Built with ❤️ for Cloud Service Providers
