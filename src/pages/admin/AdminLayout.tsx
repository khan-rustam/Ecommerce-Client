import React from 'react';
import AdminDashboard from './AdminDashboard';
import { Outlet } from 'react-router-dom';
import AdminWarehouses from './AdminWarehouses';

const AdminLayout = () => (
  <AdminDashboard>
    <Outlet />
  </AdminDashboard>
);

export default AdminLayout; 