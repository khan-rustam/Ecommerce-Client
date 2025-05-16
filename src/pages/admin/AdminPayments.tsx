import React from 'react';
import { CreditCard, Edit, Trash2, Eye } from 'lucide-react';

const payments = [
  { id: 1, user: 'Alice', type: 'Visa', last4: '1234', expiry: '12/26' },
  { id: 2, user: 'Bob', type: 'MasterCard', last4: '5678', expiry: '09/25' },
];

const AdminPayments = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-6">Transactions</h1>
    <input className="mb-4 px-3 py-2 border rounded w-full max-w-md" placeholder="Search or filter transactions..." />
    <div className="bg-white rounded shadow p-4">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow-md">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="py-3 px-4 text-left">User</th>
              <th className="py-3 px-4 text-left">Type</th>
              <th className="py-3 px-4 text-left">Last 4</th>
              <th className="py-3 px-4 text-left">Expiry</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(payment => (
              <tr key={payment.id} className="border-b hover:bg-orange-50">
                <td className="py-3 px-4">{payment.user}</td>
                <td className="py-3 px-4">{payment.type}</td>
                <td className="py-3 px-4">{payment.last4}</td>
                <td className="py-3 px-4">{payment.expiry}</td>
                <td className="py-3 px-4 flex gap-2 justify-center">
                  <button className="text-blue-600 hover:underline"><Eye size={18} /></button>
                  <button className="text-orange-600 hover:underline"><Edit size={18} /></button>
                  <button className="text-red-600 hover:underline"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default AdminPayments; 