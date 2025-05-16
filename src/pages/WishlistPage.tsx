import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { useBrandColors } from '../contexts/BrandColorContext';

const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { colors } = useBrandColors();
  
  const handleAddToCart = (productId: number) => {
    const product = wishlistItems.find(item => item.id === productId);
    if (product) {
      addToCart(product);
      removeFromWishlist(productId);
    }
  };
  
  if (wishlistItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center" style={{ background: colors.background, color: colors.text }}>
        <div className="mb-6">
          <Heart size={64} className="mx-auto" style={{ color: colors.secondary }} />
        </div>
        <h2 className="text-2xl font-semibold mb-4" style={{ color: colors.primary }}>Your Wishlist is Empty</h2>
        <p className="mb-8" style={{ color: colors.text }}>Save your favorite items to your wishlist to find them easily later.</p>
        <Link 
          to="/"
          style={{ background: colors.primary, color: '#fff' }}
          className="font-medium py-2 px-6 rounded-md transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8" style={{ background: colors.background, color: colors.text }}>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: colors.primary }}>My Wishlist</h1>
        <button 
          onClick={clearWishlist}
          className="font-medium"
          style={{ color: '#dc2626' }}
        >
          Clear All
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4" style={{ background: colors.accent, color: colors.text, fontWeight: 500 }}>
          <div className="col-span-6">Product</div>
          <div className="col-span-2 text-center">Price</div>
          <div className="col-span-2 text-center">Stock Status</div>
          <div className="col-span-2 text-center">Actions</div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {wishlistItems.map(product => (
            <div key={product.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 md:p-6 items-center">
              {/* Product */}
              <div className="col-span-1 md:col-span-6 flex items-center">
                <Link to={`/product/${product.id}`} className="shrink-0 w-16 h-16 bg-gray-100 rounded overflow-hidden mr-4">
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </Link>
                <div>
                  <Link to={`/product/${product.id}`} className="font-medium" style={{ color: colors.primary }}>
                    {product.name}
                  </Link>
                  <div className="flex items-center mt-1 text-sm" style={{ color: colors.text }}>
                    <span className="capitalize">{product.category}</span>
                    {product.subcategory && (
                      <>
                        <span className="mx-1">•</span>
                        <span className="capitalize">{product.subcategory}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Price */}
              <div className="md:col-span-2 md:text-center">
                <div className="md:hidden text-sm mb-1" style={{ color: colors.text }}>Price:</div>
                <div>
                  {product.salePrice ? (
                    <>
                      <span style={{ color: '#dc2626', fontWeight: 500 }}>${product.salePrice.toFixed(2)}</span>
                      <span className="ml-2 text-sm line-through" style={{ color: colors.text }}>${product.price.toFixed(2)}</span>
                    </>
                  ) : (
                    <span className="font-medium" style={{ color: colors.text }}>${product.price.toFixed(2)}</span>
                  )}
                </div>
              </div>
              
              {/* Stock Status */}
              <div className="md:col-span-2 md:text-center">
                <div className="md:hidden text-sm mb-1" style={{ color: colors.text }}>Stock Status:</div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                  product.stock > 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              
              {/* Actions */}
              <div className="md:col-span-2 md:text-center flex md:justify-center space-x-2">
                <button
                  onClick={() => handleAddToCart(product.id)}
                  disabled={product.stock <= 0}
                  className={`p-2 rounded-md ${
                    product.stock > 0
                      ? ''
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  } transition-colors`}
                  style={product.stock > 0 ? { background: colors.primary, color: '#fff' } : {}}
                  title="Add to Cart"
                >
                  <ShoppingCart size={16} />
                </button>
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="p-2 rounded-md"
                  style={{ background: colors.accent, color: colors.primary }}
                  title="Remove from Wishlist"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-6">
        <Link 
          to="/"
          className="font-medium"
          style={{ color: colors.primary }}
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default WishlistPage;