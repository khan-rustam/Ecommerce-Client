import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { get } from '../../utils/authFetch';

interface SmartBanner {
  _id: string;
  title: string;
  content: string;
  image: string;
  url: string;
  displayType: 'popup' | 'banner' | 'sidebar';
  frequency: 'always' | 'once' | 'daily' | 'weekly';
}

const SmartBannerPopup: React.FC = () => {
  const [banner, setBanner] = useState<SmartBanner | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetchActiveBanner();
  }, []);

  const fetchActiveBanner = async () => {
    try {
      const { pathname } = window.location;
      const page = pathname === '/' ? 'home' : pathname.substring(1);
      
      const responseData = await get(`/smart-banners/active?page=${encodeURIComponent(page)}`);
      
      if (responseData && responseData.length > 0) {
        // Get the first active banner
        const activeBanner = responseData[0];
        
        // Check if we should display this banner based on frequency
        const shouldDisplay = checkBannerFrequency(activeBanner);
        
        if (shouldDisplay) {
          setBanner(activeBanner);
          setVisible(true);
        }
      }
    } catch (error) {
      console.error('Error fetching active smart banner:', error);
    }
  };

  const checkBannerFrequency = (banner: SmartBanner): boolean => {
    if (!banner) return false;
    
    const storageKey = `smartBanner_${banner._id}`;
    
    switch (banner.frequency) {
      case 'once':
        if (localStorage.getItem(storageKey)) {
          return false;
        }
        localStorage.setItem(storageKey, 'seen');
        return true;
        
      case 'daily':
        const lastSeen = localStorage.getItem(storageKey);
        const today = new Date().toISOString().split('T')[0];
        
        if (lastSeen === today) {
          return false;
        }
        localStorage.setItem(storageKey, today);
        return true;
        
      case 'weekly':
        const lastSeenWeekly = localStorage.getItem(storageKey);
        const now = new Date();
        const weekStart = new Date(now.setDate(now.getDate() - now.getDay())).toISOString().split('T')[0];
        
        if (lastSeenWeekly === weekStart) {
          return false;
        }
        localStorage.setItem(storageKey, weekStart);
        return true;
        
      case 'always':
      default:
        return true;
    }
  };

  const closeBanner = () => {
    setVisible(false);
  };

  if (!visible || !banner) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="relative max-w-lg w-full mx-4 animate-fade-in">
        <button
          onClick={closeBanner}
          className="absolute -top-3 -right-3 bg-white rounded-full p-1 shadow-lg z-10"
          aria-label="Close"
        >
          <X size={20} />
        </button>
        
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
          {banner.image && (
            <div className="w-full aspect-[16/9] overflow-hidden">
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/800x450?text=Image+Not+Found';
                }}
              />
            </div>
          )}
          
          <div className="p-6">
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--brand-primary)' }}>
              {banner.title}
            </h2>
            
            {banner.content && (
              <div className="mb-4 text-gray-700" dangerouslySetInnerHTML={{ __html: banner.content }} />
            )}
            
            {banner.url && (
              <Link 
                to={banner.url}
                className="inline-block px-6 py-2 rounded font-medium text-white transition-colors"
                style={{ backgroundColor: 'var(--brand-primary)', border: '1px solid var(--brand-primary)' }}
                onClick={closeBanner}
              >
                Shop Now
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartBannerPopup; 