import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import {
  Plus,
  Image as ImageIcon,
  X,
  UploadCloud,
  Trash2,
  Loader2,
  Search,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { get, post, del, patch } from "../../utils/authFetch"; // Import fetch helpers

interface Brand {
  _id: string;
  name: string;
  slug: string;
  category?: string;
  logo: string;
  isHidden: boolean;
  productsCount: number;
  createdAt: string;
}

const AdminBrands: React.FC = () => {
  const user = useSelector((state: any) => state.user.user);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [brandName, setBrandName] = useState("");
  const [brandCategory, setBrandCategory] = useState("");
  const [uploadImage, setUploadImage] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      // Use get from authFetch
      const responseData = await get(`/brands`);
      setBrands(Array.isArray(responseData) ? responseData : []);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch brands");
      console.error("Error fetching brands:", err);
      setBrands([]);
    } finally {
      setLoading(false);
    }
  };

  if (!user || !user.isAdmin) return <Navigate to="/" />;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (
      file &&
      (file.type === "image/jpeg" || file.type === "image/png") &&
      file.size <= 1 * 1024 * 1024
    ) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setUploadImage(ev.target?.result as string);
        setUploadFile(file);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Upload jpg, png images with a maximum size of 1 MB");
    }
  };

  const handleCreateBrand = async () => {
    if (!brandName.trim()) {
      toast.error("Please enter a brand name");
      return;
    }

    if (!uploadFile) {
      toast.error("Please upload a brand logo");
      return;
    }

    setUploading(true);

    try {
      // 1. Upload the logo image first
      const formData = new FormData();
      formData.append("file", uploadFile);

      // Use post from authFetch for FormData
      const uploadResponseData = await post(
        `/brands/upload`,
        formData
        // authFetch handles Content-Type for FormData
      );

      // 2. Now create the brand with the uploaded logo URL
      // Use post from authFetch
      const responseData = await post(`/brands`, {
        name: brandName,
        category: brandCategory || undefined,
        logo: uploadResponseData.logo,
        logoPublicId: uploadResponseData.logoPublicId,
      });

      // Update the brands list
      setBrands((prevBrands) =>
        Array.isArray(prevBrands)
          ? [responseData, ...prevBrands]
          : [responseData]
      );

      // Reset form and close modal
      setShowCreateModal(false);
      setBrandName("");
      setBrandCategory("");
      setUploadImage(null);
      setUploadFile(null);

      toast.success("Brand created successfully!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create brand");
      console.error("Error creating brand:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleToggleVisibility = async (id: string) => {
    try {
      // Use patch from authFetch
      const responseData = await patch(`/brands/${id}/toggle`, {});

      // Update brands list with the updated brand
      setBrands((prevBrands) => {
        if (!Array.isArray(prevBrands)) return [responseData];
        return prevBrands.map((brand) =>
          brand._id === id ? responseData : brand
        );
      });

      toast.success("Brand visibility updated");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to toggle brand visibility"
      );
      console.error("Error toggling brand visibility:", err);
    }
  };

  const handleDeleteBrand = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this brand?")) return;

    try {
      // Use del from authFetch
      await del(`/brands/${id}`);

      // Remove the deleted brand from the list
      setBrands((prevBrands) => {
        if (!Array.isArray(prevBrands)) return [];
        return prevBrands.filter((brand) => brand._id !== id);
      });

      toast.success("Brand deleted successfully");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete brand");
      console.error("Error deleting brand:", err);
    }
  };

  // Filter brands based on search term
  const filteredBrands = brands.filter(
    (brand) =>
      brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (brand.category &&
        brand.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">Brands</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="relative w-full sm:w-64">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search brands..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            className="flex items-center gap-2 px-4 py-2 rounded bg-[var(--brand-primary,#2563eb)] text-white hover:bg-[var(--brand-primary-hover,#1d4ed8)] transition"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus size={18} />
            Add Brand
          </button>
        </div>

        {loading ? (
          <div className="py-16 text-center text-gray-400">
            <div className="flex flex-col items-center justify-center">
              <Loader2 size={36} className="mb-6 text-gray-400 animate-spin" />
              <div className="text-xl font-semibold text-gray-500 mb-2">
                Loading brands...
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="py-16 text-center text-red-500">
            <div className="flex flex-col items-center justify-center">
              <AlertCircle size={36} className="mb-6 text-red-500" />
              <div className="text-xl font-semibold mb-2">
                Error loading brands
              </div>
              <div className="mb-6">{error}</div>
              <button
                className="flex items-center gap-2 px-6 py-2 rounded bg-[var(--brand-primary,#2563eb)] text-white font-semibold hover:bg-[var(--brand-primary-hover,#1d4ed8)] transition"
                onClick={fetchBrands}
              >
                Try Again
              </button>
            </div>
          </div>
        ) : filteredBrands.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <div className="flex flex-col items-center justify-center">
              <ImageIcon size={56} className="mb-6 text-gray-400" />
              <div className="text-xl font-semibold text-gray-500 mb-2">
                No brands found
              </div>
              <div className="text-gray-400 mb-6">
                {searchTerm
                  ? "Try adjusting your search to find what you're looking for."
                  : "Add your first brand by clicking the 'Add Brand' button."}
              </div>
              {searchTerm && (
                <button
                  className="flex items-center gap-2 px-6 py-2 rounded border border-gray-300 text-gray-600 font-semibold hover:bg-gray-50 transition"
                  onClick={() => setSearchTerm("")}
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border-separate border-spacing-y-1">
              <thead>
                <tr className="text-gray-500 text-xs uppercase">
                  <th className="px-4 py-2 text-left font-semibold">Logo</th>
                  <th className="px-4 py-2 text-left font-semibold">Title</th>
                  <th className="px-4 py-2 text-left font-semibold">Slug</th>
                  <th className="px-4 py-2 text-left font-semibold">
                    Products
                  </th>
                  <th className="px-4 py-2 text-left font-semibold">Hide</th>
                  <th className="px-4 py-2 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredBrands.map((brand) => (
                  <tr
                    key={brand._id}
                    className="bg-white border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      <img
                        src={
                          brand.logo ||
                          "https://placehold.co/100x100?text=No+Logo"
                        }
                        alt={`${brand.name} logo`}
                        className="w-12 h-12 object-contain rounded border"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://placehold.co/100x100?text=Error";
                        }}
                      />
                    </td>
                    <td className="px-4 py-3 text-gray-800 font-medium">
                      {brand.name}
                      {brand.category && (
                        <div className="text-xs text-gray-500">
                          {brand.category}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{brand.slug}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {brand.productsCount || "--"}
                    </td>
                    <td className="px-4 py-3">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={brand.isHidden}
                          onChange={() => handleToggleVisibility(brand._id)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteBrand(brand._id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Brand Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md relative animate-fade-in">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={() => {
                setShowCreateModal(false);
                setBrandName("");
                setBrandCategory("");
                setUploadImage(null);
                setUploadFile(null);
              }}
              aria-label="Close"
              disabled={uploading}
            >
              <X />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Create Brand
            </h2>

            <div className="mb-4">
              <label
                htmlFor="brand-name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Brand Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="brand-name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Enter brand name"
                disabled={uploading}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="brand-category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Brand category (Optional)
              </label>
              <input
                type="text"
                id="brand-category"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={brandCategory}
                onChange={(e) => setBrandCategory(e.target.value)}
                placeholder="E.g., Electronics, Fashion, etc."
                disabled={uploading}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Logo <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-[var(--brand-primary,#2563eb)] transition">
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  className="hidden"
                  id="brand-logo-upload"
                  onChange={handleLogoUpload}
                  disabled={uploading}
                />
                <label
                  htmlFor="brand-logo-upload"
                  className="flex flex-col items-center cursor-pointer"
                >
                  {uploadImage ? (
                    <img
                      src={uploadImage}
                      alt="Logo Preview"
                      className="w-32 h-32 object-contain rounded mb-2 border"
                    />
                  ) : (
                    <>
                      <UploadCloud size={36} className="mb-2 text-gray-400" />
                      <span className="text-gray-400 text-sm text-center">
                        Upload jpg, png images with a maximum size of 1 MB
                      </span>
                    </>
                  )}
                </label>
              </div>
            </div>

            <button
              className="w-full py-2 rounded bg-[var(--brand-primary,#2563eb)] text-white font-semibold hover:bg-[var(--brand-primary-hover,#1d4ed8)] transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
              onClick={handleCreateBrand}
              disabled={!brandName.trim() || !uploadFile || uploading}
            >
              {uploading ? (
                <>
                  <Loader2 size={20} className="mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBrands;
