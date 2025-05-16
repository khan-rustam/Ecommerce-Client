import React from 'react';
import { MapPin, Edit, Trash2, Eye } from 'lucide-react';

const addresses = [
  { id: 1, user: 'Alice', name: 'Home', city: 'Delhi', country: 'India', pincode: '110001' },
  { id: 2, user: 'Bob', name: 'Office', city: 'Mumbai', country: 'India', pincode: '400001' },
];

const AdminAddresses = () => (
  <div>
    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><MapPin /> Addresses</h2>
    <div className="mb-4 flex justify-between items-center">
      <input className="border rounded px-3 py-2 w-64" placeholder="Search addresses..." />
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-xl shadow-md">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="py-3 px-4 text-left">User</th>
            <th className="py-3 px-4 text-left">Name</th>
            <th className="py-3 px-4 text-left">City</th>
            <th className="py-3 px-4 text-left">Country</th>
            <th className="py-3 px-4 text-left">Pincode</th>
            <th className="py-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {addresses.map(addr => (
            <tr key={addr.id} className="border-b hover:bg-orange-50">
              <td className="py-3 px-4">{addr.user}</td>
              <td className="py-3 px-4">{addr.name}</td>
              <td className="py-3 px-4">{addr.city}</td>
              <td className="py-3 px-4">{addr.country}</td>
              <td className="py-3 px-4">{addr.pincode}</td>
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
);

export default AdminAddresses; 