import { usersApi } from "./apiClient";

export const authService = {
  /**
   * Login user with username and password
   */
  login: async (userData) => {
    try {
      const formData = new URLSearchParams();
      formData.append("username", userData.username || "");
      formData.append("password", userData.plain_password || "");

      const response = await usersApi.post("/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });
      return response.data;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  },

  /**
   * Register new user
   */
  register: async (userData) => {
    try {
      const payload = {
        username: userData.username || "",
        email: userData.email || "",
        plain_password: userData.plain_password || "",
        role: userData.role || "buyer"
      };
      
      const response = await usersApi.post("/Signup", payload);
      return response.data;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  },

  /**
   * Google OAuth authentication
   */
  googleAuth: async (idToken) => {
    try {
      const response = await usersApi.post("/auth/google", {
        id_token: idToken,
      });
      return response.data;
    } catch (error) {
      console.error("Google auth failed:", error);
      throw error;
    }
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async () => {
    try {
      const response = await usersApi.get("/user/me");
      return response.data;
    } catch (error) {
      console.error("Failed to get current user:", error);
      throw error;
    }
  },

  /**
   * Get user by ID
   */
  getUserById: async (userId) => {
    try {
      const response = await usersApi.get(`/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to get user:", error);
      throw error;
    }
  },

  /**
   * Get all users
   */
  getAllUsers: async () => {
    try {
      const response = await usersApi.get("/user/all");
      return response.data;
    } catch (error) {
      console.error("Failed to get all users:", error);
      throw error;
    }
  },

  /**
   * Delete user by ID
   */
  deleteUser: async (userId) => {
    try {
      const response = await usersApi.delete(`/user/delete/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to delete user:", error);
      throw error;
    }
  },

  /**
   * Get access token for testing
   */
  getAccessToken: async (email, role = "buyer", userId = null) => {
    try {
      const response = await usersApi.get("/get_access_token", {
        params: { email, role, user_id: userId },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to get access token:", error);
      throw error;
    }
  },

  /**
   * Decode access token
   */
  decodeToken: async (accessToken) => {
    try {
      const response = await usersApi.get("/decode_token", {
        params: { access_token: accessToken },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to decode token:", error);
      throw error;
    }
  },

  /**
   * Store authentication token in localStorage
   */
  setAuthToken: (token) => {
    localStorage.setItem("authToken", token);
  },

  /**
   * Get authentication token from localStorage
   */
  getAuthToken: () => {
    return localStorage.getItem("authToken");
  },

  /**
   * Remove authentication token from localStorage
   */
  removeAuthToken: () => {
    localStorage.removeItem("authToken");
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem("authToken");
  },
};
