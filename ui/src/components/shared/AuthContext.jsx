import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState();

  const checkAuth = async () => {
    const storedAuthState = Cookies.get('isAuthenticated');    
    if (storedAuthState === "true"){
      const tokenResult = await refreshToken();
      if (tokenResult.status !== 200) {
        logout();
      } else if (tokenResult.status === 200) {
        console.log("token refreshed")
      }
    } else if (storedAuthState !== undefined && storedAuthState !== null) {
      logout();
    }
  }

  const login = () => {
    setIsAuthenticated(true);
    var date = new Date();
    var minutes = 30;
    date.setTime(date.getTime() + (minutes * 60 * 1000));
    Cookies.set('isAuthenticated', 'true', { expires: date });
  };

  const logout = async() => {
    setIsAuthenticated(false);
    Cookies.remove('isAuthenticated');
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    try{
      await axios.delete('/api/auth/users/logout', { withCredentials: true });
    }catch(e){
      console.log(e)
    }
  };

  const refreshToken = async () => {
    try{
      const res = await axios.post('/api/auth/users/refresh',  { withCredentials: true });
      return res;
    }catch(e){
      console.log(e)
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, refreshToken, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
