import { ordersApi } from "./apiClient";

export const orderService = {
  /**
   * Create a new order
   */
  createOrder: async (orderData) => {
    try {
      const response = await ordersApi.post("/create_order", orderData);
      return response.data;
    } catch (error) {
      console.error("Failed to create order:", error);
      throw error;
    }
  },

  /**
   * Update an existing order
   */
  updateOrder: async (orderId, orderData) => {
    try {
      const response = await ordersApi.put(
        `/update_order/${orderId}`,
        orderData,
      );
      return response.data;
    } catch (error) {
      console.error("Failed to update order:", error);
      throw error;
    }
  },

  /**
   * Get all orders
   */
  getAllOrders: async () => {
    try {
      const response = await ordersApi.get("/get_order");
      return response.data;
    } catch (error) {
      console.error("Failed to get orders:", error);
      throw error;
    }
  },

  /**
   * Get a single order by ID
   */
  getSingleOrder: async (orderId) => {
    try {
      const response = await ordersApi.get(
        `/get_single_order?order_id=${orderId}`,
      );
      return response.data;
    } catch (error) {
      console.error("Failed to get order:", error);
      throw error;
    }
  },

  /**
   * Delete an order
   */
  deleteOrder: async (orderId) => {
    try {
      const response = await ordersApi.delete(
        `/delete_order?order_id=${orderId}`,
      );
      return response.data;
    } catch (error) {
      console.error("Failed to delete order:", error);
      throw error;
    }
  },
};
