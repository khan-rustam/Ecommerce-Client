import React from "react";
import ProductCard from "./ProductCard";
import { Product, BackendProduct } from "../../types";

interface ProductGridProps {
  products: (Product | BackendProduct)[];
  title?: string;
  cols?: number;
  loading?: boolean;
  emptyMessage?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  title,
  cols = 4,
  loading = false,
  emptyMessage = "No products available",
}) => {
  const getGridCols = () => {
    switch (cols) {
      case 2:
        return "grid-cols-1 sm:grid-cols-2";
      case 3:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
      case 5:
        return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5";
      case 6:
        return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6";
      default:
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
    }
  };

  // Create loading skeleton cards
  const renderSkeletons = () => {
    return Array(4).fill(0).map((_, index) => (
      <div key={`skeleton-${index}`} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
        <div className="w-full h-48 bg-gray-200 rounded-md mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-8 bg-gray-200 rounded w-1/3 mt-4"></div>
      </div>
    ));
  };

  // Get product ID (works for both Product and BackendProduct)
  const getProductId = (product: Product | BackendProduct): string | number => {
    if ('_id' in product) {
      return product._id;
    }
    return product.id;
  };

  return (
    <div className="py-8">
      {title && (
        <div className="text-center mb-8">
          <h2
            className="text-2xl font-semibold inline-block relative"
          >
            {title}
            <span
              className="absolute bottom-0 left-1/2 w-16 h-0.5 transform -translate-x-1/2"
            ></span>
          </h2>
        </div>
      )}
      
      <div className={`grid ${getGridCols()} gap-6`}>
        {loading ? (
          renderSkeletons()
        ) : products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={getProductId(product)} product={product as Product} />
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            {emptyMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductGrid;
