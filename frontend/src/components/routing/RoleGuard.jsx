import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { authService } from '../../services/authService';

const RoleGuard = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, status } = useSelector((state) => state.auth);
  const location = useLocation();
  const token = authService.getAuthToken();

  // Show loading spinner if currently loading user info
  if (status === 'loading' || (status === 'idle' && token)) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primaryColor"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user && !allowedRoles.includes(user.role)) {
    // Redirect to home if they don't have access to this page
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleGuard;
