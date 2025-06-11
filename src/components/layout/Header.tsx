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
  ChevronDown,
  Apple,
  Plus,
} from "lucide-react";
import UserMenu from "./UserMenu";
import { useSelector } from "react-redux";
import User from "../../assets/user.png";
import { useSettings } from "../../contexts/SettingsContext";
import { useCart } from "../../contexts/CartContext";
import { useWishlist } from "../../contexts/WishlistContext";
import { createPortal } from "react-dom";
import ProductService from "../../utils/ProductService";
import { useUserMenu } from '../../contexts/UserMenuContext';

const Header = () => {
  const [showSearchBar, setShowSearchBar] = useState(false);
  const { userMenuOpen, setUserMenuOpen } = useUserMenu();
  const [showAdminSidebar, setShowAdminSidebar] = useState(false);
  const user = useSelector((state: { user: { user: any } }) => state.user.user);
  const navigate = useNavigate();
  const userMenuRef = React.useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const langMenuRef = React.useRef<HTMLDivElement>(null);

  const { settings } = useSettings();
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();

  const [categories, setCategories] = useState<any[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const categoriesDropdownRef = React.useRef<HTMLDivElement>(null);

  const handleUserDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("User avatar or name clicked");
    if (!user) {
      navigate("/auth/login");
    } else {
      setUserMenuOpen(!userMenuOpen);
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
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    }

    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuOpen]);

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

  React.useEffect(() => {
    setCategoriesLoading(true);
    ProductService.getCategories()
      .then((data) => {
        setCategories(Array.isArray(data) ? data : []);
        setCategoriesError(null);
      })
      .catch((err) => {
        setCategoriesError("Failed to load categories");
        setCategories([]);
      })
      .finally(() => setCategoriesLoading(false));
  }, []);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        categoriesDropdownRef.current &&
        !categoriesDropdownRef.current.contains(event.target as Node)
      ) {
        setShowCategoriesDropdown(false);
      }
    }
    if (showCategoriesDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCategoriesDropdown]);

  return (
    <header
      className="fixed top-0 z-40 w-full bg-gradient-to-b from-[#f8fafc] via-white/95 to-white/80 backdrop-blur border-b border-accent/20 shadow-xl transition-all duration-300 font-sans"
      style={{ fontFamily: "Inter, Poppins, sans-serif" }}
    >
      <div className="w-full max-w-[1600px] mx-auto px-2 md:px-6 py-1 flex items-center justify-between gap-2 min-h-[60px] rounded-b-xl">
        {/* Mobile: Logo, Location, User */}
        <div className="flex w-full items-center justify-between md:hidden">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            {settings.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt="Logo"
                className="object-contain rounded-full bg-white shadow border-accent/30"
                style={{ width: 36, height: 36 }}
              />
            ) : (
              <span className="bg-primary text-white rounded-full w-9 h-9 flex items-center justify-center font-bold text-lg shadow">
                <ShoppingCart size={18} />
              </span>
            )}
          </Link>
          {/* Location Selector */}
          <button className="flex items-center gap-1 px-2 py-1 rounded-lg bg-accent/20 hover:bg-accent/40 text-xs font-medium text-primary transition border border-accent/30 shadow-sm">
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"></path>
              <circle cx="12" cy="9" r="2.5"></circle>
            </svg>
            <span>
              Deliver to <span className="font-semibold">Home</span>
            </span>
          </button>
          {/* User Info */}
          {user ? (
            <div className="flex items-center relative" ref={userMenuRef}>
              <img
                src={user?.avatar || user?.image || User}
                alt="avatar"
                className="w-9 h-9 rounded-full object-cover border-2 border-accent/30 cursor-pointer shadow-md hover:scale-105 transition"
                onClick={handleUserDropdown}
              />
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-background rounded-xl shadow-2xl z-50 overflow-hidden border border-accent/20 animate-fade-in-up">
                  <UserMenu onClose={() => setUserMenuOpen(false)} />
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/auth/login"
              className="flex items-center text-primary hover:text-accent font-semibold rounded-lg transition-colors"
            >
              <UserIcon size={22} />
            </Link>
          )}
        </div>
        {/* Desktop: Full Header */}
        <div className="hidden md:flex w-full items-center justify-between">
          {/* Logo & Location */}
          <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
            <Link
              to="/"
              className="flex items-center flex-shrink-0 mr-1 md:mr-2"
            >
              {settings.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt="Logo"
                  className="object-contain rounded-full bg-white shadow border-accent/30 mr-2"
                  style={{
                    width: settings.logoWidth
                      ? Math.min(settings.logoWidth, 40)
                      : 40,
                    height: settings.logoHeight
                      ? Math.min(settings.logoHeight, 40)
                      : 40,
                  }}
                />
              ) : (
                <span className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-xl shadow">
                  <ShoppingCart size={20} />
                </span>
              )}
            </Link>
            {/* Categories Dropdown */}
            <div className="relative" ref={categoriesDropdownRef}>
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-t-xl bg-primary text-white font-semibold shadow-md hover:bg-accent transition-colors text-base"
                onClick={() => setShowCategoriesDropdown((prev) => !prev)}
                type="button"
                style={{ minWidth: 160 }}
              >
                <Apple size={20} className="mr-1" />
                <span>Categories</span>
                <ChevronDown size={18} />
              </button>
              {showCategoriesDropdown && (
                <div
                  className="absolute left-0 top-full mt-1 w-80 max-h-[70vh] overflow-y-auto bg-white border border-accent/20 rounded-b-xl shadow-2xl z-50 animate-fade-in-up"
                  style={{ paddingTop: 8 }}
                >
                  {/* Pointer/arrow */}
                  <div
                    style={{
                      position: "absolute",
                      top: -8,
                      left: 32,
                      width: 16,
                      height: 8,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        background: "#fff",
                        transform: "rotate(45deg)",
                        boxShadow: "-1px -1px 2px 0 rgba(0,0,0,0.04)",
                        marginLeft: 0,
                      }}
                    ></div>
                  </div>
                  {categoriesLoading ? (
                    <div className="p-6 text-center text-gray-400">
                      Loading...
                    </div>
                  ) : categoriesError ? (
                    <div className="p-6 text-center text-red-500">
                      {categoriesError}
                    </div>
                  ) : categories.length === 0 ? (
                    <div className="p-6 text-center text-gray-400">
                      No categories found
                    </div>
                  ) : (
                    <ul className="divide-y divide-accent/10">
                      {categories.map((cat) => (
                        <li key={cat._id || cat.id}>
                          <Link
                            to={`/category/${cat.slug}`}
                            className="flex items-center px-5 py-3 hover:bg-accent/10 transition-colors group"
                            onClick={() => setShowCategoriesDropdown(false)}
                            style={{ fontWeight: 600, fontSize: "1rem" }}
                          >
                            {/* Icon or image */}
                            {cat.image ? (
                              <img
                                src={cat.image}
                                alt={cat.name}
                                className="w-8 h-8 rounded object-cover border bg-gray-50 mr-3"
                                onError={(e) =>
                                  (e.currentTarget.src =
                                    "https://placehold.co/64x64?text=No+Image")
                                }
                              />
                            ) : (
                              <Apple size={24} className="text-primary mr-3" />
                            )}
                            <span className="flex-1 text-gray-900 font-semibold group-hover:text-accent transition-colors">
                              {cat.name}
                            </span>
                            {/* Show + if subcategories exist */}
                            {cat.subcategories &&
                              cat.subcategories.length > 0 && (
                                <span className="ml-2 bg-gray-100 rounded-full p-1 flex items-center justify-center border border-gray-200">
                                  <Plus size={18} className="text-gray-400" />
                                </span>
                              )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
            {/* Location Selector */}
            <button className="flex items-center gap-1 px-2 py-1 rounded-lg bg-accent/20 hover:bg-accent/40 text-sm font-medium text-primary transition border border-accent/30 shadow-sm">
              <svg
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"></path>
                <circle cx="12" cy="9" r="2.5"></circle>
              </svg>
              <span>
                Deliver to <span className="font-semibold">Home</span>
              </span>
            </button>
          </div>
          {/* Centered Search */}
          <div className="flex-1 flex justify-center items-center mx-1">
            <form onSubmit={handleSearch} className="relative w-full max-w-lg">
              <input
                type="search"
                name="search"
                placeholder="Search for products, brands, categories..."
                className="w-full py-2 px-5 rounded-full border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary text-base transition placeholder-gray-400 shadow-lg bg-white outline-none"
                style={{ minHeight: 44, fontSize: "1.1rem" }}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white rounded-full p-2.5 shadow-lg transition-all duration-200 scale-110 hover:scale-125"
              >
                <Search size={22} />
              </button>
            </form>
          </div>
          {/* Right Side Icons/User */}
          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            <Link
              to="/wishlist"
              className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-white shadow-md hover:bg-accent/10 transition group border border-accent/10 hover:scale-105 active:scale-95"
              title="Wishlist"
            >
              <Heart
                size={22}
                className="text-primary group-hover:text-accent transition"
              />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full px-1.5 py-0.5 shadow font-bold animate-bounce">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
            <Link
              to="/cart"
              className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-white shadow-md hover:bg-accent/10 transition group border border-accent/10 hover:scale-105 active:scale-95"
              title="Cart"
            >
              <ShoppingCart
                size={22}
                className="text-primary group-hover:text-accent transition"
              />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full px-1.5 py-0.5 shadow font-bold animate-bounce">
                  {cartItems.length}
                </span>
              )}
            </Link>
            {user?.isAdmin && (
              <button
                className="w-10 h-10 flex items-center justify-center rounded-full bg-background border border-accent/20 hover:bg-accent/10 transition shadow-sm"
                onClick={() => setShowAdminSidebar(true)}
              >
                <Settings size={20} />
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
                  className="w-10 h-10 rounded-full object-cover border-2 border-accent/30 cursor-pointer shadow-md hover:scale-105 transition"
                  onClick={handleUserDropdown}
                />
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-background rounded-xl shadow-2xl z-[9999] overflow-hidden border border-accent/20 animate-fade-in-up">
                    <UserMenu onClose={() => setUserMenuOpen(false)} />
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/auth/login"
                className="flex items-center gap-2 ml-2 text-primary hover:text-accent font-semibold rounded-xl bg-white shadow-md px-4 py-2 border border-accent/10 transition-colors hover:scale-105 active:scale-95"
              >
                <UserIcon size={24} />
                <span className="hidden md:inline">Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Admin Sidebar Drawer */}
      {showAdminSidebar &&
        user?.isAdmin &&
        createPortal(
          <div className="fixed inset-0 z-[10000]">
            <div
              className="fixed inset-0 bg-black/40 z-[9999]"
              onClick={() => setShowAdminSidebar(false)}
            ></div>
            <div className="fixed right-0 top-0 bg-white w-80 max-w-full h-full shadow-xl animate-slide-in-right flex flex-col z-[10000]">
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
          </div>,
          document.body
        )}
    </header>
  );
};

export default Header;
