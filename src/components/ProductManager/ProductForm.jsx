import React, { useState, useEffect, useRef } from "react";
import { X, Plus, Upload, Tag } from "lucide-react";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import ProductService from "../../utils/ProductService";

/**
 * @typedef {Object} FormProps
 * @property {Object} [initialData] - Initial product data
 * @property {Function} onSubmit - Form submission handler
 * @property {boolean} isLoading - Loading state
 */

/**
 * @typedef {Object} Category
 * @property {string} _id - Category ID
 * @property {string} name - Category name
 */

/**
 * @typedef {Object} Brand
 * @property {string} _id - Brand ID
 * @property {string} name - Brand name
 */

/**
 * Product form component
 * @param {FormProps} props - Component props
 * @returns {React.ReactElement}
 */
const ProductForm = ({ initialData = {}, onSubmit, isLoading }) => {
  const fileInputRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [images, setImages] = useState(initialData?.images || []);
  const [imagePublicIds, setImagePublicIds] = useState(
    initialData?.imagePublicIds || []
  );
  const [uploadLoading, setUploadLoading] = useState(false);
  const [currentTag, setCurrentTag] = useState("");
  const [warehouses, setWarehouses] = useState([]);
  const [warehouseStocks, setWarehouseStocks] = useState([]);

  // Form data state
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    salePrice: initialData?.salePrice || 0,
    category: initialData?.category || "",
    brand: initialData?.brand || "",
    stock: initialData?.stock || 0,
    stockStatus: initialData?.stockStatus || "in_stock",
    tags: initialData?.tags || [],
    isHidden: initialData?.isHidden || false,
    isFeatured: initialData?.isFeatured || false,
    isTrending: initialData?.isTrending || false,
    onSale: initialData?.onSale || false,
    readyToShip: initialData?.readyToShip || true,
    sellInOtherCountries: initialData?.sellInOtherCountries || false,
    allowReviews: initialData?.allowReviews || true,
    allowCashOnDelivery: initialData?.allowCashOnDelivery || true,
    foreignPrice: initialData?.foreignPrice || 0,
    foreignSalePrice: initialData?.foreignSalePrice || 0,
    currency: initialData?.currency || "₹",
    foreignCurrency: initialData?.foreignCurrency || "$",
    purchaseNote: initialData?.purchaseNote || "",
    hsnCode: initialData?.hsnCode || "",
    madeIn: initialData?.madeIn || "India",
    productType: initialData?.productType || "Simple",
    isRenewable: initialData?.isRenewable || false,
    gstRate: initialData?.gstRate || { sgst: 0, cgst: 0, igst: 0 },
    dimensions: initialData?.dimensions || {
      length: 0,
      width: 0,
      height: 0,
      unit: "cm",
    },
    weight: initialData?.weight || { value: 0, unit: "g" },
    images: images,
    imagePublicIds: imagePublicIds,
  });

  // Fetch categories and brands
  useEffect(() => {
    const fetchData = async () => {
      try {
        // First try to fetch categories
        let categoriesData = [];
        try {
          categoriesData = await ProductService.getCategories();
          console.log("Fetched categories:", categoriesData);
          setCategories(categoriesData || []);

          if (!categoriesData || categoriesData.length === 0) {
            toast.warning(
              "No categories found. Please create categories first."
            );
          }
        } catch (categoryError) {
          console.error("Error fetching categories:", categoryError);
          toast.error("Failed to load categories");
        }

        // Then try to fetch brands
        let brandsData = [];
        try {
          brandsData = await ProductService.getBrands();
          console.log("Fetched brands:", brandsData);
          setBrands(brandsData || []);

          if (!brandsData || brandsData.length === 0) {
            toast.warning(
              "No brands found. You may want to create brands first."
            );
          }
        } catch (brandError) {
          console.error("Error fetching brands:", brandError);
          toast.error("Failed to load brands");
        }
      } catch (error) {
        console.error("Error in data fetching:", error);
        toast.error("Failed to load product form data");
      }
    };

    fetchData();
  }, []);

  // Fetch warehouses
  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const res = await fetch("/api/warehouses");
        const data = await res.json();
        setWarehouses(data);
        // If editing, prefill stocks
        if (initialData?.warehouses) {
          setWarehouseStocks(initialData.warehouses);
        }
      } catch (err) {
        toast.error("Failed to load warehouses");
      }
    };
    fetchWarehouses();
  }, [initialData]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type } = e.target;

    // Handle checkbox inputs
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: e.target.checked }));
      return;
    }

    // Handle numeric inputs
    if (type === "number") {
      const numValue = value === "" ? 0 : Number(value);
      setFormData((prev) => ({ ...prev, [name]: numValue }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle rich text editor (description)
  const handleDescriptionChange = (content) => {
    setFormData((prev) => ({ ...prev, description: content }));
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadLoading(true);

    try {
      // Upload each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const result = await ProductService.uploadProductImage(file);

        setImages((prev) => [...prev, result.url]);
        setImagePublicIds((prev) => [...prev, result.publicId]);
      }

      setFormData((prev) => ({
        ...prev,
        images: [...images, ...Array.from(files).map(() => "")],
        imagePublicIds: [...imagePublicIds, ...Array.from(files).map(() => "")],
      }));

      toast.success("Images uploaded successfully");
    } catch (error) {
      toast.error(error.message || "Failed to upload images");
    } finally {
      setUploadLoading(false);
      // Clear the file input
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Remove an image
  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePublicIds((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index) || [],
      imagePublicIds: prev.imagePublicIds?.filter((_, i) => i !== index) || [],
    }));
  };

  // Add a tag
  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags?.includes(currentTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), currentTag.trim()],
      }));
      setCurrentTag("");
    }
  };

  // Remove a tag
  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((tag) => tag !== tagToRemove) || [],
    }));
  };

  // Handle warehouse stock change
  const handleWarehouseStockChange = (warehouseId, stock) => {
    setWarehouseStocks((prev) => {
      const exists = prev.find((w) => w.warehouseId === warehouseId);
      if (exists) {
        return prev.map((w) =>
          w.warehouseId === warehouseId ? { ...w, stock: Number(stock) } : w
        );
      } else {
        return [...prev, { warehouseId, stock: Number(stock) }];
      }
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.name || !formData.description || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (images.length === 0) {
      toast.error("Please upload at least one product image");
      return;
    }

    // Update images in form data
    const updatedFormData = {
      ...formData,
      images,
      imagePublicIds,
      warehouses: warehouseStocks.filter((w) => w.stock > 0),
    };

    onSubmit(updatedFormData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-3 gap-8"
    >
      {/* Left Column - Basic Info */}
      <div className="md:col-span-2 space-y-6">
        <section className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>

          {/* Product Name */}
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter product name"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description <span className="text-red-500">*</span>
            </label>
            <ReactQuill
              value={formData.description}
              onChange={handleDescriptionChange}
              className="bg-white rounded-md"
              placeholder="Enter product description"
              modules={{
                toolbar: [
                  [{ header: [1, 2, 3, false] }],
                  ["bold", "italic", "underline", "strike"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["blockquote", "code-block"],
                  ["link"],
                ],
              }}
            />
          </div>

          {/* Images */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Images <span className="text-red-500">*</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
              {/* Display existing images */}
              {images.map((imageUrl, index) => (
                <div key={index} className="relative group">
                  <img
                    src={imageUrl.url}
                    alt={`Product ${index + 1}`}
                    className="h-24 w-full object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}

              {/* Upload button */}
              <div
                className="h-24 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:border-blue-500 hover:text-blue-500"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={24} />
                <span className="text-xs mt-1">Upload</span>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>

            {uploadLoading && (
              <div className="text-sm text-blue-600 flex items-center">
                <div className="spinner mr-2 h-4 w-4 border-t-2 border-b-2 border-blue-600 rounded-full animate-spin"></div>
                Uploading images...
              </div>
            )}
          </div>
        </section>

        {/* Pricing Section */}
        <section className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Pricing</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Regular Price */}
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Regular Price <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                  {formData.currency}
                </span>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="flex-1 rounded-none rounded-r-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Sale Price */}
            <div>
              <label
                htmlFor="salePrice"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Sale Price
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                  {formData.currency}
                </span>
                <input
                  type="number"
                  id="salePrice"
                  name="salePrice"
                  value={formData.salePrice}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="flex-1 rounded-none rounded-r-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* On Sale Toggle */}
            <div className="col-span-full">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="onSale"
                  name="onSale"
                  checked={formData.onSale}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="onSale" className="ml-2 text-sm text-gray-700">
                  Product is on sale
                </label>
              </div>
            </div>

            {/* Currency */}
            <div>
              <label
                htmlFor="currency"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Currency
              </label>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="₹">Indian Rupee (₹)</option>
                <option value="$">US Dollar ($)</option>
                <option value="€">Euro (€)</option>
                <option value="£">British Pound (£)</option>
              </select>
            </div>
          </div>
        </section>

        {/* Foreign Pricing (conditional) */}
        {formData.sellInOtherCountries && (
          <section className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Foreign Pricing</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Foreign Regular Price */}
              <div>
                <label
                  htmlFor="foreignPrice"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Foreign Regular Price
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                    {formData.foreignCurrency}
                  </span>
                  <input
                    type="number"
                    id="foreignPrice"
                    name="foreignPrice"
                    value={formData.foreignPrice}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="flex-1 rounded-none rounded-r-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Foreign Sale Price */}
              <div>
                <label
                  htmlFor="foreignSalePrice"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Foreign Sale Price
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                    {formData.foreignCurrency}
                  </span>
                  <input
                    type="number"
                    id="foreignSalePrice"
                    name="foreignSalePrice"
                    value={formData.foreignSalePrice}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="flex-1 rounded-none rounded-r-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Foreign Currency */}
              <div>
                <label
                  htmlFor="foreignCurrency"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Foreign Currency
                </label>
                <select
                  id="foreignCurrency"
                  name="foreignCurrency"
                  value={formData.foreignCurrency}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="$">US Dollar ($)</option>
                  <option value="€">Euro (€)</option>
                  <option value="£">British Pound (£)</option>
                  <option value="₹">Indian Rupee (₹)</option>
                </select>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Right Column - Additional Info */}
      <div className="space-y-6">
        {/* Categories and Tags */}
        <section className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Organization</h2>

          {/* Category */}
          <div className="mb-4">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Category</option>
              {categories && categories.length > 0 ? (
                categories
                  .filter((category) => !category.isHidden)
                  .map((category) => (
                    <option
                      key={category._id || category.id}
                      value={category._id || category.id}
                    >
                      {category.name}
                    </option>
                  ))
              ) : (
                <option disabled>No categories found</option>
              )}
            </select>
          </div>

          {/* Brand */}
          <div className="mb-4">
            <label
              htmlFor="brand"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Brand
            </label>
            <select
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Brand</option>
              {brands && brands.length > 0 ? (
                brands.map((brand) => (
                  <option
                    key={brand._id || brand.id}
                    value={brand._id || brand.id}
                  >
                    {brand.name}
                  </option>
                ))
              ) : (
                <option disabled>No brands found</option>
              )}
            </select>
          </div>

          {/* Tags */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags &&
                formData.tags.map((tag, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 text-blue-500 hover:text-blue-700"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
            </div>
            <div className="flex">
              <input
                type="text"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add a tag"
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), handleAddTag())
                }
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-r-md border border-l-0 border-gray-300 hover:bg-gray-200"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
        </section>

        {/* Inventory */}
        <section className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Inventory</h2>

          {/* Stock */}
          <div className="mb-4">
            <label
              htmlFor="stock"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Stock Quantity
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Stock Status */}
          <div className="mb-4">
            <label
              htmlFor="stockStatus"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Stock Status
            </label>
            <select
              id="stockStatus"
              name="stockStatus"
              value={formData.stockStatus}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="in_stock">In stock</option>
              <option value="out_of_stock">Out of stock</option>
              <option value="on_backorder">On backorder</option>
            </select>
          </div>
        </section>

        {/* Publication Settings */}
        <section className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Publication</h2>

          <div className="space-y-3">
            {/* Hide Product */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isHidden"
                name="isHidden"
                checked={formData.isHidden}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="isHidden" className="ml-2 text-sm text-gray-700">
                Hide from store
              </label>
            </div>

            {/* Featured Product */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isFeatured"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="isFeatured"
                className="ml-2 text-sm text-gray-700"
              >
                Featured product
              </label>
            </div>

            {/* Trending Product */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isTrending"
                name="isTrending"
                checked={formData.isTrending}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="isTrending"
                className="ml-2 text-sm text-gray-700"
              >
                Trending product
              </label>
            </div>

            {/* Ready to Ship */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="readyToShip"
                name="readyToShip"
                checked={formData.readyToShip}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label
                htmlFor="readyToShip"
                className="ml-2 text-sm text-gray-700"
              >
                Ready to ship
              </label>
            </div>

            {/* Sell in Other Countries */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="sellInOtherCountries"
                name="sellInOtherCountries"
                checked={formData.sellInOtherCountries}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="sellInOtherCountries"
                className="ml-2 text-sm text-gray-700"
              >
                Sell in other countries
              </label>
            </div>
          </div>
        </section>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isLoading || uploadLoading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Saving..." : "Save Product"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProductForm;
