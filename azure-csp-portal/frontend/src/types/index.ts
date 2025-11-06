// Customer Entity
export interface Customer {
  id: string;
  name: string;
  tenant_id: string;
  status: 'active' | 'inactive' | 'suspended';
  azure_subscriptions: AzureSubscription[];
  created_at: Date;
  updated_at: Date;
}

export interface AzureSubscription {
  subscription_id: string;
  name: string;
  state: string;
}

// Azure Resource Entity
export interface AzureResource {
  id: string;
  resource_id: string;
  name: string;
  type: string;
  region: string;
  resource_group: string;
  status: 'running' | 'stopped' | 'deallocated';
  monthly_cost: number;
  tags: Record<string, string>;
  customer_id: string;
  subscription_id: string;
  created_at: Date;
  updated_at: Date;
}

// M365 Entities
export interface M365User {
  id: string;
  email: string;
  display_name: string;
  licenses: M365License[];
  last_sign_in: Date;
  status: 'active' | 'inactive' | 'disabled';
  customer_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface M365License {
  id: string;
  sku_id: string;
  name: string;
  assigned_count: number;
  available_count: number;
  cost: number;
  customer_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface SharePointSite {
  id: string;
  url: string;
  storage_used: number; // in GB
  owner: string;
  activity_score: number;
  customer_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface TeamsTeam {
  id: string;
  name: string;
  member_count: number;
  channel_count: number;
  activity: number;
  customer_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface ExchangeMailbox {
  id: string;
  email: string;
  size_gb: number;
  item_count: number;
  archive_enabled: boolean;
  customer_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface IntuneDevice {
  id: string;
  device_name: string;
  os: string;
  compliance_status: 'compliant' | 'non-compliant' | 'unknown';
  last_sync: Date;
  customer_id: string;
  created_at: Date;
  updated_at: Date;
}

// Dashboard Metrics
export interface DashboardMetrics {
  total_customers: number;
  total_azure_resources: number;
  total_m365_users: number;
  total_monthly_cost: number;
  resources_by_status: {
    running: number;
    stopped: number;
    deallocated: number;
  };
  resources_by_type: Record<string, number>;
}

// Filter Types
export interface ResourceFilters {
  customer_id?: string;
  type?: string;
  region?: string;
  status?: 'running' | 'stopped' | 'deallocated';
  tags?: Record<string, string>;
}

// License Optimization
export interface LicenseOptimization {
  license_name: string;
  total_assigned: number;
  total_available: number;
  unused_count: number;
  potential_savings: number;
  recommendation: string;
}
