import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { authService } from '../../services/authService';

const AuthGuard = ({ children }) => {
  const { isAuthenticated, status } = useSelector((state) => state.auth);
  const location = useLocation();
  const token = authService.getAuthToken();

  // Show spinner only while actively fetching the user profile or waiting for hydration
  if (status === 'loading' || (status === 'idle' && token)) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primaryColor"></div>
      </div>
    );
  }

  // Not authenticated and not in a loading state → redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default AuthGuard;
