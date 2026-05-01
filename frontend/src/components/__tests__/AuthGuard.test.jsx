import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../store/authSlice';
import AuthGuard from '../routing/AuthGuard';

const Protected = () => <div>Protected Content</div>;
const Login = () => <div>Login Page</div>;

const renderWithStore = (authState) => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: { auth: authState },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/protected" element={<AuthGuard><Protected /></AuthGuard>} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

describe('AuthGuard', () => {
  it('shows a loading spinner when status is loading', () => {
    const { container } = renderWithStore({ isAuthenticated: true, status: 'loading', user: null, error: null });
    expect(container.querySelector('.animate-spin')).toBeTruthy();
  });

  it('does NOT block navigation when isAuthenticated=true and status=idle', () => {
    // After page refresh: token exists but user not yet fetched — should NOT block (AuthInit handles the fetch)
    renderWithStore({ isAuthenticated: true, status: 'idle', user: null, error: null });
    // AuthGuard only blocks on 'loading' — with idle+auth it renders children immediately
    expect(screen.getByText('Protected Content')).toBeTruthy();
  });

  it('redirects to /login when not authenticated and status is succeeded', () => {
    renderWithStore({ isAuthenticated: false, status: 'succeeded', user: null, error: null });
    expect(screen.getByText('Login Page')).toBeTruthy();
  });

  it('renders children when authenticated and status is succeeded', () => {
    renderWithStore({
      isAuthenticated: true,
      status: 'succeeded',
      user: { username: 'alice' },
      error: null,
    });
    expect(screen.getByText('Protected Content')).toBeTruthy();
  });

  it('redirects to /login when status is failed', () => {
    renderWithStore({ isAuthenticated: false, status: 'failed', user: null, error: 'Unauthorized' });
    expect(screen.getByText('Login Page')).toBeTruthy();
  });
});
