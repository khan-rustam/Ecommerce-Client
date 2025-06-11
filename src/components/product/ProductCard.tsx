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
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:scale-105 border-2 border-transparent hover:border-accent font-sans animate-fade-in" style={{fontFamily:'Inter, Poppins, sans-serif'}}>
      <Link to={getProductUrl()} className="block relative">
        {/* Product image */}
        <div className="relative overflow-hidden aspect-square">
          <img
            src={getFirstImage()}
            alt={getProductName()}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 rounded-2xl"
          />
          {/* Discount badge */}
          {discountPercentage() > 0 && (
            <div className="absolute top-2 right-2 bg-gradient-to-r from-primary to-accent text-white text-sm font-bold py-1 px-2 rounded-md shadow-md">
              -{discountPercentage()}%
            </div>
          )}
          {/* Add to wishlist button */}
          <button
            onClick={handleAddToWishlist}
            className={`absolute top-2 left-2 p-2 rounded-full bg-white shadow-md hover:bg-accent/10 transition-colors border border-accent/10 ${
              isProductInWishlist() ? "text-[var(--brand-primary,#2563eb)]" : "text-gray-400"
            }`}
          >
            <Heart
              size={20}
              fill={isProductInWishlist() ? "currentColor" : "none"}
            />
          </button>
          {/* New tag */}
          {isNewProduct() && (
            <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs font-bold py-1 px-2 rounded-md shadow-md">
              NEW
            </div>
          )}
          {/* Trending tag */}
          {isTrendingProduct() && (
            <div className="absolute bottom-2 left-20 bg-amber-500 text-white text-xs font-bold py-1 px-2 rounded-md shadow-md">
              TRENDING
            </div>
          )}
          {/* Quick actions overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
            <div className="translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              <button
                onClick={handleAddToCart}
                className="bg-gradient-to-r from-accent to-primary text-white hover:from-primary hover:to-accent py-2 px-6 rounded-full shadow-lg transition-colors font-bold text-base"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
        {/* Product info */}
        <div className="p-5">
          <h3 className="text-lg md:text-xl font-extrabold text-gray-800 mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300">
            {getProductName()}
          </h3>
          <div className="mt-2 flex items-center">
            {product.salePrice ? (
              <>
                <span className="text-red-600 font-bold text-lg">
                  ${getFormattedPrice(product.salePrice)}
                </span>
                <span className="ml-2 text-gray-400 text-base line-through">
                  ${getFormattedPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="font-bold text-lg">${getFormattedPrice(product.price)}</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;

<style>{`
@keyframes fade-in {
  0% { opacity: 0; transform: translateY(40px); }
  100% { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.8s cubic-bezier(0.23, 1, 0.32, 1) both;
}
`}</style>
