import React, { useEffect, useState } from 'react';
import { useBrandColors } from '../../contexts/BrandColorContext';
import { Phone, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface CallbackRequest {
  _id: string;
  name: string;
  email?: string;
  phone: string;
  timing: string;
  message?: string;
  createdAt: string;
}

const AdminCallbackRequest: React.FC = () => {
  const { colors } = useBrandColors();
  const [requests, setRequests] = useState<CallbackRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/callback-requests');
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      toast.error('Failed to fetch callback requests');
    } finally {
      setLoading(false);
    }
  };

  const deleteRequest = async (id: string) => {
    if (!window.confirm('Delete this callback request?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/callback-requests/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setRequests(requests.filter(r => r._id !== id));
      toast.success('Deleted successfully');
    } catch (err) {
      toast.error('Failed to delete');
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto" style={{ background: colors.background, color: colors.text }}>
      <h1 className="text-3xl font-bold mb-8 text-center" style={{ color: colors.primary }}>Callback Requests</h1>
      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : requests.length === 0 ? (
        <div className="text-center text-gray-400">No callback requests found.</div>
      ) : (
        <div className="space-y-6">
          {requests.map(req => (
            <div key={req._id} className="bg-white rounded-xl shadow border border-slate-100 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 transition hover:shadow-lg">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-[var(--brand-primary,#f3f4f6)] w-14 h-14 flex items-center justify-center text-2xl font-bold text-white" style={{ background: colors.primary }}>
                  <Phone size={28} />
                </div>
                <div>
                  <div className="font-semibold text-lg" style={{ color: colors.primary }}>{req.name}</div>
                  <div className="text-gray-500 text-sm">{req.phone} {req.email && <span className="ml-2">| {req.email}</span>}</div>
                  <div className="text-xs text-gray-400">{new Date(req.createdAt).toLocaleString()}</div>
                  <div className="text-sm mt-1"><span className="font-medium">Timing:</span> {req.timing}</div>
                  {req.message && <div className="text-gray-700 mt-1">{req.message}</div>}
                </div>
              </div>
              <div className="flex flex-col gap-2 md:items-end md:justify-center">
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition shadow"
                  onClick={() => deleteRequest(req._id)}
                  disabled={deletingId === req._id}
                >
                  <Trash2 size={18} /> {deletingId === req._id ? 'Deleting...' : 'Delete'}
                </button>
                <a href={`tel:${req.phone}`} className="flex items-center gap-2 px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition shadow text-center" style={{ background: colors.primary }}>
                  <Phone size={18} /> Call now
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCallbackRequest; 