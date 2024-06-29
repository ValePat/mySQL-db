import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

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

  const logout = async() => {
    setIsAuthenticated(false);
    Cookies.remove('isAuthenticated');
    try{
      await axios.delete('/api/auth/users/logout', { withCredentials: true });
    }catch(e){
      console.log(e)
    }
  };

  const clearAuth = async () => {
    setIsAuthenticated(false);
    Cookies.remove('isAuthenticated');
    try{
      await axios.delete('/api/users/logout');
    }catch(e){
      console.log(e)
    }
  };


  useEffect(() => {
    var date = new Date();
    var minutes = 30;
    date.setTime(date.getTime() + (minutes * 60 * 1000));
    Cookies.set('isAuthenticated', isAuthenticated ? 'true' : 'false', { expires: date });
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, clearAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
