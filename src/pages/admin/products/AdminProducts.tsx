import React, { useState } from "react";
import { Plus, Edit, Trash2, Search, } from "lucide-react";
import { useBrandColors } from "../../../contexts/BrandColorContext";
import { useNavigate } from "react-router-dom";
import AddProductModal from "./AddProductModal";

const initialProducts = [
  {
    id: 2,
    image:
      "https://images.pexels.com/photos/276528/pexels-photo-276528.jpeg?auto=compress&w=64&h=64",
    name: "Modern Lamp",
    price: 59.99,
    salePrice: undefined,
    stock: 12,
    status: "Inactive",
    show: false,
    featured: true,
    trending: true,
    readyToShip: false,
  },
  {
    id: 3,
    image:
      "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&w=64&h=64",
    name: "Minimalist Desk",
    price: 249.99,
    salePrice: 200.00,
    stock: 7,
    status: "Active",
    show: true,
    featured: false,
    trending: true,
    readyToShip: true,
  },
];

const statusStyles = (status: string, colors: any) =>
  status === "Active"
    ? `bg-[${colors.accent}] text-[${colors.primary}] border border-[${colors.primary}]`
    : `bg-gray-100 text-gray-400 border border-gray-200`;

const AdminProducts = () => {
  const { colors } = useBrandColors();
  const navigate = useNavigate();
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({
    image: "",
    name: "",
    price: "",
    stock: "",
    status: "Active",
  });

  const openModal = (product: any = null) => {
    setEditing(product);
    setForm(
      product
        ? {
            ...product,
            price: product.price.toString(),
            stock: product.stock.toString(),
          }
        : { image: "", name: "", price: "", stock: "", status: "Active" }
    );
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
    setForm({ image: "", name: "", price: "", stock: "", status: "Active" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm({ ...form, image: URL.createObjectURL(e.target.files[0]) });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      setProducts(
        products.map((p) =>
          p.id === editing.id
            ? {
                ...editing,
                ...form,
                price: parseFloat(form.price),
                stock: parseInt(form.stock),
              }
            : p
        )
      );
    } else {
      setProducts([
        ...products,
        {
          ...form,
          id: Date.now(),
          price: parseFloat(form.price),
          stock: parseInt(form.stock),
        },
      ]);
    }
    closeModal();
  };

  const handleDelete = (id: number) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="min-h-screen w-full relative py-10 px-2 md:px-8"
      style={{ background: colors.background }}
    >
      {/* Breadcrumbs */}
      <nav
        className="flex items-center gap-2 text-sm mb-2"
        aria-label="Breadcrumbs"
      >
        <button
          onClick={() => navigate("/admin")}
          className="hover:underline font-medium"
          style={{ color: colors.primary, background: "transparent" }}
        >
          Dashboard
        </button>
        <span className="mx-1 text-gray-400">/</span>
        <span className="font-semibold" style={{ color: colors.text }}>
          Products
        </span>
      </nav>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <h1
          className="text-3xl font-bold tracking-tight"
          style={{ color: colors.primary }}
        >
          Products
        </h1>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full max-w-xs">
            <input
              className="w-full pl-10 pr-4 py-2 rounded-lg shadow-sm border focus:ring-2 focus:ring-[var(--brand-accent)] focus:outline-none transition"
              style={{
                background: colors.accent,
                color: colors.text,
                borderColor: colors.primary,
              }}
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2"
              size={18}
              style={{ color: colors.primary }}
            />
          </div>
          <button
            className="ml-4 flex items-center justify-center rounded bg-[var(--brand-primary,#6366f1)] text-white w-10 h-10 hover:bg-[var(--brand-secondary,#4f46e5)] transition"
            style={{ background: colors.primary }}
            onClick={() => setModalOpen(true)}
            aria-label="Add Product"
          >
            <Plus size={24} />
          </button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-sm shadow-xl bg-white animate-fade-in">
        <table className="min-w-full text-sm">
          <thead>
            <tr style={{ background: colors.accent, color: colors.text }}>
              <th className="py-4 px-4 text-left font-semibold">ID</th>
              <th className="py-4 px-4 text-left font-semibold">Details</th>
              <th className="py-4 px-4 text-left font-semibold">Price</th>
              <th className="py-4 px-4 text-left font-semibold">Stock</th>
              <th className="py-4 px-4 text-left font-semibold">Show / Hide</th>
              <th className="py-4 px-4 text-left font-semibold">Featured</th>
              <th className="py-4 px-4 text-left font-semibold">Trending</th>
              <th className="py-4 px-4 text-left font-semibold">On Sale</th>
              <th className="py-4 px-4 text-left font-semibold">Ready to Ship</th>
              <th className="py-4 px-4 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-24 text-center">
                  <div className="flex flex-col items-center justify-center gap-4">
                    <div className="mb-2">
                      <svg width="64" height="64" fill="none" stroke="#b0b7c3" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 8h18"/></svg>
                    </div>
                    <div className="text-2xl font-semibold text-gray-700 mb-1">No Products Added Yet</div>
                    <div className="text-gray-400 mb-6">Create your first product by clicking the + button in the top right corner.</div>
                    <button
                      className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold shadow bg-gray-500 text-white text-base hover:bg-gray-600 transition"
                      onClick={() => setModalOpen(true)}
                    >
                      <Plus size={20} /> Add Product
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((product, idx) => (
                <tr
                  key={product.id}
                  className="even:bg-gray-50 transition-all duration-200 hover:scale-[1.01] hover:shadow-lg group"
                  style={{ borderBottom: `1px solid ${colors.accent}` }}
                >
                  <td className="py-3 px-4">
                    <a href={`#${product.id}`} className="text-blue-600 font-semibold hover:underline">#{product.id}</a>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-white border flex items-center justify-center overflow-hidden">
                        <img
                          src={product.image || ''}
                          alt={product.name}
                          className="w-10 h-10 object-contain"
                          onError={e => (e.currentTarget.src = '/broken-image.png')}
                        />
                      </div>
                      <span className="font-medium text-gray-700">{product.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-gray-800">₹{product.salePrice !== undefined ? product.salePrice : product.price}</span>
                    {product.salePrice !== undefined && (
                      <span className="ml-2 text-red-500 line-through font-bold">₹{product.price}</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {product.stock > 0 ? (
                      <span className="text-blue-600 font-semibold cursor-pointer">In stock</span>
                    ) : (
                      <span className="text-red-500">Out of stock</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button className={`w-10 h-6 rounded-full flex items-center transition-colors duration-200 ${product.show ? 'bg-gray-600' : 'bg-gray-300'}`}
                      onClick={() => {}}>
                      <span className={`inline-block w-5 h-5 rounded-full bg-white shadow transform transition-transform duration-200 ${product.show ? 'translate-x-4' : ''}`}></span>
                    </button>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button className={`w-10 h-6 rounded-full flex items-center transition-colors duration-200 ${product.featured ? 'bg-gray-600' : 'bg-gray-300'}`}
                      onClick={() => {}}>
                      <span className={`inline-block w-5 h-5 rounded-full bg-white shadow transform transition-transform duration-200 ${product.featured ? 'translate-x-4' : ''}`}></span>
                    </button>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button className={`w-10 h-6 rounded-full flex items-center transition-colors duration-200 ${product.trending ? 'bg-gray-600' : 'bg-gray-300'}`}
                      onClick={() => {}}>
                      <span className={`inline-block w-5 h-5 rounded-full bg-white shadow transform transition-transform duration-200 ${product.trending ? 'translate-x-4' : ''}`}></span>
                    </button>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button className={`w-10 h-6 rounded-full flex items-center transition-colors duration-200 ${product.salePrice !== undefined ? 'bg-gray-600' : 'bg-gray-300'}`}
                      onClick={() => {}}>
                      <span className={`inline-block w-5 h-5 rounded-full bg-white shadow transform transition-transform duration-200 ${product.salePrice !== undefined ? 'translate-x-4' : ''}`}></span>
                    </button>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button className={`w-10 h-6 rounded-full flex items-center transition-colors duration-200 ${product.readyToShip ? 'bg-gray-600' : 'bg-gray-300'}`}
                      onClick={() => {}}>
                      <span className={`inline-block w-5 h-5 rounded-full bg-white shadow transform transition-transform duration-200 ${product.readyToShip ? 'translate-x-4' : ''}`}></span>
                    </button>
                  </td>
                  <td className="py-3 px-4 flex gap-2 justify-end">
                    <button className="p-2 rounded bg-gray-500 hover:bg-gray-600 text-white" title="Edit"><Edit size={18} /></button>
                    <button className="p-2 rounded bg-red-500 hover:bg-red-600 text-white" title="Delete"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <AddProductModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default AdminProducts;
