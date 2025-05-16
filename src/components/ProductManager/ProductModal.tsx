export default function ProductModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-lg relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">Add / Edit Product</h2>
        {/* Add form fields here */}
        <form className="flex flex-col gap-4">
          <input className="border rounded px-3 py-2" placeholder="Product Name" />
          <input className="border rounded px-3 py-2" placeholder="Price" type="number" />
          <input className="border rounded px-3 py-2" placeholder="Stock" type="number" />
          {/* ...more fields */}
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
} 