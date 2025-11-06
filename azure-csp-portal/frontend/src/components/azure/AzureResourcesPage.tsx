import React, { useEffect, useState } from 'react';
import { AzureResource, ResourceFilters } from '../../types';
import { azureResourcesApi } from '../../services/api';
import ResourcesTable from './ResourcesTable';
import ResourceFiltersComponent from './ResourceFilters';

interface AzureResourcesPageProps {
  customerId: string | null;
}

const AzureResourcesPage: React.FC<AzureResourcesPageProps> = ({ customerId }) => {
  const [resources, setResources] = useState<AzureResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [filters, setFilters] = useState<ResourceFilters>({});

  useEffect(() => {
    loadResources();
  }, [customerId, filters]);

  const loadResources = async () => {
    try {
      setLoading(true);
      const filterParams = { ...filters };
      if (customerId) {
        filterParams.customer_id = customerId;
      }
      const data = await azureResourcesApi.getAll(filterParams);
      setResources(data);
    } catch (error) {
      console.error('Failed to load resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    try {
      setSyncing(true);
      await azureResourcesApi.syncResources(customerId || undefined);
      await loadResources();
    } catch (error) {
      console.error('Failed to sync resources:', error);
    } finally {
      setSyncing(false);
    }
  };

  const resourceTypes = [...new Set(resources.map((r) => r.type))];
  const regions = [...new Set(resources.map((r) => r.region))];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Azure Resources</h2>
        <button
          onClick={handleSync}
          disabled={syncing}
          style={syncing ? { ...styles.syncButton, ...styles.syncButtonDisabled } : styles.syncButton}
        >
          {syncing ? 'Syncing...' : 'Sync with Azure'}
        </button>
      </div>

      <ResourceFiltersComponent
        filters={filters}
        onFiltersChange={setFilters}
        resourceTypes={resourceTypes}
        regions={regions}
      />

      <div style={styles.stats}>
        <span style={styles.statText}>
          Showing {resources.length} resource{resources.length !== 1 ? 's' : ''}
        </span>
        {resources.length > 0 && (
          <span style={styles.statText}>
            Total monthly cost: ${resources.reduce((sum, r) => sum + r.monthly_cost, 0).toFixed(2)}
          </span>
        )}
      </div>

      <ResourcesTable resources={resources} loading={loading} />
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '24px',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#1f2937',
    margin: 0,
  },
  syncButton: {
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '600',
    backgroundColor: '#0078d4',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  syncButtonDisabled: {
    backgroundColor: '#9ca3af',
    cursor: 'not-allowed',
  },
  stats: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  statText: {
    fontSize: '14px',
    color: '#6b7280',
    fontWeight: '500',
  },
};

export default AzureResourcesPage;
