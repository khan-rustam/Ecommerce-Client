import React from 'react';
import { useBrandColors } from '../../contexts/BrandColorContext';

const mockOrders = [
  { id: '1001', date: '2024-06-01', status: 'Delivered', total: '₹1,299' },
  { id: '1002', date: '2024-05-20', status: 'Shipped', total: '₹2,499' },
  { id: '1003', date: '2024-05-10', status: 'Cancelled', total: '₹799' },
];

const OrdersPage = () => {
  const { colors } = useBrandColors();
  return (
    <div className="max-w-3xl mx-auto p-8" style={{ background: colors.background, color: colors.text }}>
      <h2 className="text-2xl font-bold mb-6" style={{ color: colors.primary }}>My Orders</h2>
      <table className="w-full border rounded shadow text-left" style={{ background: colors.accent }}>
        <thead>
          <tr style={{ background: colors.secondary }}>
            <th className="py-2 px-4">Order #</th>
            <th className="py-2 px-4">Date</th>
            <th className="py-2 px-4">Status</th>
            <th className="py-2 px-4">Total</th>
            <th className="py-2 px-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {mockOrders.map(order => (
            <tr key={order.id} className="border-t">
              <td className="py-2 px-4">{order.id}</td>
              <td className="py-2 px-4">{order.date}</td>
              <td className="py-2 px-4">{order.status}</td>
              <td className="py-2 px-4">{order.total}</td>
              <td className="py-2 px-4">
                <button
                  style={{ color: colors.primary }}
                  className="hover:underline font-medium"
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default OrdersPage; 