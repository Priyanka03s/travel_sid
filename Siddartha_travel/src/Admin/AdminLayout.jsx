// src/Admin/AdminLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavbar from './nav/AdminNavbar';

const AdminLayout = () => {
  return (
    // You can add a specific background or styling for the admin section here
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      {/* The Outlet is where child routes will be rendered */}
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;