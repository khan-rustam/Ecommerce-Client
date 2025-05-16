import React, { useState, useRef } from "react";
import { X, UploadCloud } from "lucide-react";
import { useBrandColors } from "../../../contexts/BrandColorContext";

const countries = ["USA", "India", "UK", "Germany", "France", "Australia"];
const productTypes = ["Simple", "Variable", "Bundled"];
const categories = ["Shoes", "Clothing", "Accessories"];
const brands = ["Nike", "Adidas", "Puma", "Reebok"];
// const genders = ["Male", "Female", "Unisex"];
// const sizes = [
//   "EU - 38.5",
//   "EU - 39",
//   "EU - 40",
//   "EU - 41.5",
//   "EU - 42",
//   "EU - 43",
//   "EU - 44",
// ];
const currencies = ["USD", "INR", "EUR", "GBP", "AFN"];
const stockStatuses = ["In stock", "Out of stock", "Backorder"];
const yesNo = ["Yes", "No"];
const publishOptions = ["Publish", "Draft"];
const warehouses = ["Warehouse A", "Warehouse B", "Warehouse C"];

export default function AddProductModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { colors } = useBrandColors();
  const [form, setForm] = useState({
    name: "",
    category: "",
    brand: "",
    gender: "Male",
    description: "",
    images: [] as string[],
    size: "EU - 44",
    date: "",
    regularPrice: "",
    salePrice: "",
    regularPriceOther: "",
    salePriceOther: "",
    stock: "",
    stockStatus: stockStatuses[0],
    purchaseNote: "",
    sgst: "",
    cgst: "",
    igst: "",
    export: "Yes",
    saleForeign: "Yes",
    hsn: "",
    publish: publishOptions[0],
    productType: productTypes[0],
    returnable: "No",
    featured: "No",
    cashOnDelivery: "No",
    availableForSale: "Yes",
    allowReviews: "Yes",
    madeIn: countries[0],
    currency: currencies[0],
    weight: "",
    dimHeight: "",
    dimWidth: "",
    dimLength: "",
    warehouse: "",
  });
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  const handleInput = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploading(true);
      const filesArray = Array.from(e.target.files);
      setTimeout(() => {
        setForm({
          ...form,
          images: [
            ...form.images,
            ...filesArray.map((f) => URL.createObjectURL(f)),
          ],
        });
        setUploading(false);
      }, 600);
    }
  };

  const handleImageRemove = (img: string) => {
    setForm({ ...form, images: form.images.filter((i) => i !== img) });
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setUploading(true);
      const filesArray = Array.from(e.dataTransfer.files);
      setTimeout(() => {
        setForm({
          ...form,
          images: [
            ...form.images,
            ...filesArray.map((f) => URL.createObjectURL(f)),
          ],
        });
        setUploading(false);
      }, 600);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save logic here
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-sm shadow-xl p-8 w-full max-w-6xl max-h-[90vh] overflow-y-auto relative animate-fade-in">
        <div
          className="sticky -top-8 z-10 flex items-center justify-between p-4 bg-white shadow-sm border-b"
          style={{
            borderTopLeftRadius: "0.5rem",
            borderTopRightRadius: "0.5rem",
          }}
        >
          <h2 className="text-2xl font-bold mb-0" style={{ color: colors.primary }}>
            Create Products
          </h2>
          <button
            className="text-gray-400 hover:text-gray-700 text-2xl"
            onClick={onClose}
            style={{ lineHeight: 1 }}
          >
            <X />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-8 mt-2">
          {/* General */}
          <section className="bg-gray-50 rounded-xl p-6 border">
            <div className="font-bold text-lg mb-1">General</div>
            <div className="text-gray-400 mb-4 text-sm">
              Add general information for this product.
            </div>
            <label className="font-medium text-sm flex flex-col gap-1 mb-4">
              Product name <span className="text-red-500">*</span>
              <input
                name="name"
                maxLength={20}
                required
                className="mt-1 px-3 py-2 rounded-lg border focus:ring-2 focus:ring-[var(--brand-accent)] focus:outline-none w-full"
                style={{
                  borderColor: colors.accent,
                  color: colors.text,
                  background: colors.background,
                }}
                value={form.name}
                onChange={handleInput}
                placeholder="Enter product name"
              />
            </label>
            <label className="font-medium text-sm flex flex-col gap-1 mb-4">
              Description
              <textarea
                name="description"
                maxLength={100}
                required
                className="mt-1 px-3 py-2 rounded-lg border focus:ring-2 focus:ring-[var(--brand-accent)] focus:outline-none w-full min-h-[100px]"
                style={{
                  borderColor: colors.accent,
                  color: colors.text,
                  background: colors.background,
                }}
                value={form.description}
                onChange={handleInput}
                placeholder="Description"
              />
            </label>
          </section>
          {/* Pricing */}
          <section className="bg-gray-50 rounded-xl p-6 border">
            <div className="font-bold text-lg mb-1">
              Pricing and Exclusive Sale
            </div>
            <div className="text-gray-400 mb-4 text-sm">
              Add general information for this product.
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="font-medium text-sm flex flex-col gap-1">
                <span className="flex items-center">Regular price <span className="text-red-500 ml-1">*</span></span>
                <input
                  name="regularPrice"
                  required
                  className="mt-1 px-3 py-2 rounded-lg border w-full"
                  value={form.regularPrice}
                  onChange={handleInput}
                />
              </label>
              <label className="font-medium text-sm flex flex-col gap-1">
                Sale price
                <input
                  name="salePrice"
                  className="mt-1 px-3 py-2 rounded-lg border w-full"
                  value={form.salePrice}
                  onChange={handleInput}
                />
              </label>
              {form.saleForeign === "Yes" && (
                <>
                  <label className="font-medium text-sm flex flex-col gap-1">
                    Regular price for other countries
                    <input
                      name="regularPriceOther"
                      className="mt-1 px-3 py-2 rounded-lg border w-full"
                      value={form.regularPriceOther}
                      onChange={handleInput}
                    />
                  </label>
                  <label className="font-medium text-sm flex flex-col gap-1">
                    Sale price for other countries
                    <input
                      name="salePriceOther"
                      className="mt-1 px-3 py-2 rounded-lg border w-full"
                      value={form.salePriceOther}
                      onChange={handleInput}
                    />
                  </label>
                </>
              )}
            </div>
            {/* Warehouse dropdown */}
            <div className="mt-4">
              <label className="font-medium text-sm flex flex-col gap-1">
                Warehouse
                <select
                  name="warehouse"
                  className="mt-1 px-3 py-2 rounded-lg border w-full"
                  value={form.warehouse || ""}
                  onChange={handleInput}
                >
                  <option value="">Select warehouse</option>
                  {warehouses.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>
          {/* Inventory */}
          <section className="bg-gray-50 rounded-xl p-6 border">
            <div className="font-bold text-lg mb-1">Inventory</div>
            <div className="text-gray-400 mb-4 text-sm">
              The type of product we choose determines how we manage inventory
              and reporting.
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="font-medium text-sm flex flex-col gap-1">
                Stock quantity
                <input
                  name="stock"
                  className="mt-1 px-3 py-2 rounded-lg border w-full"
                  value={form.stock}
                  onChange={handleInput}
                />
              </label>
              <label className="font-medium text-sm flex flex-col gap-1">
                Stock status
                <select
                  name="stockStatus"
                  className="mt-1 px-3 py-2 rounded-lg border w-full"
                  value={form.stockStatus}
                  onChange={handleInput}
                >
                  {stockStatuses.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
            </div>
          </section>
          {/* Purchase Note */}
          <section className="bg-gray-50 rounded-xl p-6 border">
            <div className="font-bold text-lg mb-1">Purchase note</div>
            <div className="text-gray-400 mb-4 text-sm">
              Leave a message / warning for your customer
            </div>
            <textarea
              name="purchaseNote"
              className="w-full min-h-[80px] px-3 py-2 rounded-lg border"
              value={form.purchaseNote}
              onChange={handleInput}
              placeholder="Your message..."
            />
          </section>
          {/* Images */}
          <section className="bg-gray-50 rounded-xl p-6 border flex flex-col items-center">
            <div className="font-bold text-lg mb-4 w-full text-left">Product images</div>
            <div className="w-full flex flex-col items-center">
              <div
                className={`flex flex-col items-center justify-center w-64 h-48 rounded-lg border-2 border-dashed cursor-pointer transition mb-4 ${
                  dragActive ? "border-blue-400 bg-blue-50" : "border-gray-300 bg-gray-50"
                }`}
                onClick={handleBrowseClick}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
              >
                <UploadCloud size={40} style={{ color: colors.primary }} />
                <span className="text-base text-gray-500 text-center mt-2">
                  Upload up to 5 images (jpg, png, max 20 MB each)
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
              {form.images.length > 0 && (
                <div className="flex flex-wrap gap-4 justify-center w-full mb-2">
                  {form.images.map((img, idx) => (
                    <div key={idx} className="relative group w-28 h-36 flex items-center justify-center bg-gray-50 rounded-lg border">
                      <img src={img} alt="Preview" className="object-contain w-24 h-32" />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-white border border-gray-200 rounded-full p-1 shadow hover:bg-red-100 transition"
                        onClick={() => handleImageRemove(img)}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <span className="text-xs text-gray-500 text-center mt-2">
                Please select all images at once. You can upload up to 5 images.
              </span>
            </div>
          </section>
          {/* Category/Brand */}
          <section className="bg-gray-50 rounded-xl p-6 border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="font-semibold mb-2">Product category</div>
                <select
                  name="category"
                  className="mt-1 px-3 py-2 rounded-lg border w-full"
                  value={form.category}
                  onChange={handleInput}
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <div className="font-semibold mb-2">Product brand</div>
                <select
                  name="brand"
                  className="mt-1 px-3 py-2 rounded-lg border w-full"
                  value={form.brand}
                  onChange={handleInput}
                >
                  <option value="">Select brand</option>
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>
          {/* Tax */}
          <section className="bg-gray-50 rounded-xl p-6 border">
            <div className="font-bold text-lg mb-1">Tax</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="font-medium text-sm flex flex-col gap-1">
                SGST rate (%)
                <input
                  name="sgst"
                  className="mt-1 px-3 py-2 rounded-lg border w-full"
                  value={form.sgst}
                  onChange={handleInput}
                />
              </label>
              <label className="font-medium text-sm flex flex-col gap-1">
                CGST rate (%)
                <input
                  name="cgst"
                  className="mt-1 px-3 py-2 rounded-lg border w-full"
                  value={form.cgst}
                  onChange={handleInput}
                />
              </label>
              <label className="font-medium text-sm flex flex-col gap-1">
                IGST rate (%)
                <input
                  name="igst"
                  className="mt-1 px-3 py-2 rounded-lg border w-full"
                  value={form.igst}
                  onChange={handleInput}
                />
              </label>
            </div>
          </section>
          {/* Export */}
          <section className="bg-gray-50 rounded-xl p-6 border">
            <div className="font-bold text-lg mb-1">Do you want to export?</div>
            <label className="font-medium text-sm flex flex-col gap-1">
              Sale in foreign countries
              <select
                name="saleForeign"
                className="mt-1 px-3 py-2 rounded-lg border w-full"
                value={form.saleForeign}
                onChange={handleInput}
              >
                {yesNo.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </label>
          </section>
          {/* More */}
          <section className="bg-gray-50 rounded-xl p-6 border">
            <div className="font-bold text-lg mb-1">More</div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <label className="font-medium text-sm flex flex-col gap-1">
                HSN code
                <input
                  name="hsn"
                  className="mt-1 px-3 py-2 rounded-lg border w-full"
                  value={form.hsn}
                  onChange={handleInput}
                />
              </label>
              <label className="font-medium text-sm flex flex-col gap-1">
                Publish product
                <select
                  name="publish"
                  className="mt-1 px-3 py-2 rounded-lg border w-full"
                  value={form.publish}
                  onChange={handleInput}
                >
                  {publishOptions.map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </label>
              <label className="font-medium text-sm flex flex-col gap-1">
                Product type
                <select
                  name="productType"
                  className="mt-1 px-3 py-2 rounded-lg border w-full"
                  value={form.productType}
                  onChange={handleInput}
                >
                  {productTypes.map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </label>
              <label className="font-medium text-sm flex flex-col gap-1">
                Is product returnable?
                <select
                  name="returnable"
                  className="mt-1 px-3 py-2 rounded-lg border w-full"
                  value={form.returnable}
                  onChange={handleInput}
                >
                  {yesNo.map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </label>
              <label className="font-medium text-sm flex flex-col gap-1">
                Featured
                <select
                  name="featured"
                  className="mt-1 px-3 py-2 rounded-lg border w-full"
                  value={form.featured}
                  onChange={handleInput}
                >
                  {yesNo.map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </label>
              <label className="font-medium text-sm flex flex-col gap-1">
                Allow cash on delivery
                <select
                  name="cashOnDelivery"
                  className="mt-1 px-3 py-2 rounded-lg border w-full"
                  value={form.cashOnDelivery}
                  onChange={handleInput}
                >
                  {yesNo.map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </label>
              <label className="font-medium text-sm flex flex-col gap-1">
                Available for sale
                <select
                  name="availableForSale"
                  className="mt-1 px-3 py-2 rounded-lg border w-full"
                  value={form.availableForSale}
                  onChange={handleInput}
                >
                  {yesNo.map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </label>
              <label className="font-medium text-sm flex flex-col gap-1">
                Allow reviews
                <select
                  name="allowReviews"
                  className="mt-1 px-3 py-2 rounded-lg border w-full"
                  value={form.allowReviews}
                  onChange={handleInput}
                >
                  {yesNo.map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </label>
              <label className="font-medium text-sm flex flex-col gap-1">
                Made In <span className="text-red-500">*</span>
                <select
                  name="madeIn"
                  className="mt-1 px-3 py-2 rounded-lg border w-full"
                  value={form.madeIn}
                  onChange={handleInput}
                >
                  {countries.map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </label>
              <label className="font-medium text-sm flex flex-col gap-1">
                Product currency <span className="text-red-500">*</span>
                <select
                  name="currency"
                  className="mt-1 px-3 py-2 rounded-lg border w-full"
                  value={form.currency}
                  onChange={handleInput}
                >
                  {currencies.map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </label>
              <label className="font-medium text-sm flex flex-col gap-1">
                Product weight (KG)
                <input
                  name="weight"
                  className="mt-1 px-3 py-2 rounded-lg border w-full"
                  value={form.weight}
                  onChange={handleInput}
                />
              </label>
              <div className="flex flex-col gap-1">
                <span className="font-medium text-sm">
                  Dimensions (Centimeter)
                </span>
                <div className="flex gap-2">
                  <input
                    name="dimHeight"
                    placeholder="Height"
                    className="px-2 py-1 rounded border w-1/3"
                    value={form.dimHeight}
                    onChange={handleInput}
                  />
                  <input
                    name="dimWidth"
                    placeholder="Width"
                    className="px-2 py-1 rounded border w-1/3"
                    value={form.dimWidth}
                    onChange={handleInput}
                  />
                  <input
                    name="dimLength"
                    placeholder="Length"
                    className="px-2 py-1 rounded border w-1/3"
                    value={form.dimLength}
                    onChange={handleInput}
                  />
                </div>
              </div>
            </div>
          </section>
          <div className="flex gap-4 justify-end mt-4">
            <button
              type="submit"
              className="px-6 py-3 rounded-lg font-semibold shadow-lg transition text-base"
              style={{ background: colors.primary, color: colors.background }}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
