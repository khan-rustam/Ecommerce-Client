import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Heart,
  ShoppingCart,
  X,
  MessageSquare,
  Settings,
  Maximize2,
  Home,
  User as UserIcon,
  Users,
  FileText,
  Info,
  Briefcase,
  Package,
  Gift,
  ClipboardList,
  PlusCircle,
  Truck,
  CheckSquare,
  XCircle,
  RotateCcw,
  Image,
  Bookmark,
  Rss,
  HelpCircle,
  PhoneCall,
  Star,
} from "lucide-react";
import UserMenu from "./UserMenu";
import { useSelector } from "react-redux";
import { useBrandColors } from "../../contexts/BrandColorContext";
import User from "../../assets/user.png";
import { useSettings } from "../../contexts/SettingsContext";

const Header = () => {
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showAdminSidebar, setShowAdminSidebar] = useState(false);
  const user = useSelector((state: { user: { user: any } }) => state.user.user);
  const navigate = useNavigate();
  const { colors } = useBrandColors();
  const userMenuRef = React.useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const langMenuRef = React.useRef<HTMLDivElement>(null);

  const { settings } = useSettings();

  const handleUserDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("User avatar or name clicked");
    if (!user) {
      navigate("/auth/login");
    } else {
      setShowUserDropdown((prev) => !prev);
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("search") as string;
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setShowSearchBar(false);
    }
  };

  const handleFullscreen = () => {
    if (!isFullscreen) {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if ((elem as any).webkitRequestFullscreen) {
        (elem as any).webkitRequestFullscreen();
      } else if ((elem as any).msRequestFullscreen) {
        (elem as any).msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    }
  };

  const handleLangDropdown = () => setShowLangDropdown((prev) => !prev);

  React.useEffect(() => {
    document.documentElement.style.setProperty(
      "--brand-primary",
      colors.primary
    );
    document.documentElement.style.setProperty(
      "--brand-secondary",
      colors.secondary
    );
  }, [colors]);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserDropdown(false);
      }
    }

    if (showUserDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserDropdown]);

  React.useEffect(() => {
    function onFullscreenChange() {
      setIsFullscreen(
        !!(
          document.fullscreenElement ||
          (document as any).webkitFullscreenElement ||
          (document as any).msFullscreenElement
        )
      );
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsFullscreen(false);
      }
    }
    document.addEventListener("fullscreenchange", onFullscreenChange);
    document.addEventListener("webkitfullscreenchange", onFullscreenChange);
    document.addEventListener("msfullscreenchange", onFullscreenChange);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        onFullscreenChange
      );
      document.removeEventListener("msfullscreenchange", onFullscreenChange);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        langMenuRef.current &&
        !langMenuRef.current.contains(event.target as Node)
      ) {
        setShowLangDropdown(false);
      }
    }
    if (showLangDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showLangDropdown]);

  return (
    <header className="fixed top-0 z-50 bg-background shadow-lg w-full border-b border-accent/30">
      <div className="w-full max-w-[1600px] mx-auto px-2 md:px-8 py-4 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center flex-shrink-0 mr-2 md:mr-6">
          {settings.logoUrl ? (
            <img
              src={settings.logoUrl}
              alt="Logo"
              className="object-contain rounded-full bg-white shadow-md border-2 border-accent/30 mr-2"
              style={{
                width: settings.logoWidth || 56,
                height: settings.logoHeight || 56,
              }}
            />
          ) : (
            <span className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-2xl shadow-md">
              <ShoppingCart />
            </span>
          )}
        </Link>

        {/* Centered Search */}
        <div className="flex-1 flex justify-center items-center mx-2">
          <form onSubmit={handleSearch} className="relative w-full max-w-xl">
            <input
              type="search"
              name="search"
              placeholder="Search for products, brands, categories..."
              className="w-full py-3 px-5 pr-12 border border-accent/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-background text-lg shadow-sm"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-accent hover:text-primary transition-colors"
            >
              <Search size={24} />
            </button>
          </form>
        </div>

        {/* Right Side Icons/User */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <Link
            to="/blogs"
            className="hidden md:flex items-center gap-1 px-4 py-2 text-primary hover:text-accent font-semibold rounded-lg transition-colors"
          >
            <Rss size={20} />
            <span>Blogs</span>
          </Link>

          <button
            className="hidden md:flex w-12 h-12 items-center justify-center rounded-full bg-background border border-accent/20 hover:bg-accent/10 transition shadow-sm"
            onClick={handleFullscreen}
            aria-label="Toggle Fullscreen"
          >
            <Maximize2 size={22} />
          </button>
          {user?.isAdmin && (
            <button
              className="w-12 h-12 flex items-center justify-center rounded-full bg-background border border-accent/20 hover:bg-accent/10 transition shadow-sm"
              onClick={() => setShowAdminSidebar(true)}
            >
              <Settings size={22} />
            </button>
          )}
          {/* User Info */}
          {user ? (
            <div
              className="flex items-center gap-2 ml-2 relative"
              ref={userMenuRef}
            >
              <img
                src={user?.avatar || user?.image || User}
                alt="avatar"
                className="w-12 h-12 rounded-full object-cover border-2 border-accent/30 cursor-pointer shadow-md"
                onClick={handleUserDropdown}
              />
              {showUserDropdown && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-background rounded-xl shadow-2xl z-50 overflow-hidden border border-accent/20 animate-fade-in-up">
                  <UserMenu onClose={() => setShowUserDropdown(false)} />
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/auth/login"
              className="flex items-center gap-2 ml-2 text-primary hover:text-accent font-semibold rounded-lg transition-colors"
            >
              <UserIcon size={26} />
              <span className="hidden md:inline">Login</span>
            </Link>
          )}
        </div>
      </div>

      {/* Admin Sidebar Drawer */}
      {showAdminSidebar && user?.isAdmin && (
        <div className="fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setShowAdminSidebar(false)}
          ></div>
          <div className="fixed right-0 top-0 bg-white w-80 max-w-full h-full shadow-xl animate-slide-in-right flex flex-col">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-[var(--brand-primary,#2563eb)]"
              onClick={() => setShowAdminSidebar(false)}
            >
              <X size={28} />
            </button>
            <div className="p-8 overflow-y-auto flex-1">
              <div className="text-lg font-bold mb-4 text-gray-700">
                Admin Dashboard
              </div>
              <div className="flex flex-col">
                <Link
                  to="/admin"
                  className="flex items-center gap-3 text-gray-700 font-small hover:text-[var(--brand-primary,#2563eb)] py-2"
                  onClick={() => setShowAdminSidebar(false)}
                >
                  <Home size={18} /> Home
                </Link>
                <Link
                  to="/admin/users"
                  className="flex items-center gap-3 text-gray-700 font-small hover:text-[var(--brand-primary,#2563eb)] py-2"
                  onClick={() => setShowAdminSidebar(false)}
                >
                  <UserIcon size={18} /> Users
                </Link>
                <Link
                  to="/admin/interested-clients"
                  className="flex items-center gap-3 text-gray-700 font-small hover:text-[var(--brand-primary,#2563eb)] py-2"
                  onClick={() => setShowAdminSidebar(false)}
                >
                  <Users size={18} /> Interested Clients
                </Link>
                <Link
                  to="/admin/reports"
                  className="flex items-center gap-3 text-gray-700 font-small hover:text-[var(--brand-primary,#2563eb)] py-2"
                  onClick={() => setShowAdminSidebar(false)}
                >
                  <FileText size={18} /> Reports
                </Link>
                <Link
                  to="/admin/notice"
                  className="flex items-center gap-3 text-gray-700 font-small hover:text-[var(--brand-primary,#2563eb)] py-2"
                  onClick={() => setShowAdminSidebar(false)}
                >
                  <Info size={18} /> Notice
                </Link>
                <div className="text-sm text-gray-700 mt-4 mb-2 capitalize font-bold border-t border-gray-200 pt-4">
                  PRODUCTS
                </div>
                <Link
                  to="/admin/warehouses"
                  className="flex items-center gap-3 text-gray-700 font-small hover:text-[var(--brand-primary,#2563eb)] py-2"
                  onClick={() => setShowAdminSidebar(false)}
                >
                  <Briefcase size={18} /> Warehouses
                </Link>
                <Link
                  to="/admin/brands"
                  className="flex items-center gap-3 text-gray-700 font-small hover:text-[var(--brand-primary,#2563eb)] py-2"
                  onClick={() => setShowAdminSidebar(false)}
                >
                  <Briefcase size={18} /> Brands
                </Link>
                <Link
                  to="/admin/categories"
                  className="flex items-center gap-3 text-gray-700 font-small hover:text-[var(--brand-primary,#2563eb)] py-2"
                  onClick={() => setShowAdminSidebar(false)}
                >
                  <Package size={18} /> Categories
                </Link>
                <Link
                  to="/admin/products"
                  className="flex items-center gap-3 text-gray-700 font-small hover:text-[var(--brand-primary,#2563eb)] py-2"
                  onClick={() => setShowAdminSidebar(false)}
                >
                  <Package size={18} /> Products
                </Link>
                <Link
                  to="/admin/coupons"
                  className="flex items-center gap-3 text-gray-700 font-small hover:text-[var(--brand-primary,#2563eb)] py-2"
                  onClick={() => setShowAdminSidebar(false)}
                >
                  <Gift size={18} /> Promocodes
                </Link>
                <div className="text-sm text-gray-700 mt-4 mb-2 capitalize font-bold border-t border-gray-200 pt-4">
                  ORDERS
                </div>
                <Link
                  to="/admin/all-orders"
                  className="flex items-center gap-3 text-gray-700 font-small hover:text-[var(--brand-primary,#2563eb)] py-2"
                  onClick={() => setShowAdminSidebar(false)}
                >
                  <ClipboardList size={18} /> All Orders
                </Link>
                <Link
                  to="/admin/new-orders"
                  className="flex items-center gap-3 text-gray-700 font-small hover:text-[var(--brand-primary,#2563eb)] py-2"
                  onClick={() => setShowAdminSidebar(false)}
                >
                  <PlusCircle size={18} /> New Orders{" "}
                  <span className="ml-2 bg-gray-300 text-xs rounded-full px-2 py-0.5">
                    6
                  </span>
                </Link>
                <Link
                  to="/admin/shipped-orders"
                  className="flex items-center gap-3 text-gray-700 font-small hover:text-[var(--brand-primary,#2563eb)] py-2"
                  onClick={() => setShowAdminSidebar(false)}
                >
                  <Truck size={18} /> Shipped Orders
                </Link>
                <Link
                  to="/admin/delivered-orders"
                  className="flex items-center gap-3 text-gray-700 font-small hover:text-[var(--brand-primary,#2563eb)] py-2"
                  onClick={() => setShowAdminSidebar(false)}
                >
                  <CheckSquare size={18} /> Delivered Orders
                </Link>
                <Link
                  to="/admin/cancelled-orders"
                  className="flex items-center gap-3 text-gray-700 font-small hover:text-[var(--brand-primary,#2563eb)] py-2"
                  onClick={() => setShowAdminSidebar(false)}
                >
                  <XCircle size={18} /> Cancelled Orders
                </Link>
                <Link
                  to="/admin/refunded-orders"
                  className="flex items-center gap-3 text-gray-700 font-small hover:text-[var(--brand-primary,#2563eb)] py-2"
                  onClick={() => setShowAdminSidebar(false)}
                >
                  <RotateCcw size={18} /> Refunded Orders
                </Link>
                <div className="text-sm text-gray-700 mt-4 mb-2 capitalize font-bold border-t border-gray-200 pt-4">
                  OTHER
                </div>
                <Link
                  to="/admin/banners"
                  className="flex items-center gap-3 text-gray-700 font-small hover:text-[var(--brand-primary,#2563eb)] py-2"
                  onClick={() => setShowAdminSidebar(false)}
                >
                  <Image size={18} /> Banners
                </Link>
                <Link
                  to="/admin/smart-banners"
                  className="flex items-center gap-3 text-gray-700 font-small hover:text-[var(--brand-primary,#2563eb)] py-2"
                  onClick={() => setShowAdminSidebar(false)}
                >
                  <Bookmark size={18} /> Smart Banners
                </Link>
                <Link
                  to="/admin/blogs"
                  className="flex items-center gap-3 text-gray-700 font-small hover:text-[var(--brand-primary,#2563eb)] py-2"
                  onClick={() => setShowAdminSidebar(false)}
                >
                  <Rss size={18} /> Blogs
                </Link>
                <Link
                  to="/admin/questions"
                  className="flex items-center gap-3 text-gray-700 font-small hover:text-[var(--brand-primary,#2563eb)] py-2"
                  onClick={() => setShowAdminSidebar(false)}
                >
                  <HelpCircle size={18} /> Questions
                </Link>
                <Link
                  to="/admin/queries"
                  className="flex items-center gap-3 text-gray-700 font-small hover:text-[var(--brand-primary,#2563eb)] py-2"
                  onClick={() => setShowAdminSidebar(false)}
                >
                  <MessageSquare size={18} /> ENQUIRY
                </Link>
                <Link
                  to="#"
                  className="flex items-center gap-3 text-gray-700 font-small hover:text-[var(--brand-primary,#2563eb)] py-2"
                  onClick={() => setShowAdminSidebar(false)}
                >
                  <PhoneCall size={18} /> Callback Requests
                </Link>
                <Link
                  to="#"
                  className="flex items-center gap-3 text-gray-700 font-small hover:text-[var(--brand-primary,#2563eb)] py-2"
                  onClick={() => setShowAdminSidebar(false)}
                >
                  <Heart size={18} /> Subscriptions
                </Link>
                <Link
                  to="/admin/reviews"
                  className="flex items-center gap-3 text-gray-700 font-small hover:text-[var(--brand-primary,#2563eb)] py-2"
                  onClick={() => setShowAdminSidebar(false)}
                >
                  <Star size={18} /> Rating & Reviews
                </Link>
                <Link
                  to="/admin/settings"
                  className="flex items-center gap-3 text-gray-700 font-small hover:text-[var(--brand-primary,#2563eb)] py-2"
                  onClick={() => setShowAdminSidebar(false)}
                >
                  <Settings size={18} /> Website Settings
                </Link>
              </div>
            </div>
          </div>
          <style>{`
            @keyframes slide-in-right {
              0% { transform: translateX(100%); }
              100% { transform: translateX(0); }
            }
            .animate-slide-in-right {
              animation: slide-in-right 0.4s cubic-bezier(0.23, 1, 0.32, 1) both;
            }
          `}</style>
        </div>
      )}
    </header>
  );
};

export default Header;
