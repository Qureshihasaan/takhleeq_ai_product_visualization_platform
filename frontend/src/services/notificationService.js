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
  },

  /**
   * Get notifications for current user.
   * Falls back to service root message when dedicated endpoint is unavailable.
   */
  getNotifications: async () => {
    try {
      const response = await notificationApi.get('/get_notification');
      return response.data;
    } catch (error) {
      const isNotFound = error?.response?.status === 404;
      if (!isNotFound) {
        throw error;
      }

      const statusResponse = await notificationApi.get('/');
      const message = statusResponse?.data?.message || "Notification service is running.";

      return [
        {
          id: "service-status",
          type: "system",
          title: "Notification Service",
          desc: message,
          time: "Just now",
          unread: true,
        },
      ];
    }
  }
};
