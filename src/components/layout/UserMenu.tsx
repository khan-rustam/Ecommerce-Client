import React, { useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LogOut,
  User,
  ShoppingBag,
  Heart,
  MapPin,
  CreditCard,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../../store/userSlice";
import { useCart } from "../../contexts/CartContext";
import { useWishlist } from "../../contexts/WishlistContext";

interface UserMenuProps {
  onClose: () => void;
  hideUserInfo?: boolean;
}

const UserMenu: React.FC<UserMenuProps> = ({ onClose, hideUserInfo }) => {
  const user = useSelector((state: { user: { user: any } }) => state.user.user);
  const dispatch = useDispatch();
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleSignOut = () => {
    dispatch(clearUser());
    onClose();
    // Use a timeout to ensure state updates before navigation
    setTimeout(() => {
      navigate("/", { replace: true });
    }, 100);
  };

  if (!user) {
    return null;
  }

  return (
    <div
      ref={menuRef}
      className="h-full w-full p-0 overflow-y-auto max-h-[90vh] bg-white"
    >
      <div>
        {!hideUserInfo && (
          <div className="px-6 py-6 border-b flex items-center gap-4">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt="avatar"
                className="w-12 h-12 rounded-full object-cover border"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold text-white">
                {user.username ? user.username[0].toUpperCase() : "U"}
              </div>
            )}
            <div>
              <p className="text-lg font-bold text-gray-900 mb-1">
                {user.username || user.name}
              </p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
        )}
        <div className="py-2">
          <Link
            to="/account/profile"
            className="flex items-center px-6 py-3 text-base text-gray-700 hover:bg-gray-100"
            onClick={onClose}
          >
            <User className="mr-3 h-5 w-5" />
            Profile Settings
          </Link>
          <Link
            to="/account/orders"
            className="flex items-center px-6 py-3 text-base text-gray-700 hover:bg-gray-100"
            onClick={onClose}
          >
            <ShoppingBag className="mr-3 h-5 w-5" />
            My Orders
          </Link>
          <Link
            to="/cart"
            className="flex items-center px-6 py-3 text-base text-gray-700 hover:bg-gray-100 relative"
            onClick={onClose}
          >
            <ShoppingBag className="mr-3 h-5 w-5" />
            Cart
            {cartItems.length > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5 absolute right-6 top-2 animate-bounce shadow">
                {cartItems.length}
              </span>
            )}
          </Link>
          <Link
            to="/wishlist"
            className="flex items-center px-6 py-3 text-base text-gray-700 hover:bg-gray-100 relative"
            onClick={onClose}
          >
            <Heart className="mr-3 h-5 w-5" />
            Wishlist
            {wishlistItems.length > 0 && (
              <span className="ml-2 bg-pink-500 text-white text-xs rounded-full px-2 py-0.5 absolute right-6 top-2 animate-bounce shadow">
                {wishlistItems.length}
              </span>
            )}
          </Link>
          <Link
            to="/account/addresses"
            className="flex items-center px-6 py-3 text-base text-gray-700 hover:bg-gray-100"
            onClick={onClose}
          >
            <MapPin className="mr-3 h-5 w-5" />
            Addresses
          </Link>
          <Link
            to="/account/payments"
            className="flex items-center px-6 py-3 text-base text-gray-700 hover:bg-gray-100"
            onClick={onClose}
          >
            <CreditCard className="mr-3 h-5 w-5" />
            Payment Methods
          </Link>
        </div>
        <div className="py-2 border-t">
          <button
            onClick={handleSignOut}
            className="flex w-full items-center px-6 py-3 text-base text-red-600 hover:bg-red-50"
            type="button"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserMenu;
