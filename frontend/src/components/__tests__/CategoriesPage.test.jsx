import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../store/authSlice';
import cartReducer from '../../store/cartSlice';
import CategoriesPage from '../pages/CategoriesPage';
import { productService } from '../../services/productService';

vi.mock('../../services/productService');
vi.mock('../../services/inventoryService', () => ({
  inventoryService: { checkInventory: vi.fn().mockResolvedValue({ available: true }) },
}));

const mockProducts = [
  { product_id: 1, Product_name: 'T-Shirt', Product_details: 'A cool tee', price: 29.99, category: 'Cotton', product_image: null },
  { product_id: 2, Product_name: 'Hoodie', Product_details: 'Warm hoodie', price: 54.99, category: 'Winter', product_image: null },
];

const store = configureStore({
  reducer: { auth: authReducer, cart: cartReducer },
  preloadedState: {
    auth: { isAuthenticated: true, user: { username: 'test', email: 'test@test.com' }, status: 'succeeded', error: null },
    cart: { items: [], totalItems: 0, totalPrice: 0, isOpen: false },
  },
});

const renderPage = () =>
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CategoriesPage />
      </MemoryRouter>
    </Provider>
  );

describe('CategoriesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows a loading spinner initially', () => {
    productService.getAllProducts.mockImplementation(() => new Promise(() => {})); // never resolves
    renderPage();
    expect(document.querySelector('.animate-spin')).toBeTruthy();
  });

  it('renders products after successful fetch', async () => {
    productService.getAllProducts.mockResolvedValue(mockProducts);
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('T-Shirt')).toBeTruthy();
      expect(screen.getByText('Hoodie')).toBeTruthy();
    });
  });

  it('renders "No products found" when fetch returns empty array', async () => {
    productService.getAllProducts.mockResolvedValue([]);
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('No products found')).toBeTruthy();
    });
  });

  it('renders an error message when fetch fails', async () => {
    productService.getAllProducts.mockRejectedValue(new Error('Network Error'));
    renderPage();
    await waitFor(() => {
      expect(screen.getByText(/Failed to load products/i)).toBeTruthy();
    });
  });

  it('renders category cards', async () => {
    productService.getAllProducts.mockResolvedValue([]);
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Abstract Art')).toBeTruthy();
      expect(screen.getByText('Nature & Landscape')).toBeTruthy();
    });
  });
});
