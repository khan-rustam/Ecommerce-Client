import React, { useState } from 'react';
import { useBrandColors } from '../../contexts/BrandColorContext';
import { useNavigate } from 'react-router-dom';

const AdminReviews = () => {
  const { colors } = useBrandColors();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  return (
    <div className="min-h-screen py-10 px-2 md:px-8 flex flex-col items-center" style={{ background: colors.background }}>
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm mb-2 w-full max-w-3xl" aria-label="Breadcrumbs">
        <button onClick={() => navigate('/admin')} className="hover:underline font-medium" style={{ color: colors.primary, background: 'transparent' }}>Dashboard</button>
        <span className="mx-1 text-gray-400">/</span>
        <span className="font-semibold" style={{ color: colors.text }}>Reviews</span>
      </nav>
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: colors.primary }}>Manage Reviews</h1>
        </div>
        <div className="mb-6 flex items-center gap-2">
          <input
            className="w-full max-w-md px-4 py-2 rounded-lg shadow-sm border focus:ring-2 focus:ring-[var(--brand-accent)] focus:outline-none transition"
            style={{ background: colors.accent, color: colors.text, borderColor: colors.primary }}
            placeholder="Search or filter reviews..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          {/* Reviews table/list placeholder */}
          <p className="text-gray-500">Reviews list will appear here.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminReviews; 