import React from 'react';
import { ResourceFilters } from '../../types';

interface ResourceFiltersProps {
  filters: ResourceFilters;
  onFiltersChange: (filters: ResourceFilters) => void;
  resourceTypes: string[];
  regions: string[];
}

const ResourceFiltersComponent: React.FC<ResourceFiltersProps> = ({
  filters,
  onFiltersChange,
  resourceTypes,
  regions,
}) => {
  const handleFilterChange = (key: keyof ResourceFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined,
    });
  };

  const handleClearFilters = () => {
    onFiltersChange({});
  };

  return (
    <div style={styles.container}>
      <div style={styles.filtersRow}>
        <div style={styles.filterGroup}>
          <label style={styles.label}>Type:</label>
          <select
            value={filters.type || ''}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            style={styles.select}
          >
            <option value="">All Types</option>
            {resourceTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.filterGroup}>
          <label style={styles.label}>Region:</label>
          <select
            value={filters.region || ''}
            onChange={(e) => handleFilterChange('region', e.target.value)}
            style={styles.select}
          >
            <option value="">All Regions</option>
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.filterGroup}>
          <label style={styles.label}>Status:</label>
          <select
            value={filters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value as any)}
            style={styles.select}
          >
            <option value="">All Statuses</option>
            <option value="running">Running</option>
            <option value="stopped">Stopped</option>
            <option value="deallocated">Deallocated</option>
          </select>
        </div>

        <button onClick={handleClearFilters} style={styles.clearButton}>
          Clear Filters
        </button>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: 'white',
    padding: '16px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    marginBottom: '20px',
  },
  filtersRow: {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
  },
  select: {
    padding: '8px 12px',
    fontSize: '14px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    backgroundColor: 'white',
    cursor: 'pointer',
    minWidth: '160px',
  },
  clearButton: {
    padding: '8px 16px',
    fontSize: '14px',
    backgroundColor: '#f3f4f6',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
    color: '#374151',
  },
};

export default ResourceFiltersComponent;
