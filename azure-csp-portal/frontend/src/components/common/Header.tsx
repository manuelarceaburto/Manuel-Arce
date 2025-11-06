import React from 'react';
import CustomerSelector from './CustomerSelector';

interface HeaderProps {
  selectedCustomerId: string | null;
  onSelectCustomer: (customerId: string | null) => void;
}

const Header: React.FC<HeaderProps> = ({ selectedCustomerId, onSelectCustomer }) => {
  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <div style={styles.logo}>
          <h1 style={styles.title}>Azure CSP Management Portal</h1>
        </div>
        <CustomerSelector
          selectedCustomerId={selectedCustomerId}
          onSelectCustomer={onSelectCustomer}
        />
      </div>
    </header>
  );
};

const styles: Record<string, React.CSSProperties> = {
  header: {
    backgroundColor: '#0078d4',
    color: 'white',
    padding: '16px 24px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    margin: 0,
    fontSize: '24px',
    fontWeight: '600',
  },
};

export default Header;
