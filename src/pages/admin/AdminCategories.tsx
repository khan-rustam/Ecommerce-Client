import React, { useState } from 'react';
import { useBrandColors } from '../../contexts/BrandColorContext';
import { Plus, Image as ImageIcon, Edit, Trash2, UploadCloud } from 'lucide-react';

interface Category {
  id: number;
  title: string;
  slug: string;
  brands: number;
  products: number;
  hide: boolean;
  popular: boolean;
  image?: string;
  parent?: string;
}

const mockCategories: Category[] = [
  { id: 1, title: 'Crafts', slug: 'crafts', brands: 0, products: 0, hide: false, popular: false },
  { id: 2, title: 'Electronics', slug: 'electronics', brands: 0, products: 0, hide: false, popular: false },
  { id: 3, title: 'Home Decor', slug: 'home-decor', brands: 0, products: 0, hide: false, popular: false },
  { id: 4, title: 'LifeStyle', slug: 'lifestyle', brands: 0, products: 0, hide: false, popular: false },
];

const AdminCategories = () => {
  const { colors } = useBrandColors();
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', parent: '', image: '', file: null as File | null });
  const [editId, setEditId] = useState<number | null>(null);

  const handleAdd = () => {
    setShowModal(true);
    setForm({ title: '', parent: '', image: '', file: null });
    setEditId(null);
  };

  const handleEdit = (cat: Category) => {
    setShowModal(true);
    setForm({ title: cat.title, parent: cat.parent || '', image: cat.image || '', file: null });
    setEditId(cat.id);
  };

  const handleDelete = (id: number) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const handleSave = () => {
    if (!form.title.trim()) return;
    if (editId !== null) {
      setCategories((prev) => prev.map((c) => c.id === editId ? { ...c, ...form, id: editId, slug: form.title.toLowerCase().replace(/\s+/g, '-') } : c));
    } else {
      setCategories((prev) => [
        ...prev,
        { id: Date.now(), title: form.title, slug: form.title.toLowerCase().replace(/\s+/g, '-'), brands: 0, products: 0, hide: false, popular: false, image: form.image, parent: form.parent },
      ]);
    }
    setShowModal(false);
    setForm({ title: '', parent: '', image: '', file: null });
    setEditId(null);
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png') && file.size <= 20 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = (ev) => setForm(f => ({ ...f, image: ev.target?.result as string, file }));
      reader.readAsDataURL(file);
    } else {
      alert('Upload jpg, png images with a maximum size of 20 MB');
    }
  };

  const handleToggle = (id: number, key: 'hide' | 'popular') => {
    setCategories((prev) => prev.map((c) => c.id === id ? { ...c, [key]: !c[key] } : c));
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6" style={{ color: colors.primary }}>Categories</h1>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
          <input
            className="border rounded px-4 py-2 w-full md:w-64 text-gray-700"
            placeholder="Search..."
          />
          <button
            className="w-10 h-10 flex items-center justify-center rounded bg-[var(--brand-primary,#2563eb)] text-white hover:bg-[var(--brand-primary-hover,#1d4ed8)] transition"
            onClick={handleAdd}
            aria-label="Add Category"
          >
            <Plus size={22} />
          </button>
        </div>
        <table className="min-w-full text-sm border-separate border-spacing-y-1">
          <thead>
            <tr className="text-gray-500 text-xs uppercase">
              <th className="px-4 py-2 text-left font-semibold">Title</th>
              <th className="px-4 py-2 text-left font-semibold">Slug</th>
              <th className="px-4 py-2 text-left font-semibold">Brands</th>
              <th className="px-4 py-2 text-left font-semibold">Products</th>
              <th className="px-4 py-2 text-left font-semibold">Hide</th>
              <th className="px-4 py-2 text-left font-semibold">Popular</th>
              <th className="px-4 py-2 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-16 text-center text-gray-400">
                  <div className="flex flex-col items-center justify-center">
                    <ImageIcon size={56} className="mb-6 text-gray-400" />
                    <div className="text-xl font-semibold text-gray-500 mb-2">No Categories Added Yet</div>
                    <div className="text-gray-400 mb-6">Create your first category by clicking the + button in the top right corner.</div>
                    <button
                      className="flex items-center gap-2 px-6 py-2 rounded bg-[var(--brand-primary,#2563eb)] text-white font-semibold hover:bg-[var(--brand-primary-hover,#1d4ed8)] transition"
                      onClick={handleAdd}
                    >
                      <Plus size={18} /> Add Category
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id} className="bg-white border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-800 font-medium flex items-center gap-2">
                    {cat.image ? <img src={cat.image} alt={cat.title} className="w-8 h-8 rounded object-cover border" /> : <ImageIcon size={32} className="text-gray-300" />}
                    {cat.title}
                  </td>
                  <td className="px-4 py-2 text-gray-500">{cat.slug}</td>
                  <td className="px-4 py-2 text-gray-500">{cat.brands}</td>
                  <td className="px-4 py-2 text-gray-500">{cat.products}</td>
                  <td className="px-4 py-2">
                    <label className="inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={cat.hide} onChange={() => handleToggle(cat.id, 'hide')} />
                      <div className="w-10 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-[var(--brand-primary,#2563eb)] transition"></div>
                    </label>
                  </td>
                  <td className="px-4 py-2">
                    <label className="inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={cat.popular} onChange={() => handleToggle(cat.id, 'popular')} />
                      <div className="w-10 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-[var(--brand-primary,#2563eb)] transition"></div>
                    </label>
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      className="w-8 h-8 flex items-center justify-center rounded bg-[var(--brand-primary,#2563eb)] text-white hover:bg-[var(--brand-primary-hover,#1d4ed8)]"
                      onClick={() => handleEdit(cat)}
                      aria-label="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="w-8 h-8 flex items-center justify-center rounded bg-red-100 text-red-600 hover:bg-red-200"
                      onClick={() => handleDelete(cat.id)}
                      aria-label="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Modal for Add/Edit Category */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-lg relative animate-fade-in">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={() => setShowModal(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Create Category</h2>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">
                Category title <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full border rounded px-4 py-2"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">
                Select parent category <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <select
                className="w-full border rounded px-4 py-2"
                value={form.parent}
                onChange={e => setForm(f => ({ ...f, parent: e.target.value }))}
              >
                <option value="">Select parent category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.title}>{cat.title}</option>
                ))}
              </select>
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-medium">Upload Image</label>
              <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-[var(--brand-primary,#2563eb)] transition">
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  className="hidden"
                  id="category-image-upload"
                  onChange={handleImage}
                />
                <label htmlFor="category-image-upload" className="flex flex-col items-center cursor-pointer">
                  {form.image ? (
                    <img src={form.image} alt="Category" className="w-20 h-20 object-cover rounded mb-2 border" />
                  ) : (
                    <UploadCloud size={36} className="mb-2 text-gray-400" />
                  )}
                  <span className="text-gray-400 text-sm">Upload jpg, png images with a maximum size of 20 MB</span>
                </label>
              </div>
            </div>
            <button
              className="w-full py-2 rounded bg-[var(--brand-primary,#6b7280)] text-white font-semibold hover:bg-[var(--brand-primary-hover,#2563eb)] transition"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories; 