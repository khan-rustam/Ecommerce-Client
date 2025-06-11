import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Check, Trash2, Star, Store } from 'lucide-react';
import { get, patch, del } from "../../utils/authFetch";

type Review = {
  _id: string;
  product: string | { name: string };
  userName: string;
  comment: string;
  rating: number;
  status: 'approved' | 'pending' | 'rejected';
  isCustomStore: boolean;
  createdAt: string;
  [key: string]: any;
};

const AdminReviews = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await get('/reviews');
      setReviews(res);
    } catch (err) {
      toast.error('Failed to fetch reviews');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await patch(`/reviews/${id}/approve`, {});
      toast.success('Review approved');
      setReviews(reviews => reviews.map(r => r._id === id ? { ...r, status: 'approved' } : r));
    } catch {
      toast.error('Failed to approve review');
    }
  };

  const handleToggleCustomStore = async (id: string, isCustomStore: boolean) => {
    try {
      await patch(`/reviews/${id}/custom-store`, { isCustomStore: !isCustomStore });
      toast.success(`Review ${!isCustomStore ? 'added to' : 'removed from'} custom store`);
      setReviews(reviews => reviews.map(r => r._id === id ? { ...r, isCustomStore: !isCustomStore } : r));
    } catch {
      toast.error('Failed to toggle custom store status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await del(`/reviews/${id}`);
      toast.success('Review deleted');
      setReviews(reviews => reviews.filter(r => r._id !== id));
    } catch {
      toast.error('Failed to delete review');
    }
  };

  const filtered = reviews.filter(r => {
    // Handle both populated product object and just product ID string
    const productName = typeof r.product === 'object' ? r.product?.name : String(r.product);
    const userNameMatch = r.userName?.toLowerCase().includes(search.toLowerCase()) || false;
    const commentMatch = r.comment?.toLowerCase().includes(search.toLowerCase()) || false;
    const productMatch = productName?.toLowerCase().includes(search.toLowerCase()) || false;
    
    return userNameMatch || commentMatch || productMatch;
  });

  return (
    <div className="min-h-screen py-10 px-2 md:px-8 flex flex-col items-center" style={{ background: 'var(--brand-bg)' }}>
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm mb-2 w-full max-w-5xl" aria-label="Breadcrumbs">
        <button onClick={() => navigate('/admin')} className="hover:underline font-medium" style={{ color: 'var(--brand-primary)', background: 'transparent' }}>Dashboard</button>
        <span className="mx-1 text-gray-400">/</span>
        <span className="font-semibold" style={{ color: 'var(--brand-text)' }}>Reviews</span>
      </nav>
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--brand-primary)' }}>Manage Reviews</h1>
        </div>
        <div className="mb-6 flex items-center gap-2">
          <input
            className="w-full max-w-md px-4 py-2 rounded-lg shadow-sm border focus:ring-2 focus:ring-[var(--brand-accent)] focus:outline-none transition"
            style={{ background: 'var(--brand-accent)', color: 'var(--brand-text)', borderColor: 'var(--brand-primary)' }}
            placeholder="Search or filter reviews..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border-separate border-spacing-y-1">
            <thead>
              <tr className="text-gray-500 text-xs uppercase">
                <th className="px-4 py-2 text-left font-semibold">Product</th>
                <th className="px-4 py-2 text-left font-semibold">User</th>
                <th className="px-4 py-2 text-left font-semibold">Rating</th>
                <th className="px-4 py-2 text-left font-semibold">Comment</th>
                <th className="px-4 py-2 text-left font-semibold">Status</th>
                <th className="px-4 py-2 text-left font-semibold">Custom Store</th>
                <th className="px-4 py-2 text-left font-semibold">Date</th>
                <th className="px-4 py-2 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="text-center py-8 text-gray-400">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-8 text-gray-400">No reviews found.</td></tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r._id} className="bg-white border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-800 font-medium">
                      {typeof r.product === 'object' ? r.product?.name : r.product}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{r.userName}</td>
                    <td className="px-4 py-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < r.rating ? "currentColor" : "none"} className="inline text-yellow-400" />
                      ))}
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{r.comment}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${r.status === 'approved' ? 'bg-green-100 text-green-700' : r.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{r.status}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={r.isCustomStore}
                        onChange={() => handleToggleCustomStore(r._id, r.isCustomStore)}
                        className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3 text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right flex gap-2 justify-end">
                      {r.status !== 'approved' && (
                        <button className="p-2 rounded bg-green-100 text-green-700 hover:bg-green-200 transition" title="Approve" onClick={() => handleApprove(r._id)}><Check size={16} /></button>
                      )}
                      <button className="p-2 rounded bg-red-100 text-red-500 hover:bg-red-200 transition" title="Delete" onClick={() => handleDelete(r._id)}><Trash2 size={16} /></button>
                    </td>
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

export default AdminReviews; 