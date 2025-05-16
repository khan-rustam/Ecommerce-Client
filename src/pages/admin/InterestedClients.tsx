import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Plus } from "lucide-react";

interface InterestedClientEntry {
  id: number;
  product: { name: string; image: string };
  user: { name: string; email: string; phone: string };
  createdAt: string;
}

const registeredUsers: InterestedClientEntry[] = [
  {
    id: 10,
    product: {
      name: "TEST",
      image: "https://via.placeholder.com/40x40?text=Img",
    },
    user: {
      name: "Admin User",
      email: "connect@ipestretail.com",
      phone: "--",
    },
    createdAt: "16 May, 2025",
  },
];

const unregisteredUsers: InterestedClientEntry[] = [];

const InterestedClients: React.FC = () => {
  const user = useSelector((state: any) => state.user.user);
  const [tab, setTab] = useState<'registered' | 'unregistered'>('registered');
  if (!user || !user.isAdmin) return <Navigate to="/" />;

  const data = tab === 'registered' ? registeredUsers : unregisteredUsers;

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">Users in cart</h1>
      <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
          <div className="flex gap-2">
            <button
              className={`px-5 py-2 rounded border text-sm font-medium transition-colors ${tab === 'registered' ? 'bg-[var(--brand-primary,#2563eb)] text-white border-[var(--brand-primary,#2563eb)]' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
              style={{ minWidth: 160 }}
              onClick={() => setTab('registered')}
            >
              Registered Users
            </button>
            <button
              className={`px-5 py-2 rounded border text-sm font-medium transition-colors ${tab === 'unregistered' ? 'bg-[var(--brand-primary,#2563eb)] text-white border-[var(--brand-primary,#2563eb)]' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
              style={{ minWidth: 160 }}
              onClick={() => setTab('unregistered')}
            >
              Unregistered Users
            </button>
          </div>
          <button
            className="w-10 h-10 flex items-center justify-center rounded bg-[var(--brand-primary,#2563eb)] text-white hover:bg-[var(--brand-primary,#1d4ed8)] transition"
            aria-label="Add"
          >
            <Plus size={22} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border-separate border-spacing-y-1">
            <thead>
              <tr className="text-gray-500 text-xs uppercase">
                <th className="px-4 py-2 text-left font-semibold">ID</th>
                <th className="px-4 py-2 text-left font-semibold">Product</th>
                <th className="px-4 py-2 text-left font-semibold">Name</th>
                <th className="px-4 py-2 text-left font-semibold">Email</th>
                <th className="px-4 py-2 text-left font-semibold">Phone</th>
                <th className="px-4 py-2 text-left font-semibold">Created at</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-gray-400 py-8">No users found.</td>
                </tr>
              ) : (
                data.map((entry) => (
                  <tr key={entry.id} className="bg-white border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-2">
                      <a
                        href={`#${entry.id}`}
                        className="text-[var(--brand-primary,#2563eb)] font-medium hover:underline"
                      >
                        #{entry.id}
                      </a>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <img src={entry.product.image} alt={entry.product.name} className="w-10 h-10 rounded border object-cover bg-white" />
                        <span className="font-medium text-gray-800">{entry.product.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-gray-800">{entry.user.name}</td>
                    <td className="px-4 py-2">
                      <a
                        href={`mailto:${entry.user.email}`}
                        className="text-[var(--brand-primary,#2563eb)] hover:underline"
                      >
                        {entry.user.email}
                      </a>
                    </td>
                    <td className="px-4 py-2 text-gray-500">{entry.user.phone}</td>
                    <td className="px-4 py-2 text-gray-500">{entry.createdAt}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InterestedClients;
