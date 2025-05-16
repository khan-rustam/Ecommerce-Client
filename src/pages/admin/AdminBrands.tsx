import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Plus, Briefcase, X, UploadCloud } from "lucide-react";

interface Brand {
  id: number;
  name: string;
  slug: string;
  category?: string;
  image?: string;
  products: number;
  hide: boolean;
}

const mockCategories = ["Electronics", "Fashion", "Home", "Beauty"];

const AdminBrands: React.FC = () => {
  const user = useSelector((state: any) => state.user.user);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", category: "", image: "", file: null as File | null });

  if (!user || !user.isAdmin) return <Navigate to="/" />;

  const handleAdd = () => {
    setShowModal(true);
    setForm({ name: "", category: "", image: "", file: null });
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    setBrands((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: form.name,
        slug: form.name.toLowerCase().replace(/\s+/g, "-"),
        category: form.category,
        image: form.image,
        products: 0,
        hide: false,
      },
    ]);
    setShowModal(false);
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png") && file.size <= 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = (ev) => setForm(f => ({ ...f, image: ev.target?.result as string, file }));
      reader.readAsDataURL(file);
    } else {
      alert("Upload jpg, png images with a maximum size of 1 MB");
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">Brands</h1>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
          <input
            className="border rounded px-4 py-2 w-full md:w-64 text-gray-700"
            placeholder="Search..."
          />
          <button
            className="w-10 h-10 flex items-center justify-center rounded bg-[var(--brand-primary,#2563eb)] text-white hover:bg-[var(--brand-primary-hover,#1d4ed8)] transition"
            onClick={handleAdd}
            aria-label="Add Brand"
          >
            <Plus size={22} />
          </button>
        </div>
        <table className="min-w-full text-sm border-separate border-spacing-y-1">
          <thead>
            <tr className="text-gray-500 text-xs uppercase">
              <th className="px-4 py-2 text-left font-semibold">Title</th>
              <th className="px-4 py-2 text-left font-semibold">Slug</th>
              <th className="px-4 py-2 text-left font-semibold">Products</th>
              <th className="px-4 py-2 text-left font-semibold">Hide</th>
            </tr>
          </thead>
          <tbody>
            {brands.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-16 text-center text-gray-400">
                  <div className="flex flex-col items-center justify-center">
                    <Briefcase size={56} className="mb-6 text-gray-400" />
                    <div className="text-xl font-semibold text-gray-500 mb-2">No Brands Added Yet</div>
                    <div className="text-gray-400 mb-6">Create your first brand by clicking the + button in the top right corner.</div>
                    <button
                      className="flex items-center gap-2 px-6 py-2 rounded bg-[var(--brand-primary,#2563eb)] text-white font-semibold hover:bg-[var(--brand-primary-hover,#1d4ed8)] transition"
                      onClick={handleAdd}
                    >
                      <Plus size={18} /> Add Brand
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              brands.map((brand) => (
                <tr key={brand.id} className="bg-white border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-800 font-medium flex items-center gap-2">
                    {brand.image && <img src={brand.image} alt={brand.name} className="w-8 h-8 rounded object-cover border" />}
                    {brand.name}
                  </td>
                  <td className="px-4 py-2 text-gray-500">{brand.slug}</td>
                  <td className="px-4 py-2 text-gray-500">{brand.products}</td>
                  <td className="px-4 py-2 text-gray-500">{brand.hide ? "Yes" : "No"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Modal for Add Brand */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md relative animate-fade-in">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={() => setShowModal(false)}
              aria-label="Close"
            >
              <X />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Create Brand</h2>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">
                Brand Name <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full border rounded px-4 py-2"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">
                Brand category <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <select
                className="w-full border rounded px-4 py-2"
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              >
                <option value="">Select category</option>
                {mockCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
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
                  id="brand-image-upload"
                  onChange={handleImage}
                />
                <label htmlFor="brand-image-upload" className="flex flex-col items-center cursor-pointer">
                  {form.image ? (
                    <img src={form.image} alt="Brand" className="w-20 h-20 object-cover rounded mb-2 border" />
                  ) : (
                    <UploadCloud size={36} className="mb-2 text-gray-400" />
                  )}
                  <span className="text-gray-400 text-sm">Upload jpg, png images with a maximum size of 1 MB</span>
                </label>
              </div>
            </div>
            <button
              className="w-full py-2 rounded bg-[var(--brand-primary,#6b7280)] text-white font-semibold hover:bg-[var(--brand-primary-hover,#2563eb)] transition"
              onClick={handleSave}
            >
              Create
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBrands; 