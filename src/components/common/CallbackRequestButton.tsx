import React, { useState } from "react";
import { Phone, CheckCircle2 } from "lucide-react";
import toast from 'react-hot-toast';

const initialForm = {
  name: "",
  email: "",
  phone: "",
  timing: "Anytime",
  message: "",
  recaptcha: false,
};

const CallbackRequestButton: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/callback-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to submit request');
      setSuccess(true);
      setForm(initialForm);
      toast.success('Callback request sent!');
      setTimeout(() => {
        setSuccess(false);
        setModalOpen(false);
      }, 1500);
    } catch (err) {
      toast.error('Failed to send request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Sticky Call Button */}
      <button
        className="fixed bottom-6 right-6 z-50 shadow-lg rounded-full w-16 h-16 flex items-center justify-center text-3xl focus:outline-none"
        style={{ background: 'var(--brand-primary)', color: '#fff' }}
        onClick={() => setModalOpen(true)}
        title="Request Callback"
      >
        <Phone size={32} />
      </button>

      {/* Callback Request Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative border border-slate-100" style={{ color: 'var(--brand-text)' }}>
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
              onClick={() => setModalOpen(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--brand-primary)' }}>
              <Phone className="text-green-600" /> Request Callback
            </h2>
            {success ? (
              <div className="flex flex-col items-center justify-center py-10">
                <CheckCircle2 size={48} className="text-green-500 mb-2" />
                <div className="text-lg font-semibold mb-2">Request Sent!</div>
                <div className="text-gray-500 text-center">We'll get back to you soon.</div>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Name"
                    className="flex-1 border rounded-lg p-3 focus:ring-2 focus:ring-[var(--brand-primary,#f59e42)] outline-none"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="flex-1 border rounded-lg p-3 focus:ring-2 focus:ring-[var(--brand-primary,#f59e42)] outline-none"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Phone"
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[var(--brand-primary,#f59e42)] outline-none"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  required
                />
                <div>
                  <label className="block text-gray-600 mb-1">Contact Timing</label>
                  <select
                    className="w-full border rounded-lg p-3"
                    value={form.timing}
                    onChange={e => setForm(f => ({ ...f, timing: e.target.value }))}
                  >
                    <option value="Anytime">Anytime</option>
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">What can I help you with today? (500 characters)</label>
                  <textarea
                    className="w-full border rounded-lg p-3"
                    maxLength={500}
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="recaptcha"
                    checked={form.recaptcha}
                    onChange={e => setForm(f => ({ ...f, recaptcha: e.target.checked }))}
                    required
                  />
                  <label htmlFor="recaptcha" className="text-gray-600">I'm not a robot</label>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
                    onClick={() => setModalOpen(false)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-lg font-semibold transition shadow"
                    style={{ background: 'var(--brand-primary)', color: '#fff' }}
                    disabled={!form.name || !form.phone || !form.recaptcha || loading}
                  >
                    {loading ? "Requesting..." : "Request Now"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CallbackRequestButton; 