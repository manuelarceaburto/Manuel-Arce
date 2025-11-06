import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Header from './components/common/Header';
import Dashboard from './components/dashboard/Dashboard';
import AzureResourcesPage from './components/azure/AzureResourcesPage';
import M365Dashboard from './components/m365/M365Dashboard';
import { useCustomerSelection } from './hooks/useCustomerSelection';

const App: React.FC = () => {
  const { selectedCustomerId, selectCustomer } = useCustomerSelection();

  return (
    <Router>
      <div style={styles.app}>
        <Header selectedCustomerId={selectedCustomerId} onSelectCustomer={selectCustomer} />

        <nav style={styles.nav}>
          <div style={styles.navContainer}>
            <Link to="/" style={styles.navLink}>
              Dashboard
            </Link>
            <Link to="/azure-resources" style={styles.navLink}>
              Azure Resources
            </Link>
            <Link to="/m365" style={styles.navLink}>
              Microsoft 365
            </Link>
          </div>
        </nav>

        <main style={styles.main}>
          <Routes>
            <Route path="/" element={<Dashboard customerId={selectedCustomerId} />} />
            <Route
              path="/azure-resources"
              element={<AzureResourcesPage customerId={selectedCustomerId} />}
            />
            <Route path="/m365" element={<M365Dashboard customerId={selectedCustomerId} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer style={styles.footer}>
          <div style={styles.footerContainer}>
            <p style={styles.footerText}>
              Azure CSP Management Portal &copy; {new Date().getFullYear()}
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

const styles: Record<string, React.CSSProperties> = {
  app: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f9fafb',
  },
  nav: {
    backgroundColor: 'white',
    borderBottom: '1px solid #e5e7eb',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  },
  navContainer: {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'flex',
    gap: '32px',
    padding: '0 24px',
  },
  navLink: {
    padding: '16px 0',
    fontSize: '14px',
    fontWeight: '500',
    color: '#4b5563',
    textDecoration: 'none',
    borderBottom: '2px solid transparent',
    transition: 'all 0.2s',
  },
  main: {
    flex: 1,
    paddingTop: '24px',
    paddingBottom: '48px',
  },
  footer: {
    backgroundColor: 'white',
    borderTop: '1px solid #e5e7eb',
    marginTop: 'auto',
  },
  footerContainer: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '16px 24px',
  },
  footerText: {
    fontSize: '14px',
    color: '#6b7280',
    textAlign: 'center',
    margin: 0,
  },
};

export default App;
