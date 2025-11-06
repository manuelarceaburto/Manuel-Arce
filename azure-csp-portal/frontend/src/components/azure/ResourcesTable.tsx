import React from 'react';
import { AzureResource } from '../../types';
import StatusIndicator from '../common/StatusIndicator';

interface ResourcesTableProps {
  resources: AzureResource[];
  loading: boolean;
}

const ResourcesTable: React.FC<ResourcesTableProps> = ({ resources, loading }) => {
  if (loading) {
    return <div style={styles.loading}>Loading resources...</div>;
  }

  if (resources.length === 0) {
    return <div style={styles.empty}>No resources found</div>;
  }

  return (
    <div style={styles.tableContainer}>
      <table style={styles.table}>
        <thead>
          <tr style={styles.headerRow}>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Type</th>
            <th style={styles.th}>Resource Group</th>
            <th style={styles.th}>Region</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Monthly Cost</th>
            <th style={styles.th}>Tags</th>
          </tr>
        </thead>
        <tbody>
          {resources.map((resource) => (
            <tr key={resource.id} style={styles.bodyRow}>
              <td style={styles.td}>
                <div style={styles.nameCell}>
                  <div style={styles.resourceName}>{resource.name}</div>
                  <div style={styles.resourceId}>{resource.resource_id}</div>
                </div>
              </td>
              <td style={styles.td}>{resource.type}</td>
              <td style={styles.td}>{resource.resource_group}</td>
              <td style={styles.td}>{resource.region}</td>
              <td style={styles.td}>
                <StatusIndicator status={resource.status} />
              </td>
              <td style={styles.td}>
                <span style={styles.cost}>
                  ${resource.monthly_cost.toFixed(2)}
                </span>
              </td>
              <td style={styles.td}>
                <div style={styles.tags}>
                  {Object.entries(resource.tags).map(([key, value]) => (
                    <span key={key} style={styles.tag}>
                      {key}: {value}
                    </span>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  loading: {
    padding: '48px',
    textAlign: 'center',
    fontSize: '16px',
    color: '#6b7280',
    backgroundColor: 'white',
    borderRadius: '8px',
  },
  empty: {
    padding: '48px',
    textAlign: 'center',
    fontSize: '16px',
    color: '#6b7280',
    backgroundColor: 'white',
    borderRadius: '8px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  headerRow: {
    backgroundColor: '#f9fafb',
    borderBottom: '2px solid #e5e7eb',
  },
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
  },
  bodyRow: {
    borderBottom: '1px solid #e5e7eb',
  },
  td: {
    padding: '12px 16px',
    fontSize: '14px',
    color: '#4b5563',
  },
  nameCell: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  resourceName: {
    fontWeight: '500',
    color: '#1f2937',
  },
  resourceId: {
    fontSize: '12px',
    color: '#9ca3af',
  },
  cost: {
    fontWeight: '600',
    color: '#059669',
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px',
  },
  tag: {
    fontSize: '12px',
    padding: '2px 8px',
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    borderRadius: '4px',
  },
};

export default ResourcesTable;
