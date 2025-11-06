import apiClient from './api';
import {
  M365User,
  M365License,
  SharePointSite,
  TeamsTeam,
  ExchangeMailbox,
  IntuneDevice,
  LicenseOptimization,
} from '../types';

// M365 Users API
export const m365UsersApi = {
  getAll: async (customerId?: string): Promise<M365User[]> => {
    const params = customerId ? { customer_id: customerId } : {};
    const response = await apiClient.get('/m365/users', { params });
    return response.data;
  },

  getById: async (id: string): Promise<M365User> => {
    const response = await apiClient.get(`/m365/users/${id}`);
    return response.data;
  },

  syncUsers: async (customerId?: string): Promise<void> => {
    const params = customerId ? { customer_id: customerId } : {};
    await apiClient.post('/m365/users/sync', params);
  },
};

// M365 Licenses API
export const m365LicensesApi = {
  getAll: async (customerId?: string): Promise<M365License[]> => {
    const params = customerId ? { customer_id: customerId } : {};
    const response = await apiClient.get('/m365/licenses', { params });
    return response.data;
  },

  getOptimizations: async (customerId?: string): Promise<LicenseOptimization[]> => {
    const params = customerId ? { customer_id: customerId } : {};
    const response = await apiClient.get('/m365/licenses/optimizations', { params });
    return response.data;
  },

  syncLicenses: async (customerId?: string): Promise<void> => {
    const params = customerId ? { customer_id: customerId } : {};
    await apiClient.post('/m365/licenses/sync', params);
  },
};

// SharePoint Sites API
export const sharePointApi = {
  getAll: async (customerId?: string): Promise<SharePointSite[]> => {
    const params = customerId ? { customer_id: customerId } : {};
    const response = await apiClient.get('/m365/sharepoint', { params });
    return response.data;
  },

  syncSites: async (customerId?: string): Promise<void> => {
    const params = customerId ? { customer_id: customerId } : {};
    await apiClient.post('/m365/sharepoint/sync', params);
  },
};

// Teams API
export const teamsApi = {
  getAll: async (customerId?: string): Promise<TeamsTeam[]> => {
    const params = customerId ? { customer_id: customerId } : {};
    const response = await apiClient.get('/m365/teams', { params });
    return response.data;
  },

  syncTeams: async (customerId?: string): Promise<void> => {
    const params = customerId ? { customer_id: customerId } : {};
    await apiClient.post('/m365/teams/sync', params);
  },
};

// Exchange Mailboxes API
export const exchangeApi = {
  getAll: async (customerId?: string): Promise<ExchangeMailbox[]> => {
    const params = customerId ? { customer_id: customerId } : {};
    const response = await apiClient.get('/m365/exchange', { params });
    return response.data;
  },

  syncMailboxes: async (customerId?: string): Promise<void> => {
    const params = customerId ? { customer_id: customerId } : {};
    await apiClient.post('/m365/exchange/sync', params);
  },
};

// Intune Devices API
export const intuneApi = {
  getAll: async (customerId?: string): Promise<IntuneDevice[]> => {
    const params = customerId ? { customer_id: customerId } : {};
    const response = await apiClient.get('/m365/intune', { params });
    return response.data;
  },

  syncDevices: async (customerId?: string): Promise<void> => {
    const params = customerId ? { customer_id: customerId } : {};
    await apiClient.post('/m365/intune/sync', params);
  },
};
