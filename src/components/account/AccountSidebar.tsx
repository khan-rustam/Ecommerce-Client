import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  User,
  ShoppingBag,
  Heart,
  MapPin,
  CreditCard,
  Clock,
  LogOut,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { clearUser } from "../../store/userSlice";
import { useNavigate } from "react-router-dom";

const AccountSidebar: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Check if the current path matches the link path
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleSignOut = () => {
    dispatch(clearUser());
    // Use a timeout to ensure state updates before navigation
    setTimeout(() => {
      navigate("/", { replace: true });
    }, 100);
  };

  return (
    <div className="w-full bg-white shadow-sm rounded-md">
      <nav className="flex flex-col">
        <Link
          to="/account/profile"
          className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 ${
            isActive("/account/profile") ? "bg-gray-100 font-medium" : ""
          }`}
        >
          <User className="mr-3 h-5 w-5" />
          <span>Profile Settings</span>
        </Link>

        <Link
          to="/account/orders"
          className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 ${
            isActive("/account/orders") ? "bg-gray-100 font-medium" : ""
          }`}
        >
          <ShoppingBag className="mr-3 h-5 w-5" />
          <span>My Orders</span>
        </Link>

        <Link
          to="/wishlist"
          className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 ${
            isActive("/wishlist") ? "bg-gray-100 font-medium" : ""
          }`}
        >
          <Heart className="mr-3 h-5 w-5" />
          <span>Wishlist</span>
        </Link>

        <Link
          to="/account/addresses"
          className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 ${
            isActive("/account/addresses") ? "bg-gray-100 font-medium" : ""
          }`}
        >
          <MapPin className="mr-3 h-5 w-5" />
          <span>Addresses</span>
        </Link>

        <Link
          to="/account/payments"
          className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 ${
            isActive("/account/payments") ? "bg-gray-100 font-medium" : ""
          }`}
        >
          <CreditCard className="mr-3 h-5 w-5" />
          <span>Payment Methods</span>
        </Link>

        <button
          onClick={handleSignOut}
          className="flex items-center px-4 py-3 text-red-600 hover:bg-red-50 mt-2 w-full text-left"
          type="button"
        >
          <LogOut className="mr-3 h-5 w-5" />
          <span>Sign out</span>
        </button>
      </nav>
    </div>
  );
};

export default AccountSidebar;
