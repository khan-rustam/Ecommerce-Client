import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { Profile } from '../../api';
import { MapPin, Home, Building, Landmark } from 'lucide-react';
import { useBrandColors } from '../../contexts/BrandColorContext';
import AccountLayout from '../../components/layout/AccountLayout';

const emptyAddress = {
  name: '',
  addressLine1: '',
  city: '',
  country: '',
  pincode: '',
  landmark: '',
  phone: '',
};

const AddressesPage = () => {
  const token = useSelector((state: any) => state.user.token);
  const [addresses, setAddresses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyAddress);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { colors } = useBrandColors();

  const fetchAddresses = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${Profile}/address`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setAddresses(data);
      else toast.error(data.msg || 'Failed to load addresses');
    } catch {
      toast.error('Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
    // eslint-disable-next-line
  }, [token]);

  const handleEdit = (addr: any) => {
    setForm({
      name: addr.name,
      addressLine1: addr.addressLine1,
      city: addr.city,
      country: addr.country,
      pincode: addr.pincode,
      landmark: addr.landmark || '',
      phone: addr.phone,
    });
    setEditId(addr._id);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    if (!token) {
      toast.error('Please login to delete address');
      setDeleteId(null);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${Profile}/address/${deleteId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Address deleted');
        fetchAddresses();
      } else {
        toast.error(data.msg || 'Failed to delete address');
      }
    } catch {
      toast.error('Failed to delete address');
    } finally {
      setLoading(false);
      setDeleteId(null);
    }
  };

  const handleAddOrEdit = async () => {
    if (!token) {
      toast.error('Please login to save address');
      return;
    }
    // Validate required fields
    const { name, addressLine1, city, country, pincode, phone } = form;
    if (!name || !addressLine1 || !city || !country || !pincode || !phone) {
      toast.error('Please fill all required fields');
      return;
    }
    setSubmitting(true);
    try {
      let res, data;
      if (editId) {
        res = await fetch(`${Profile}/address/${editId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        });
        data = await res.json();
      } else {
        res = await fetch(`${Profile}/address`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        });
        data = await res.json();
      }
      if (res.ok) {
        toast.success(editId ? 'Address updated' : 'Address added');
        setShowModal(false);
        setForm(emptyAddress);
        setEditId(null);
        fetchAddresses();
      } else {
        toast.error(data.msg || (editId ? 'Failed to update address' : 'Failed to add address'));
      }
    } catch {
      toast.error(editId ? 'Failed to update address' : 'Failed to add address');
    } finally {
      setSubmitting(false);
    }
  };

  const getAddressIcon = (name: string) => {
    if (/home/i.test(name)) return <Home className="inline mr-1" size={18} style={{ color: colors.primary }} />;
    if (/office|work/i.test(name)) return <Building className="inline mr-1" size={18} style={{ color: colors.secondary }} />;
    if (/landmark/i.test(name)) return <Landmark className="inline mr-1" size={18} style={{ color: colors.accent }} />;
    return <MapPin className="inline mr-1" size={18} style={{ color: colors.text }} />;
  };

  return (
    <AccountLayout>
      <h2 className="text-2xl font-bold mb-6" style={{ color: colors.primary }}>Manage Addresses</h2>
      <button
        className="mb-4 px-4 py-2 rounded shadow transition font-semibold"
        style={{ background: colors.primary, color: '#fff' }}
        onClick={() => {
          if (!token) {
            toast.error('Please login to add address');
            return;
          }
          setForm(emptyAddress);
          setEditId(null);
          setShowModal(true);
        }}
      >
        + Add New Address
      </button>
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <span style={{ color: colors.primary, fontWeight: 600 }}>Loading...</span>
        </div>
      ) : addresses.length === 0 ? (
        <div className="text-gray-500">No addresses found.</div>
      ) : (
        <div className="space-y-4">
          {addresses.map((addr: any) => (
            <div key={addr._id} className="border rounded-xl p-5 flex justify-between items-center bg-white shadow-md hover:shadow-lg transition-shadow duration-200 group" style={{ borderColor: colors.secondary }}>
              <div>
                <div className="font-semibold text-lg flex items-center gap-1">
                  {getAddressIcon(addr.name)}
                  <span style={{ color: colors.text }}>{addr.name}</span>
                </div>
                <div className="text-sm mt-1" style={{ color: colors.text }}>{addr.addressLine1}</div>
                <div className="text-sm" style={{ color: colors.text }}>{addr.city}, {addr.country} - {addr.pincode}</div>
                {addr.landmark && <div className="text-xs" style={{ color: colors.accent }}>Landmark: {addr.landmark}</div>}
                <div className="text-sm mt-1" style={{ color: colors.text }}>{addr.phone}</div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button className="hover:underline font-medium" style={{ color: colors.primary }} onClick={() => handleEdit(addr)}>Edit</button>
                <button className="hover:underline font-medium" style={{ color: '#dc2626' }} onClick={() => handleDelete(addr._id)}>Delete</button>
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
              style={{ color: colors.primary }}
              onClick={() => { setShowModal(false); setEditId(null); }}
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4 text-center" style={{ color: colors.primary }}>{editId ? 'Edit Address' : 'Add Address'}</h3>
            <div className="space-y-3">
              <input className="w-full border rounded px-3 py-2" placeholder="Name (e.g. Home, Office)" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              <input className="w-full border rounded px-3 py-2" placeholder="Address Line 1" value={form.addressLine1} onChange={e => setForm(f => ({ ...f, addressLine1: e.target.value }))} />
              <input className="w-full border rounded px-3 py-2" placeholder="City" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
              <input className="w-full border rounded px-3 py-2" placeholder="Country" value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} />
              <input className="w-full border rounded px-3 py-2" placeholder="Pincode" value={form.pincode} onChange={e => setForm(f => ({ ...f, pincode: e.target.value }))} />
              <input className="w-full border rounded px-3 py-2" placeholder="Landmark (optional)" value={form.landmark} onChange={e => setForm(f => ({ ...f, landmark: e.target.value }))} />
              <input className="w-full border rounded px-3 py-2" placeholder="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              <button
                className="w-full py-2 rounded font-semibold mt-2 transition"
                style={{ background: colors.primary, color: '#fff' }}
                onClick={handleAddOrEdit}
                disabled={submitting}
              >
                {submitting ? (editId ? 'Saving...' : 'Saving...') : (editId ? 'Update Address' : 'Save Address')}
              </button>
            </div>
          </div>
        </div>
      )}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm relative z-10 animate-fade-in flex flex-col items-center">
            <h3 className="text-xl font-bold mb-4 text-center" style={{ color: colors.primary }}>Delete Address</h3>
            <p className="mb-6 text-center" style={{ color: colors.text }}>Are you sure you want to delete this address? This action cannot be undone.</p>
            <div className="flex gap-4 w-full justify-center">
              <button
                className="px-6 py-2 rounded-lg font-semibold shadow"
                style={{ background: colors.secondary, color: colors.text }}
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 rounded-lg font-semibold shadow"
                style={{ background: '#dc2626', color: '#fff' }}
                onClick={confirmDelete}
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AccountLayout>
  );
};

export default AddressesPage; 