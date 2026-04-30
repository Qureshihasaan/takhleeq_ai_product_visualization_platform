import { beforeEach, describe, expect, it, vi } from "vitest";

var usersApi;
var productsApi;
var ordersApi;
var inventoryApi;
var paymentApi;
var notificationApi;
var aiChatbotApi;
var aiDesignApi;

vi.mock("../apiClient", () => {
  usersApi = {
    post: vi.fn(),
    get: vi.fn(),
    delete: vi.fn(),
  };

  productsApi = {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  };

  ordersApi = {
    post: vi.fn(),
    put: vi.fn(),
    get: vi.fn(),
    delete: vi.fn(),
  };

  inventoryApi = {
    get: vi.fn(),
    delete: vi.fn(),
  };

  paymentApi = {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  };

  notificationApi = {
    get: vi.fn(),
  };

  aiChatbotApi = {
    post: vi.fn(),
    get: vi.fn(),
  };

  aiDesignApi = {
    post: vi.fn(),
    get: vi.fn(),
  };

  return {
    usersApi,
    productsApi,
    ordersApi,
    inventoryApi,
    paymentApi,
    notificationApi,
    aiChatbotApi,
    aiDesignApi,
  };
});

import { authService } from "../authService";
import { productService } from "../productService";
import { orderService } from "../orderService";
import { paymentService } from "../paymentService";
import { inventoryService } from "../inventoryService";
import { notificationService } from "../notificationService";
import { aiChatbotService } from "../aiChatbotService";
import { aiDesignService } from "../aiDesignService";

const verifyNonEmptyObject = (obj) => {
  Object.values(obj).forEach((value) => {
    expect(value).not.toBeNull();
    expect(value).not.toBeUndefined();
    if (typeof value === "string") {
      expect(value.trim()).not.toBe("");
    }
  });
};

describe("API service request validation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("authService.login sends non-empty username and password values", async () => {
    usersApi.post.mockResolvedValue({ data: { access_token: "token" } });

    const payload = { username: "test-user", password: "secret" };
    const result = await authService.login(payload);

    expect(result).toEqual({ access_token: "token" });
    expect(usersApi.post).toHaveBeenCalledTimes(1);
    expect(usersApi.post).toHaveBeenCalledWith(
      "/login",
      expect.any(URLSearchParams),
      expect.objectContaining({
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }),
    );

    const body = usersApi.post.mock.calls[0][1];
    expect(body.get("username")).toBe("test-user");
    expect(body.get("password")).toBe("secret");
  });

  it("authService.register sends a complete registration payload", async () => {
    usersApi.post.mockResolvedValue({ data: { id: 1 } });

    const payload = {
      username: "newuser",
      email: "newuser@example.com",
      plain_password: "password123",
    };

    const result = await authService.register(payload);

    expect(result).toEqual({ id: 1 });
    expect(usersApi.post).toHaveBeenCalledWith("/Signup", {
      username: "newuser",
      email: "newuser@example.com",
      plain_password: "password123",
      role: "buyer",
    });
  });

  it("authService.googleAuth sends id_token and never sends null values", async () => {
    usersApi.post.mockResolvedValue({ data: { success: true } });

    const result = await authService.googleAuth("token-value");

    expect(result).toEqual({ success: true });
    expect(usersApi.post).toHaveBeenCalledWith("/auth/google", {
      id_token: "token-value",
    });
  });

  it("productService.createProduct sends non-empty multipart payload", async () => {
    productsApi.post.mockResolvedValue({ data: { product_id: 101 } });

    const file = new File(["dummy"], "image.png", { type: "image/png" });
    const payload = {
      product_id: 101,
      Product_name: "Cool Shirt",
      Product_details: "A soft cotton shirt",
      product_quantity: 5,
      price: 39.99,
      file,
    };

    const result = await productService.createProduct(payload);
    expect(result).toEqual({ product_id: 101 });
    expect(productsApi.post).toHaveBeenCalledTimes(1);

    const formData = productsApi.post.mock.calls[0][1];
    expect(formData.get("Product_id")).toBe("101");
    expect(formData.get("Product_name")).toBe("Cool Shirt");
    expect(formData.get("Product_details")).toBe("A soft cotton shirt");
    expect(formData.get("product_quantity")).toBe("5");
    expect(formData.get("price")).toBe("39.99");
    expect(formData.get("file")).toBe(file);
    expect(productsApi.post.mock.calls[0][2]).toEqual({
      headers: { "Content-Type": "multipart/form-data" },
    });
  });

  it("productService.updateProduct uses the correct endpoint and payload", async () => {
    productsApi.put.mockResolvedValue({ data: { updated: true } });

    const payload = { Product_name: "Updated shirt" };
    const result = await productService.updateProduct(101, payload);

    expect(result).toEqual({ updated: true });
    expect(productsApi.put).toHaveBeenCalledWith("/product/101", payload);
  });

  it("productService.deleteProduct calls the delete endpoint correctly", async () => {
    productsApi.delete.mockResolvedValue({ data: { deleted: true } });

    const result = await productService.deleteProduct(101);

    expect(result).toEqual({ deleted: true });
    expect(productsApi.delete).toHaveBeenCalledWith("/product/101");
  });

  it("inventoryService.checkInventory constructs the path with productId and quantity", async () => {
    inventoryApi.get.mockResolvedValue({ data: { available: true } });

    const result = await inventoryService.checkInventory(55, 3);

    expect(result).toEqual({ available: true });
    expect(inventoryApi.get).toHaveBeenCalledWith("/check_inventory/55/3");
  });

  it("orderService.createOrder sends a valid order payload", async () => {
    ordersApi.post.mockResolvedValue({ data: { success: true } });

    const payload = {
      order_id: 200,
      product_id: 101,
      quantity: 2,
      total_price: 79.98,
    };

    const result = await orderService.createOrder(payload);

    expect(result).toEqual({ success: true });
    expect(ordersApi.post).toHaveBeenCalledWith("/create_order", payload);
  });

  it("orderService.updateOrder uses the corrected update endpoint", async () => {
    ordersApi.put.mockResolvedValue({ data: { updated: true } });

    const payload = { status: "shipped" };
    const result = await orderService.updateOrder("200", payload);

    expect(result).toEqual({ updated: true });
    expect(ordersApi.put).toHaveBeenCalledWith("/update_order/200", payload);
  });

  it("paymentService.createPayment sends a complete payment payload", async () => {
    paymentApi.post.mockResolvedValue({ data: { payment_id: 300 } });

    const payload = {
      amount: 99.99,
      currency: "USD",
      method: "card",
      order_id: 200,
    };

    const result = await paymentService.createPayment(payload);

    expect(result).toEqual({ payment_id: 300 });
    expect(paymentApi.post).toHaveBeenCalledWith("/create_payment/", payload);
  });

  it("aiChatbotService.sendMessage sends a non-empty message and session_id", async () => {
    aiChatbotApi.post.mockResolvedValue({ data: { answer: "Hello!" } });

    const result = await aiChatbotService.sendMessage("Hello", "session-123");

    expect(result).toEqual({ answer: "Hello!" });
    expect(aiChatbotApi.post).toHaveBeenCalledWith("/chat", {
      message: "Hello",
      session_id: "session-123",
    });
  });

  it("aiDesignService.createAICenterDesign sends the full design request payload", async () => {
    aiDesignApi.post.mockResolvedValue({ data: { record_id: 400 } });

    const payload = {
      title: "New AI design",
      description: "Create a summer collection graphic",
      user_id: 10,
    };

    const result = await aiDesignService.createAICenterDesign(payload);

    expect(result).toEqual({ record_id: 400 });
    expect(aiDesignApi.post).toHaveBeenCalledWith("/ai-center/create", payload);
  });

  it("notificationService.getServiceStatus calls the notification root endpoint", async () => {
    notificationApi.get.mockResolvedValue({ data: { status: "ok" } });

    const result = await notificationService.getServiceStatus();

    expect(result).toEqual({ status: "ok" });
    expect(notificationApi.get).toHaveBeenCalledWith("/");
  });
});
