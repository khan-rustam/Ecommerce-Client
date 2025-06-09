import { get, post, put, del, patch } from './authFetch'; // Import fetch helpers

interface Blog {
  _id: string;
  title: string;
  content: string;
  image: string;
  imagePublicId?: string;
  author: {
    _id: string;
    name: string;
  };
  isPublished: boolean;
  slug: string;
  tags: string[];
  views: number;
  createdAt: string;
  updatedAt: string;
}

interface BlogFormData {
  title: string;
  content: string;
  image: string;
  imagePublicId?: string;
  isPublished?: boolean;
  tags?: string[];
}

class BlogService {
  // Get all published blogs (public)
  async getPublishedBlogs(): Promise<Blog[]> {
    try {
      // Use get from authFetch
      const responseData = await get('/blogs/public');
      // authFetch returns the parsed data directly
      return responseData;
    } catch (error: any) {
      console.error('Error fetching blogs:', error);
      throw error;
    }
  }

  // Get all blogs (admin)
  async getAllBlogs(): Promise<Blog[]> {
    try {
      // Use get from authFetch
      const responseData = await get('/blogs');
      return responseData;
    } catch (error: any) {
      console.error('Error fetching all blogs:', error);
      throw error;
    }
  }

  // Get a single blog by ID or slug
  async getBlogByIdOrSlug(identifier: string, countView: boolean = false): Promise<Blog> {
    try {
      const params = countView ? { countView: 'true' } : {};
      // Use get from authFetch
      const responseData = await get(`/blogs/${identifier}`, { params });
      return responseData;
    } catch (error: any) {
      console.error('Error fetching blog:', error);
      throw error;
    }
  }

  // Create a new blog
  async createBlog(blogData: BlogFormData): Promise<Blog> {
    try {
      // Use post from authFetch
      const responseData = await post('/blogs', blogData);
      return responseData;
    } catch (error: any) {
      console.error('Error creating blog:', error);
      throw error;
    }
  }

  // Update an existing blog
  async updateBlog(id: string, blogData: Partial<BlogFormData>): Promise<Blog> {
    try {
      // Use put from authFetch
      const responseData = await put(`/blogs/${id}`, blogData);
      return responseData;
    } catch (error: any) {
      console.error('Error updating blog:', error);
      throw error;
    }
  }

  // Delete a blog
  async deleteBlog(id: string): Promise<{ message: string }> {
    try {
      // Use del from authFetch
      const responseData = await del(`/blogs/${id}`);
      return responseData;
    } catch (error: any) {
      console.error('Error deleting blog:', error);
      throw error;
    }
  }

  // Toggle blog published status
  async toggleBlogPublished(id: string): Promise<Blog> {
    try {
      // Use patch from authFetch
      const responseData = await patch(`/blogs/${id}/toggle-published`, {});
      return responseData;
    } catch (error: any) {
      console.error('Error toggling blog status:', error);
      throw error;
    }
  }

  // Upload blog image
  async uploadImage(file: File): Promise<{ image: string; imagePublicId: string }> {
    const MAX_RETRIES = 2;
    let retries = 0;
    
    while (retries <= MAX_RETRIES) {
      try {
        const formData = new FormData();
        formData.append('file', file);

        // Use post from authFetch for FormData
        const responseData = await post('/blogs/upload', formData, {
           // authFetch handles Content-Type for FormData
           // Remove timeout option as fetch does not directly support it, needs AbortController if needed
        });
        
        return responseData;
      } catch (error: any) {
        console.error(`Error uploading image (attempt ${retries + 1}/${MAX_RETRIES + 1}):`, error);
        
        // If we've reached max retries, throw the error
        if (retries === MAX_RETRIES) {
          // Check for response status if available
          if (error.response?.status === 413) {
            throw new Error('Image file is too large. Please upload a smaller image (max 20MB).');
          } else if (error.message && error.message.includes('timed out')) { // Basic check for timeout message
             throw new Error('Upload timed out. Please try with a smaller image or check your connection.');
          } else {
            throw error;
          }
        }
        
        // Increment retry counter and wait before retrying
        retries++;
        await new Promise(resolve => setTimeout(resolve, 1000 * retries)); // Increasing delay between retries
      }
    }
    
    // This should never be reached due to the throw in the catch block above
    throw new Error('Failed to upload image after multiple attempts');
  }
}

export default new BlogService();
export type { Blog, BlogFormData }; 