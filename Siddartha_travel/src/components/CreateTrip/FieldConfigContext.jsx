// components/CreateTrip/FieldConfigContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { fieldConfigAPI } from '../../services/api';

const FieldConfigContext = createContext();

export const FieldConfigProvider = ({ children }) => {
  const [configurations, setConfigurations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchConfigurations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fieldConfigAPI.getAll();
      
      // Ensure response.data exists and is an array
      if (response && response.data && Array.isArray(response.data)) {
        setConfigurations(response.data);
      } else {
        console.warn('Invalid field configuration response:', response);
        setConfigurations([]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching field configurations:', error);
      setError('Failed to load field configurations');
      setConfigurations([]);
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchConfigurations();
  }, []);

  // Refresh configurations every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchConfigurations();
    }, 300000); // 5 minutes
    return () => clearInterval(interval);
  }, []);

  const isFieldEnabled = (fieldName) => {
    if (loading) return true; // Default to enabled while loading
    if (!Array.isArray(configurations)) return true; // Safety check
    
    const field = configurations.find(config => config.fieldName === fieldName);
    return field ? field.enabled : true; // Default to enabled if not found
  };

  const isFieldRequired = (fieldName) => {
    if (loading) return false; // Default to not required while loading
    if (!Array.isArray(configurations)) return false; // Safety check
    
    const field = configurations.find(config => config.fieldName === fieldName);
    return field ? field.required : false; // Default to not required if not found
  };

  const getConfigurationsByComponent = (componentName) => {
    if (loading) return []; // Return empty array while loading
    if (!Array.isArray(configurations)) return []; // Safety check
    
    const filtered = configurations.filter(config => config.component === componentName);
    return Array.isArray(filtered) ? filtered : []; // Ensure we return an array
  };

  const value = {
    configurations,
    loading,
    error,
    isFieldEnabled,
    isFieldRequired,
    getConfigurationsByComponent,
    refreshConfigurations: fetchConfigurations
  };

  return (
    <FieldConfigContext.Provider value={value}>
      {children}
    </FieldConfigContext.Provider>
  );
};

export const useFieldConfig = () => {
  const context = useContext(FieldConfigContext);
  if (!context) {
    throw new Error('useFieldConfig must be used within a FieldConfigProvider');
  }
  return context;
};