import { Router, Request, Response } from 'express';
import Customer from '../models/Customer';
import AzureResource from '../models/AzureResource';
import M365User from '../models/M365User';

const router = Router();

// Get dashboard metrics
router.get('/metrics', async (req: Request, res: Response) => {
  try {
    const { customer_id } = req.query;

    // Build filters based on customer selection
    const resourceFilters = customer_id ? { customer_id } : {};
    const userFilters = customer_id ? { customer_id } : {};

    // Get total customers
    const total_customers = customer_id
      ? 1
      : await Customer.countDocuments({ status: 'active' });

    // Get total Azure resources
    const total_azure_resources = await AzureResource.countDocuments(resourceFilters);

    // Get total M365 users
    const total_m365_users = await M365User.countDocuments(userFilters);

    // Get total monthly cost
    const resources = await AzureResource.find(resourceFilters);
    const total_monthly_cost = resources.reduce((sum, r) => sum + r.monthly_cost, 0);

    // Get resources by status
    const resources_by_status = {
      running: await AzureResource.countDocuments({ ...resourceFilters, status: 'running' }),
      stopped: await AzureResource.countDocuments({ ...resourceFilters, status: 'stopped' }),
      deallocated: await AzureResource.countDocuments({ ...resourceFilters, status: 'deallocated' }),
    };

    // Get resources by type
    const resourcesByType = await AzureResource.aggregate([
      { $match: resourceFilters },
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    const resources_by_type = resourcesByType.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {} as Record<string, number>);

    res.json({
      total_customers,
      total_azure_resources,
      total_m365_users,
      total_monthly_cost,
      resources_by_status,
      resources_by_type,
    });
  } catch (error) {
    console.error('Dashboard metrics error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard metrics' });
  }
});

export default router;
