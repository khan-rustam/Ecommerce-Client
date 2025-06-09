import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Product, BackendProduct } from '../types';
import { useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';

interface WishlistContextType {
  wishlistItems: (Product | BackendProduct)[];
  addToWishlist: (product: Product | BackendProduct) => void;
  removeFromWishlist: (productId: number | string) => void;
  isInWishlist: (productId: number | string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const user = useSelector((state: any) => state.user.user);
  const [wishlistItems, setWishlistItems] = useState<(Product | BackendProduct)[]>([]);

  // Helper to get product ID (works for both types)
  const getProductId = (product: Product | BackendProduct): string | number => {
    if ('_id' in product) {
      return product._id;
    }
    return product.id;
  };

  // Load wishlist from backend or localStorage
  useEffect(() => {
    if (user && user._id) {
      axios.get(`/api/wishlist?userId=${user._id}`).then(res => setWishlistItems(res.data.items || []));
    } else {
      const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setWishlistItems(localWishlist);
    }
  }, [user]);

  const addToWishlist = (product: Product | BackendProduct) => {
    const productId = getProductId(product);
    if (!isInWishlist(productId)) {
      setWishlistItems(prevItems => {
        const updatedWishlist = [...prevItems, product];
        if (user && user._id) {
          axios.post('/api/wishlist', { userId: user._id, items: updatedWishlist });
        } else {
          localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
        }
        toast.success(
          <span>
            Added to wishlist! <button onClick={() => window.location.href = '/wishlist'} className="ml-2 underline text-pink-600">View Wishlist</button>
          </span>
        );
        return updatedWishlist;
      });
    }
  };

  // On login, merge local wishlist to backend
  useEffect(() => {
    if (user && user._id) {
      const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      if (localWishlist.length) {
        axios.post('/api/wishlist/merge', { userId: user._id, items: localWishlist }).then(() => {
          localStorage.removeItem('wishlist');
        });
      }
    }
  }, [user]);

  const removeFromWishlist = (productId: number | string) => {
    setWishlistItems(prevItems => {
      const updatedWishlist = prevItems.filter(item => {
        const itemId = '_id' in item ? item._id : item.id;
        return itemId !== productId;
      });
      if (user && user._id) {
        axios.post('/api/wishlist', { userId: user._id, items: updatedWishlist });
      } else {
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      }
      return updatedWishlist;
    });
  };

  const isInWishlist = (productId: number | string): boolean => {
    return wishlistItems.some(item => {
      const itemId = '_id' in item ? item._id : item.id;
      return itemId === productId;
    });
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    if (user && user._id) {
      axios.post('/api/wishlist', { userId: user._id, items: [] });
    } else {
      localStorage.removeItem('wishlist');
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};