import React, { useEffect, useState } from 'react';
import { DashboardMetrics } from '../../types';
import { dashboardApi } from '../../services/api';

interface DashboardProps {
  customerId: string | null;
}

const Dashboard: React.FC<DashboardProps> = ({ customerId }) => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, [customerId]);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      const data = await dashboardApi.getMetrics(customerId || undefined);
      setMetrics(data);
    } catch (error) {
      console.error('Failed to load dashboard metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading dashboard...</div>;
  }

  if (!metrics) {
    return <div style={styles.error}>Failed to load dashboard data</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Dashboard Overview</h2>

      <div style={styles.metricsGrid}>
        <MetricCard
          title="Total Customers"
          value={metrics.total_customers}
          icon="👥"
          color="#0078d4"
        />
        <MetricCard
          title="Azure Resources"
          value={metrics.total_azure_resources}
          icon="☁️"
          color="#50e6ff"
        />
        <MetricCard
          title="M365 Users"
          value={metrics.total_m365_users}
          icon="👤"
          color="#00bcf2"
        />
        <MetricCard
          title="Monthly Cost"
          value={`$${metrics.total_monthly_cost.toLocaleString()}`}
          icon="💰"
          color="#00188f"
        />
      </div>

      <div style={styles.chartsGrid}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Resources by Status</h3>
          <div style={styles.statusList}>
            <StatusItem
              label="Running"
              count={metrics.resources_by_status.running}
              color="#10b981"
            />
            <StatusItem
              label="Stopped"
              count={metrics.resources_by_status.stopped}
              color="#f59e0b"
            />
            <StatusItem
              label="Deallocated"
              count={metrics.resources_by_status.deallocated}
              color="#6b7280"
            />
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Resources by Type</h3>
          <div style={styles.typeList}>
            {Object.entries(metrics.resources_by_type).map(([type, count]) => (
              <div key={type} style={styles.typeItem}>
                <span style={styles.typeName}>{type}</span>
                <span style={styles.typeCount}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, color }) => {
  return (
    <div style={{ ...styles.metricCard, borderLeftColor: color }}>
      <div style={styles.metricIcon}>{icon}</div>
      <div>
        <div style={styles.metricTitle}>{title}</div>
        <div style={styles.metricValue}>{value}</div>
      </div>
    </div>
  );
};

interface StatusItemProps {
  label: string;
  count: number;
  color: string;
}

const StatusItem: React.FC<StatusItemProps> = ({ label, count, color }) => {
  return (
    <div style={styles.statusItem}>
      <div style={{ ...styles.statusDot, backgroundColor: color }} />
      <span style={styles.statusLabel}>{label}</span>
      <span style={styles.statusCount}>{count}</span>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '24px',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  loading: {
    padding: '48px',
    textAlign: 'center',
    fontSize: '18px',
    color: '#6b7280',
  },
  error: {
    padding: '48px',
    textAlign: 'center',
    fontSize: '18px',
    color: '#ef4444',
  },
  title: {
    fontSize: '28px',
    fontWeight: '600',
    marginBottom: '24px',
    color: '#1f2937',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '24px',
  },
  metricCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    borderLeft: '4px solid',
  },
  metricIcon: {
    fontSize: '32px',
  },
  metricTitle: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '4px',
  },
  metricValue: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1f2937',
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '16px',
    color: '#1f2937',
  },
  statusList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  statusItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  statusDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
  },
  statusLabel: {
    flex: 1,
    fontSize: '14px',
    color: '#374151',
  },
  statusCount: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1f2937',
  },
  typeList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  typeItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #f3f4f6',
  },
  typeName: {
    fontSize: '14px',
    color: '#374151',
  },
  typeCount: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1f2937',
  },
};

export default Dashboard;
