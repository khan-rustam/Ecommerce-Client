export default function ProductFilters() {
  return (
    <div className="flex gap-2">
      <input
        className="px-3 py-2 border rounded-lg text-sm"
        placeholder="Search products..."
      />
      <select className="px-3 py-2 border rounded-lg text-sm">
        <option>All Categories</option>
        {/* Add dynamic categories */}
      </select>
    </div>
  );
} 