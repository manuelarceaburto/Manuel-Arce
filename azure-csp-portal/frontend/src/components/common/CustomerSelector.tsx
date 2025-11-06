import React, { useEffect, useState } from 'react';
import { Customer } from '../../types';
import { customersApi } from '../../services/api';

interface CustomerSelectorProps {
  selectedCustomerId: string | null;
  onSelectCustomer: (customerId: string | null) => void;
}

const CustomerSelector: React.FC<CustomerSelectorProps> = ({
  selectedCustomerId,
  onSelectCustomer,
}) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await customersApi.getAll();
      setCustomers(data);
    } catch (error) {
      console.error('Failed to load customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    onSelectCustomer(value === 'all' ? null : value);
  };

  if (loading) {
    return <div style={styles.selector}>Loading customers...</div>;
  }

  return (
    <div style={styles.container}>
      <label style={styles.label}>Customer:</label>
      <select
        value={selectedCustomerId || 'all'}
        onChange={handleChange}
        style={styles.selector}
      >
        <option value="all">All Customers</option>
        {customers.map((customer) => (
          <option key={customer.id} value={customer.id}>
            {customer.name}
          </option>
        ))}
      </select>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
  },
  selector: {
    padding: '8px 12px',
    fontSize: '14px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    backgroundColor: 'white',
    cursor: 'pointer',
    minWidth: '200px',
  },
};

export default CustomerSelector;
