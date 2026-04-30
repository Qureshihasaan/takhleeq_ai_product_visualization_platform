import { notificationApi } from './apiClient';

export const notificationService = {
  /**
   * Get notification service status
   */
  getServiceStatus: async () => {
    try {
      const response = await notificationApi.get('/');
      return response.data;
    } catch (error) {
      console.error("Failed to get notification service status:", error);
      throw error;
    }
  }
};
