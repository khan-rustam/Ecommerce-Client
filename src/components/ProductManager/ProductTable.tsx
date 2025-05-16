type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  categories: string[];
  featured: boolean;
  trending: boolean;
  newArrival: boolean;
  image: string;
};

export default function ProductTable({ products }: { products: Product[] }) {
  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-50 text-gray-700">
            <th className="py-3 px-4 text-left">Image</th>
            <th className="py-3 px-4 text-left">Name</th>
            <th className="py-3 px-4 text-left">Categories</th>
            <th className="py-3 px-4 text-left">Price</th>
            <th className="py-3 px-4 text-left">Stock</th>
            <th className="py-3 px-4 text-left">Featured</th>
            <th className="py-3 px-4 text-left">Trending</th>
            <th className="py-3 px-4 text-left">New Arrival</th>
            <th className="py-3 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan={9} className="py-8 text-center text-gray-400">No products found.</td>
            </tr>
          ) : (
            products.map(product => (
              <tr key={product.id} className="even:bg-gray-50">
                <td className="py-3 px-4">
                  <img src={product.image} alt={product.name} className="w-12 h-12 rounded object-cover border" />
                </td>
                <td className="py-3 px-4 font-semibold">{product.name}</td>
                <td className="py-3 px-4">{product.categories.join(', ')}</td>
                <td className="py-3 px-4">${product.price.toFixed(2)}</td>
                <td className="py-3 px-4">{product.stock}</td>
                <td className="py-3 px-4">{product.featured ? 'Yes' : 'No'}</td>
                <td className="py-3 px-4">{product.trending ? 'Yes' : 'No'}</td>
                <td className="py-3 px-4">{product.newArrival ? 'Yes' : 'No'}</td>
                <td className="py-3 px-4">
                  <button className="text-blue-600 hover:underline mr-2">Edit</button>
                  <button className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
} 