import React from 'react';
import { LicenseOptimization } from '../../types';

interface LicenseOptimizationProps {
  optimizations: LicenseOptimization[];
}

const LicenseOptimizationComponent: React.FC<LicenseOptimizationProps> = ({ optimizations }) => {
  if (optimizations.length === 0) {
    return null;
  }

  const totalPotentialSavings = optimizations.reduce((sum, opt) => sum + opt.potential_savings, 0);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>License Optimization Recommendations</h3>
        <div style={styles.savingsBadge}>
          Potential Savings: ${totalPotentialSavings.toFixed(2)}/month
        </div>
      </div>

      <div style={styles.optimizationsGrid}>
        {optimizations.map((opt, index) => (
          <OptimizationCard key={index} optimization={opt} />
        ))}
      </div>
    </div>
  );
};

interface OptimizationCardProps {
  optimization: LicenseOptimization;
}

const OptimizationCard: React.FC<OptimizationCardProps> = ({ optimization }) => {
  const utilizationRate = (
    (optimization.total_assigned / (optimization.total_assigned + optimization.total_available)) *
    100
  ).toFixed(1);

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <div>
          <div style={styles.licenseName}>{optimization.license_name}</div>
          <div style={styles.utilization}>
            Utilization: {utilizationRate}%
          </div>
        </div>
        <div style={styles.savings}>${optimization.potential_savings.toFixed(2)}/mo</div>
      </div>

      <div style={styles.stats}>
        <div style={styles.statItem}>
          <span style={styles.statLabel}>Assigned:</span>
          <span style={styles.statValue}>{optimization.total_assigned}</span>
        </div>
        <div style={styles.statItem}>
          <span style={styles.statLabel}>Available:</span>
          <span style={styles.statValue}>{optimization.total_available}</span>
        </div>
        <div style={styles.statItem}>
          <span style={styles.statLabel}>Unused:</span>
          <span style={styles.statValueUnused}>{optimization.unused_count}</span>
        </div>
      </div>

      <div style={styles.recommendation}>
        <div style={styles.recommendationIcon}>💡</div>
        <div style={styles.recommendationText}>{optimization.recommendation}</div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    marginBottom: '24px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  title: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1f2937',
    margin: 0,
  },
  savingsBadge: {
    padding: '8px 16px',
    backgroundColor: '#d1fae5',
    color: '#065f46',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
  },
  optimizationsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '16px',
  },
  card: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    border: '2px solid #fbbf24',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
  },
  licenseName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '4px',
  },
  utilization: {
    fontSize: '14px',
    color: '#6b7280',
  },
  savings: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#059669',
  },
  stats: {
    display: 'flex',
    gap: '16px',
    marginBottom: '16px',
    paddingBottom: '16px',
    borderBottom: '1px solid #e5e7eb',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  statLabel: {
    fontSize: '12px',
    color: '#6b7280',
  },
  statValue: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1f2937',
  },
  statValueUnused: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#dc2626',
  },
  recommendation: {
    display: 'flex',
    gap: '12px',
    padding: '12px',
    backgroundColor: '#fef3c7',
    borderRadius: '6px',
  },
  recommendationIcon: {
    fontSize: '20px',
  },
  recommendationText: {
    fontSize: '14px',
    color: '#92400e',
    lineHeight: '1.5',
  },
};

export default LicenseOptimizationComponent;
