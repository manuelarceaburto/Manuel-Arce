import axios from 'axios';
import { Customer, AzureResource, ResourceFilters, DashboardMetrics } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Customers API
export const customersApi = {
  getAll: async (): Promise<Customer[]> => {
    const response = await apiClient.get('/customers');
    return response.data;
  },

  getById: async (id: string): Promise<Customer> => {
    const response = await apiClient.get(`/customers/${id}`);
    return response.data;
  },

  create: async (customer: Partial<Customer>): Promise<Customer> => {
    const response = await apiClient.post('/customers', customer);
    return response.data;
  },

  update: async (id: string, customer: Partial<Customer>): Promise<Customer> => {
    const response = await apiClient.put(`/customers/${id}`, customer);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/customers/${id}`);
  },
};

// Dashboard API
export const dashboardApi = {
  getMetrics: async (customerId?: string): Promise<DashboardMetrics> => {
    const params = customerId ? { customer_id: customerId } : {};
    const response = await apiClient.get('/dashboard/metrics', { params });
    return response.data;
  },
};

// Azure Resources API
export const azureResourcesApi = {
  getAll: async (filters?: ResourceFilters): Promise<AzureResource[]> => {
    const response = await apiClient.get('/azure/resources', { params: filters });
    return response.data;
  },

  getById: async (id: string): Promise<AzureResource> => {
    const response = await apiClient.get(`/azure/resources/${id}`);
    return response.data;
  },

  syncResources: async (customerId?: string): Promise<void> => {
    const params = customerId ? { customer_id: customerId } : {};
    await apiClient.post('/azure/sync', params);
  },

  getResourcesByCustomer: async (customerId: string): Promise<AzureResource[]> => {
    const response = await apiClient.get(`/azure/resources/customer/${customerId}`);
    return response.data;
  },
};

export default apiClient;
