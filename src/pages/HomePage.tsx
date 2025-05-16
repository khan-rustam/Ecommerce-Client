import React from "react";
import { useBrandColors } from "../contexts/BrandColorContext";
import HeroSection from "../components/home/HeroSection";
import CategoryShowcase from "../components/home/CategoryShowcase";
import ProductGrid from "../components/product/ProductGrid";
import { categories, products } from "../data/mockData";

const HomePage = () => {
  const { colors } = useBrandColors();
  const featuredProducts = products.filter((product) => product.featured);
  const newArrivals = products.filter((product) => product.new);

  return (
    <div style={{ background: colors.background, color: colors.text }}>
      <HeroSection
        title="ECHOES OF TRADITION, STRINGS OF HERITAGE"
        subtitle="Bringing India's rich musical legacy to life through handcrafted instruments—one soulful note at a time."
        buttonText="Explore Collection"
        buttonLink="/category/music"
        backgroundImage="https://plus.unsplash.com/premium_photo-1681488262364-8aeb1b6aac56?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      />

      <div className="container mx-auto px-4">
        {/* Popular Categories Section */}
        <CategoryShowcase
          title="Popular Categories"
          categories={categories.slice(0, 4)}
        />

        {/* Featured Products Section */}
        <ProductGrid title="Top Selling Products" products={featuredProducts} />

        {/* Banner Section */}
        <div className="w-full flex justify-center my-12">
          <div className="relative w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl bg-white flex flex-col md:flex-row items-center p-0 h-auto md:h-80 transition-transform duration-300 hover:scale-[1.02]">
            {/* Discount Badge */}
            <div className="absolute top-6 left-6 z-20 flex items-center space-x-2">
              <span className="bg-orange-500 text-white font-bold px-4 py-1 rounded-full text-sm shadow-lg animate-bounce">
                50% OFF
              </span>
              <svg
                className="w-6 h-6 text-yellow-400 animate-pulse"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 2v2m6.364 1.636l-1.414 1.414M22 12h-2M19.364 19.364l-1.414-1.414M12 22v-2M4.636 19.364l1.414-1.414M2 12h2M4.636 4.636l1.414 1.414" />
              </svg>
            </div>
            {/* Text Section */}
            <div className="flex-1 p-8 md:p-12 flex flex-col justify-center z-10">
              <h2
                className="text-3xl md:text-4xl font-extrabold mb-2 drop-shadow-lg"
                style={{ color: colors.primary }}
              >
                Special Discount
              </h2>
              <p
                className="text-lg md:text-xl mb-2"
                style={{ color: colors.text }}
              >
                Get up to{" "}
                <span className="font-bold" style={{ color: colors.primary }}>
                  50% off
                </span>{" "}
                on selected musical instruments.
              </p>
              <p
                className="text-sm mb-6 font-medium"
                style={{ color: colors.text }}
              >
                Hurry! Offer ends soon.
              </p>
              <button
                style={{ background: colors.primary, color: "#fff" }}
                className="font-semibold py-3 px-8 rounded-lg shadow-lg transition-all duration-200 text-lg w-max animate-pulse"
              >
                Shop Now
              </button>
            </div>
            {/* Image Section */}
            <div className="flex-1 h-64 md:h-full w-full md:w-1/2 relative">
              <img
                src="https://images.pexels.com/photos/164936/pexels-photo-164936.jpeg?auto=compress&w=800&q=80"
                alt="Special Discount"
                className="object-cover w-full h-full scale-105"
                style={{ minHeight: "220px" }}
              />
              {/* Stronger Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-black/60 via-transparent to-white/30 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* New Arrivals Section */}
        <ProductGrid title="New Arrivals" products={newArrivals} />

        {/* Newsletter Section */}
        <div
          className="rounded-lg p-8 my-12 text-center"
          style={{ background: colors.accent }}
        >
          <h2
            className="text-2xl font-semibold mb-4"
            style={{ color: colors.primary }}
          >
            Subscribe to Our Newsletter
          </h2>
          <p className="mb-6 max-w-lg mx-auto" style={{ color: colors.text }}>
            Stay updated with our latest products, exclusive offers, and
            cultural insights.
          </p>
          <div className="flex flex-col sm:flex-row max-w-lg mx-auto gap-3">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow py-3 px-4 border rounded-md focus:outline-none"
              style={{ borderColor: colors.secondary, color: colors.text }}
            />
            <button
              style={{ background: colors.primary, color: "#fff" }}
              className="font-medium py-3 px-6 rounded-md transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
