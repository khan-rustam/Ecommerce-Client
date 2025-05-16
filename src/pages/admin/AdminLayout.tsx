import React from 'react';
import AdminDashboard from './AdminDashboard';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => (
  <AdminDashboard>
    <Outlet />
  </AdminDashboard>
);

export default AdminLayout; 