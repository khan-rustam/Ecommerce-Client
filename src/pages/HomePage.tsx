import { useState, useEffect } from "react";
import { useBrandColors } from "../contexts/BrandColorContext";
import HeroSection from "../components/home/HeroSection";
import CategoryShowcase from "../components/home/CategoryShowcase";
import ProductGrid from "../components/product/ProductGrid";
import { useSettings } from "../contexts/SettingsContext";
import { BackendProduct, Review } from "../types";
import ProductService from "../utils/ProductService.ts";
import { get } from "../utils/authFetch";
import { Star, Phone } from "lucide-react";
import "./HomePage.css";
import React from 'react';
import axios from 'axios';

console.log("axiosInstance");

const HomePage = () => {
  const { colors } = useBrandColors();
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
  const [locationError, setLocationError] = useState('');
  const [manualPin, setManualPin] = useState('');
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
      setLocationError('Geolocation is not supported by your browser.');
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await axios.get(`/api/products/nearby?lat=${latitude}&lng=${longitude}`);
          setProducts(res.data.products);
          setWarehouse(res.data.warehouse);
        } catch (err) {
          setLocationError('No warehouse found nearby or failed to fetch products.');
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setLocationError('Location access denied. Please enable location or set manually.');
        setLoading(false);
      }
    );
  }, []);

  const handlePinSubmit = async (e) => {
    e.preventDefault();
    if (!manualPin) return;
    setManualLoading(true);
    setLocationError('');
    try {
      // Call backend to get coordinates for pin code
      const res = await axios.get(`/api/pincode/${manualPin}`);
      const { lat, lng } = res.data;
      const prodRes = await axios.get(`/api/products/nearby?lat=${lat}&lng=${lng}`);
      setProducts(prodRes.data.products);
      setWarehouse(prodRes.data.warehouse);
      setLocationError('');
    } catch (err) {
      setLocationError('Could not find products for this pin code.');
    } finally {
      setManualLoading(false);
    }
  };

  return (
    <div style={{ background: colors.background, color: colors.text }}>
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
        <CategoryShowcase title="Popular Categories" useBackendData={true} />

        {/* Trending Now Section */}
        <ProductGrid
          title="Trending Now"
          products={trendingProducts}
          loading={loading}
          emptyMessage="No trending products available"
        />

        {/* Customer Stories Section */}
        <section className="py-12 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-10">
              <h2
                className="text-2xl font-semibold inline-block relative"
                style={{ color: colors.primary }}
              >
                Customer Stories
                <span
                  className="absolute bottom-0 left-1/2 w-16 h-0.5 transform -translate-x-1/2"
                  style={{ background: colors.primary }}
                ></span>
              </h2>
            </div>
            {/* Display Customer Stories */}
            {storiesLoading ? (
              <div className="col-span-full text-center text-gray-500">
                Loading customer stories...
              </div>
            ) : customerStories.length === 0 ? (
              <div className="col-span-full text-center text-gray-500">
                No customer stories available yet.
              </div>
            ) : (
              // Auto-scrolling container
              <div className="auto-scroll-reviews-container">
                <div className="auto-scroll-reviews-inner flex gap-8">
                  {/* First set of reviews */}
                  {customerStories.map((story) => (
                    <div
                      key={story._id + "_1"} // Add unique key suffix
                      className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center border border-slate-100 flex-shrink-0 w-72 md:w-80"
                    >
                      {/* Removed profile image */}
                      <h3
                        className="font-semibold text-lg mb-2"
                        style={{ color: colors.primary }}
                      >
                        {story.userName}
                      </h3>
                      <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            fill={i < story.rating ? "currentColor" : "none"}
                            className="inline text-yellow-400"
                          />
                        ))}
                      </div>
                      <p className="text-gray-600 line-clamp-4">
                        {story.comment}
                      </p>
                    </div>
                  ))}
                  {/* Second set of reviews (for seamless loop) */}
                  {customerStories.map((story) => (
                    <div
                      key={story._id + "_2"} // Add unique key suffix
                      className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center border border-slate-100 flex-shrink-0 w-72 md:w-80"
                    >
                      {/* Removed profile image */}
                      <h3
                        className="font-semibold text-lg mb-2"
                        style={{ color: colors.primary }}
                      >
                        {story.userName}
                      </h3>
                      <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            fill={i < story.rating ? "currentColor" : "none"}
                            className="inline text-yellow-400"
                          />
                        ))}
                      </div>
                      <p className="text-gray-600 line-clamp-4">
                        {story.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

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

        {loading ? (
          <div>Loading products for your location...</div>
        ) : locationError ? (
          <div style={{ color: 'red' }}>
            {locationError}
            <form onSubmit={handlePinSubmit} style={{ marginTop: 16 }}>
              <input
                type="text"
                value={manualPin}
                onChange={e => setManualPin(e.target.value)}
                placeholder="Enter your pin code"
                className="border px-2 py-1 rounded mr-2"
              />
              <button type="submit" disabled={manualLoading} className="bg-blue-600 text-white px-4 py-1 rounded">
                {manualLoading ? 'Checking...' : 'Find Products'}
              </button>
            </form>
          </div>
        ) : (
          <div>
            <h2>Products available near you {warehouse && `from ${warehouse.name}`} {warehouse && (warehouse.deliveryTime || warehouse.deliveryCost) && (<span style={{ fontWeight: 'normal', fontSize: '1rem' }}>({warehouse.deliveryTime}{warehouse.deliveryTime && warehouse.deliveryCost ? ', ' : ''}{warehouse.deliveryCost ? `Delivery: ₹${warehouse.deliveryCost}` : ''})</span>)}</h2>
            {/* Render products as cards or list */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {products.map(product => (
                <div key={product._id} className="border rounded p-4">
                  <img src={product.images?.[0]?.url} alt={product.name} className="h-40 w-full object-cover mb-2" />
                  <h3 className="font-bold text-lg">{product.name}</h3>
                  <p>{product.description?.replace(/<[^>]+>/g, '').slice(0, 100)}...</p>
                  <div className="mt-2 font-semibold">₹{product.price}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
