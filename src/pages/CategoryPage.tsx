import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Sliders } from 'lucide-react';
import ProductGrid from '../components/product/ProductGrid';
import { categories, products } from '../data/mockData';
import { Product } from '../types';

const sortOptions = [
  { label: 'Best Selling', value: 'best-selling' },
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
];

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState('best-selling');
  const [showFilters, setShowFilters] = useState(false);
  
  const categoryInfo = categories.find(c => c.slug === category);
  
  useEffect(() => {
    if (category) {
      let filtered = products.filter(product => product.category === category);
      
      // Apply sorting
      switch (sortBy) {
        case 'newest':
          filtered = [...filtered].sort((a, b) => (b.new ? 1 : 0) - (a.new ? 1 : 0));
          break;
        case 'price-asc':
          filtered = [...filtered].sort((a, b) => 
            (a.salePrice || a.price) - (b.salePrice || b.price)
          );
          break;
        case 'price-desc':
          filtered = [...filtered].sort((a, b) => 
            (b.salePrice || b.price) - (a.salePrice || a.price)
          );
          break;
        default:
          // Best selling is the default
          filtered = [...filtered].sort((a, b) => 
            (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
          );
      }
      
      setFilteredProducts(filtered);
    }
  }, [category, sortBy]);
  
  if (!categoryInfo) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-semibold mb-4">Category Not Found</h2>
        <p className="mb-8">The category you're looking for doesn't exist.</p>
        <Link 
          to="/"
          className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-md transition-colors"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Category Banner */}
      <div className="bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-4 flex items-center text-sm">
            <Link to="/" className="text-gray-600 hover:text-orange-500">Home</Link>
            <ChevronRight size={16} className="mx-1 text-gray-400" />
            <span className="text-gray-800 font-medium capitalize">{categoryInfo.name}</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold">{categoryInfo.name}</h1>
          {categoryInfo.description && (
            <p className="mt-2 text-gray-600">{categoryInfo.description}</p>
          )}
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {/* Subcategories */}
        {categoryInfo.subcategories && categoryInfo.subcategories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Popular in {categoryInfo.name}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categoryInfo.subcategories.map(subcat => (
                <Link 
                  key={subcat.id}
                  to={`/category/${category}/${subcat.slug}`}
                  className="text-center group"
                >
                  <div className="bg-gray-100 rounded-lg p-4 mb-2 aspect-square flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                    <img 
                      src="https://via.placeholder.com/80"
                      alt={subcat.name}
                      className="max-h-full"
                    />
                  </div>
                  <h3 className="text-sm font-medium group-hover:text-orange-500 transition-colors">
                    {subcat.name}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        )}
        
        {/* Filters and Sorting */}
        <div className="flex flex-wrap items-center justify-between mb-6 pb-4 border-b">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center text-gray-600 hover:text-gray-900 md:mr-4"
          >
            <Sliders size={20} className="mr-2" />
            <span>Filters</span>
          </button>
          
          <div className="flex items-center mt-4 sm:mt-0">
            <span className="text-gray-600 mr-2">Sort by:</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-md py-1 px-3 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Price Range */}
              <div>
                <h3 className="font-medium mb-2">Price Range</h3>
                <div className="space-y-2">
                  <div>
                    <input type="checkbox" id="price-1" className="mr-2" />
                    <label htmlFor="price-1">Under $50</label>
                  </div>
                  <div>
                    <input type="checkbox" id="price-2" className="mr-2" />
                    <label htmlFor="price-2">$50 - $100</label>
                  </div>
                  <div>
                    <input type="checkbox" id="price-3" className="mr-2" />
                    <label htmlFor="price-3">$100 - $200</label>
                  </div>
                  <div>
                    <input type="checkbox" id="price-4" className="mr-2" />
                    <label htmlFor="price-4">Over $200</label>
                  </div>
                </div>
              </div>
              
              {/* Availability */}
              <div>
                <h3 className="font-medium mb-2">Availability</h3>
                <div className="space-y-2">
                  <div>
                    <input type="checkbox" id="in-stock" className="mr-2" />
                    <label htmlFor="in-stock">In Stock</label>
                  </div>
                  <div>
                    <input type="checkbox" id="out-of-stock" className="mr-2" />
                    <label htmlFor="out-of-stock">Out of Stock</label>
                  </div>
                </div>
              </div>
              
              {/* Rating */}
              <div>
                <h3 className="font-medium mb-2">Rating</h3>
                <div className="space-y-2">
                  <div>
                    <input type="checkbox" id="rating-4" className="mr-2" />
                    <label htmlFor="rating-4">4 Stars & Up</label>
                  </div>
                  <div>
                    <input type="checkbox" id="rating-3" className="mr-2" />
                    <label htmlFor="rating-3">3 Stars & Up</label>
                  </div>
                </div>
              </div>
              
              {/* Special Offers */}
              <div>
                <h3 className="font-medium mb-2">Special Offers</h3>
                <div className="space-y-2">
                  <div>
                    <input type="checkbox" id="discount" className="mr-2" />
                    <label htmlFor="discount">On Sale</label>
                  </div>
                  <div>
                    <input type="checkbox" id="new-arrival" className="mr-2" />
                    <label htmlFor="new-arrival">New Arrivals</label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button 
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-4 rounded-md mr-2 transition-colors"
                onClick={() => setShowFilters(false)}
              >
                Cancel
              </button>
              <button 
                className="bg-orange-500 hover:bg-orange-600 text-white py-1 px-4 rounded-md transition-colors"
                onClick={() => setShowFilters(false)}
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
        
        {/* Products */}
        {filteredProducts.length > 0 ? (
          <ProductGrid products={filteredProducts} />
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">No Products Found</h2>
            <p className="text-gray-600">Try adjusting your filters or check back later for new arrivals.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;