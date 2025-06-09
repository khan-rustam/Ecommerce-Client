import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import MobileNav from "./components/layout/MobileNav";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import CategoryPage from "./pages/CategoryPage";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import SearchPage from "./pages/SearchPage";
import LoginPage from "./pages/auth/LoginPage";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import FAQPage from "./pages/FAQPage";
import ReturnPolicyPage from "./pages/ReturnPolicyPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import RegisterPage from "./pages/auth/RegisterPage";
import ScrollToTop from "./components/common/ScrollToTop";
import ProfilePage from "./pages/account/ProfilePage";
import OrdersPage from "./pages/account/OrdersPage";
import AddressesPage from "./pages/account/AddressesPage";
import PaymentsPage from "./pages/account/PaymentsPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
// @ts-ignore
import AdminProducts from "./pages/admin/products/AdminProducts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminBlogs from "./pages/admin/AdminBlogs";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminCoupons from "./pages/admin/AdminCoupons";
import AdminAddresses from "./pages/admin/AdminAddresses";
import AdminSettings from "./pages/admin/AdminBrandSettings";
import AdminReviews from "./pages/admin/AdminReviews";
import {
  BrandColorProvider,
  useBrandColors,
} from "./contexts/BrandColorContext";
import InterestedClients from "./pages/admin/InterestedClients";
import AdminReports from "./pages/admin/AdminReports";
import AdminNotice from "./pages/admin/AdminNotice";
import AdminBrands from "./pages/admin/AdminBrands";
import AdminNewOrders from "./pages/admin/AdminNewOrders";
import AdminCancelledOrders from "./pages/admin/AdminCancelledOrders";
import AdminRefundedOrders from "./pages/admin/AdminRefundedOrders";
import AdminShippedOrders from "./pages/admin/AdminShippedOrders";
import AdminDeliveredOrders from "./pages/admin/AdminDeliveredOrders";
import AdminBanners from "./pages/admin/AdminBanners";
import AdminSmartBanners from "./pages/admin/AdminSmartBanners";
import SmartBannerPopup from "./components/common/SmartBannerPopup";
import BlogsPage from "./pages/BlogsPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import CreateBlog from "./pages/admin/blogs/CreateBlog";
import EditBlog from "./pages/admin/blogs/EditBlog";
// @ts-ignore
import CreateProduct from "./pages/admin/products/CreateProduct";
// @ts-ignore
import EditProduct from "./pages/admin/products/EditProduct";
// Import AdminQuestionsPage
import AdminQuestionsPage from "./pages/admin/questions/AdminQuestionsPage";
import AdminEnquiry from "./pages/admin/AdminEnquiryPage";
import AdminWarehouses from "./pages/admin/AdminWarehouses";
function App() {
  const { colors } = useBrandColors();
  return (
    <Router>
      <style>{`
        :root {
          --brand-primary: ${colors.primary};
          --brand-primary-hover: ${colors.primary};
          --brand-accent: ${colors.accent};
        }
      `}</style>
      <ScrollToTop />
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <BrandColorProvider>
              <ToastProvider>
                <div className="flex flex-col min-h-screen">
                  <Header />
                  <main className="flex-grow pt-16">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/product/:id" element={<ProductPage />} />
                      <Route
                        path="/category/:category"
                        element={<CategoryPage />}
                      />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/wishlist" element={<WishlistPage />} />
                      <Route path="/search" element={<SearchPage />} />
                      <Route path="/auth/login" element={<LoginPage />} />
                      <Route path="/auth/register" element={<RegisterPage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/faq" element={<FAQPage />} />
                      <Route
                        path="/return-policy"
                        element={<ReturnPolicyPage />}
                      />
                      <Route
                        path="/privacy-policy"
                        element={<PrivacyPolicyPage />}
                      />
                      <Route
                        path="/account/profile"
                        element={<ProfilePage />}
                      />
                      <Route path="/account/orders" element={<OrdersPage />} />
                      <Route
                        path="/account/addresses"
                        element={<AddressesPage />}
                      />
                      <Route
                        path="/account/payments"
                        element={<PaymentsPage />}
                      />

                      {/* Blog Routes */}
                      <Route path="/blogs" element={<BlogsPage />} />
                      <Route path="/blog/:slug" element={<BlogDetailPage />} />

                      {/* Admin Routes */}
                      <Route path="/admin" element={<AdminDashboard />} />
                      <Route
                        path="/admin/products"
                        element={<AdminProducts />}
                      />
                      <Route
                        path="/admin/products/create"
                        element={<CreateProduct />}
                      />
                      <Route
                        path="/admin/products/edit/:id"
                        element={<EditProduct />}
                      />
                      <Route
                        path="/admin/all-orders"
                        element={<AdminOrders />}
                      />
                      <Route
                        path="/admin/new-orders"
                        element={<AdminNewOrders />}
                      />
                      <Route
                        path="/admin/shipped-orders"
                        element={<AdminShippedOrders />}
                      />
                      <Route
                        path="/admin/delivered-orders"
                        element={<AdminDeliveredOrders />}
                      />
                      <Route
                        path="/admin/cancelled-orders"
                        element={<AdminCancelledOrders />}
                      />
                      <Route
                        path="/admin/refunded-orders"
                        element={<AdminRefundedOrders />}
                      />
                      <Route
                        path="/admin/payments"
                        element={<AdminPayments />}
                      />
                      <Route path="/admin/coupons" element={<AdminCoupons />} />
                      <Route path="/admin/blogs" element={<AdminBlogs />} />
                      <Route
                        path="/admin/blogs/create"
                        element={<CreateBlog />}
                      />
                      <Route
                        path="/admin/blogs/edit/:id"
                        element={<EditBlog />}
                      />
                      <Route path="/admin/users" element={<AdminUsers />} />
                      <Route
                        path="/admin/interested-clients"
                        element={<InterestedClients />}
                      />
                      <Route path="/admin/reports" element={<AdminReports />} />
                      <Route path="/admin/notice" element={<AdminNotice />} />
                      <Route path="/admin/brands" element={<AdminBrands />} />
                      <Route path="/admin/banners" element={<AdminBanners />} />
                      <Route path="/admin/queries" element={<AdminEnquiry />} />
                      <Route path="/admin/warehouses" element={<AdminWarehouses />} />
                      <Route
                        path="/admin/categories"
                        element={<AdminCategories />}
                      />
                      <Route
                        path="/admin/addresses"
                        element={<AdminAddresses />}
                      />
                      <Route
                        path="/admin/settings"
                        element={<AdminSettings />}
                      />
                      <Route path="/admin/reviews" element={<AdminReviews />} />
                      <Route
                        path="/admin/smart-banners"
                        element={<AdminSmartBanners />}
                      />
                      {/* Admin Questions Route */}
                      <Route
                        path="/admin/questions"
                        element={<AdminQuestionsPage />}
                      />
                    </Routes>
                  </main>
                  <Footer />
                  <MobileNav />
                </div>
                <SmartBannerPopup />
                <Toaster position="top-right" />
              </ToastProvider>
            </BrandColorProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
