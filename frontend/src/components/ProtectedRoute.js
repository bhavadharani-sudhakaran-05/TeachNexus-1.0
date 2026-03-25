import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../context/store';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { token, user } = useAuthStore();

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && user?.userType !== 'admin' && user?.userType !== 'school_admin') {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default ProtectedRoute;
