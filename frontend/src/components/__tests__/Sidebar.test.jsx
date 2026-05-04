import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../store/authSlice';
import cartReducer from '../../store/cartSlice';
import Sidebar from '../ui/Sidebar';

// Sidebar uses framer-motion — mock it to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }) => children,
}));

const renderWithStore = (authState) => {
  const store = configureStore({
    reducer: { auth: authReducer, cart: cartReducer },
    preloadedState: { auth: authState, cart: { items: [], totalItems: 0, totalPrice: 0, isOpen: false } },
  });
  const setIsCollapsed = vi.fn();
  return {
    ...render(
      <Provider store={store}>
        <MemoryRouter>
          <Sidebar isCollapsed={false} setIsCollapsed={setIsCollapsed} />
        </MemoryRouter>
      </Provider>
    ),
    store,
    setIsCollapsed,
  };
};

describe('Sidebar', () => {
  describe('when user is NOT authenticated', () => {
    const unauthState = { isAuthenticated: false, user: null, status: 'idle', error: null };

    it('shows Login link', () => {
      renderWithStore(unauthState);
      expect(screen.getByText('Login')).toBeTruthy();
    });

    it('shows Sign Up link', () => {
      renderWithStore(unauthState);
      expect(screen.getByText('Sign Up')).toBeTruthy();
    });
  });

  describe('when user IS authenticated', () => {
    const authState = {
      isAuthenticated: true,
      user: { username: 'hasaan', email: 'hasaan@test.com', role: 'buyer' },
      status: 'succeeded',
      error: null,
    };

    it("shows the user's username", () => {
      renderWithStore(authState);
      expect(screen.getByText('hasaan')).toBeTruthy();
    });

    it('shows Logout button', () => {
      renderWithStore(authState);
      expect(screen.getByText('Logout')).toBeTruthy();
    });

    it('does NOT show Login link', () => {
      renderWithStore(authState);
      expect(screen.queryByText('Login')).toBeNull();
    });
  });

  describe('when user is authenticated as seller', () => {
    const sellerState = {
      isAuthenticated: true,
      user: { username: 'seller1', email: 'seller@test.com', role: 'seller' },
      status: 'succeeded',
      error: null,
    };

    it('shows Dashboard link to /admin', () => {
      renderWithStore(sellerState);
      const link = screen.getByRole('link', { name: /dashboard/i });
      expect(link.getAttribute('href')).toBe('/admin');
    });
  });

  it('renders main navigation links', () => {
    renderWithStore({ isAuthenticated: false, user: null, status: 'idle', error: null });
    expect(screen.getByText('Home')).toBeTruthy();
    expect(screen.getByText('Categories')).toBeTruthy();
    expect(screen.getByText('Studio')).toBeTruthy();
  });
});
