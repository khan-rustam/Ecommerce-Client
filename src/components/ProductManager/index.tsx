import ProductTable from './ProductTable';
import ProductFilters from './ProductFilters';
import { useState } from 'react';
import ProductModal from './ProductModal';

export default function ProductManager() {
  const [showModal, setShowModal] = useState(false);

  // Dummy data for now
  const [products, setProducts] = useState([
    {
      id: '1',
      name: 'Sample Product',
      price: 199.99,
      stock: 20,
      categories: ['Shoes'],
      featured: true,
      trending: false,
      newArrival: true,
      image: 'https://images.pexels.com/photos/4587997/pexels-photo-4587997.jpeg?auto=compress&w=80&h=80',
    },
  ]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <ProductFilters />
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
          onClick={() => setShowModal(true)}
        >
          + Add Product
        </button>
      </div>
      <ProductTable products={products} />
      <ProductModal open={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
} 