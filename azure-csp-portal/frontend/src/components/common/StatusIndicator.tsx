import React from 'react';

interface StatusIndicatorProps {
  status: 'running' | 'stopped' | 'deallocated' | 'active' | 'inactive' | 'compliant' | 'non-compliant' | 'unknown';
  label?: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, label }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'running':
      case 'active':
      case 'compliant':
        return '#10b981'; // green
      case 'stopped':
      case 'inactive':
        return '#f59e0b'; // orange
      case 'deallocated':
      case 'unknown':
        return '#6b7280'; // gray
      case 'non-compliant':
        return '#ef4444'; // red
      default:
        return '#6b7280';
    }
  };

  const getStatusText = () => {
    if (label) return label;
    return status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ');
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div
        style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          backgroundColor: getStatusColor(),
        }}
      />
      <span style={{ fontSize: '14px', color: '#374151' }}>{getStatusText()}</span>
    </div>
  );
};

export default StatusIndicator;
