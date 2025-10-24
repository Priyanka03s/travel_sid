import React, { useState, useEffect } from 'react';
import axios from 'axios';

// API base URL configuration
const API_BASE_URL = 'http://localhost:5000';

export default function AdminFieldConfig() {
  const [configurations, setConfigurations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeComponent, setActiveComponent] = useState('All');
  const [showInitializeModal, setShowInitializeModal] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [showAddFieldModal, setShowAddFieldModal] = useState(false);
  const [newField, setNewField] = useState({
    fieldName: '',
    label: '',
    component: 'BasicDetails',
    inputType: 'text',
    enabled: true,
    required: false
  });
  
  // Add state to track which fields are being updated
  const [updatingFields, setUpdatingFields] = useState({});
  
  // Add new state variables for backup and restoration
  const [backups, setBackups] = useState([]);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState(null);
  
  // State for field details when editing
  const [fieldDetails, setFieldDetails] = useState({
    fieldName: '', // Added fieldName to state
    label: '',
    component: 'BasicDetails',
    inputType: 'text',
    enabled: true,
    required: false,
    defaultValue: '',
    options: [],
    validation: {
      min: '',
      max: '',
      pattern: ''
    }
  });

  useEffect(() => {
    fetchConfigurations();
    fetchBackups();
  }, []);

  const fetchConfigurations = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/field-configurations`);
      setConfigurations(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching field configurations:', error);
      setLoading(false);
    }
  };

  const fetchBackups = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/field-configurations/backups`);
      setBackups(response.data);
    } catch (error) {
      console.error('Error fetching backups:', error);
    }
  };

  // Fixed handleToggle function with proper state management
  const handleToggle = async (id, field, value) => {
    // If this field is already being updated, return
    if (updatingFields[id]) return;
    
    // Mark this field as being updated
    setUpdatingFields(prev => ({ ...prev, [id]: true }));
    
    try {
      // Prepare update data
      const updateData = { [field]: value };
      
      // If disabling a field, also set required to false
      if (field === 'enabled' && !value) {
        updateData.required = false;
      }
      
      // Use PUT to update the field
      const response = await axios.put(`${API_BASE_URL}/api/field-configurations/${id}`, updateData);
      
      // Update the state with the response from the server
      setConfigurations(prev => 
        prev.map(config => 
          config._id === id ? response.data : config
        )
      );
      
      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent('fieldConfigUpdated'));
    } catch (error) {
      console.error('Error updating field configuration:', error);
      
      // Revert the optimistic update on error
      setConfigurations(prev => 
        prev.map(config => 
          config._id === id ? { ...config, [field]: !value } : config
        )
      );
      
      // Provide more detailed error information
      if (error.response) {
        if (error.response.status === 404) {
          alert(`Error: Field not found on server. The field may have been deleted by another user.`);
          fetchConfigurations(); // Refresh the data
        } else {
          alert(`Error updating field: ${error.response.data.message || 'Unknown error'}`);
        }
      } else if (error.request) {
        alert('Error: No response from server. Please check your connection.');
      } else {
        alert(`Error: ${error.message}`);
      }
    } finally {
      // Mark this field as no longer being updated
      setUpdatingFields(prev => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    }
  };

  const initializeConfigurations = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/field-configurations/initialize`);
      fetchConfigurations();
      setShowInitializeModal(false);
      alert('Field configurations initialized successfully!');
      
      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent('fieldConfigUpdated'));
    } catch (error) {
      console.error('Error initializing field configurations:', error);
      alert('Failed to initialize field configurations');
    }
  };

  const handleEditField = (field) => {
    setEditingField(field);
    setFieldDetails({
      fieldName: field.fieldName, // Include fieldName in state
      label: field.label,
      component: field.component,
      inputType: field.inputType,
      enabled: field.enabled,
      required: field.required,
      defaultValue: field.defaultValue || '',
      options: field.options || [],
      validation: {
        min: field.validation?.min || '',
        max: field.validation?.max || '',
        pattern: field.validation?.pattern || ''
      }
    });
  };

  const saveFieldEdit = async () => {
    try {
      // Make sure we have a valid field to edit
      if (!editingField || !editingField._id) {
        alert('No field selected for editing');
        return;
      }
      
      // Check if field name is being changed and already exists
      if (fieldDetails.fieldName !== editingField.fieldName) {
        const existingField = configurations.find(c => 
          c.fieldName === fieldDetails.fieldName && c._id !== editingField._id
        );
        if (existingField) {
          alert(`Field with name "${fieldDetails.fieldName}" already exists`);
          return;
        }
      }
      
      const response = await axios.put(
        `${API_BASE_URL}/api/field-configurations/${editingField._id}`, 
        fieldDetails
      );
      
      // Update the state with the response from the server
      setConfigurations(prev => 
        prev.map(config => 
          config._id === editingField._id ? response.data : config
        )
      );
      
      setEditingField(null);
      alert('Field updated successfully!');
      
      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent('fieldConfigUpdated'));
    } catch (error) {
      console.error('Error updating field:', error);
      
      if (error.response) {
        alert(`Error updating field: ${error.response.data.message || 'Unknown error'}`);
      } else if (error.request) {
        alert('Error: No response from server. Please check your connection.');
      } else {
        alert(`Error: ${error.message}`);
      }
    }
  };

  const handleAddField = async () => {
    try {
      if (!newField.fieldName.trim() || !newField.label.trim()) {
        alert('Field name and label are required');
        return;
      }
      
      const existingField = configurations.find(c => c.fieldName === newField.fieldName);
      if (existingField) {
        alert(`Field with name "${newField.fieldName}" already exists`);
        return;
      }
      
      const response = await axios.post(`${API_BASE_URL}/api/field-configurations`, newField);
      
      // Add the new field to the state
      setConfigurations(prev => [...prev, response.data]);
      
      setShowAddFieldModal(false);
      setNewField({
        fieldName: '',
        label: '',
        component: 'BasicDetails',
        inputType: 'text',
        enabled: true,
        required: false
      });
      alert('Field added successfully!');
      
      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent('fieldConfigUpdated'));
    } catch (error) {
      console.error('Error adding field:', error);
      
      if (error.response) {
        alert(`Error adding field: ${error.response.data.message || 'Unknown error'}`);
      } else if (error.request) {
        alert('Error: No response from server. Please check your connection.');
      } else {
        alert(`Error: ${error.message}`);
      }
    }
  };

  // New function to create a backup
  const createBackup = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/field-configurations/backup`);
      fetchBackups();
      setShowBackupModal(false);
      alert('Backup created successfully!');
    } catch (error) {
      console.error('Error creating backup:', error);
      alert('Failed to create backup');
    }
  };

  // Function to restore from backup
  const restoreFromBackup = async () => {
    if (!selectedBackup) return;
    
    try {
      await axios.post(`${API_BASE_URL}/api/field-configurations/restore/${selectedBackup}`);
      fetchConfigurations();
      setShowRestoreModal(false);
      setSelectedBackup(null);
      alert('Field configurations restored successfully!');
      
      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent('fieldConfigUpdated'));
    } catch (error) {
      console.error('Error restoring from backup:', error);
      alert('Failed to restore from backup');
    }
  };

  // Function to restore missing default fields
  const restoreMissingDefaults = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/field-configurations/restore-missing`);
      fetchConfigurations();
      alert(response.data.message);
      
      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent('fieldConfigUpdated'));
    } catch (error) {
      console.error('Error restoring missing defaults:', error);
      alert('Failed to restore missing fields');
    }
  };

  const filteredConfigurations = configurations.filter(config => {
    const matchesSearch = config.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          config.fieldName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesComponent = activeComponent === 'All' || config.component === activeComponent;
    return matchesSearch && matchesComponent;
  });

  const groupedConfigurations = configurations.reduce((acc, config) => {
    if (!acc[config.component]) {
      acc[config.component] = [];
    }
    acc[config.component].push(config);
    return acc;
  }, {});

  const components = ['All', ...Object.keys(groupedConfigurations)];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Input Field Manager</h1>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowAddFieldModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Add New Field
          </button>
          <button
            onClick={restoreMissingDefaults}
            className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
          >
            Restore Missing Fields
          </button>
          <button
            onClick={() => setShowBackupModal(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Create Backup
          </button>
          <button
            onClick={() => setShowRestoreModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Restore from Backup
          </button>
          <button
            onClick={() => setShowInitializeModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Reset to Default
          </button>
        </div>
      </div>
      
      <div className="mb-6">
        <p className="text-gray-600 mb-4">
          Manage all input fields across the application. Enable/disable fields, edit properties, and control their behavior.
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search fields..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <select
              value={activeComponent}
              onChange={(e) => setActiveComponent(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {components.map(component => (
                <option key={component} value={component}>
                  {component === 'All' ? 'All Components' : component}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Fields</p>
              <p className="text-2xl font-bold">{configurations.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Enabled Fields</p>
              <p className="text-2xl font-bold">
                {configurations.filter(c => c.enabled).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="rounded-full bg-yellow-100 p-3 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Required Fields</p>
              <p className="text-2xl font-bold">
                {configurations.filter(c => c.required).length}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Field List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Field Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Component</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enabled</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Required</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredConfigurations.map((field) => (
              <tr key={field._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{field.label}</div>
                      <div className="text-sm text-gray-500">{field.fieldName}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {field.component}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {field.inputType}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={field.enabled}
                      onChange={(e) => handleToggle(field._id, 'enabled', e.target.checked)}
                      className="sr-only peer"
                      disabled={updatingFields[field._id]}
                    />
                    <div className={`relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 ${updatingFields[field._id] ? 'opacity-50' : ''}`}></div>
                  </label>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={field.required}
                      onChange={(e) => handleToggle(field._id, 'required', e.target.checked)}
                      className="sr-only peer"
                      disabled={!field.enabled || updatingFields[field._id]}
                    />
                    <div className={`relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${field.enabled ? 'peer-checked:bg-blue-600' : 'opacity-50'} ${updatingFields[field._id] ? 'opacity-50' : ''}`}></div>
                  </label>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEditField(field)}
                    className="text-blue-600 hover:text-blue-900"
                    disabled={updatingFields[field._id]}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredConfigurations.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No fields found matching your criteria.</p>
          </div>
        )}
      </div>
      
      {/* Add Field Modal */}
      {showAddFieldModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Add New Field</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Field Name *</label>
                <input
                  type="text"
                  value={newField.fieldName}
                  onChange={(e) => setNewField({...newField, fieldName: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  placeholder="e.g., customField"
                />
                <p className="text-xs text-gray-500 mt-1">Unique identifier for the field (camelCase recommended)</p>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Label *</label>
                <input
                  type="text"
                  value={newField.label}
                  onChange={(e) => setNewField({...newField, label: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  placeholder="e.g., Custom Field"
                />
                <p className="text-xs text-gray-500 mt-1">Display name for the field</p>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Component *</label>
                <select
                  value={newField.component}
                  onChange={(e) => setNewField({...newField, component: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                >
                  <option value="BasicDetails">Basic Details</option>
                  <option value="ItineraryDetails">Itinerary Details</option>
                  <option value="LogisticsSection">Logistics Section</option>
                  <option value="PricingSection">Pricing Section</option>
                  <option value="ReviewPublish">Review & Publish</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Which component should this field appear in?</p>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Input Type *</label>
                <select
                  value={newField.inputType}
                  onChange={(e) => setNewField({...newField, inputType: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                >
                  <option value="text">Text</option>
                  <option value="textarea">Textarea</option>
                  <option value="select">Select</option>
                  <option value="checkbox">Checkbox</option>
                  <option value="radio">Radio</option>
                  <option value="date">Date</option>
                  <option value="file">File</option>
                  <option value="number">Number</option>
                  <option value="complex">Complex</option>
                  <option value="button">Button</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">What type of input should this field have?</p>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={newField.enabled}
                  onChange={(e) => setNewField({...newField, enabled: e.target.checked})}
                  className="mr-2"
                />
                <label className="text-gray-700">Enabled by default</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={newField.required}
                  onChange={(e) => setNewField({...newField, required: e.target.checked})}
                  className="mr-2"
                />
                <label className="text-gray-700">Required by default</label>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowAddFieldModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleAddField}
                className="px-4 py-2 bg-green-600 text-white rounded-md"
              >
                Add Field
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Field Modal */}
      {editingField && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Edit Field: {editingField.label}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Field Name *</label>
                <input
                  type="text"
                  value={fieldDetails.fieldName}
                  onChange={(e) => setFieldDetails({...fieldDetails, fieldName: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
                <p className="text-xs text-gray-500 mt-1">Unique identifier for the field</p>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Label *</label>
                <input
                  type="text"
                  value={fieldDetails.label}
                  onChange={(e) => setFieldDetails({...fieldDetails, label: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Component *</label>
                <select
                  value={fieldDetails.component}
                  onChange={(e) => setFieldDetails({...fieldDetails, component: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                >
                  <option value="BasicDetails">Basic Details</option>
                  <option value="ItineraryDetails">Itinerary Details</option>
                  <option value="LogisticsSection">Logistics Section</option>
                  <option value="PricingSection">Pricing Section</option>
                  <option value="ReviewPublish">Review & Publish</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Input Type *</label>
                <select
                  value={fieldDetails.inputType}
                  onChange={(e) => setFieldDetails({...fieldDetails, inputType: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                >
                  <option value="text">Text</option>
                  <option value="textarea">Textarea</option>
                  <option value="select">Select</option>
                  <option value="checkbox">Checkbox</option>
                  <option value="radio">Radio</option>
                  <option value="date">Date</option>
                  <option value="file">File</option>
                  <option value="number">Number</option>
                  <option value="complex">Complex</option>
                  <option value="button">Button</option>
                </select>
              </div>
              
              {/* Conditional fields based on input type */}
              {(fieldDetails.inputType === 'select' || fieldDetails.inputType === 'radio') && (
                <div>
                  <label className="block text-gray-700 mb-2">Options</label>
                  <div className="space-y-2">
                    {fieldDetails.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...fieldDetails.options];
                            newOptions[index] = e.target.value;
                            setFieldDetails({...fieldDetails, options: newOptions});
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                          placeholder="Option value"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newOptions = [...fieldDetails.options];
                            newOptions.splice(index, 1);
                            setFieldDetails({...fieldDetails, options: newOptions});
                          }}
                          className="px-3 py-2 bg-red-100 text-red-700 rounded-md"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setFieldDetails({
                          ...fieldDetails,
                          options: [...fieldDetails.options, '']
                        });
                      }}
                      className="px-3 py-2 bg-blue-100 text-blue-700 rounded-md"
                    >
                      Add Option
                    </button>
                  </div>
                </div>
              )}
              
              {fieldDetails.inputType === 'number' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Minimum Value</label>
                    <input
                      type="number"
                      value={fieldDetails.validation.min}
                      onChange={(e) => setFieldDetails({
                        ...fieldDetails,
                        validation: {...fieldDetails.validation, min: e.target.value}
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Maximum Value</label>
                    <input
                      type="number"
                      value={fieldDetails.validation.max}
                      onChange={(e) => setFieldDetails({
                        ...fieldDetails,
                        validation: {...fieldDetails.validation, max: e.target.value}
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              )}
              
              <div>
                <label className="block text-gray-700 mb-2">Default Value</label>
                <input
                  type="text"
                  value={fieldDetails.defaultValue}
                  onChange={(e) => setFieldDetails({...fieldDetails, defaultValue: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={fieldDetails.enabled}
                    onChange={(e) => setFieldDetails({...fieldDetails, enabled: e.target.checked})}
                    className="mr-2"
                  />
                  <label className="text-gray-700">Enabled</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={fieldDetails.required}
                    onChange={(e) => setFieldDetails({...fieldDetails, required: e.target.checked})}
                    className="mr-2"
                    disabled={!fieldDetails.enabled}
                  />
                  <label className={`text-gray-700 ${!fieldDetails.enabled ? 'opacity-50' : ''}`}>Required</label>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setEditingField(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={saveFieldEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Initialize Confirmation Modal */}
      {showInitializeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Reset Field Configurations</h3>
            <p className="text-gray-600 mb-6">
              This will reset all field configurations to their default values. Are you sure you want to continue?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowInitializeModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={initializeConfigurations}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Backup Creation Modal */}
      {showBackupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Create Backup</h3>
            <p className="text-gray-600 mb-6">
              This will create a backup of all current field configurations. You can restore from this backup later if needed.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowBackupModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={createBackup}
                className="px-4 py-2 bg-purple-600 text-white rounded-md"
              >
                Create Backup
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Restore from Backup Modal */}
      {showRestoreModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Restore from Backup</h3>
            <p className="text-gray-600 mb-4">
              Select a backup to restore field configurations from. This will replace all current configurations.
            </p>
            
            {backups.length > 0 ? (
              <div className="mb-6 max-h-60 overflow-y-auto">
                {backups.map(backup => (
                  <div 
                    key={backup._id} 
                    className={`p-3 border rounded-md mb-2 cursor-pointer ${selectedBackup === backup._id ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                    onClick={() => setSelectedBackup(backup._id)}
                  >
                    <div className="font-medium">
                      {new Date(backup.timestamp).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {backup.configurations.length} fields
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mb-6 text-gray-500 text-center py-4">
                No backups available
              </div>
            )}
            
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowRestoreModal(false);
                  setSelectedBackup(null);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={restoreFromBackup}
                disabled={!selectedBackup}
                className={`px-4 py-2 rounded-md ${selectedBackup ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-indigo-300 text-white cursor-not-allowed'}`}
              >
                Restore
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 