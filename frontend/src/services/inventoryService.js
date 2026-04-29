import { inventoryApi } from './apiClient';

export const inventoryService = {
  /**
   * Get stock information for a single product
   */
  getSingleStock: async (productId) => {
    try {
      const response = await inventoryApi.get(`/get_single_stock_update?product_id=${productId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to get stock information:", error);
      throw error;
    }
  },

  /**
   * Get all stock information
   */
  getAllStock: async () => {
    try {
      const response = await inventoryApi.get('/get_stock_update');
      return response.data;
    } catch (error) {
      console.error("Failed to get all stock information:", error);
      throw error;
    }
  },

  /**
   * Delete stock for a product
   */
  deleteStock: async (productId) => {
    try {
      const response = await inventoryApi.delete(`/delete_stock/${productId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to delete stock:", error);
      throw error;
    }
  },

  /**
   * Check if inventory is available for a product
   */
  checkInventory: async (productId, quantity) => {
    try {
      const response = await inventoryApi.get(`/check_inventory/${productId}/${quantity}`);
      return response.data;
    } catch (error) {
      console.error("Failed to check inventory:", error);
      throw error;
    }
  }
};
