import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();


  if (!isAuthenticated) {
    return <Navigate to="/Login" />;
  }

  return children;
};

export default ProtectedRoute;
