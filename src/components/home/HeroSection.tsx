import React, { useState, useEffect, useCallback, useRef } from "react";
import { useBrandColors } from "../../contexts/BrandColorContext";
import {ChevronLeft, ChevronRight } from "lucide-react";
import { get } from "../../utils/authFetch";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface HeroProps {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  backgroundImage?: string;
  titleFontSize?: number;
  titleFontWeight?: string;
  subtitleFontSize?: number;
  subtitleFontWeight?: string;
}

interface Banner {
  _id: string;
  path: string;
  name: string;
  show: boolean;
}

// Default slider settings
const getSliderSettings = (bannerCount: number) => ({
  dots: true,
  infinite: bannerCount > 1,
  speed: 700,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  autoplay: bannerCount > 1,
  autoplaySpeed: 4000,
  pauseOnHover: true,
  fade: true, // Smooth fade animation
  cssEase: 'ease-in-out',
});

const HeroSection: React.FC<HeroProps> = ({
  backgroundImage,
}) => {
  const { colors } = useBrandColors();
  const [activeBanners, setActiveBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const sliderRef = useRef<any>(null);

  // Fetch active banners
  useEffect(() => {
    const fetchBanners = async () => {
      setLoading(true);
      try {
        const res = await get('/banners?show=true');
        console.log("Fetched banners for HeroSection:", res); // Log the backend response
        let bannersArray = [];
        if (Array.isArray(res)) {
          bannersArray = res;
        } else if (Array.isArray(res?.data)) {
          bannersArray = res.data;
        } else if (Array.isArray(res?.banners)) {
          bannersArray = res.banners;
        }
        // Filter out invalid entries
        bannersArray = bannersArray.filter(b => b && typeof b === 'object' && typeof b.show !== 'undefined');
        setActiveBanners(bannersArray);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch banners");
        setActiveBanners([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  return (
    <div
      className="relative w-full overflow-hidden bg-gradient-to-r from-primary to-accent rounded-xl shadow-lg mt-4"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="relative h-[45vh] md:h-[55vh] w-full overflow-hidden py-2">
        {loading ? (
          <div className="h-64 flex items-center justify-center text-primary animate-pulse font-semibold text-xl">Loading banners...</div>
        ) : error ? (
          <div className="h-64 flex items-center justify-center text-red-500 font-semibold">{error}</div>
        ) : (
          <Slider
            ref={sliderRef}
            {...getSliderSettings(activeBanners.length)}
            beforeChange={(_, next) => setCurrentIndex(next)}
          >
            {Array.isArray(activeBanners) && activeBanners
              .filter(banner => banner && typeof banner === 'object' && typeof banner.show !== 'undefined')
              .map((banner) => (
                <div key={banner._id} className="relative h-64 md:h-96 rounded-xl overflow-hidden group">
                  <img
                    src={banner.path}
                    alt={banner.name || "Banner"}
                    className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-700 shadow-xl border-4 border-white/30"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/1200x400?text=Error';
                    }}
                  />
                  {banner.name && (
                    <div className="absolute bottom-6 left-6 bg-primary/80 text-white px-6 py-3 rounded-xl shadow-lg text-lg font-bold tracking-wide animate-fade-in-up">
                      {banner.name}
                    </div>
                  )}
                </div>
              ))}
          </Slider>
        )}

        {/* Fallback if no banners */}
        {activeBanners.length === 0 && (
          <div
            className="absolute inset-0 w-full h-full rounded-xl bg-background flex items-center justify-center"
            style={{
              backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30 rounded-xl"></div>
            <span className="relative z-10 text-white text-2xl font-bold">Welcome to our Store</span>
          </div>
        )}

        {/* Previous/Next navigation buttons */}
        {activeBanners.length > 1 && (
          <>
            <button
              onClick={() => sliderRef.current?.slickPrev()}
              className="absolute left-6 top-1/2 transform -translate-y-1/2 z-40 bg-primary hover:bg-accent text-white p-3 rounded-full shadow-lg transition-all duration-200 border-2 border-white/40"
              aria-label="Previous banner"
            >
              <ChevronLeft className="h-7 w-7" />
            </button>
            <button
              onClick={() => sliderRef.current?.slickNext()}
              className="absolute right-6 top-1/2 transform -translate-y-1/2 z-40 bg-primary hover:bg-accent text-white p-3 rounded-full shadow-lg transition-all duration-200 border-2 border-white/40"
              aria-label="Next banner"
            >
              <ChevronRight className="h-7 w-7" />
            </button>
          </>
        )}

        {/* Banner pagination indicator */}
        {activeBanners.length > 1 && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-40 flex space-x-3">
            {activeBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full border-2 border-white transition-all duration-300 ${
                  index === currentIndex ? "bg-accent scale-125 shadow-lg" : "bg-white/60"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
      <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s cubic-bezier(0.23, 1, 0.32, 1) both;
        }
      `}</style>
    </div>
  );
};

export default HeroSection;
