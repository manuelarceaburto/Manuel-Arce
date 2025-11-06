import { useState, useEffect } from 'react';

const STORAGE_KEY = 'selected_customer_id';

export const useCustomerSelection = () => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(() => {
    // Initialize from localStorage
    return localStorage.getItem(STORAGE_KEY);
  });

  useEffect(() => {
    // Persist to localStorage whenever selection changes
    if (selectedCustomerId) {
      localStorage.setItem(STORAGE_KEY, selectedCustomerId);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [selectedCustomerId]);

  const selectCustomer = (customerId: string | null) => {
    setSelectedCustomerId(customerId);
  };

  const isAllCustomers = selectedCustomerId === null || selectedCustomerId === 'all';

  return {
    selectedCustomerId,
    selectCustomer,
    isAllCustomers,
  };
};
