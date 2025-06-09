
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  
  const shippingFee = 4.99;
  const tax = getCartTotal() * 0.07; // 7% tax
  const total = getCartTotal() + shippingFee + tax;
  
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="mb-6">
          <ShoppingBag size={64} className="mx-auto text-gray-300" />
        </div>
        <h2 className="text-2xl font-semibold mb-4">Your Cart is Empty</h2>
        <p className="mb-8 text-gray-600">Looks like you haven't added any products to your cart yet.</p>
        <Link 
          to="/"
          className="bg-[var(--brand-primary)] text-white font-medium py-2 px-6 rounded-md transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="hidden md:grid grid-cols-5 gap-4 px-6 py-4 bg-gray-50 font-medium text-gray-700">
              <div className="col-span-2">Product</div>
              <div className="text-center">Price</div>
              <div className="text-center">Quantity</div>
              <div className="text-right">Subtotal</div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {cartItems.map(({ product, quantity }) => (
                <div key={product.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 md:p-6 items-center">
                  {/* Product */}
                  <div className="col-span-1 md:col-span-2 flex items-center">
                    <Link to={`/product/${product.id}`} className="shrink-0 w-20 h-20 bg-gray-100 rounded overflow-hidden mr-4">
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </Link>
                    <div>
                      <Link to={`/product/${product.id}`} className="font-medium hover:text-orange-500">
                        {product.name}
                      </Link>
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="flex items-center text-red-500 text-sm mt-2 hover:text-red-600"
                      >
                        <Trash2 size={16} className="mr-1" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Price */}
                  <div className="md:text-center">
                    <div className="md:hidden text-sm text-gray-500 mb-1">Price:</div>
                    <span className="font-medium">
                      ${(product.salePrice || product.price).toFixed(2)}
                    </span>
                  </div>
                  
                  {/* Quantity */}
                  <div className="md:text-center">
                    <div className="md:hidden text-sm text-gray-500 mb-1">Quantity:</div>
                    <div className="flex items-center md:justify-center">
                      <button 
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        disabled={quantity <= 1}
                        className="text-gray-500 hover:text-gray-700 p-1"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-10 text-center">{quantity}</span>
                      <button 
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        disabled={quantity >= product.stock}
                        className="text-gray-500 hover:text-gray-700 p-1"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Subtotal */}
                  <div className="md:text-right">
                    <div className="md:hidden text-sm text-gray-500 mb-1">Subtotal:</div>
                    <span className="font-medium">
                      ${((product.salePrice || product.price) * quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-6 flex justify-between">
            <Link 
              to="/"
              className="flex items-center text-orange-500 hover:text-orange-600 font-medium"
            >
              <ArrowRight size={16} className="mr-2 rotate-180" />
              Continue Shopping
            </Link>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">${shippingFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 mt-3 border-gray-200">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-md transition-colors mt-6">
              Proceed to Checkout
            </button>
            
            <div className="mt-6">
              <h3 className="font-medium mb-2">Accepted Payment Methods</h3>
              <div className="flex space-x-2">
                <img src="https://via.placeholder.com/40x25/f3f4f6/94a3b8?text=VISA" alt="Visa" className="h-6" />
                <img src="https://via.placeholder.com/40x25/f3f4f6/94a3b8?text=MC" alt="Mastercard" className="h-6" />
                <img src="https://via.placeholder.com/40x25/f3f4f6/94a3b8?text=AMEX" alt="American Express" className="h-6" />
                <img src="https://via.placeholder.com/40x25/f3f4f6/94a3b8?text=PP" alt="PayPal" className="h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
            <h3 className="font-medium mb-3">Have a coupon?</h3>
            <div className="flex">
              <input 
                type="text" 
                placeholder="Enter coupon code" 
                className="flex-grow py-2 px-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
              <button className="bg-gray-800 hover:bg-gray-900 text-white font-medium py-2 px-4 rounded-r-md transition-colors">
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;