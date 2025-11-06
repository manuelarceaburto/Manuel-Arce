import { Router, Request, Response } from 'express';
import M365User from '../models/M365User';
import M365License from '../models/M365License';
import SharePointSite from '../models/SharePointSite';
import TeamsTeam from '../models/TeamsTeam';
import ExchangeMailbox from '../models/ExchangeMailbox';
import IntuneDevice from '../models/IntuneDevice';
import m365Sync from '../services/m365Sync';

const router = Router();

// Users routes
router.get('/users', async (req: Request, res: Response) => {
  try {
    const { customer_id } = req.query;
    const filters = customer_id ? { customer_id } : {};
    const users = await M365User.find(filters).sort({ display_name: 1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.get('/users/:id', async (req: Request, res: Response) => {
  try {
    const user = await M365User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

router.post('/users/sync', async (req: Request, res: Response) => {
  try {
    const { customer_id } = req.body;
    if (customer_id) {
      await m365Sync.syncCustomerM365Data(customer_id);
    } else {
      await m365Sync.syncAllM365Data();
    }
    res.json({ message: 'Users synced successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to sync users' });
  }
});

// Licenses routes
router.get('/licenses', async (req: Request, res: Response) => {
  try {
    const { customer_id } = req.query;
    const filters = customer_id ? { customer_id } : {};
    const licenses = await M365License.find(filters).sort({ name: 1 });
    res.json(licenses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch licenses' });
  }
});

router.get('/licenses/optimizations', async (req: Request, res: Response) => {
  try {
    const { customer_id } = req.query;
    const optimizations = await m365Sync.getLicenseOptimizations(
      customer_id as string | undefined
    );
    res.json(optimizations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch license optimizations' });
  }
});

router.post('/licenses/sync', async (req: Request, res: Response) => {
  try {
    const { customer_id } = req.body;
    if (customer_id) {
      await m365Sync.syncCustomerM365Data(customer_id);
    } else {
      await m365Sync.syncAllM365Data();
    }
    res.json({ message: 'Licenses synced successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to sync licenses' });
  }
});

// SharePoint routes
router.get('/sharepoint', async (req: Request, res: Response) => {
  try {
    const { customer_id } = req.query;
    const filters = customer_id ? { customer_id } : {};
    const sites = await SharePointSite.find(filters).sort({ url: 1 });
    res.json(sites);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch SharePoint sites' });
  }
});

router.post('/sharepoint/sync', async (req: Request, res: Response) => {
  try {
    const { customer_id } = req.body;
    if (customer_id) {
      await m365Sync.syncCustomerM365Data(customer_id);
    } else {
      await m365Sync.syncAllM365Data();
    }
    res.json({ message: 'SharePoint sites synced successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to sync SharePoint sites' });
  }
});

// Teams routes
router.get('/teams', async (req: Request, res: Response) => {
  try {
    const { customer_id } = req.query;
    const filters = customer_id ? { customer_id } : {};
    const teams = await TeamsTeam.find(filters).sort({ name: 1 });
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Teams' });
  }
});

router.post('/teams/sync', async (req: Request, res: Response) => {
  try {
    const { customer_id } = req.body;
    if (customer_id) {
      await m365Sync.syncCustomerM365Data(customer_id);
    } else {
      await m365Sync.syncAllM365Data();
    }
    res.json({ message: 'Teams synced successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to sync Teams' });
  }
});

// Exchange routes
router.get('/exchange', async (req: Request, res: Response) => {
  try {
    const { customer_id } = req.query;
    const filters = customer_id ? { customer_id } : {};
    const mailboxes = await ExchangeMailbox.find(filters).sort({ email: 1 });
    res.json(mailboxes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch mailboxes' });
  }
});

router.post('/exchange/sync', async (req: Request, res: Response) => {
  try {
    const { customer_id } = req.body;
    if (customer_id) {
      await m365Sync.syncCustomerM365Data(customer_id);
    } else {
      await m365Sync.syncAllM365Data();
    }
    res.json({ message: 'Exchange mailboxes synced successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to sync mailboxes' });
  }
});

// Intune routes
router.get('/intune', async (req: Request, res: Response) => {
  try {
    const { customer_id } = req.query;
    const filters = customer_id ? { customer_id } : {};
    const devices = await IntuneDevice.find(filters).sort({ device_name: 1 });
    res.json(devices);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Intune devices' });
  }
});

router.post('/intune/sync', async (req: Request, res: Response) => {
  try {
    const { customer_id } = req.body;
    if (customer_id) {
      await m365Sync.syncCustomerM365Data(customer_id);
    } else {
      await m365Sync.syncAllM365Data();
    }
    res.json({ message: 'Intune devices synced successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to sync devices' });
  }
});

export default router;
