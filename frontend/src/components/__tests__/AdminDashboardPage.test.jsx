import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../../store/authSlice";
import AdminDashboardPage from "../pages/AdminDashboardPage";

const { getAllUsers, deleteUser } = vi.hoisted(() => ({
  getAllUsers: vi.fn(),
  deleteUser: vi.fn(),
}));

const { getAllProducts, checkHealth, createProduct, updateProduct, deleteProduct } =
  vi.hoisted(() => ({
    getAllProducts: vi.fn(),
    checkHealth: vi.fn(),
    createProduct: vi.fn(),
    updateProduct: vi.fn(),
    deleteProduct: vi.fn(),
  }));

const { getAllOrders, updateOrder, deleteOrder } = vi.hoisted(() => ({
  getAllOrders: vi.fn(),
  updateOrder: vi.fn(),
  deleteOrder: vi.fn(),
}));

vi.mock("../../services/authService", () => ({
  authService: {
    getAllUsers,
    deleteUser,
    getAuthToken: vi.fn(() => null),
    removeAuthToken: vi.fn(),
    setAuthToken: vi.fn(),
    login: vi.fn(),
    register: vi.fn(),
    googleAuth: vi.fn(),
    getCurrentUser: vi.fn(),
    getUserById: vi.fn(),
  },
}));

vi.mock("../../services/productService", () => ({
  productService: {
    getAllProducts,
    checkHealth,
    createProduct,
    updateProduct,
    deleteProduct,
  },
}));

vi.mock("../../services/orderService", () => ({
  orderService: {
    getAllOrders,
    updateOrder,
    deleteOrder,
  },
}));

const defaultApi = () => {
  getAllUsers.mockResolvedValue([
    { id: 1, username: "buyer1", email: "b@test.com", role: "buyer" },
  ]);
  getAllProducts.mockResolvedValue([
    {
      product_id: 10,
      Product_name: "Mug",
      Product_details: "Ceramic",
      product_quantity: 4,
      price: 12.5,
      category: "drinkware",
    },
  ]);
  getAllOrders.mockResolvedValue([
    {
      order_id: 100,
      user_id: 1,
      product_id: 10,
      product_quantity: 1,
      payment_status: "Pending",
    },
  ]);
  checkHealth.mockResolvedValue({ status: "healthy" });
};

const renderPage = (user) => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: {
      auth: {
        user,
        isAuthenticated: !!user,
        status: "succeeded",
        error: null,
      },
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

describe("AdminDashboardPage (unit)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    defaultApi();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("redirects to /login when there is no authenticated user", async () => {
    renderPage(null);

    await waitFor(() => {
      expect(screen.getByText("Login Page")).toBeTruthy();
    });
  });

  it("shows access denied for non-seller roles", () => {
    renderPage({ id: 9, username: "buyer", email: "x@test.com", role: "buyer" });

    expect(screen.getByText("Seller Dashboard")).toBeTruthy();
    expect(screen.getByText(/Seller accounts only/i)).toBeTruthy();
    expect(getAllUsers).not.toHaveBeenCalled();
  });

  it("loads metrics and lists for a seller after APIs resolve", async () => {
    renderPage({ id: 2, username: "seller1", email: "s@test.com", role: "seller" });

    expect(screen.getByText("Loading dashboard...")).toBeTruthy();

    await waitFor(() => {
      expect(screen.getByText("Seller Dashboard")).toBeTruthy();
    });

    expect(getAllUsers).toHaveBeenCalledTimes(1);
    expect(getAllProducts).toHaveBeenCalledTimes(1);
    expect(getAllOrders).toHaveBeenCalledTimes(1);
    expect(checkHealth).toHaveBeenCalledTimes(1);

    expect(screen.getByText("Total Users")).toBeTruthy();
    expect(screen.getAllByText("1").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Total Products")).toBeTruthy();
    expect(screen.getByText("Inventory Units")).toBeTruthy();
    expect(screen.getByText("4")).toBeTruthy();
    expect(screen.getByText("buyer1")).toBeTruthy();
    expect(screen.getByText(/Order #100/)).toBeTruthy();
  });

  it("shows error banner when dashboard APIs fail", async () => {
    getAllUsers.mockRejectedValueOnce({
      response: { data: { detail: "Forbidden" } },
    });

    renderPage({ id: 2, username: "seller1", email: "s@test.com", role: "seller" });

    await waitFor(() => {
      expect(screen.getByText("Forbidden")).toBeTruthy();
    });
  });

  it("submits create product and refreshes data", async () => {
    const user = userEvent.setup();
    createProduct.mockResolvedValue({});
    defaultApi();

    renderPage({ id: 2, username: "seller1", email: "s@test.com", role: "seller" });

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Product name")).toBeTruthy();
    });

    await user.type(screen.getByPlaceholderText("Product name"), "New Tee");
    await user.type(screen.getByPlaceholderText("Details"), "Soft cotton");
    await user.clear(screen.getByPlaceholderText("Quantity"));
    await user.type(screen.getByPlaceholderText("Quantity"), "10");
    await user.clear(screen.getByPlaceholderText("Price"));
    await user.type(screen.getByPlaceholderText("Price"), "29.99");
    await user.type(screen.getByPlaceholderText("Category"), "apparel");

    const form = document.querySelector("form");
    expect(form).toBeTruthy();
    fireEvent.submit(form);

    await waitFor(() => {
      expect(createProduct).toHaveBeenCalledWith(
        expect.objectContaining({
          Product_name: "New Tee",
          Product_details: "Soft cotton",
          product_quantity: 10,
          price: 29.99,
          category: "apparel",
          Product_id: 0,
        })
      );
    });

    expect(getAllUsers.mock.calls.length).toBeGreaterThanOrEqual(2);
  });

  it("deletes a user after confirm", async () => {
    const user = userEvent.setup();
    vi.stubGlobal("confirm", vi.fn(() => true));
    deleteUser.mockResolvedValue({});

    renderPage({ id: 2, username: "seller1", email: "s@test.com", role: "seller" });

    await waitFor(() => {
      expect(screen.getByText("buyer1")).toBeTruthy();
    });

    const deleteButtons = screen.getAllByRole("button", { name: /^delete$/i });
    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(deleteUser).toHaveBeenCalledWith(1);
    });
  });
});

describe("AdminDashboardPage (integration-style)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getAllUsers.mockResolvedValue([]);
    getAllProducts.mockResolvedValue([
      {
        product_id: 10,
        Product_name: "Mug",
        Product_details: "Ceramic",
        product_quantity: 4,
        price: 12.5,
        category: "drinkware",
      },
    ]);
    getAllOrders.mockResolvedValue([
      {
        order_id: 100,
        user_id: 1,
        product_id: 10,
        product_quantity: 1,
        payment_status: "Pending",
      },
    ]);
    checkHealth.mockResolvedValue({ status: "healthy" });
    updateOrder.mockResolvedValue({});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("submits order status update to order service", async () => {
    const user = userEvent.setup();
    renderPage({ id: 2, username: "seller1", email: "s@test.com", role: "seller" });

    await waitFor(() => {
      expect(screen.getByText(/Order #100/)).toBeTruthy();
    });

    const statusSelect = screen.getByDisplayValue("Pending");
    await user.selectOptions(statusSelect, "Completed");
    await user.click(screen.getAllByRole("button", { name: /^update$/i })[0]);

    await waitFor(() => {
      expect(updateOrder).toHaveBeenCalledWith(
        100,
        expect.objectContaining({
          order_id: 100,
          payment_status: "Completed",
        })
      );
    });
  });

  it("deletes a product after confirmation", async () => {
    const user = userEvent.setup();
    vi.stubGlobal("confirm", vi.fn(() => true));
    deleteProduct.mockResolvedValue({});

    renderPage({ id: 2, username: "seller1", email: "s@test.com", role: "seller" });

    await waitFor(() => {
      expect(screen.getByText("Mug")).toBeTruthy();
    });

    const productsSection = screen
      .getByText("Products (Update/Delete)")
      .closest("section");
    const deleteInProducts = within(productsSection).getByRole("button", {
      name: /^delete$/i,
    });
    await user.click(deleteInProducts);

    await waitFor(() => {
      expect(deleteProduct).toHaveBeenCalledWith(10);
    });
  });
});
