import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '../../types';
import { useBrandColors } from '../../contexts/BrandColorContext';

interface ProductGridProps {
  products: Product[];
  title?: string;
  cols?: number;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  title,
  cols = 4 
}) => {
  const { colors } = useBrandColors();
  const getGridCols = () => {
    switch (cols) {
      case 2: return 'grid-cols-1 sm:grid-cols-2';
      case 3: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      case 5: return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5';
      case 6: return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6';
      default: return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
    }
  };

  return (
    <div className="py-8">
      {title && (
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold inline-block relative" style={{ color: colors.primary }}>
            {title}
            <span className="absolute bottom-0 left-1/2 w-16 h-0.5 transform -translate-x-1/2" style={{ background: colors.primary }}></span>
          </h2>
        </div>
      )}
      <div className={`grid ${getGridCols()} gap-6`}>
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;