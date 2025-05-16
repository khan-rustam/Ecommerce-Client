import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Plus, Check, Edit, Trash2 } from "lucide-react";

interface Notice {
  id: number;
  message: string;
  startDate: string;
  endDate: string;
}

const initialNotices: Notice[] = [];

const AdminNotice: React.FC = () => {
  const user = useSelector((state: any) => state.user.user);
  const [notices, setNotices] = useState<Notice[]>(initialNotices);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ message: "", startDate: "", endDate: "" });
  const [editId, setEditId] = useState<number | null>(null);

  if (!user || !user.isAdmin) return <Navigate to="/" />;

  const handleAdd = () => {
    setShowForm(true);
    setForm({ message: "", startDate: "", endDate: "" });
    setEditId(null);
  };

  const handleEdit = (notice: Notice) => {
    setShowForm(true);
    setForm({ message: notice.message, startDate: notice.startDate, endDate: notice.endDate });
    setEditId(notice.id);
  };

  const handleDelete = (id: number) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
  };

  const handleSave = () => {
    if (!form.message.trim()) return;
    if (editId !== null) {
      setNotices((prev) => prev.map((n) => n.id === editId ? { ...n, ...form } : n));
    } else {
      setNotices((prev) => [
        ...prev,
        { id: Date.now(), ...form },
      ]);
    }
    setShowForm(false);
    setForm({ message: "", startDate: "", endDate: "" });
    setEditId(null);
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">Notice</h1>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {!showForm && notices.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[320px]">
            <div className="mb-6">
              <Check size={48} className="text-gray-400 mx-auto" />
            </div>
            <div className="text-xl font-semibold text-gray-500 mb-2">No Notices Uploaded Yet</div>
            <div className="text-gray-400 mb-6">Create your first notice to display important information to users.</div>
            <button
              className="px-6 py-2 rounded bg-[var(--brand-primary,#475569)] text-white font-semibold hover:bg-[var(--brand-primary-hover,#334155)] transition"
              onClick={handleAdd}
            >
              Add Notice
            </button>
          </div>
        )}
        {showForm && (
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-semibold">Create notice</div>
              <button
                className="px-4 py-2 rounded bg-[var(--brand-primary,#475569)] text-white font-semibold hover:bg-[var(--brand-primary-hover,#334155)] transition"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-gray-600 mb-2">Your message here...</label>
              <textarea
                className="w-full min-h-[120px] border rounded p-3 text-gray-700"
                placeholder="Type something"
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600 mb-2">Start Date</label>
                <input
                  type="date"
                  className="w-full border rounded p-2"
                  value={form.startDate}
                  onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-2">End Date</label>
                <input
                  type="date"
                  className="w-full border rounded p-2"
                  value={form.endDate}
                  onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                />
              </div>
            </div>
          </div>
        )}
        {!showForm && notices.length > 0 && (
          <>
            <div className="flex justify-end mb-2">
              <button
                className="w-10 h-10 flex items-center justify-center rounded bg-[var(--brand-primary,#475569)] text-white hover:bg-[var(--brand-primary-hover,#334155)] transition"
                onClick={handleAdd}
                aria-label="Add Notice"
              >
                <Plus size={22} />
              </button>
            </div>
            <table className="min-w-full text-sm border-separate border-spacing-y-1">
              <thead>
                <tr className="text-gray-500 text-xs uppercase">
                  <th className="px-4 py-2 text-left font-semibold">Notice</th>
                  <th className="px-4 py-2 text-left font-semibold">Start date</th>
                  <th className="px-4 py-2 text-left font-semibold">End date</th>
                  <th className="px-4 py-2 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {notices.map((notice) => (
                  <tr key={notice.id} className="bg-white border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-800">{notice.message}</td>
                    <td className="px-4 py-2 text-gray-800">{notice.startDate}</td>
                    <td className="px-4 py-2 text-gray-800">{notice.endDate}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        className="w-8 h-8 flex items-center justify-center rounded bg-[var(--brand-primary,#2563eb)] text-white hover:bg-[var(--brand-primary-hover,#1d4ed8)]"
                        onClick={() => handleEdit(notice)}
                        aria-label="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="w-8 h-8 flex items-center justify-center rounded bg-red-100 text-red-600 hover:bg-red-200"
                        onClick={() => handleDelete(notice.id)}
                        aria-label="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminNotice; 