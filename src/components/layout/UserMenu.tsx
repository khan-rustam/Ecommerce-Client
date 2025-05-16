import React, { useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LogOut,
  User,
  ShoppingBag,
  Heart,
  MapPin,
  CreditCard,
  Clock,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../../store/userSlice";

interface UserMenuProps {
  onClose: () => void;
  hideUserInfo?: boolean;
}
const UserMenu: React.FC<UserMenuProps> = ({ onClose, hideUserInfo }) => {
  const user = useSelector((state: { user: { user: any } }) => state.user.user);
  const dispatch = useDispatch();
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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
    navigate("/");
  };

  if (!user) {
    return null;
  }

  return (
    <div
      ref={menuRef}
      className="h-full w-full p-0 overflow-y-auto max-h-screen"
    >
      <div className="py-1">
        {!hideUserInfo && (
          <div className="px-6 py-6 border-b">
            <p className="text-lg font-bold text-gray-900 mb-1">
              {user.username || user.name}
            </p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        )}
        <div className="py-1">
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
            to="/wishlist"
            className="flex items-center px-6 py-3 text-base text-gray-700 hover:bg-gray-100"
            onClick={onClose}
          >
            <Heart className="mr-3 h-5 w-5" />
            Wishlist
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
          <Link
            to="/account/order-history"
            className="flex items-center px-6 py-3 text-base text-gray-700 hover:bg-gray-100"
            onClick={onClose}
          >
            <Clock className="mr-3 h-5 w-5" />
            Order History
          </Link>
        </div>
        <div className="py-1 border-t">
          <button
            onClick={handleSignOut}
            className="flex w-full items-center px-6 py-3 text-base text-red-700 hover:bg-red-50"
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
