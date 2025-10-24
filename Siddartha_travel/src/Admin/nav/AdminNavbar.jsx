// src/Admin/nav/AdminNavbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const AdminNavbar = ({ onMenuClick }) => {
  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side */}
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="text-gray-500 hover:text-gray-700 mr-4 md:hidden"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-800">🌍 Travel Admin Panel</h1>
        </div>
        {/* Center - Navigation */}
        <div className="hidden md:flex space-x-6">
          {/* Use relative paths for links within a nested route */}
          <Link to="users" className="text-gray-700 hover:text-blue-600 font-medium">
            Users
          </Link>
          <Link to="hosts" className="text-gray-700 hover:text-blue-600 font-medium">
            Hosts
          </Link>
          <Link to="field-config" className="text-gray-700 hover:text-blue-600 font-medium">
            Input Fields
          </Link>
        </div>
        {/* Right side */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            {/* 
              NOTE: The ERR_NAME_NOT_RESOLVED error was likely from this placeholder URL.
              Using a local image or a more reliable service is recommended.
            */}
            <img
              className="h-8 w-8 rounded-full object-cover"
              src="https://picsum.photos/seed/admin/32/32.jpg" // Using a more reliable placeholder
              alt="Admin"
            />
            <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">
              Admin User
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;