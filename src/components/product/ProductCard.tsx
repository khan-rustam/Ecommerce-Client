import React from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Product, BackendProduct } from "../../types";
import { useWishlist } from "../../contexts/WishlistContext";
import { useCart } from "../../contexts/CartContext";

interface ProductCardProps {
  product: Product | BackendProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  // Helper to get product ID (works for both types)
  const getProductId = (): string | number => {
    if ('_id' in product) {
      return product._id;
    }
    return product.id;
  };

  // Helper to check if product is new
  const isNewProduct = (): boolean => {
    if ('isNew' in product) {
      return !!product.isNew;
    }
    if ('new' in product) {
      return !!product.new;
    }
    return false;
  };

  // Helper to check if product is trending
  const isTrendingProduct = (): boolean => {
    if ('isTrending' in product) {
      return !!product.isTrending;
    }
    return false;
  };

  // Helper to get product URL
  const getProductUrl = (): string => {
    if ('_id' in product) {
      // For backend products, use _id
      return `/product/${product._id}`;
    }
    // For frontend mock products
    return `/product/${product.id}`;
  };

  // Helper to get first image
  const getFirstImage = (): string => {
    if (!product.images || product.images.length === 0) {
      return 'https://via.placeholder.com/300?text=No+Image';
    }
    
    const firstImage = product.images[0];
    if (typeof firstImage === 'string') {
      return firstImage;
    } else if (typeof firstImage === 'object' && firstImage !== null) {
      // Handle object with url property (BackendProduct image format)
      return (firstImage as any).url || 'https://via.placeholder.com/300?text=Invalid+Image';
    }
    
    return 'https://via.placeholder.com/300?text=Invalid+Image';
  };

  // Helper to check if product is in wishlist
  const isProductInWishlist = (): boolean => {
    const id = getProductId();
    // Handle both string and number IDs
    return isInWishlist(id);
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToWishlist(product as Product);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product as Product);
  };

  // Calculate discount percentage
  const discountPercentage = (): number => {
    // If the product has an explicit discount field
    if ('discount' in product && product.discount) {
      return product.discount;
    }
    
    // Calculate discount from price and sale price
    if (product.salePrice && product.price && product.salePrice < product.price) {
      return Math.round(((product.price - product.salePrice) / product.price) * 100);
    }
    
    return 0;
  };

  // Get product name with fallback
  const getProductName = (): string => {
    return product.name || 'Unnamed Product';
  };

  // Get formatted price
  const getFormattedPrice = (price: number): string => {
    return price.toFixed(2);
  };

  return (
    <div className="group bg-white rounded-md shadow-sm hover:shadow-md transition-all duration-300">
      <Link to={getProductUrl()} className="block relative">
        {/* Product image */}
        <div className="relative overflow-hidden aspect-square">
          <img
            src={getFirstImage()}
            alt={getProductName()}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Discount badge */}
          {discountPercentage() > 0 && (
            <div className="absolute top-2 right-2 bg-[var(--brand-primary,#2563eb)] text-white text-sm font-medium py-1 px-2 rounded-sm">
              -{discountPercentage()}%
            </div>
          )}

          {/* Add to wishlist button */}
          <button
            onClick={handleAddToWishlist}
            className={`absolute top-2 left-2 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors ${
              isProductInWishlist() ? "text-[var(--brand-primary,#2563eb)]" : "text-gray-400"
            }`}
          >
            <Heart
              size={18}
              fill={isProductInWishlist() ? "currentColor" : "none"}
            />
          </button>

          {/* New tag */}
          {isNewProduct() && (
            <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs font-medium py-1 px-2 rounded-sm">
              NEW
            </div>
          )}
          
          {/* Trending tag */}
          {isTrendingProduct() && (
            <div className="absolute bottom-2 left-16 bg-amber-500 text-white text-xs font-medium py-1 px-2 rounded-sm">
              TRENDING
            </div>
          )}

          {/* Quick actions overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
            <div className="translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              <button
                onClick={handleAddToCart}
                className="bg-white text-gray-800 hover:bg-[var(--brand-primary,#2563eb)] hover:text-white py-2 px-4 rounded-md shadow-md transition-colors font-medium"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* Product info */}
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-1 line-clamp-2">
            {getProductName()}
          </h3>

          <div className="mt-2 flex items-center">
            {product.salePrice ? (
              <>
                <span className="text-red-600 font-semibold">
                  ${getFormattedPrice(product.salePrice)}
                </span>
                <span className="ml-2 text-gray-500 text-sm line-through">
                  ${getFormattedPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="font-semibold">${getFormattedPrice(product.price)}</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
