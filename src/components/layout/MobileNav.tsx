import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, User, ShoppingCart, Rss } from 'lucide-react';
import { useSelector } from 'react-redux';

const MobileNav: React.FC = () => {
  const location = useLocation();
  const user = useSelector((state: any) => state.user.user);
  const cartItems = useSelector((state: any) => state.cart?.items) || [];
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="md:hidden fixed bottom-3 left-1/2 -translate-x-1/2 bg-background border border-accent/20 rounded-2xl shadow-2xl z-40 w-[98vw] max-w-xl mx-auto">
      <div className="flex justify-around items-center py-3">
        <Link 
          to="/" 
          className={`flex flex-col items-center p-2 ${isActive('/') 
            ? 'text-primary font-bold' 
            : 'text-gray-400 hover:text-accent'}`}
        >
          <Home size={24} />
          <span className="text-xs mt-1">Home</span>
        </Link>
        
        <Link 
          to="/search" 
          className={`flex flex-col items-center p-2 ${isActive('/search') 
            ? 'text-primary font-bold' 
            : 'text-gray-400 hover:text-accent'}`}
        >
          <Search size={24} />
          <span className="text-xs mt-1">Search</span>
        </Link>
        
        <Link 
          to="/blogs" 
          className={`flex flex-col items-center p-2 ${isActive('/blogs') || location.pathname.startsWith('/blog/') 
            ? 'text-primary font-bold' 
            : 'text-gray-400 hover:text-accent'}`}
        >
          <Rss size={24} />
          <span className="text-xs mt-1">Blogs</span>
        </Link>
        
        <Link 
          to="/cart" 
          className={`flex flex-col items-center p-2 relative ${isActive('/cart') 
            ? 'text-primary font-bold' 
            : 'text-gray-400 hover:text-accent'}`}
        >
          <ShoppingCart size={24} />
          {cartItems.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
              {cartItems.length}
            </span>
          )}
          <span className="text-xs mt-1">Cart</span>
        </Link>
        
        <Link 
          to={user ? "/account/profile" : "/auth/login"} 
          className={`flex flex-col items-center p-2 ${
            isActive('/account/profile') || isActive('/auth/login') 
              ? 'text-primary font-bold' 
              : 'text-gray-400 hover:text-accent'}`}
        >
          <User size={24} />
          <span className="text-xs mt-1">{user ? 'Account' : 'Login'}</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileNav; 