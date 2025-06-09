import { API_URL } from '../config.ts';
import Cookies from 'js-cookie';
import { BackendProduct } from '../types';
import { get, post, put, del } from './authFetch'; // Import fetch helpers

// Helper to handle file upload with retry logic
const uploadFileWithRetry = async(file: File, maxRetries = 3): Promise<string> => {
  let retries = 0;

  while (retries < maxRetries) {
    try {
      // Convert the file to base64 string
      return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });
    } catch (error) {
      retries++;
      if (retries >= maxRetries) {
        throw new Error(`Failed to upload file after ${maxRetries} attempts: ${error}`);
      }
      // Wait before retrying (exponential backoff)
      await new Promise(r => setTimeout(r, 1000 * Math.pow(2, retries)));
    }
  }
  
  throw new Error('Failed to upload file');
};

// Process images for upload
const processImages = async(images: any[]): Promise<any[]> => {
  if (!images || !images.length) return [];

  return Promise.all(
    images.map(async(image) => {
      // If the image already has a URL and no new file, keep it as is
      if (image.url && !image.file) {
        return image;
      }

      // If it's a new file, process it
      if (image.file) {
        const base64Data = await uploadFileWithRetry(image.file);
        return {
          ...image,
          file: base64Data
        };
      }

      return image;
    })
  );
};

interface ProductServiceInterface {
  getProducts: (params?: Record<string, any>) => Promise<{ products: BackendProduct[], currentPage: number, total: number, totalPages: number }>;
  getProduct: (idOrSlug: string | number) => Promise<BackendProduct>;
  createProduct: (productData: any) => Promise<BackendProduct>;
  updateProduct: (id: string | number, productData: any) => Promise<BackendProduct>;
  deleteProduct: (id: string | number) => Promise<any>;
  bulkProductsOperation: (operation: string, productIds: string[], updateData?: any) => Promise<any>;
  uploadProductImage: (file: File) => Promise<{ url: string, publicId: string }>;
  getBrands: () => Promise<any[]>;
  getCategories: () => Promise<any[]>;
  getCategoryBySlug: (slug: string) => Promise<any>;
}

const ProductService: ProductServiceInterface = {
  // Get all products with filtering, sorting, pagination
  getProducts: async(params = {}) => {
    try {
      const queryParams = new URLSearchParams();

      // Add all params to query string
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });

      console.log('Fetching products with params:', Object.fromEntries(queryParams.entries()));
      // Use get from authFetch
      const responseData = await get(`/products?${queryParams.toString()}`);
      console.log('Products API response:', responseData);
      // authFetch returns the parsed data directly
      return responseData;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Get a single product by ID or slug
  getProduct: async(idOrSlug: string | number) => {
    try {
      console.log('Fetching product with ID/slug:', idOrSlug);
      
      // Try to fetch from API
      try {
        // First determine if this is likely a MongoDB ID (24 character hex) or a slug
        const idOrSlugStr = String(idOrSlug);
        const isMongoId = /^[0-9a-fA-F]{24}$/.test(idOrSlugStr);
        const endpoint = isMongoId ? `/products/${idOrSlugStr}` : `/products/slug/${idOrSlugStr}`;
        
        console.log(`Using endpoint: ${endpoint} (detected as ${isMongoId ? 'MongoDB ID' : 'slug'})`);
        
        // Use get from authFetch
        const responseData = await get(endpoint);
        console.log('API response for product:', responseData);
        
        if (!responseData || !responseData.product) {
          throw new Error('Product data not found in API response');
        }
        
        return responseData.product;
      } catch (apiError: any) {
        console.error('API error details:', apiError.response?.data || apiError.message);
        throw apiError;
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  // Create a new product
  createProduct: async(productData) => {
    try {
      // Clean up the data before sending
      const cleanedData = {...productData};

      // Convert empty strings to null for certain fields
      if (cleanedData.brand === '') cleanedData.brand = null;

      // Make sure category is provided
      if (!cleanedData.category) {
        throw new Error('Category is required');
      }

      // Fix stockStatus enum value
      if (cleanedData.stockStatus === 'In stock') {
        cleanedData.stockStatus = 'in_stock';
      } else if (cleanedData.stockStatus === 'Out of stock') {
        cleanedData.stockStatus = 'out_of_stock';
      } else if (cleanedData.stockStatus === 'On backorder') {
        cleanedData.stockStatus = 'on_backorder';
      }

      // Format images properly - convert string URLs to objects
      if (cleanedData.images && cleanedData.images.length > 0) {
        if (typeof cleanedData.images[0] === 'string') {
          // Convert string URLs to objects with url property
          const formattedImages = [];
          for (let i = 0; i < cleanedData.images.length; i++) {
            const url = cleanedData.images[i];
            const publicId = cleanedData.imagePublicIds && i < cleanedData.imagePublicIds.length ?
              cleanedData.imagePublicIds[i] :
              '';
            formattedImages.push({
              url: url,
              public_id: publicId
            });
          }
          cleanedData.images = formattedImages;
        } else {
          // Process images if they are file objects
          cleanedData.images = await processImages(cleanedData.images);
        }
      }

      console.log('Sending product data:', JSON.stringify(cleanedData, null, 2));

      // Use post from authFetch
      const responseData = await post('/products', cleanedData);

      return responseData.product || responseData;
    } catch (error: any) {
      console.error('Error creating product:', error);
      if (error.response && error.response.data) {
        console.error('Server error details:', error.response.data);
        throw new Error(error.response.data.message || 'Server error creating product');
      }
      throw error;
    }
  },

  // Update an existing product
  updateProduct: async(id, productData) => {
    try {
      // Clean up the data before sending
      const cleanedData = {...productData};

      // Convert empty strings to null for certain fields
      if (cleanedData.brand === '') cleanedData.brand = null;

      // Make sure category is provided
      if (!cleanedData.category) {
        throw new Error('Category is required');
      }

      // Fix stockStatus enum value
      if (cleanedData.stockStatus === 'In stock') {
        cleanedData.stockStatus = 'in_stock';
      } else if (cleanedData.stockStatus === 'Out of stock') {
        cleanedData.stockStatus = 'out_of_stock';
      } else if (cleanedData.stockStatus === 'On backorder') {
        cleanedData.stockStatus = 'on_backorder';
      }

      // Format images properly - convert string URLs to objects
      if (cleanedData.images && cleanedData.images.length > 0) {
        if (typeof cleanedData.images[0] === 'string') {
          // Convert string URLs to objects with url property
          const formattedImages = [];
          for (let i = 0; i < cleanedData.images.length; i++) {
            const url = cleanedData.images[i];
            const publicId = cleanedData.imagePublicIds && i < cleanedData.imagePublicIds.length ?
              cleanedData.imagePublicIds[i] :
              '';
            formattedImages.push({
              url: url,
              public_id: publicId
            });
          }
          cleanedData.images = formattedImages;
        } else {
          // Process images if they are file objects
          cleanedData.images = await processImages(cleanedData.images);
        }
      }

      console.log('Sending updated product data:', JSON.stringify(cleanedData, null, 2));

      // Use put from authFetch
      const responseData = await put(`/products/${id}`, cleanedData);

      return responseData.product || responseData;
    } catch (error: any) {
      console.error('Error updating product:', error);
      if (error.response && error.response.data) {
        console.error('Server error details:', error.response.data);
        throw new Error(error.response.data.message || 'Server error updating product');
      }
      throw error;
    }
  },

  // Delete a product
  deleteProduct: async(id) => {
    try {
      // Use del from authFetch
      const responseData = await del(`/products/${id}`);
      return responseData;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  // Bulk operations on products
  bulkProductsOperation: async(operation, productIds, updateData = null) => {
    try {
      const payload = {
        operation,
        productIds,
        updateData
      };

      console.log('Sending bulk operation request:', {
        operation,
        productCount: productIds.length,
        updateData: updateData ? 'Data provided' : 'No data'
      });

      // Use post from authFetch
      const responseData = await post('/products/bulk', payload);

      console.log('Bulk operation response:', responseData);
      return responseData;
    } catch (error: any) {
      console.error('Error performing bulk operation:', error);
      if (error.response) {
        console.error('Server response:', error.response.status, error.response.data);
        throw new Error(error.response.data && error.response.data.message ? error.response.data.message : `Server error (${error.response.status})`);
      }
      throw error;
    }
  },

  // Upload a product image
  uploadProductImage: async(file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Use post from authFetch for FormData
      const responseData = await post('/products/upload', formData);

      return {
        url: responseData.url,
        publicId: responseData.publicId
      };
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },

  // Get all brands
  getBrands: async() => {
    try {
      // Use get from authFetch
      const responseData = await get('/brands');
      console.log('Brands API response:', responseData);

      // The API returns an array directly
      if (Array.isArray(responseData)) {
        return responseData;
      }
      // If it's wrapped in a property
      else if (responseData.brands) {
        return responseData.brands;
      }
      // If it's wrapped in a data property
      else if (responseData.data) {
        return responseData.data;
      }
      // If it's a single object, wrap it in an array
      else if (responseData._id) {
        return [responseData];
      }
      // Fallback
      else {
        console.warn('Unexpected brands response format:', responseData);
        return [];
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
      return [];
    }
  },

  // Get all categories
  getCategories: async() => {
    try {
      // Use get from authFetch
      const responseData = await get('/categories');
      console.log('Categories API response:', responseData);

      // The API returns an array directly
      if (Array.isArray(responseData)) {
        return responseData;
      }
      // If it's wrapped in a property
      else if (responseData.categories) {
        return responseData.categories;
      }
      // If it's wrapped in a data property
      else if (responseData.data) {
        return responseData.data;
      }
      // If it's a single object, wrap it in an array
      else if (responseData._id) {
        return [responseData];
      }
      // Fallback
      else {
        console.warn('Unexpected categories response format:', responseData);
        return [];
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },
  
  // Get a category by slug
  getCategoryBySlug: async(slug: string) => {
    try {
      // Use get from authFetch
      const responseData = await get(`/categories/slug/${slug}`);
      console.log('Category by slug API response:', responseData);
      
      // Return the category data
      if (responseData && responseData._id) {
        return responseData;
      } else if (responseData && responseData.category && responseData.category._id) {
        return responseData.category;
      } else {
        throw new Error('Category not found');
      }
    } catch (error) {
      console.error(`Error fetching category by slug ${slug}:`, error);
      throw error;
    }
  }
};

export default ProductService; 