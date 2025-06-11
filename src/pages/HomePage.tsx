import { useState, useEffect } from "react";
import HeroSection from "../components/home/HeroSection";
import CategoryShowcase from "../components/home/CategoryShowcase";
import ProductGrid from "../components/product/ProductGrid";
import { useSettings } from "../contexts/SettingsContext";
import { BackendProduct, Review } from "../types";
import ProductService from "../utils/ProductService.ts";
import { get } from "../utils/authFetch";
import { Star, Phone } from "lucide-react";
import "./HomePage.css";
import React from "react";
import axios from "axios";

console.log("axiosInstance");

const HomePage = () => {
  const { settings } = useSettings();
  const [featuredProducts, setFeaturedProducts] = useState<BackendProduct[]>(
    []
  );
  const [trendingProducts, setTrendingProducts] = useState<BackendProduct[]>(
    []
  );
  const [newArrivals, setNewArrivals] = useState<BackendProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [customerStories, setCustomerStories] = useState<Review[]>([]);
  const [storiesLoading, setStoriesLoading] = useState(true);
  const [callbackModalOpen, setCallbackModalOpen] = useState(false);
  const [callbackForm, setCallbackForm] = useState({
    name: "",
    email: "",
    phone: "",
    timing: "Anytime",
    message: "",
    recaptcha: false,
  });
  const [products, setProducts] = useState([]);
  const [warehouse, setWarehouse] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [manualPin, setManualPin] = useState("");
  const [manualLoading, setManualLoading] = useState(false);

  // Fetch products and customer stories from backend
  useEffect(() => {
    const fetchProductsAndStories = async () => {
      try {
        setLoading(true);
        setStoriesLoading(true);

        // Fetch featured products
        const featuredResponse = await ProductService.getProducts({
          isFeatured: true,
          limit: 8,
        });
        setFeaturedProducts(featuredResponse.products || []);

        // Fetch trending products
        const trendingResponse = await ProductService.getProducts({
          isTrending: true,
          limit: 8,
        });
        setTrendingProducts(trendingResponse.products || []);

        // Fetch new arrivals (sorted by creation date)
        const newArrivalsResponse = await ProductService.getProducts({
          sort: "newest",
          limit: 8,
        });
        setNewArrivals(newArrivalsResponse.products || []);

        // Fetch customer stories (approved and marked for custom store)
        const storiesResponseData = await get("/reviews/customer-stories");
        // Check if storiesResponseData is an array before setting state
        if (Array.isArray(storiesResponseData)) {
          setCustomerStories(storiesResponseData);
        } else {
          console.error(
            "API response for customer stories is not an array:",
            storiesResponseData
          );
          setCustomerStories([]); // Ensure it's always an array
        }
      } catch (error) {
        console.error("Error fetching home page products:", error);
        // Set empty arrays if API fails
        setFeaturedProducts([]);
        setTrendingProducts([]);
        setNewArrivals([]);
        setCustomerStories([]);
      } finally {
        setLoading(false);
        setStoriesLoading(false);
      }
    };

    fetchProductsAndStories();
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await axios.get(
            `/api/products/nearby?lat=${latitude}&lng=${longitude}`
          );
          setProducts(res.data.products);
          setWarehouse(res.data.warehouse);
        } catch (err) {
          setLocationError(
            "No warehouse found nearby or failed to fetch products."
          );
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setLocationError(
          "Location access denied. Please enable location or set manually."
        );
        setLoading(false);
      }
    );
  }, []);

  const handlePinSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (!manualPin) return;
    setManualLoading(true);
    setLocationError("");
    try {
      // Call backend to get coordinates for pin code
      const res = await axios.get(`/api/pincode/${manualPin}`);
      const { lat, lng } = res.data;
      const prodRes = await axios.get(
        `/api/products/nearby?lat=${lat}&lng=${lng}`
      );
      setProducts(prodRes.data.products);
      setWarehouse(prodRes.data.warehouse);
      setLocationError("");
    } catch (err) {
      setLocationError("Could not find products for this pin code.");
    } finally {
      setManualLoading(false);
    }
  };

  const handleNavigate = (path: string) => () => {
    setCallbackModalOpen(false);
    setTimeout(() => navigate(path), 50);
  };

  return (
    <div style={{ background: "#E6E5E8", color: "#2E5767" }}>
      <HeroSection
        title={settings.heroTitle || "ECHOES OF TRADITION"}
        subtitle={
          settings.heroSubtitle ||
          "Bringing India's rich musical legacy to life through handcrafted instruments—one soulful note at a time."
        }
        buttonText="Explore Collection"
        buttonLink="/category/music"
        backgroundImage={
          settings.heroBannerUrl ||
          "https://plus.unsplash.com/premium_photo-1681488262364-8aeb1b6aac56?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        }
        titleFontSize={settings.heroTitleFontSize}
        titleFontWeight={settings.heroTitleFontWeight}
        subtitleFontSize={settings.heroSubtitleFontSize}
        subtitleFontWeight={settings.heroSubtitleFontWeight}
      />

      {/* Promo Banner */}
      <div
        className="w-full text-center py-4 font-bold text-lg shadow-lg mb-8 animate-fade-in"
        style={{
          background: "linear-gradient(90deg, #2E5767 0%, #746A9F 100%)",
          color: "#E6E5E8",
        }}
      >
        🚚 Free shipping on orders over $50! &nbsp; | &nbsp; 🎁 10% off your
        first order:{" "}
        <span style={{ color: "#747474", textDecoration: "underline" }}>
          WELCOME10
        </span>
      </div>

      <div className="container mx-auto px-4">
        {/* Featured Products Section */}
        <ProductGrid
          title="Featured Products"
          products={featuredProducts}
          loading={loading}
          emptyMessage="No featured products available"
        />

        {/* New Arrivals Section */}
        <ProductGrid
          title="New Arrivals"
          products={newArrivals}
          loading={loading}
          emptyMessage="No new arrivals available"
        />

        {/* Popular Categories Section - Using CategoryShowcase's internal fetch */}
        <CategoryShowcase
          title="Popular Categories"
          useBackendData={true}
        />

        {/* Trending Now Section */}
        <ProductGrid
          title="Trending Now"
          products={trendingProducts}
          loading={loading}
          emptyMessage="No trending products available"
        />

        {/* Testimonials Section */}
        <section
          className="py-20 px-4 font-sans animate-fade-in"
          style={{ background: "#E6E5E8" }}
        >
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <h2
                className="text-4xl md:text-5xl font-extrabold mb-2"
                style={{ color: "#2E5767" }}
              >
                What Our Customers Say
              </h2>
              <span
                className="block mx-auto w-24 h-1 rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, #746A9F 0%, #2E5767 100%)",
                }}
              ></span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {customerStories.slice(0, 6).map((story, idx) => (
                <div
                  key={story._id || idx}
                  className="rounded-3xl shadow-xl p-8 flex flex-col items-center text-center hover:scale-105 transition-all duration-300"
                  style={{
                    background:
                      "linear-gradient(135deg, #E6E5E8 60%, #746A9F10 100%)",
                    border: `2px solid #2E5767`,
                  }}
                >
                  <img
                    src={`https://i.pravatar.cc/100?img=${idx + 3}`}
                    alt="avatar"
                    className="w-16 h-16 rounded-full mb-4 shadow-lg border-4"
                    style={{ borderColor: "#E6E5E8" }}
                  />
                  <p
                    className="text-lg italic mb-4"
                    style={{ color: "#2E5767" }}
                  >
                    “{story.comment}”
                  </p>
                  <div className="flex items-center justify-center mb-2">
                    {[...Array(story.rating)].map((_, i) => (
                      <span
                        key={i}
                        style={{ color: "#746A9F", fontSize: "1.25rem" }}
                      >
                        ★
                      </span>
                    ))}
                    {[...Array(5 - story.rating)].map((_, i) => (
                      <span
                        key={i}
                        style={{ color: "#E6E5E8", fontSize: "1.25rem" }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <div className="font-bold" style={{ color: "#2E5767" }}>
                    {story.userName || "Customer"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Signup Section */}
        <section
          className="py-16 px-4 rounded-3xl shadow-2xl my-16 font-sans animate-fade-in"
          style={{
            background: "linear-gradient(90deg, #746A9F 0%, #2E5767 100%)",
          }}
        >
          <div className="container mx-auto max-w-3xl text-center">
            <h2
              className="text-3xl md:text-4xl font-extrabold mb-4"
              style={{ color: "#E6E5E8" }}
            >
              Stay in the Loop!
            </h2>
            <p className="mb-8 text-lg" style={{ color: "#E6E5E8" }}>
              Subscribe to our newsletter for exclusive offers, new arrivals,
              and more.
            </p>
            <form className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full sm:w-auto flex-1 px-6 py-3 rounded-full border-none outline-none text-lg shadow-lg"
                style={{ background: "#E6E5E8", color: "#2E5767" }}
                required
              />
              <button
                type="submit"
                className="px-8 py-3 rounded-full font-bold text-lg shadow-lg transition-all duration-300"
                style={{
                  background:
                    "linear-gradient(90deg, #2E5767 0%, #746A9F 100%)",
                  color: "#E6E5E8",
                }}
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </div>

      {/* Modern Footer */}
      <footer
        className="w-full py-12 mt-16 font-sans animate-fade-in"
        style={{
          background: "linear-gradient(90deg, #2E5767 0%, #746A9F 100%)",
          color: "#E6E5E8",
        }}
      >
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <h3 className="font-extrabold text-2xl mb-4">EkoMart</h3>
            <p className="mb-4" style={{ color: "#E6E5E8" }}>
              Your one-stop shop for authentic, handcrafted products and more.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="#" className="hover:opacity-80 transition">
                <svg width="24" height="24" fill="#746A9F">
                  <path d="M22.46 6c-.77.35-1.6.58-2.47.69a4.3 4.3 0 0 0 1.88-2.37 8.59 8.59 0 0 1-2.72 1.04A4.28 4.28 0 0 0 16.11 4c-2.37 0-4.29 1.92-4.29 4.29 0 .34.04.67.11.99C7.69 9.13 4.07 7.38 1.64 4.7c-.37.64-.58 1.38-.58 2.17 0 1.5.76 2.82 1.92 3.6-.7-.02-1.36-.21-1.94-.53v.05c0 2.1 1.5 3.85 3.5 4.25-.36.1-.74.16-1.13.16-.28 0-.54-.03-.8-.08.54 1.7 2.1 2.94 3.95 2.97A8.6 8.6 0 0 1 2 19.54c-.28 0-.56-.02-.83-.05A12.13 12.13 0 0 0 8.29 21.5c7.55 0 11.68-6.26 11.68-11.68 0-.18-.01-.36-.02-.54A8.18 8.18 0 0 0 24 4.59a8.36 8.36 0 0 1-2.54.7z" />
                </svg>
              </a>
              <a href="#" className="hover:opacity-80 transition">
                <svg width="24" height="24" fill="#746A9F">
                  <path d="M12 2.04c-5.5 0-9.96 4.46-9.96 9.96 0 4.41 3.6 8.06 8.24 8.93.6.11.82-.26.82-.58v-2.02c-3.34.73-4.04-1.61-4.04-1.61-.54-1.37-1.32-1.74-1.32-1.08-.74.08-.73.08-.73 1.2.08 1.83 1.23 1.83 1.23 1.06 1.82 2.78 1.3 3.46.99.11-.77.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.97 0-1.32.47-2.39 1.23-3.23-.12-.3-.53-1.52.12-3.17 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0C17 5.09 18 5.41 18 5.41c.65 1.65.24 2.87.12 3.17.77.84 1.23 1.91 1.23 3.23 0 4.64-2.8 5.67-5.47 5.97.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A10 10 0 0 0 22 12c0-5.5-4.46-9.96-9.96-9.96z" />
                </svg>
              </a>
              <a href="#" className="hover:opacity-80 transition">
                <svg width="24" height="24" fill="#746A9F">
                  <path d="M21.54 7.2c-.13-.47-.52-.8-.99-.8h-2.13c-.47 0-.86.33-.99.8l-1.7 6.13-1.7-6.13c-.13-.47-.52-.8-.99-.8H5.45c-.47 0-.86.33-.99.8L2.01 19.2c-.13.47.09.8.56.8h2.13c.47 0 .86-.33.99-.8l1.7-6.13 1.7 6.13c.13.47.52.8.99.8h2.13c.47 0 .86-.33.99-.8l1.7-6.13 1.7 6.13c.13.47.52.8.99.8h2.13c.47 0 .69-.33.56-.8L21.54 7.2z" />
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-3">Shop</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/shop"
                  className="hover:underline"
                  style={{ color: "#E6E5E8" }}
                >
                  All Products
                </a>
              </li>
              <li>
                <a
                  href="/category/music"
                  className="hover:underline"
                  style={{ color: "#E6E5E8" }}
                >
                  Musical Instruments
                </a>
              </li>
              <li>
                <a
                  href="/category/crafts"
                  className="hover:underline"
                  style={{ color: "#E6E5E8" }}
                >
                  Crafts
                </a>
              </li>
              <li>
                <a
                  href="/category/fashion"
                  className="hover:underline"
                  style={{ color: "#E6E5E8" }}
                >
                  Fashion
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-3">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/contact"
                  className="hover:underline"
                  style={{ color: "#E6E5E8" }}
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="/faq"
                  className="hover:underline"
                  style={{ color: "#E6E5E8" }}
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="/return-policy"
                  className="hover:underline"
                  style={{ color: "#E6E5E8" }}
                >
                  Return Policy
                </a>
              </li>
              <li>
                <a
                  href="/shipping-policy"
                  className="hover:underline"
                  style={{ color: "#E6E5E8" }}
                >
                  Shipping Policy
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-3">About</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/about"
                  className="hover:underline"
                  style={{ color: "#E6E5E8" }}
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/blog"
                  className="hover:underline"
                  style={{ color: "#E6E5E8" }}
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="/terms-and-agreement"
                  className="hover:underline"
                  style={{ color: "#E6E5E8" }}
                >
                  Terms & Agreement
                </a>
              </li>
              <li>
                <a
                  href="/privacy-policy"
                  className="hover:underline"
                  style={{ color: "#E6E5E8" }}
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-10 text-sm" style={{ color: "#E6E5E8" }}>
          © {new Date().getFullYear()} EkoMart. All rights reserved.
        </div>
      </footer>

      <style>{`
      @keyframes fade-in {
        0% { opacity: 0; transform: translateY(40px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      .animate-fade-in {
        animation: fade-in 0.8s cubic-bezier(0.23, 1, 0.32, 1) both;
      }
      `}</style>

      {/* Sticky Call Button */}
      <button
        className="fixed bottom-6 right-6 z-50 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center text-3xl focus:outline-none"
        onClick={() => setCallbackModalOpen(true)}
        title="Request Callback"
      >
        <Phone size={32} />
      </button>

      {/* Callback Request Modal */}
      {callbackModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl"
              onClick={() => setCallbackModalOpen(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Phone className="text-green-600" /> Request Callback
            </h2>
            <form className="space-y-4">
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Name"
                  className="flex-1 border rounded p-2"
                  value={callbackForm.name}
                  onChange={(e) =>
                    setCallbackForm((f) => ({ ...f, name: e.target.value }))
                  }
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="flex-1 border rounded p-2"
                  value={callbackForm.email}
                  onChange={(e) =>
                    setCallbackForm((f) => ({ ...f, email: e.target.value }))
                  }
                />
              </div>
              <input
                type="text"
                placeholder="Phone"
                className="w-full border rounded p-2"
                value={callbackForm.phone}
                onChange={(e) =>
                  setCallbackForm((f) => ({ ...f, phone: e.target.value }))
                }
              />
              <div>
                <label className="block text-gray-600 mb-1">
                  Contact Timing
                </label>
                <select
                  className="w-full border rounded p-2"
                  value={callbackForm.timing}
                  onChange={(e) =>
                    setCallbackForm((f) => ({ ...f, timing: e.target.value }))
                  }
                >
                  <option value="Anytime">Anytime</option>
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Evening">Evening</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-600 mb-1">
                  What can I help you with today? (500 characters)
                </label>
                <textarea
                  className="w-full border rounded p-2"
                  maxLength={500}
                  value={callbackForm.message}
                  onChange={(e) =>
                    setCallbackForm((f) => ({
                      ...f,
                      message: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="recaptcha"
                  checked={callbackForm.recaptcha}
                  onChange={(e) =>
                    setCallbackForm((f) => ({
                      ...f,
                      recaptcha: e.target.checked,
                    }))
                  }
                />
                <label htmlFor="recaptcha" className="text-gray-600">
                  I'm not a robot
                </label>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  className="px-6 py-2 rounded bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
                  onClick={() => setCallbackModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition"
                  disabled={
                    !callbackForm.name ||
                    !callbackForm.phone ||
                    !callbackForm.recaptcha
                  }
                >
                  Request Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
