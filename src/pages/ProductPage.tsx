import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Share2, ShoppingCart, Star, ChevronRight, Minus, Plus } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { products } from '../data/mockData';
import ProductGrid from '../components/product/ProductGrid';

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const productId = parseInt(id || '0');
  
  const product = products.find(p => p.id === productId);
  const relatedProducts = products.filter(p => 
    p.id !== productId && 
    (p.category === product?.category || p.subcategory === product?.subcategory)
  ).slice(0, 4);
  
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  
  // Reset selections when product changes
  useEffect(() => {
    setQuantity(1);
    setSelectedImage(0);
  }, [productId]);
  
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };
  
  const handleAddToWishlist = () => {
    if (product) {
      addToWishlist(product);
    }
  };
  
  const increaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-semibold mb-4">Product Not Found</h2>
        <p className="mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <Link 
          to="/"
          className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-md transition-colors"
        >
          Return to Home
        </Link>
      </div>
    );
  }
  
  const discountPercentage = product.discount || 
    (product.salePrice && product.price 
      ? Math.round(((product.price - product.salePrice) / product.price) * 100) 
      : 0);
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center text-sm">
        <Link to="/" className="text-gray-600 hover:text-orange-500">Home</Link>
        <ChevronRight size={16} className="mx-1 text-gray-400" />
        <Link to={`/category/${product.category}`} className="text-gray-600 hover:text-orange-500 capitalize">
          {product.category}
        </Link>
        {product.subcategory && (
          <>
            <ChevronRight size={16} className="mx-1 text-gray-400" />
            <Link 
              to={`/category/${product.category}/${product.subcategory}`} 
              className="text-gray-600 hover:text-orange-500 capitalize"
            >
              {product.subcategory}
            </Link>
          </>
        )}
        <ChevronRight size={16} className="mx-1 text-gray-400" />
        <span className="text-gray-800 font-medium truncate">{product.name}</span>
      </div>
      
      {/* Product Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Product Images */}
        <div>
          <div className="mb-4 aspect-square overflow-hidden rounded-lg bg-gray-100">
            <img 
              src={product.images[selectedImage]} 
              alt={product.name}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, index) => (
              <button 
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square rounded overflow-hidden border-2 ${
                  selectedImage === index ? 'border-orange-500' : 'border-transparent'
                }`}
              >
                <img 
                  src={image} 
                  alt={`${product.name} - view ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
        
        {/* Product Info */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>
          
          {/* Rating */}
          <div className="flex items-center mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={18} 
                  fill={i < Math.floor(product.rating || 0) ? "currentColor" : "none"}
                  className="text-yellow-400"
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">
              {product.rating} ({Math.floor(Math.random() * 100) + 10} reviews)
            </span>
          </div>
          
          {/* Price */}
          <div className="flex items-center mb-6">
            {product.salePrice ? (
              <>
                <span className="text-2xl font-bold text-red-600">${product.salePrice.toFixed(2)}</span>
                <span className="ml-3 text-lg text-gray-500 line-through">${product.price.toFixed(2)}</span>
                {discountPercentage > 0 && (
                  <span className="ml-3 bg-red-100 text-red-700 px-2 py-0.5 rounded text-sm font-medium">
                    {discountPercentage}% OFF
                  </span>
                )}
              </>
            ) : (
              <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
            )}
          </div>
          
          {/* Stock Status */}
          <div className="mb-6">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              product.stock > 10 
                ? 'bg-green-100 text-green-800' 
                : product.stock > 0 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {product.stock > 10 
                ? 'In Stock' 
                : product.stock > 0 
                ? `Only ${product.stock} left` 
                : 'Out of Stock'}
            </span>
          </div>
          
          {/* Description */}
          <p className="text-gray-600 mb-8">{product.description}</p>
          
          {/* Quantity Selector */}
          <div className="flex items-center mb-6">
            <span className="mr-4 font-medium">Quantity:</span>
            <div className="flex items-center border border-gray-300 rounded-md">
              <button 
                onClick={decreaseQuantity}
                className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                disabled={quantity <= 1}
              >
                <Minus size={16} />
              </button>
              <span className="px-4 py-1 border-x border-gray-300 min-w-[40px] text-center">
                {quantity}
              </span>
              <button 
                onClick={increaseQuantity}
                className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                disabled={product.stock <= quantity}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-md transition-colors flex items-center justify-center"
              disabled={product.stock <= 0}
            >
              <ShoppingCart size={20} className="mr-2" />
              Add to Cart
            </button>
            <button
              onClick={handleAddToWishlist}
              className={`p-3 rounded-md border ${
                isInWishlist(product.id)
                  ? 'border-red-500 text-red-500 hover:bg-red-50'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50'
              } transition-colors`}
            >
              <Heart size={20} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
            </button>
            <button
              className="p-3 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <Share2 size={20} />
            </button>
          </div>
          
          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="mt-8">
              <span className="font-medium mr-2">Tags:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {product.tags.map(tag => (
                  <Link 
                    key={tag} 
                    to={`/tag/${tag}`}
                    className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-sm text-gray-600 transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <ProductGrid
          title="You May Also Like"
          products={relatedProducts}
        />
      )}
    </div>
  );
};

export default ProductPage;