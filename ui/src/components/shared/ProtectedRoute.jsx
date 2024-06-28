import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, clearAuth } = useAuth();

  useEffect(() => {
    const storedAuthState = Cookies.get('isAuthenticated');
    if (storedAuthState !== 'true') {
      const handleLogout = async () => {
        await clearAuth();
        console.log("cleared cookies")
      };
      handleLogout();
    }
    return () => {
    };
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/Login" />;
  }

  return children;
};

export default ProtectedRoute;
