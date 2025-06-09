import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import {
  Plus,
  Image as ImageIcon,
  Edit,
  Trash2,
  UploadCloud,
  X,
  Loader2,
  Search,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { useBrandColors } from "../../contexts/BrandColorContext";
import { get, post, put, del, patch } from "../../utils/authFetch"; // Import fetch helpers

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parent?: {
    _id: string;
    name: string;
  } | null;
  image: string;
  imagePublicId: string;
  isHidden: boolean;
  isPopular: boolean;
  brandsCount: number;
  productsCount: number;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

const AdminCategories: React.FC = () => {
  const { colors } = useBrandColors();
  const user = useSelector((state: any) => state.user.user);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [uploadImage, setUploadImage] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState<string | null>(null);

  // Form state
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [parentCategory, setParentCategory] = useState<string>("");

  useEffect(() => {
    fetchCategories();
  }, []);

  console.log(categories);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      // Always fetch all categories for admin
      // Use get from authFetch
      const responseData = await get(`/categories?admin=true`);
      const fetchedCategories = Array.isArray(responseData)
        ? responseData
        : [];
      console.log("Fetched categories data:", fetchedCategories);
      setCategories(fetchedCategories);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch categories");
      console.error("Error fetching categories:", err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCategoryName("");
    setCategoryDescription("");
    setParentCategory("");
    setUploadImage(null);
    setUploadFile(null);
    setEditMode(false);
    setEditCategoryId(null);
  };

  const handleOpenCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const handleOpenEditModal = (category: Category) => {
    setCategoryName(category.name);
    setCategoryDescription(category.description || "");
    setParentCategory(category.parent?._id || "");
    setUploadImage(category.image || null);
    setEditMode(true);
    setEditCategoryId(category._id);
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    resetForm();
  };

  if (!user || !user.isAdmin) return <Navigate to="/" />;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (
      file &&
      (file.type === "image/jpeg" || file.type === "image/png") &&
      file.size <= 20 * 1024 * 1024
    ) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setUploadImage(ev.target?.result as string);
        setUploadFile(file);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Upload jpg, png images with a maximum size of 20 MB");
    }
  };

  const handleSaveCategory = async () => {
    if (!categoryName.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    setUploading(true);

    try {
      let imageUrl = "";
      let imagePublicId = "";

      // Upload image if a new one is selected
      if (uploadFile) {
        const formData = new FormData();
        formData.append("file", uploadFile);

        console.log(
          "Uploading image file:",
          uploadFile.name,
          uploadFile.type,
          uploadFile.size
        );

        // Use post from authFetch for FormData
        const uploadResponseData = await post(
          `/categories/upload`,
          formData
          // authFetch handles Content-Type for FormData
        );

        console.log("Image upload response:", uploadResponseData);

        imageUrl = uploadResponseData.image;
        imagePublicId = uploadResponseData.imagePublicId;
      }

      if (editMode && editCategoryId) {
        // Update existing category
        const updateData: any = {
          name: categoryName,
          description: categoryDescription || undefined,
          parent: parentCategory || null,
        };

        // Only include image data if a new image was uploaded
        if (imageUrl) {
          updateData.image = imageUrl;
          updateData.imagePublicId = imagePublicId;
        }

        console.log("Updating category with data:", updateData);

        // Use put from authFetch
        const responseData = await put(
          `/categories/${editCategoryId}`,
          updateData
        );

        console.log("Category update response:", responseData);

        // Update categories list with the updated category
        setCategories((prevCategories) => {
          if (!Array.isArray(prevCategories)) return [responseData];
          return prevCategories.map((cat) =>
            cat._id === editCategoryId ? responseData : cat
          );
        });

        toast.success("Category updated successfully!");
      } else {
        // Create new category
        const categoryData = {
          name: categoryName,
          description: categoryDescription || undefined,
          parent: parentCategory || undefined,
          image: imageUrl || undefined,
          imagePublicId: imagePublicId || undefined,
        };

        console.log("Creating category with data:", categoryData);

        // Use post from authFetch
        const responseData = await post(`/categories`, categoryData);

        console.log("Category creation response:", responseData);

        // Add the new category to the list
        setCategories((prevCategories) =>
          Array.isArray(prevCategories)
            ? [responseData, ...prevCategories]
            : [responseData]
        );

        toast.success("Category created successfully!");
      }

      // Reset form and close modal
      handleCloseModal();
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          (editMode ? "Failed to update category" : "Failed to create category")
      );
      console.error(
        editMode ? "Error updating category:" : "Error creating category:",
        err
      );
    } finally {
      setUploading(false);
    }
  };

  const handleToggleVisibility = async (id: string) => {
    try {
      const category = categories.find(cat => cat._id === id);
      if (!category) return;
      
      // Check if we're hiding a category
      const isHiding = !category.isHidden;
      
      // First toggle the current category
      // Use patch from authFetch
      const responseData = await patch(
        `/categories/${id}/toggle-visibility`,
        { cascade: isHiding } // Pass cascade flag to backend when hiding
      );

      // Update categories list with the updated category
      setCategories((prevCategories) => {
        if (!Array.isArray(prevCategories)) return [responseData];
        
        // If hiding with cascade, update all subcategories in our local state too
        if (isHiding) {
          const updatedCategories = [...prevCategories];
          // Find the index of the current category
          const categoryIndex = updatedCategories.findIndex(cat => cat._id === id);
          
          if (categoryIndex !== -1) {
            // Replace the category with the updated one
            updatedCategories[categoryIndex] = responseData;
            
            // Update all subcategories to be hidden
            for (let i = 0; i < updatedCategories.length; i++) {
              if (updatedCategories[i].parent && updatedCategories[i].parent?._id === id) {
                updatedCategories[i] = { ...updatedCategories[i], isHidden: true };
              }
            }
            
            return updatedCategories;
          }
        }
        
        // Default case - just update the single category
        return prevCategories.map((cat) =>
          cat._id === id ? responseData : cat
        );
      });
      
      // Show appropriate toast message
      if (isHiding) {
        toast.success(`Category and its subcategories are now hidden`);
      } else {
        toast.success(`Category is now visible`);
      }
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to toggle category visibility"
      );
      console.error("Error toggling category visibility:", err);
    }
  };

  const handleTogglePopularity = async (id: string) => {
    try {
      // Use patch from authFetch
      const responseData = await patch(
        `/categories/${id}/toggle-popularity`,
        {}
      );

      // Update categories list with the updated category
      setCategories((prevCategories) => {
        if (!Array.isArray(prevCategories)) return [responseData];
        return prevCategories.map((cat) =>
          cat._id === id ? responseData : cat
        );
      });

      toast.success("Category popularity updated");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to toggle category popularity"
      );
      console.error("Error toggling category popularity:", err);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;

    try {
      // Use del from authFetch
      await del(`/categories/${id}`);

      // Remove the deleted category from the list
      setCategories((prevCategories) => {
        if (!Array.isArray(prevCategories)) return [];
        return prevCategories.filter((cat) => cat._id !== id);
      });

      toast.success("Category deleted successfully");
    } catch (err: any) {
      if (err.response?.status === 400 && err.response?.data?.childCategories) {
        // Handle case where category has children
        const childNames = err.response.data.childCategories
          .map((c: any) => c.name)
          .join(", ");
        toast.error(
          `Cannot delete: This category is a parent to: ${childNames}`
        );
      } else {
        toast.error(err.response?.data?.message || "Failed to delete category");
      }
      console.error("Error deleting category:", err);
    }
  };

  // Filter categories based on search term
  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description &&
        category.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (category.parent?.name &&
        category.parent.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <h1
        className="text-2xl font-semibold mb-6"
        style={{ color: colors.primary }}
      >
        Categories
      </h1>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="relative w-full sm:w-64">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search categories..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            className="flex items-center gap-2 px-4 py-2 rounded bg-[var(--brand-primary)] text-white hover:bg-opacity-80 transition"
            onClick={handleOpenCreateModal}
            style={{ backgroundColor: colors.primary }}
          >
            <Plus size={18} />
            Add Category
          </button>
        </div>

        {loading ? (
          <div className="py-16 text-center text-gray-400">
            <div className="flex flex-col items-center justify-center">
              <Loader2 size={36} className="mb-6 text-gray-400 animate-spin" />
              <div className="text-xl font-semibold text-gray-500 mb-2">
                Loading categories...
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="py-16 text-center text-red-500">
            <div className="flex flex-col items-center justify-center">
              <AlertCircle size={36} className="mb-6 text-red-500" />
              <div className="text-xl font-semibold mb-2">
                Error loading categories
              </div>
              <div className="mb-6">{error}</div>
              <button
                className="flex items-center gap-2 px-6 py-2 rounded bg-[var(--brand-primary,#2563eb)] text-white font-semibold hover:bg-[var(--brand-primary-hover,#1d4ed8)] transition"
                onClick={fetchCategories}
              >
                Try Again
              </button>
            </div>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <div className="flex flex-col items-center justify-center">
              <ImageIcon size={56} className="mb-6 text-gray-400" />
              <div className="text-xl font-semibold text-gray-500 mb-2">
                No categories found
              </div>
              <div className="text-gray-400 mb-6">
                {searchTerm
                  ? "Try adjusting your search to find what you're looking for."
                  : "Add your first category by clicking the 'Add Category' button."}
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
                  <th className="px-4 py-2 text-left font-semibold">Title</th>
                  <th className="px-4 py-2 text-left font-semibold">
                    Parent Category
                  </th>
                  <th className="px-4 py-2 text-left font-semibold">Slug</th>
                  <th className="px-4 py-2 text-left font-semibold">Brands</th>
                  <th className="px-4 py-2 text-left font-semibold">
                    Products
                  </th>
                  <th className="px-4 py-2 text-left font-semibold">Hide</th>
                  <th className="px-4 py-2 text-left font-semibold">Popular</th>
                  <th className="px-4 py-2 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((category) => (
                  <tr
                    key={category._id}
                    className="bg-white border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 text-gray-800 font-medium">
                      <div className="flex items-center gap-2">
                        {category.image ? (
                          <img
                            src={category.image}
                            alt={category.name}
                            className="w-10 h-10 rounded object-cover border"
                            onError={(e) => {
                              console.error(
                                `Failed to load image for ${category.name}:`,
                                category.image
                              );
                              (e.target as HTMLImageElement).src =
                                "https://placehold.co/100x100?text=Error";
                            }}
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                            <ImageIcon size={20} className="text-gray-400" />
                          </div>
                        )}
                        <div>
                          {category.name}
                          {category.description && (
                            <div className="text-xs text-gray-500 truncate max-w-[200px]">
                              {category.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {category.parent?.name || "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{category.slug}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {category.brandsCount || "0"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {category.productsCount || "0"}
                    </td>
                    <td className="px-4 py-3">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={category.isHidden}
                          onChange={() => handleToggleVisibility(category._id)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </td>
                    <td className="px-4 py-3">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={category.isPopular}
                          onChange={() => handleTogglePopularity(category._id)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </td>
                    <td className="px-4 py-3 text-right flex justify-end gap-2">
                      <button
                        className="p-2 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                        onClick={() => handleOpenEditModal(category)}
                        title="Edit Category"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="p-2 rounded bg-red-100 text-red-500 hover:bg-red-200 transition"
                        onClick={() => handleDeleteCategory(category._id)}
                        title="Delete Category"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Category Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-lg relative animate-fade-in">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={handleCloseModal}
              aria-label="Close"
              disabled={uploading}
            >
              <X />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {editMode ? "Edit Category" : "Create Category"}
            </h2>

            <div className="mb-4">
              <label
                htmlFor="category-name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="category-name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Enter category name"
                disabled={uploading}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="category-description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description <span className="text-gray-400">(Optional)</span>
              </label>
              <textarea
                id="category-description"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
                placeholder="Brief description of the category"
                rows={3}
                disabled={uploading}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="parent-category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Select parent category{" "}
                <span className="text-gray-400">(Optional)</span>
              </label>
              <select
                id="parent-category"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={parentCategory}
                onChange={(e) => setParentCategory(e.target.value)}
                disabled={uploading}
              >
                <option value="">None (Top-level category)</option>
                {categories
                  .filter((cat) => !editMode || cat._id !== editCategoryId) // Filter out current category when editing
                  .map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category Image <span className="text-gray-400">(Optional)</span>
              </label>
              <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-[var(--brand-primary,#2563eb)] transition">
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  className="hidden"
                  id="category-image-upload"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
                <label
                  htmlFor="category-image-upload"
                  className="flex flex-col items-center cursor-pointer"
                >
                  {uploadImage ? (
                    <img
                      src={uploadImage}
                      alt="Category Preview"
                      className="w-40 h-40 object-contain rounded mb-2 border"
                    />
                  ) : (
                    <>
                      <UploadCloud size={36} className="mb-2 text-gray-400" />
                      <span className="text-gray-400 text-sm text-center">
                        Upload jpg, png images with a maximum size of 20 MB
                      </span>
                    </>
                  )}
                </label>
              </div>
            </div>

            <button
              className="w-full py-2 rounded bg-[var(--brand-primary)] text-white font-semibold hover:bg-[var(--brand-primary-hover)] transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
              onClick={handleSaveCategory}
              disabled={!categoryName.trim() || uploading}
            >
              {uploading ? (
                <>
                  <Loader2 size={20} className="mr-2 animate-spin" />
                  {editMode ? "Updating..." : "Creating..."}
                </>
              ) : editMode ? (
                "Update"
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

export default AdminCategories;
