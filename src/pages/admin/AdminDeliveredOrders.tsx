import React, { useState } from "react";
import { ShoppingCart } from "lucide-react";

const initialOrders: any[] = [];

const AdminDeliveredOrders = () => {
  const [orders] = useState(initialOrders);
  const [search, setSearch] = useState("");

  const filteredOrders = orders.filter((order: any) =>
    order.transactionId?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen py-10 px-2 md:px-8 flex flex-col items-center" style={{ background: 'var(--brand-bg)' }}>
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
        <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--brand-primary)' }}>Delivered Orders</h1>
        <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 mb-2">
          <input
            type="text"
            placeholder="Search..."
            className="w-64 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary,#2563eb)] bg-white"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 text-gray-700">
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Transaction ID</th>
                <th className="py-3 px-4 text-left">Customer</th>
                <th className="py-3 px-4 text-left">Items</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Total</th>
                <th className="py-3 px-4 text-left">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-4">
                      <ShoppingCart size={56} className="text-gray-300 mb-2" />
                      <div className="text-xl font-semibold text-gray-500">No Delivered Orders Yet</div>
                      <div className="text-gray-400 mb-4">No delivered orders have been placed yet.</div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order: any, idx: number) => (
                  <tr key={idx} className="even:bg-gray-50">
                    {/* Render order data here */}
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

export default AdminDeliveredOrders; 