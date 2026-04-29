import axios from "axios";

// Create API clients for all backend services based on compose.yaml ports
export const productsApi = axios.create({
  baseURL: import.meta.env.VITE_PRODUCTS_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

export const usersApi = axios.create({
  baseURL: import.meta.env.VITE_USERS_API_URL || "http://localhost:8002",
  headers: {
    "Content-Type": "application/json",
  },
});

export const ordersApi = axios.create({
  baseURL: import.meta.env.VITE_ORDERS_API_URL || "http://localhost:8003",
  headers: {
    "Content-Type": "application/json",
  },
});

export const inventoryApi = axios.create({
  baseURL: import.meta.env.VITE_INVENTORY_API_URL || "http://localhost:8001",
  headers: {
    "Content-Type": "application/json",
  },
});

export const paymentApi = axios.create({
  baseURL: import.meta.env.VITE_PAYMENT_API_URL || "http://localhost:8005",
  headers: {
    "Content-Type": "application/json",
  },
});

export const notificationApi = axios.create({
  baseURL: import.meta.env.VITE_NOTIFICATION_API_URL || "http://localhost:8004",
  headers: {
    "Content-Type": "application/json",
  },
});

export const aiChatbotApi = axios.create({
  baseURL: import.meta.env.VITE_AI_CHATBOT_API_URL || "http://localhost:8006",
  headers: {
    "Content-Type": "application/json",
  },
});

export const aiDesignApi = axios.create({
  baseURL: import.meta.env.VITE_AI_DESIGN_API_URL || "http://localhost:8007",
  headers: {
    "Content-Type": "application/json",
  },
});

// Authentication token management
const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

// Generic interceptors can be attached here for tokens, error handling, etc.
const setupInterceptors = (axiosInstance) => {
  // Request interceptor to add auth token
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  // Response interceptor for error handling
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      // Global error handling strategy
      console.error("API Error:", error.response?.data || error.message);

      // Handle 401 Unauthorized - token expired or invalid
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        // Dispatch a custom event to let React/Redux handle the redirect
        window.dispatchEvent(new Event("auth:unauthorized"));
      }

      return Promise.reject(error);
    },
  );
};

// Setup interceptors for all API clients
setupInterceptors(productsApi);
setupInterceptors(usersApi);
setupInterceptors(ordersApi);
setupInterceptors(inventoryApi);
setupInterceptors(paymentApi);
setupInterceptors(notificationApi);
setupInterceptors(aiChatbotApi);
setupInterceptors(aiDesignApi);
