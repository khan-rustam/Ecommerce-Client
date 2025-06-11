import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import ProductService from '../../../utils/ProductService';
import ProductForm from '../../../components/ProductManager/ProductForm';

/**
 * Create Product page component
 * @returns {React.ReactElement}
 */
const CreateProduct = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const [isLoading, setIsLoading] = useState(false);
  
  // Check if user is admin
  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/');
    }
  }, [user, navigate]);

  /**
   * Handle form submission
   * @param {Object} formData - The product form data
   */
  const handleSubmit = async (formData) => {
    setIsLoading(true);
    
    try {
      // Basic validation
      if (!formData.name || formData.name.trim() === '') {
        throw new Error('Product name is required');
      }
      
      if (!formData.category) {
        throw new Error('Please select a category');
      }
      
      if (!formData.price || formData.price <= 0) {
        throw new Error('Please enter a valid price');
      }
      
      if (!formData.images || formData.images.length === 0) {
        throw new Error('At least one product image is required');
      }
      
      // Automatically set the product as published (not hidden)
      // Format images as array of objects with url and public_id
      const images = (formData.images || []).map((url, i) => ({
        url,
        public_id: (formData.imagePublicIds && formData.imagePublicIds[i]) || ''
      }));
      const productData = {
        ...formData,
        images,
        isHidden: false,
        status: 'published'
      };
      
      console.log('Submitting product data:', productData);
      const result = await ProductService.createProduct(productData);
      
      toast.success('Product created and published successfully');
      navigate('/admin/products');
    } catch (error) {
      console.error('Error creating product:', error);
      
      // Display a more user-friendly error message
      const errorMessage = error.message || 'Failed to create product. Please try again.';
      toast.error(errorMessage);
      
      // If there's a specific field error, focus that field
      if (errorMessage.includes('name')) {
        document.getElementById('name')?.focus();
      } else if (errorMessage.includes('category')) {
        document.getElementById('category')?.focus();
      } else if (errorMessage.includes('price')) {
        document.getElementById('price')?.focus();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <button 
            onClick={() => navigate('/admin/products')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-2"
          >
            <ArrowLeft size={18} />
            Back to Products
          </button>
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: colors.primary }}>
            Create New Product
          </h1>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-10">
        <ProductForm 
          onSubmit={handleSubmit}
          isLoading={isLoading}
          initialData={{ isHidden: false, readyToShip: true }}
        />
      </div>
    </div>
  );
};

export default CreateProduct; 