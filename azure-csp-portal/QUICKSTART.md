# Azure CSP Management Portal - Quick Start Guide

This guide will help you get the Azure CSP Management Portal up and running in 5 minutes.

## Prerequisites

- Docker and Docker Compose installed
- Azure subscription with service principal
- Microsoft 365 tenant with app registration

## Step 1: Clone and Setup

```bash
cd azure-csp-portal
```

## Step 2: Configure Environment

### Backend Configuration

Create `backend/.env`:

```bash
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://mongodb:27017/azure-csp-portal

# Azure Configuration
AZURE_TENANT_ID=your-tenant-id
AZURE_CLIENT_ID=your-client-id
AZURE_CLIENT_SECRET=your-client-secret
AZURE_SUBSCRIPTION_ID=your-subscription-id

# Microsoft Graph Configuration
GRAPH_TENANT_ID=your-tenant-id
GRAPH_CLIENT_ID=your-graph-client-id
GRAPH_CLIENT_SECRET=your-graph-client-secret

JWT_SECRET=your-random-secret-key
CORS_ORIGIN=http://localhost:3000
```

### Frontend Configuration

Create `frontend/.env`:

```bash
REACT_APP_API_URL=http://localhost:3001/api
```

## Step 3: Start with Docker

```bash
docker-compose up -d
```

This will start:
- MongoDB on port 27017
- Backend API on port 3001
- Frontend on port 3000

## Step 4: Verify Installation

Check if all services are running:

```bash
docker-compose ps
```

Visit the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Health Check: http://localhost:3001/health

## Step 5: Add Your First Customer

### Using the API

```bash
curl -X POST http://localhost:3001/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Contoso Ltd",
    "tenant_id": "your-customer-tenant-id",
    "status": "active",
    "azure_subscriptions": [
      {
        "subscription_id": "sub-id",
        "name": "Production",
        "state": "Enabled"
      }
    ]
  }'
```

## Step 6: Sync Data

### Sync Azure Resources

```bash
curl -X POST http://localhost:3001/api/azure/sync \
  -H "Content-Type: application/json"
```

### Sync M365 Data

```bash
curl -X POST http://localhost:3001/api/m365/users/sync \
  -H "Content-Type: application/json"
```

## Step 7: Access the Portal

1. Open http://localhost:3000
2. Select a customer from the dropdown
3. View the dashboard
4. Navigate to Azure Resources or M365 sections

## Development Mode

To run in development mode without Docker:

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

### MongoDB

```bash
docker run -d -p 27017:27017 --name mongodb mongo:7.0
```

## Troubleshooting

### Services Not Starting

```bash
# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Rebuild containers
docker-compose up -d --build
```

### Database Connection Issues

```bash
# Check MongoDB
docker-compose exec mongodb mongosh

# Reset database
docker-compose down -v
docker-compose up -d
```

### Port Already in Use

```bash
# Change ports in docker-compose.yml
# Frontend: "3000:80" -> "8080:80"
# Backend: "3001:3001" -> "8081:3001"
```

## Next Steps

1. Configure Azure Service Principal with proper permissions
2. Set up Microsoft 365 App Registration
3. Add multiple customers
4. Schedule regular sync jobs
5. Customize dashboard metrics
6. Set up monitoring and alerts

## Useful Commands

```bash
# Stop all services
docker-compose down

# View backend logs
docker-compose logs -f backend

# View frontend logs
docker-compose logs -f frontend

# Access MongoDB shell
docker-compose exec mongodb mongosh azure-csp-portal

# Rebuild specific service
docker-compose up -d --build backend
```

## Default Credentials

This application does not include authentication by default. For production:

1. Implement JWT authentication
2. Add user management
3. Set up role-based access control
4. Enable HTTPS
5. Configure Azure AD integration

## Support

For issues, check:
- Application logs: `docker-compose logs`
- MongoDB status: `docker-compose exec mongodb mongosh`
- API health: http://localhost:3001/health

## Resources

- [Full Documentation](README.md)
- [API Documentation](API.md)
- Azure SDK Documentation
- Microsoft Graph Documentation

---

Happy managing! 🚀
