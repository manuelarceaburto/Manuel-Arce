import { ResourceManagementClient } from '@azure/arm-resources';
import { ClientSecretCredential } from '@azure/identity';
import Customer from '../models/Customer';
import AzureResource from '../models/AzureResource';

export class AzureSyncService {
  private getCredential(tenantId: string): ClientSecretCredential {
    return new ClientSecretCredential(
      tenantId,
      process.env.AZURE_CLIENT_ID!,
      process.env.AZURE_CLIENT_SECRET!
    );
  }

  async syncCustomerResources(customerId: string): Promise<void> {
    const customer = await Customer.findById(customerId);
    if (!customer) {
      throw new Error('Customer not found');
    }

    console.log(`Syncing resources for customer: ${customer.name}`);

    for (const subscription of customer.azure_subscriptions) {
      await this.syncSubscriptionResources(
        customer.tenant_id,
        subscription.subscription_id,
        customerId
      );
    }
  }

  async syncAllResources(): Promise<void> {
    const customers = await Customer.find({ status: 'active' });

    for (const customer of customers) {
      try {
        await this.syncCustomerResources(customer.id);
      } catch (error) {
        console.error(`Failed to sync resources for customer ${customer.name}:`, error);
      }
    }
  }

  private async syncSubscriptionResources(
    tenantId: string,
    subscriptionId: string,
    customerId: string
  ): Promise<void> {
    try {
      const credential = this.getCredential(tenantId);
      const client = new ResourceManagementClient(credential, subscriptionId);

      const resources = [];
      for await (const resource of client.resources.list()) {
        resources.push(resource);
      }

      console.log(`Found ${resources.length} resources in subscription ${subscriptionId}`);

      for (const resource of resources) {
        await this.upsertResource(resource, customerId, subscriptionId);
      }
    } catch (error) {
      console.error(`Failed to sync subscription ${subscriptionId}:`, error);
      throw error;
    }
  }

  private async upsertResource(
    resource: any,
    customerId: string,
    subscriptionId: string
  ): Promise<void> {
    const resourceData = {
      resource_id: resource.id,
      name: resource.name,
      type: resource.type,
      region: resource.location || 'global',
      resource_group: this.extractResourceGroup(resource.id),
      status: this.determineResourceStatus(resource),
      monthly_cost: await this.estimateMonthlyCost(resource),
      tags: resource.tags || {},
      customer_id: customerId,
      subscription_id: subscriptionId,
    };

    await AzureResource.findOneAndUpdate(
      { resource_id: resource.id },
      resourceData,
      { upsert: true, new: true }
    );
  }

  private extractResourceGroup(resourceId: string): string {
    const match = resourceId.match(/resourceGroups\/([^\/]+)/i);
    return match ? match[1] : 'unknown';
  }

  private determineResourceStatus(resource: any): 'running' | 'stopped' | 'deallocated' {
    // This is a simplified status determination
    // In a real implementation, you would query the specific resource type's API
    // to get the actual status

    if (resource.type?.toLowerCase().includes('virtualmachine')) {
      // For VMs, we would need to query the VM status separately
      // For now, we'll default to running
      return 'running';
    }

    return 'running';
  }

  private async estimateMonthlyCost(resource: any): Promise<number> {
    // This is a placeholder for cost estimation
    // In a real implementation, you would integrate with Azure Cost Management API
    // to get actual cost data

    const costMap: Record<string, number> = {
      'Microsoft.Compute/virtualMachines': 150,
      'Microsoft.Storage/storageAccounts': 50,
      'Microsoft.Web/sites': 100,
      'Microsoft.Sql/servers/databases': 200,
      'Microsoft.Network/loadBalancers': 75,
    };

    return costMap[resource.type] || 25;
  }
}

export default new AzureSyncService();
