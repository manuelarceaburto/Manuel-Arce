import { Router, Request, Response } from 'express';
import AzureResource from '../models/AzureResource';
import azureSync from '../services/azureSync';

const router = Router();

// Get all Azure resources with optional filters
router.get('/resources', async (req: Request, res: Response) => {
  try {
    const { customer_id, type, region, status, tags } = req.query;

    const filters: any = {};
    if (customer_id) filters.customer_id = customer_id;
    if (type) filters.type = type;
    if (region) filters.region = region;
    if (status) filters.status = status;

    const resources = await AzureResource.find(filters).sort({ name: 1 });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
});

// Get resource by ID
router.get('/resources/:id', async (req: Request, res: Response) => {
  try {
    const resource = await AzureResource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    res.json(resource);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch resource' });
  }
});

// Get resources by customer
router.get('/resources/customer/:customerId', async (req: Request, res: Response) => {
  try {
    const resources = await AzureResource.find({ customer_id: req.params.customerId });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
});

// Sync resources from Azure
router.post('/sync', async (req: Request, res: Response) => {
  try {
    const { customer_id } = req.body;

    if (customer_id) {
      await azureSync.syncCustomerResources(customer_id);
    } else {
      await azureSync.syncAllResources();
    }

    res.json({ message: 'Sync completed successfully' });
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ error: 'Failed to sync resources' });
  }
});

export default router;
