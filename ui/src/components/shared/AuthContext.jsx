import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const storedAuthState = Cookies.get('isAuthenticated');
    return storedAuthState === 'true' || false;
  });

  const login = () => {
    setIsAuthenticated(true);
    Cookies.set('isAuthenticated', 'true', { expires: 7 });
  };

  const logout = () => {
    setIsAuthenticated(false);
    Cookies.remove('isAuthenticated');
  };

  const clearAuth = () => {
    setIsAuthenticated(false);
    Cookies.remove('isAuthenticated');
  };


  useEffect(() => {
    Cookies.set('isAuthenticated', isAuthenticated ? 'true' : 'false', { expires: 7 });
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, clearAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
