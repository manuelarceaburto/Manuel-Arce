import { Client } from '@microsoft/microsoft-graph-client';
import { ClientSecretCredential } from '@azure/identity';
import 'isomorphic-fetch';
import Customer from '../models/Customer';
import M365User from '../models/M365User';
import M365License from '../models/M365License';
import SharePointSite from '../models/SharePointSite';
import TeamsTeam from '../models/TeamsTeam';
import ExchangeMailbox from '../models/ExchangeMailbox';
import IntuneDevice from '../models/IntuneDevice';

export class M365SyncService {
  private getGraphClient(tenantId: string): Client {
    const credential = new ClientSecretCredential(
      tenantId,
      process.env.GRAPH_CLIENT_ID!,
      process.env.GRAPH_CLIENT_SECRET!
    );

    return Client.initWithMiddleware({
      authProvider: {
        getAccessToken: async () => {
          const token = await credential.getToken('https://graph.microsoft.com/.default');
          return token.token;
        },
      },
    });
  }

  async syncCustomerM365Data(customerId: string): Promise<void> {
    const customer = await Customer.findById(customerId);
    if (!customer) {
      throw new Error('Customer not found');
    }

    console.log(`Syncing M365 data for customer: ${customer.name}`);

    const client = this.getGraphClient(customer.tenant_id);

    await Promise.all([
      this.syncUsers(client, customerId),
      this.syncLicenses(client, customerId),
      this.syncSharePointSites(client, customerId),
      this.syncTeams(client, customerId),
      this.syncMailboxes(client, customerId),
      this.syncDevices(client, customerId),
    ]);
  }

  async syncAllM365Data(): Promise<void> {
    const customers = await Customer.find({ status: 'active' });

    for (const customer of customers) {
      try {
        await this.syncCustomerM365Data(customer.id);
      } catch (error) {
        console.error(`Failed to sync M365 data for customer ${customer.name}:`, error);
      }
    }
  }

  private async syncUsers(client: Client, customerId: string): Promise<void> {
    try {
      const response = await client.api('/users').get();
      const users = response.value || [];

      console.log(`Syncing ${users.length} users`);

      for (const user of users) {
        await M365User.findOneAndUpdate(
          { email: user.mail || user.userPrincipalName, customer_id: customerId },
          {
            email: user.mail || user.userPrincipalName,
            display_name: user.displayName,
            licenses: user.assignedLicenses?.map((l: any) => l.skuId) || [],
            last_sign_in: user.signInActivity?.lastSignInDateTime || new Date(),
            status: user.accountEnabled ? 'active' : 'disabled',
            customer_id: customerId,
          },
          { upsert: true, new: true }
        );
      }
    } catch (error) {
      console.error('Failed to sync users:', error);
    }
  }

  private async syncLicenses(client: Client, customerId: string): Promise<void> {
    try {
      const response = await client.api('/subscribedSkus').get();
      const licenses = response.value || [];

      console.log(`Syncing ${licenses.length} licenses`);

      for (const license of licenses) {
        await M365License.findOneAndUpdate(
          { sku_id: license.skuId, customer_id: customerId },
          {
            sku_id: license.skuId,
            name: license.skuPartNumber,
            assigned_count: license.consumedUnits || 0,
            available_count: (license.prepaidUnits?.enabled || 0) - (license.consumedUnits || 0),
            cost: this.estimateLicenseCost(license.skuPartNumber),
            customer_id: customerId,
          },
          { upsert: true, new: true }
        );
      }
    } catch (error) {
      console.error('Failed to sync licenses:', error);
    }
  }

  private async syncSharePointSites(client: Client, customerId: string): Promise<void> {
    try {
      const response = await client.api('/sites').filter("siteCollection/root ne null").get();
      const sites = response.value || [];

      console.log(`Syncing ${sites.length} SharePoint sites`);

      for (const site of sites) {
        await SharePointSite.findOneAndUpdate(
          { url: site.webUrl, customer_id: customerId },
          {
            url: site.webUrl,
            storage_used: (site.siteCollection?.storageUsage || 0) / 1024 / 1024 / 1024, // Convert to GB
            owner: site.owner?.user?.displayName || 'Unknown',
            activity_score: Math.floor(Math.random() * 100), // Placeholder
            customer_id: customerId,
          },
          { upsert: true, new: true }
        );
      }
    } catch (error) {
      console.error('Failed to sync SharePoint sites:', error);
    }
  }

  private async syncTeams(client: Client, customerId: string): Promise<void> {
    try {
      const response = await client.api('/groups').filter("resourceProvisioningOptions/Any(x:x eq 'Team')").get();
      const teams = response.value || [];

      console.log(`Syncing ${teams.length} Teams`);

      for (const team of teams) {
        const membersResponse = await client.api(`/groups/${team.id}/members`).get();
        const channelsResponse = await client.api(`/teams/${team.id}/channels`).get();

        await TeamsTeam.findOneAndUpdate(
          { name: team.displayName, customer_id: customerId },
          {
            name: team.displayName,
            member_count: membersResponse.value?.length || 0,
            channel_count: channelsResponse.value?.length || 0,
            activity: Math.floor(Math.random() * 1000), // Placeholder
            customer_id: customerId,
          },
          { upsert: true, new: true }
        );
      }
    } catch (error) {
      console.error('Failed to sync Teams:', error);
    }
  }

  private async syncMailboxes(client: Client, customerId: string): Promise<void> {
    try {
      const response = await client.api('/users').select('mail,mailboxSettings').get();
      const users = response.value || [];

      console.log(`Syncing ${users.length} mailboxes`);

      for (const user of users) {
        if (!user.mail) continue;

        await ExchangeMailbox.findOneAndUpdate(
          { email: user.mail, customer_id: customerId },
          {
            email: user.mail,
            size_gb: Math.random() * 10, // Placeholder - would need to query mailbox stats
            item_count: Math.floor(Math.random() * 10000), // Placeholder
            archive_enabled: false, // Placeholder
            customer_id: customerId,
          },
          { upsert: true, new: true }
        );
      }
    } catch (error) {
      console.error('Failed to sync mailboxes:', error);
    }
  }

  private async syncDevices(client: Client, customerId: string): Promise<void> {
    try {
      const response = await client.api('/deviceManagement/managedDevices').get();
      const devices = response.value || [];

      console.log(`Syncing ${devices.length} Intune devices`);

      for (const device of devices) {
        await IntuneDevice.findOneAndUpdate(
          { device_name: device.deviceName, customer_id: customerId },
          {
            device_name: device.deviceName,
            os: device.operatingSystem,
            compliance_status: device.complianceState === 'compliant' ? 'compliant' : 'non-compliant',
            last_sync: device.lastSyncDateTime || new Date(),
            customer_id: customerId,
          },
          { upsert: true, new: true }
        );
      }
    } catch (error) {
      console.error('Failed to sync devices:', error);
    }
  }

  private estimateLicenseCost(skuPartNumber: string): number {
    const costMap: Record<string, number> = {
      'ENTERPRISEPACK': 22,
      'ENTERPRISEPREMIUM': 35,
      'STANDARDPACK': 12.50,
      'SPE_E3': 32,
      'SPE_E5': 57,
      'POWER_BI_PRO': 9.99,
      'FLOW_FREE': 0,
      'TEAMS_EXPLORATORY': 0,
    };

    return costMap[skuPartNumber] || 10;
  }

  async getLicenseOptimizations(customerId?: string): Promise<any[]> {
    const query = customerId ? { customer_id: customerId } : {};
    const licenses = await M365License.find(query);

    const optimizations = licenses
      .filter((license) => license.available_count > 0)
      .map((license) => ({
        license_name: license.name,
        total_assigned: license.assigned_count,
        total_available: license.available_count,
        unused_count: license.available_count,
        potential_savings: license.available_count * license.cost,
        recommendation: this.generateRecommendation(license),
      }))
      .filter((opt) => opt.potential_savings > 0)
      .sort((a, b) => b.potential_savings - a.potential_savings);

    return optimizations;
  }

  private generateRecommendation(license: any): string {
    const utilizationRate = license.assigned_count / (license.assigned_count + license.available_count);

    if (utilizationRate < 0.5) {
      return `Consider reducing license count by ${license.available_count} unused licenses to save $${(license.available_count * license.cost).toFixed(2)}/month.`;
    } else if (utilizationRate < 0.8) {
      return `${license.available_count} licenses are currently unused. Monitor usage before next renewal.`;
    } else {
      return `License utilization is good, but ${license.available_count} licenses remain unassigned.`;
    }
  }
}

export default new M365SyncService();
