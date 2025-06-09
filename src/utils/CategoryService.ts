import { get } from "./authFetch"; // Assuming authFetch is your utility for making authenticated requests

const CategoryService = {
  /**
   * Fetches popular categories from the backend.
   * @returns A promise that resolves with an array of popular categories.
   */
  getPopularCategories: async () => {
    try {
      // Assuming your backend endpoint for popular categories is /api/categories/popular
      const data = await get("/categories/popular");
      return data; // Assuming the backend returns the array directly
    } catch (error) {
      console.error("Error fetching popular categories:", error);
      throw error; // Re-throw the error for the calling component to handle
    }
  },

  // You can add other category-related functions here (e.g., getAllCategories, getCategoryById, etc.)
};

export default CategoryService; 