import { aiChatbotApi } from './apiClient';

export const aiChatbotService = {
  /**
   * Send a message to the AI chatbot
   */
  sendMessage: async (message, sessionId = null) => {
    try {
      const response = await aiChatbotApi.post('/chat', {
        message,
        session_id: sessionId
      });
      return response.data;
    } catch (error) {
      console.error("Failed to send message to chatbot:", error);
      throw error;
    }
  },

  /**
   * Check chatbot service health
   */
  checkHealth: async () => {
    try {
      const response = await aiChatbotApi.get('/health');
      return response.data;
    } catch (error) {
      console.error("Failed to check chatbot health:", error);
      throw error;
    }
  }
};
