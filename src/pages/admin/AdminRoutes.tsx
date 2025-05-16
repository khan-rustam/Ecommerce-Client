import { Route } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import AdminHome from './AdminHome';
import AdminUsers from './AdminUsers';
import AdminOrders from './AdminOrders';
import AdminAddresses from './AdminAddresses';
import AdminPayments from './AdminPayments';
import AddProductPage from './products/AddProductPage';
import InterestedClients from './InterestedClients';
import Reports from './AdminReports';
import AdminBrands from './AdminBrands';

const adminRoutes = [
  <Route path="/admin" element={<AdminLayout />} key="admin">
    <Route index element={<AdminHome />} />
    <Route path="users" element={<AdminUsers />} />
    <Route path="orders" element={<AdminOrders />} />
    <Route path="addresses" element={<AdminAddresses />} />
    <Route path="payments" element={<AdminPayments />} />
    <Route path="products/add" element={<AddProductPage />} />
    <Route path="interested-clients" element={<InterestedClients />} />
    <Route path="reports" element={<Reports />} />
    <Route path="brands" element={<AdminBrands />} />
  </Route>
];

export default adminRoutes; 