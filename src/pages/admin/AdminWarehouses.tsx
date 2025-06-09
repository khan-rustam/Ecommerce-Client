import React, { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

interface Warehouse {
  _id?: string;
  name: string;
  address: string;
  coordinates: { lat: number; lng: number };
  rangeInKm: number;
  deliveryTime: string;
  deliveryCost: number;
}

const defaultWarehouse: Warehouse = {
  name: '',
  address: '',
  coordinates: { lat: 20.5937, lng: 78.9629 }, // Center of India
  rangeInKm: 100,
  deliveryTime: '',
  deliveryCost: 0,
};

const mapContainerStyle = { width: '100%', height: '300px' };
const defaultCenter = { lat: 20.5937, lng: 78.9629 };
const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY'; // <-- Set your API key here
const LIBRARIES = ['places'];

const AdminWarehouses: React.FC = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [form, setForm] = useState<Warehouse>(defaultWarehouse);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const autocompleteRef = useRef<any>(null);
  const placeAutocompleteRef = useRef<any>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  const fetchWarehouses = async () => {
    setLoading(true);
    const res = await axios.get('/api/warehouses');
    setWarehouses(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'rangeInKm') {
      setForm({ ...form, rangeInKm: parseFloat(value) });
    } else if (name === 'deliveryCost') {
      setForm({ ...form, deliveryCost: parseFloat(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setForm((prev) => ({ ...prev, coordinates: { lat, lng } }));
      setMapCenter({ lat, lng });
    }
  }, []);

  // PlaceAutocompleteElement event handler
  useEffect(() => {
    if (!isLoaded) return;
    const el = placeAutocompleteRef.current;
    if (!el) return;
    const handlePlaceChanged = () => {
      const place = el.getPlace();
      if (place && place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setForm((prev) => ({ ...prev, address: place.formatted_address || prev.address, coordinates: { lat, lng } }));
        setMapCenter({ lat, lng });
      }
    };
    el.addEventListener('gmpx-placeautocomplete-placechange', handlePlaceChanged);
    return () => {
      el.removeEventListener('gmpx-placeautocomplete-placechange', handlePlaceChanged);
    };
  }, [isLoaded]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`/api/warehouses/${editingId}`, form);
    } else {
      await axios.post('/api/warehouses', form);
    }
    setForm(defaultWarehouse);
    setEditingId(null);
    fetchWarehouses();
  };

  const handleEdit = (wh: Warehouse) => {
    setForm(wh);
    setEditingId(wh._id!);
    setMapCenter(wh.coordinates);
  };

  const handleDelete = async (id: string) => {
    await axios.delete(`/api/warehouses/${id}`);
    fetchWarehouses();
  };

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Warehouse Management</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 24, background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 2px 8px #0001' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required style={{ flex: 1, minWidth: 180, padding: 8 }} />
          <input name="address" value={form.address} onChange={handleChange} placeholder="Address" required style={{ flex: 2, minWidth: 220, padding: 8 }} />
          <input name="rangeInKm" type="number" value={form.rangeInKm} onChange={handleChange} placeholder="Range (km)" required step="any" style={{ width: 120, padding: 8 }} />
          <input name="deliveryTime" value={form.deliveryTime} onChange={handleChange} placeholder="Delivery Time (e.g. 2-4 days)" style={{ width: 160, padding: 8 }} />
          <input name="deliveryCost" type="number" value={form.deliveryCost} onChange={handleChange} placeholder="Delivery Cost (₹)" min="0" step="any" style={{ width: 120, padding: 8 }} />
        </div>
        <div style={{ margin: '16px 0' }}>
          {isLoaded && (
            <div>
              {/* PlaceAutocompleteElement web component */}
              <div style={{ width: '100%', marginBottom: 8 }}>
                <gmpx-place-autocomplete
                  ref={placeAutocompleteRef}
                  style={{ width: '100%' }}
                  placeholder="Search location on map"
                ></gmpx-place-autocomplete>
              </div>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={form.coordinates || mapCenter}
                zoom={form.coordinates ? 13 : 5}
                onClick={handleMapClick}
              >
                <Marker position={form.coordinates || mapCenter} />
              </GoogleMap>
            </div>
          )}
        </div>
        <button type="submit" style={{ background: '#2563eb', color: '#fff', padding: '10px 24px', border: 'none', borderRadius: 6, fontWeight: 600, fontSize: 16, marginTop: 8 }}>
          {editingId ? 'Update' : 'Add'} Warehouse
        </button>
        {editingId && <button type="button" onClick={() => { setForm(defaultWarehouse); setEditingId(null); }} style={{ marginLeft: 12, background: '#eee', color: '#333', padding: '10px 24px', border: 'none', borderRadius: 6 }}>Cancel</button>}
      </form>
      {loading ? <p>Loading...</p> : (
        <table border={0} cellPadding={8} style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #0001' }}>
          <thead>
            <tr style={{ background: '#f3f4f6' }}>
              <th>Name</th>
              <th>Address</th>
              <th>Range (km)</th>
              <th>Delivery Time</th>
              <th>Delivery Cost</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {warehouses.map(wh => (
              <tr key={wh._id}>
                <td>{wh.name}</td>
                <td>{wh.address}</td>
                <td>{wh.rangeInKm}</td>
                <td>{wh.deliveryTime}</td>
                <td>{wh.deliveryCost}</td>
                <td>
                  <button onClick={() => handleEdit(wh)} style={{ marginRight: 8, background: '#fbbf24', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 12px' }}>Edit</button>
                  <button onClick={() => handleDelete(wh._id!)} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 12px' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div style={{ marginTop: 24, color: '#888', fontSize: 13 }}>
        <b>Note:</b> You must set a valid Google Maps API key in <code>GOOGLE_MAPS_API_KEY</code> and enable Maps JavaScript API and Places API in your Google Cloud Console.<br />
        The new PlaceAutocompleteElement is used for address search as recommended by Google.
      </div>
    </div>
  );
};

export default AdminWarehouses; 