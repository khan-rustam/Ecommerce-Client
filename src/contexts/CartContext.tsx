import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Product } from '../types';
import { useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string | number) => void;
  updateQuantity: (productId: string | number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const user = useSelector((state: any) => state.user.user);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from backend or localStorage
  useEffect(() => {
    if (user && user._id) {
      axios.get(`/api/cart?userId=${user._id}`).then(res => setCartItems(res.data.items || []));
    } else {
      const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartItems(localCart);
    }
  }, [user]);

  // Add to cart
  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === product.id);
      let updatedCart;
      if (existingItem) {
        updatedCart = prevItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updatedCart = [...prevItems, { product, quantity }];
      }
      // Sync to backend or localStorage
      if (user && user._id) {
        axios.post('/api/cart', { userId: user._id, items: updatedCart });
      } else {
        localStorage.setItem('cart', JSON.stringify(updatedCart));
      }
      toast.success(
        <span>
          Added to cart! <button onClick={() => window.location.href = '/cart'} className="ml-2 underline text-blue-600">View Cart</button>
        </span>
      );
      return updatedCart;
    });
  };

  // On login, merge local cart to backend
  useEffect(() => {
    if (user && user._id) {
      const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
      if (localCart.length) {
        axios.post('/api/cart/merge', { userId: user._id, items: localCart }).then(() => {
          localStorage.removeItem('cart');
        });
      }
    }
  }, [user]);

  const removeFromCart = (productId: string | number) => {
    setCartItems(prevItems => {
      const updatedCart = prevItems.filter(item => (item.product.id !== productId && item.product._id !== productId));
      if (user && user._id) {
        axios.post('/api/cart', { userId: user._id, items: updatedCart });
      } else {
        localStorage.setItem('cart', JSON.stringify(updatedCart));
      }
      return updatedCart;
    });
  };

  const updateQuantity = (productId: string | number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prevItems => {
      const updatedCart = prevItems.map(item =>
        (item.product.id === productId || item.product._id === productId)
          ? { ...item, quantity }
          : item
      );
      if (user && user._id) {
        axios.post('/api/cart', { userId: user._id, items: updatedCart });
      } else {
        localStorage.setItem('cart', JSON.stringify(updatedCart));
      }
      return updatedCart;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    if (user && user._id) {
      axios.post('/api/cart', { userId: user._id, items: [] });
    } else {
      localStorage.removeItem('cart');
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product.salePrice || item.product.price;
      return total + price * item.quantity;
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};