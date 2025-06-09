import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Category } from "../../types";
import { Loader2 } from "lucide-react";
import { get } from "../../utils/authFetch";

interface BackendCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isPopular: boolean;
  isHidden: boolean;
}

interface CategoryShowcaseProps {
  title: string;
  categories?: Category[];
  useBackendData?: boolean;
}

const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({
  title,
  categories = [],
  useBackendData = false,
}) => {
  const [backendCategories, setBackendCategories] = useState<BackendCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (useBackendData) {
      fetchPopularCategories();
    }
  }, [useBackendData]);

  const fetchPopularCategories = async () => {
    try {
      setLoading(true);
      const response = await get('/categories/popular');
      if (Array.isArray(response)) {
        setBackendCategories(response);
      } else {
        console.error('API response for popular categories is not an array:', response);
        setBackendCategories([]);
      }
      setError(null);
    } catch (err: any) {
      console.error('Error fetching popular categories:', err);
      setError('Failed to load popular categories');
      setBackendCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // Determine which categories to display
  const displayCategories = useBackendData ? backendCategories : categories;

  // Function to get unique key for each category
  const getCategoryKey = (category: BackendCategory | Category): string => {
    if ('_id' in category) {
      return category._id;
    }
    return category.id.toString();
  };

  if (useBackendData && loading) {
    return (
      <section className="py-12 px-4">
        <div className="container mx-auto text-center">
          <Loader2 className="inline-block animate-spin text-gray-400 mb-2" size={36} />
          <p className="text-gray-500">Loading categories...</p>
        </div>
      </section>
    );
  }

  if (useBackendData && error) {
    return (
      <section className="py-12 px-4">
        <div className="container mx-auto text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </section>
    );
  }

  if (displayCategories.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-4 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold inline-block relative text-primary tracking-tight drop-shadow-lg">
            {title}
            <span className="absolute bottom-0 left-1/2 w-20 h-1 bg-accent rounded-full transform -translate-x-1/2"></span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {displayCategories.map((category) => (
            <Link
              to={`/category/${category.slug}`}
              key={getCategoryKey(category)}
              className="group"
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 border-2 border-transparent group-hover:border-accent">
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/300x300?text=Image+Not+Found';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                </div>
                <div className="py-5 px-3 text-center bg-background group-hover:bg-primary group-hover:text-white transition-colors duration-300 rounded-b-2xl">
                  <h3 className="font-bold text-lg md:text-xl tracking-wide">{category.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase;
