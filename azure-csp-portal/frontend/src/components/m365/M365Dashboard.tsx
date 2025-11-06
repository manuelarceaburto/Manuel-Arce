import React, { useEffect, useState } from 'react';
import {
  M365User,
  M365License,
  SharePointSite,
  TeamsTeam,
  ExchangeMailbox,
  IntuneDevice,
  LicenseOptimization,
} from '../../types';
import {
  m365UsersApi,
  m365LicensesApi,
  sharePointApi,
  teamsApi,
  exchangeApi,
  intuneApi,
} from '../../services/m365-api';
import LicenseOptimizationComponent from './LicenseOptimization';

interface M365DashboardProps {
  customerId: string | null;
}

const M365Dashboard: React.FC<M365DashboardProps> = ({ customerId }) => {
  const [users, setUsers] = useState<M365User[]>([]);
  const [licenses, setLicenses] = useState<M365License[]>([]);
  const [sites, setSites] = useState<SharePointSite[]>([]);
  const [teams, setTeams] = useState<TeamsTeam[]>([]);
  const [mailboxes, setMailboxes] = useState<ExchangeMailbox[]>([]);
  const [devices, setDevices] = useState<IntuneDevice[]>([]);
  const [optimizations, setOptimizations] = useState<LicenseOptimization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadM365Data();
  }, [customerId]);

  const loadM365Data = async () => {
    try {
      setLoading(true);
      const customerParam = customerId || undefined;

      const [
        usersData,
        licensesData,
        sitesData,
        teamsData,
        mailboxesData,
        devicesData,
        optimizationsData,
      ] = await Promise.all([
        m365UsersApi.getAll(customerParam),
        m365LicensesApi.getAll(customerParam),
        sharePointApi.getAll(customerParam),
        teamsApi.getAll(customerParam),
        exchangeApi.getAll(customerParam),
        intuneApi.getAll(customerParam),
        m365LicensesApi.getOptimizations(customerParam),
      ]);

      setUsers(usersData);
      setLicenses(licensesData);
      setSites(sitesData);
      setTeams(teamsData);
      setMailboxes(mailboxesData);
      setDevices(devicesData);
      setOptimizations(optimizationsData);
    } catch (error) {
      console.error('Failed to load M365 data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncAll = async () => {
    try {
      setLoading(true);
      const customerParam = customerId || undefined;

      await Promise.all([
        m365UsersApi.syncUsers(customerParam),
        m365LicensesApi.syncLicenses(customerParam),
        sharePointApi.syncSites(customerParam),
        teamsApi.syncTeams(customerParam),
        exchangeApi.syncMailboxes(customerParam),
        intuneApi.syncDevices(customerParam),
      ]);

      await loadM365Data();
    } catch (error) {
      console.error('Failed to sync M365 data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading Microsoft 365 data...</div>;
  }

  const activeUsers = users.filter((u) => u.status === 'active').length;
  const totalLicenseCost = licenses.reduce((sum, l) => sum + l.cost * l.assigned_count, 0);
  const totalStorage = sites.reduce((sum, s) => sum + s.storage_used, 0);
  const compliantDevices = devices.filter((d) => d.compliance_status === 'compliant').length;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Microsoft 365 Dashboard</h2>
        <button onClick={handleSyncAll} style={styles.syncButton}>
          Sync All
        </button>
      </div>

      <div style={styles.metricsGrid}>
        <MetricCard title="Active Users" value={activeUsers} total={users.length} icon="👤" />
        <MetricCard
          title="Teams"
          value={teams.length}
          total={teams.reduce((sum, t) => sum + t.member_count, 0)}
          icon="👥"
          subtitle="total members"
        />
        <MetricCard
          title="SharePoint Sites"
          value={sites.length}
          total={`${totalStorage.toFixed(2)} GB`}
          icon="📁"
          subtitle="storage used"
        />
        <MetricCard
          title="Compliant Devices"
          value={compliantDevices}
          total={devices.length}
          icon="💻"
        />
        <MetricCard
          title="License Cost"
          value={`$${totalLicenseCost.toFixed(2)}`}
          icon="💰"
        />
        <MetricCard
          title="Mailboxes"
          value={mailboxes.length}
          total={`${mailboxes.reduce((sum, m) => sum + m.size_gb, 0).toFixed(2)} GB`}
          icon="📧"
          subtitle="total size"
        />
      </div>

      {optimizations.length > 0 && (
        <LicenseOptimizationComponent optimizations={optimizations} />
      )}

      <div style={styles.tablesGrid}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Recent Users</h3>
          <UsersTable users={users.slice(0, 5)} />
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>License Distribution</h3>
          <LicensesTable licenses={licenses} />
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Top Teams</h3>
          <TeamsTable teams={teams.slice(0, 5)} />
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Device Compliance</h3>
          <DevicesTable devices={devices.slice(0, 5)} />
        </div>
      </div>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: string | number;
  total?: string | number;
  icon: string;
  subtitle?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, total, icon, subtitle }) => {
  return (
    <div style={styles.metricCard}>
      <div style={styles.metricIcon}>{icon}</div>
      <div>
        <div style={styles.metricTitle}>{title}</div>
        <div style={styles.metricValue}>
          {value}
          {total && <span style={styles.metricTotal}> / {total}</span>}
        </div>
        {subtitle && <div style={styles.metricSubtitle}>{subtitle}</div>}
      </div>
    </div>
  );
};

const UsersTable: React.FC<{ users: M365User[] }> = ({ users }) => (
  <div style={styles.simpleTable}>
    {users.map((user) => (
      <div key={user.id} style={styles.tableRow}>
        <div>
          <div style={styles.userName}>{user.display_name}</div>
          <div style={styles.userEmail}>{user.email}</div>
        </div>
        <div style={styles.userStatus}>
          <span style={user.status === 'active' ? styles.statusActive : styles.statusInactive}>
            {user.status}
          </span>
        </div>
      </div>
    ))}
  </div>
);

const LicensesTable: React.FC<{ licenses: M365License[] }> = ({ licenses }) => (
  <div style={styles.simpleTable}>
    {licenses.map((license) => (
      <div key={license.id} style={styles.tableRow}>
        <div style={styles.licenseName}>{license.name}</div>
        <div style={styles.licenseCount}>
          {license.assigned_count} / {license.assigned_count + license.available_count}
        </div>
      </div>
    ))}
  </div>
);

const TeamsTable: React.FC<{ teams: TeamsTeam[] }> = ({ teams }) => (
  <div style={styles.simpleTable}>
    {teams.map((team) => (
      <div key={team.id} style={styles.tableRow}>
        <div style={styles.teamName}>{team.name}</div>
        <div style={styles.teamStats}>
          {team.member_count} members • {team.channel_count} channels
        </div>
      </div>
    ))}
  </div>
);

const DevicesTable: React.FC<{ devices: IntuneDevice[] }> = ({ devices }) => (
  <div style={styles.simpleTable}>
    {devices.map((device) => (
      <div key={device.id} style={styles.tableRow}>
        <div>
          <div style={styles.deviceName}>{device.device_name}</div>
          <div style={styles.deviceOS}>{device.os}</div>
        </div>
        <div
          style={
            device.compliance_status === 'compliant'
              ? styles.statusActive
              : styles.statusInactive
          }
        >
          {device.compliance_status}
        </div>
      </div>
    ))}
  </div>
);

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
  metricTotal: {
    fontSize: '18px',
    fontWeight: '400',
    color: '#6b7280',
  },
  metricSubtitle: {
    fontSize: '12px',
    color: '#9ca3af',
    marginTop: '2px',
  },
  tablesGrid: {
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
  simpleTable: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  tableRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px solid #f3f4f6',
  },
  userName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#1f2937',
  },
  userEmail: {
    fontSize: '12px',
    color: '#9ca3af',
  },
  userStatus: {
    fontSize: '12px',
  },
  statusActive: {
    color: '#10b981',
    fontWeight: '500',
  },
  statusInactive: {
    color: '#6b7280',
    fontWeight: '500',
  },
  licenseName: {
    fontSize: '14px',
    color: '#1f2937',
  },
  licenseCount: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1f2937',
  },
  teamName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#1f2937',
  },
  teamStats: {
    fontSize: '12px',
    color: '#6b7280',
  },
  deviceName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#1f2937',
  },
  deviceOS: {
    fontSize: '12px',
    color: '#9ca3af',
  },
};

export default M365Dashboard;
