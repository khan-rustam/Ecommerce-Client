import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Product } from '../../types';
import { useWishlist } from '../../contexts/WishlistContext';
import { useCart } from '../../contexts/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToWishlist(product);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const discountPercentage = product.discount || 
    (product.salePrice && product.price 
      ? Math.round(((product.price - product.salePrice) / product.price) * 100) 
      : 0);

  return (
    <div className="group bg-white rounded-md shadow-sm hover:shadow-md transition-all duration-300">
      <Link to={`/product/${product.id}`} className="block relative">
        {/* Product image */}
        <div className="relative overflow-hidden aspect-square">
          <img 
            src={product.images[0]} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Discount badge */}
          {discountPercentage > 0 && (
            <div className="absolute top-2 right-2 bg-orange-500 text-white text-sm font-medium py-1 px-2 rounded-sm">
              -{discountPercentage}%
            </div>
          )}
          
          {/* Add to wishlist button */}
          <button 
            onClick={handleAddToWishlist}
            className={`absolute top-2 left-2 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors ${
              isInWishlist(product.id) ? 'text-red-500' : 'text-gray-400'
            }`}
          >
            <Heart size={18} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
          </button>
          
          {/* New tag */}
          {product.new && (
            <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs font-medium py-1 px-2 rounded-sm">
              NEW
            </div>
          )}
          
          {/* Quick actions overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
            <div className="translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              <button
                onClick={handleAddToCart}
                className="bg-white text-gray-800 hover:bg-orange-500 hover:text-white py-2 px-4 rounded-md shadow-md transition-colors font-medium"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
        
        {/* Product info */}
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-1 line-clamp-2">{product.name}</h3>
          
          <div className="mt-2 flex items-center">
            {product.salePrice ? (
              <>
                <span className="text-red-600 font-semibold">${product.salePrice.toFixed(2)}</span>
                <span className="ml-2 text-gray-500 text-sm line-through">${product.price.toFixed(2)}</span>
              </>
            ) : (
              <span className="font-semibold">${product.price.toFixed(2)}</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;