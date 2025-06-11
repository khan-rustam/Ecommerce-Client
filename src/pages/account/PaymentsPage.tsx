import React, { useState, useEffect } from 'react';
import { CreditCard, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { Profile } from '../../api';
import AccountLayout from '../../components/layout/AccountLayout';

const emptyCard = {
  type: '',
  last4: '',
  expiry: '',
};

const PaymentsPage = () => {
  const token = useSelector((state: any) => state.user.token);
  const [payments, setPayments] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyCard);
  const [editId, setEditId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchPayments = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${Profile}/payments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setPayments(data);
      else toast.error(data.msg || 'Failed to load payment methods');
    } catch {
      toast.error('Failed to load payment methods');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
    // eslint-disable-next-line
  }, [token]);

  const handleAddOrEdit = async () => {
    if (!token) {
      toast.error('Please login to save card');
      return;
    }
    if (!form.type || !form.last4 || !form.expiry) {
      toast.error('Please fill all required fields');
      return;
    }
    setSubmitting(true);
    try {
      let res, data;
      if (editId) {
        res = await fetch(`${Profile}/payments/${editId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ...form, cardToken: 'tok_test' }),
        });
        data = await res.json();
      } else {
        res = await fetch(`${Profile}/payments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ...form, cardToken: 'tok_test' }),
        });
        data = await res.json();
      }
      if (res.ok) {
        toast.success(editId ? 'Card updated' : 'Card added');
        setShowModal(false);
        setForm(emptyCard);
        setEditId(null);
        fetchPayments();
      } else {
        toast.error(data.msg || (editId ? 'Failed to update card' : 'Failed to add card'));
      }
    } catch {
      toast.error(editId ? 'Failed to update card' : 'Failed to add card');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (card: any) => {
    setForm({ type: card.type, last4: card.last4, expiry: card.expiry });
    setEditId(card._id);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${Profile}/payments/${deleteId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Card removed');
        fetchPayments();
      } else {
        toast.error(data.msg || 'Failed to remove card');
      }
    } catch {
      toast.error('Failed to remove card');
    } finally {
      setSubmitting(false);
      setDeleteId(null);
    }
  };

  return (
    <AccountLayout>
      <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--brand-primary)' }}>Payment Methods</h2>
      <button
        className="mb-4 px-4 py-2 rounded shadow transition font-semibold"
        style={{ background: 'var(--brand-primary)', color: '#fff' }}
        onClick={() => {
          if (!token) {
            toast.error('Please login to add card');
            return;
          }
          setForm(emptyCard);
          setEditId(null);
          setShowModal(true);
        }}
      >
        + Add New Card
      </button>
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <span style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>Loading...</span>
        </div>
      ) : payments.length === 0 ? (
        <div className="text-gray-500">No payment methods found.</div>
      ) : (
        <div className="space-y-4">
          {payments.map(card => (
            <div key={card._id} className="border rounded-xl p-5 flex justify-between items-center bg-white shadow-md hover:shadow-lg transition-shadow duration-200 group" style={{ borderColor: 'var(--brand-secondary)' }}>
              <div>
                <div className="font-semibold text-lg flex items-center gap-2">
                  <CreditCard style={{ color: 'var(--brand-primary)' }} size={20} />
                  <span style={{ color: 'var(--brand-text)' }}>{card.type} ending in {card.last4}</span>
                </div>
                <div className="text-sm mt-1" style={{ color: 'var(--brand-text)' }}>Expires {card.expiry}</div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button className="hover:underline font-medium" style={{ color: 'var(--brand-primary)' }} onClick={() => handleEdit(card)}>Edit</button>
                <button className="hover:underline font-medium" style={{ color: '#dc2626' }} onClick={() => handleDelete(card._id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative z-10 animate-fade-in">
            <button
              className="absolute top-2 right-2 text-gray-400 text-xl"
              style={{ color: 'var(--brand-primary)' }}
              onClick={() => { setShowModal(false); setEditId(null); }}
            >
              <X />
            </button>
            <h3 className="text-xl font-bold mb-4 text-center" style={{ color: 'var(--brand-primary)' }}>{editId ? 'Edit Card' : 'Add Card'}</h3>
            <div className="space-y-3">
              <input className="w-full border rounded px-3 py-2" placeholder="Card Type (e.g. Visa, MasterCard)" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} />
              <input className="w-full border rounded px-3 py-2" placeholder="Last 4 Digits" value={form.last4} maxLength={4} onChange={e => setForm(f => ({ ...f, last4: e.target.value.replace(/[^0-9]/g, '') }))} />
              <input className="w-full border rounded px-3 py-2" placeholder="Expiry (MM/YY)" value={form.expiry} maxLength={5} onChange={e => setForm(f => ({ ...f, expiry: e.target.value }))} />
              <button
                className="w-full py-2 rounded font-semibold mt-2 transition"
                style={{ background: 'var(--brand-primary)', color: '#fff' }}
                onClick={handleAddOrEdit}
                disabled={submitting}
              >
                {submitting ? (editId ? 'Saving...' : 'Saving...') : (editId ? 'Update Card' : 'Save Card')}
              </button>
            </div>
          </div>
        </div>
      )}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm relative z-10 animate-fade-in flex flex-col items-center">
            <h3 className="text-xl font-bold mb-4 text-center" style={{ color: 'var(--brand-primary)' }}>Remove Card</h3>
            <p className="mb-6 text-center" style={{ color: 'var(--brand-text)' }}>Are you sure you want to remove this card? This action cannot be undone.</p>
            <div className="flex gap-4 w-full justify-center">
              <button
                className="px-6 py-2 rounded-lg font-semibold shadow"
                style={{ background: 'var(--brand-secondary)', color: 'var(--brand-text)' }}
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 rounded-lg font-semibold shadow"
                style={{ background: '#dc2626', color: '#fff' }}
                onClick={confirmDelete}
                disabled={submitting}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </AccountLayout>
  );
};

export default PaymentsPage; 