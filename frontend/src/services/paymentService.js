import { paymentApi } from './apiClient';

export const paymentService = {
  /**
   * Create a new payment
   */
  createPayment: async (paymentData) => {
    try {
      const response = await paymentApi.post('/create_payment/', paymentData);
      return response.data;
    } catch (error) {
      console.error("Failed to create payment:", error);
      throw error;
    }
  },

  /**
   * Get all payments
   */
  getAllPayments: async () => {
    try {
      const response = await paymentApi.get('/get_all_payment');
      return response.data;
    } catch (error) {
      console.error("Failed to get payments:", error);
      throw error;
    }
  },

  /**
   * Get a single payment by ID
   */
  getSinglePayment: async (paymentId) => {
    try {
      const response = await paymentApi.get(`/get_single_payment?payment_id=${paymentId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to get payment:", error);
      throw error;
    }
  },

  /**
   * Update a payment
   */
  updatePayment: async (paymentId, paymentData) => {
    try {
      const response = await paymentApi.put(`/update_payment?payment_id=${paymentId}`, paymentData);
      return response.data;
    } catch (error) {
      console.error("Failed to update payment:", error);
      throw error;
    }
  },

  /**
   * Delete a payment
   */
  deletePayment: async (paymentId) => {
    try {
      const response = await paymentApi.delete(`/delete_payment?payment_id=${paymentId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to delete payment:", error);
      throw error;
    }
  }
};
