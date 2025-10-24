// src/pages/TestPage.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';

const TestPage = () => {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Test Page</h1>
        <p className="text-gray-600 mb-2">Current URL: {window.location.href}</p>
        <p className="text-gray-600 mb-2">Path: {location.pathname}</p>
        <p className="text-gray-600 mb-4">Search: {location.search}</p>
        
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-medium mb-2">URL Parameters:</h3>
          <pre>{JSON.stringify(Object.fromEntries(new URLSearchParams(location.search)), null, 2)}</pre>
        </div>
      </div>
    </div>
  );
};

export default TestPage;