import { notificationApi } from './apiClient';

export const notificationService = {
  /**
   * Get all notifications for the current user
   */
  getNotifications: async () => {
    try {
      const response = await notificationApi.get('/notifications');
      return response.data;
    } catch (error) {
      // Gracefully return empty array if the endpoint isn't available yet
      console.warn("Notification service unavailable:", error.response?.status || error.message);
      return [];
    }
  },

  /**
   * Mark a notification as read
   */
  markAsRead: async (notificationId) => {
    try {
      const response = await notificationApi.patch(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      throw error;
    }
  },

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
