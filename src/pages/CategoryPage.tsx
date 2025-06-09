import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Sliders, AlertCircle, Loader2 } from 'lucide-react';
import ProductGrid from '../components/product/ProductGrid';
import { BackendProduct } from '../types';
import ProductService from '../utils/ProductService';

const sortOptions = [
  { label: 'Best Selling', value: 'best-selling' },
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
];

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryData, setCategoryData] = useState<any>(null);
  const [products, setProducts] = useState<BackendProduct[]>([]);
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  useEffect(() => {
    if (category) {
      fetchCategoryData();
    }
  }, [category, sortBy, currentPage]);
  
  const fetchCategoryData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get category by slug
      const categoryResponse = await ProductService.getCategoryBySlug(category);
      setCategoryData(categoryResponse);
      
      // Map sort values to API parameters
      let sortParam = 'createdAt';
      let orderParam = 'desc';
      
      switch (sortBy) {
        case 'newest':
          sortParam = 'createdAt';
          orderParam = 'desc';
          break;
        case 'price-asc':
          sortParam = 'price';
          orderParam = 'asc';
          break;
        case 'price-desc':
          sortParam = 'price';
          orderParam = 'desc';
          break;
        case 'best-selling':
          sortParam = 'sold';
          orderParam = 'desc';
          break;
      }
      
      // Fetch products for this category
      const productsResponse = await ProductService.getProducts({
        category: categoryResponse._id,
        sort: sortParam,
        order: orderParam,
        page: currentPage,
        limit: 12
      });
      
      setProducts(productsResponse.products || []);
      setTotalProducts(productsResponse.total || 0);
      setTotalPages(productsResponse.totalPages || 1);
      
    } catch (err: any) {
      console.error('Error fetching category data:', err);
      setError(err.response?.data?.message || 'Failed to load category data');
      setCategoryData(null);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin mx-auto mb-4 text-gray-600" />
          <p className="text-gray-600">Loading category data...</p>
        </div>
      </div>
    );
  }
  
  if (error || !categoryData) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <AlertCircle size={40} className="mx-auto mb-4 text-red-500" />
        <h2 className="text-2xl font-semibold mb-4">Category Not Found</h2>
        <p className="mb-8 text-gray-600">{error || "The category you're looking for doesn't exist."}</p>
        <Link 
          to="/"
          className="bg-[var(--brand-primary,#2563eb)] hover:bg-[var(--brand-primary-hover,#1d4ed8)] text-white font-medium py-2 px-6 rounded-md transition-colors"
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
            <Link to="/" className="text-gray-600 hover:text-[var(--brand-primary,#2563eb)]">Home</Link>
            <ChevronRight size={16} className="mx-1 text-gray-400" />
            <span className="text-gray-800 font-medium capitalize">{categoryData.name}</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold">{categoryData.name}</h1>
          {categoryData.description && (
            <p className="mt-2 text-gray-600">{categoryData.description}</p>
          )}
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {/* Subcategories */}
        {categoryData.subcategories && categoryData.subcategories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Popular in {categoryData.name}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categoryData.subcategories.map((subcat: any) => (
                <Link 
                  key={subcat._id}
                  to={`/category/${subcat.slug}`}
                  className="text-center group"
                >
                  <div className="bg-gray-100 rounded-lg p-4 mb-2 aspect-square flex items-center justify-center group-hover:bg-[var(--brand-primary-hover)] transition-colors">
                    {subcat.image ? (
                      <img 
                        src={subcat.image}
                        alt={subcat.name}
                        className="max-h-full object-contain"
                      />
                    ) : (
                      <div className="text-2xl text-gray-400">{subcat.name.charAt(0)}</div>
                    )}
                  </div>
                  <h3 className="text-sm font-medium group-hover:text-[var(--brand-primary)] transition-colors">
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
              className="border border-gray-300 rounded-md py-1 px-3 focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary,#2563eb)] bg-white"
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
            {/* Filter options */}
          </div>
        )}
        
        {/* Products */}
        <ProductGrid 
          products={products} 
          emptyMessage={`No products found in ${categoryData.name}`}
        />
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded ${
                    currentPage === page
                      ? 'bg-[var(--brand-primary)] text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;