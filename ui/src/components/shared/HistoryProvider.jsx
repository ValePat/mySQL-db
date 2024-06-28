import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const HistoryContext = createContext();

export const HistoryProvider = ({ children }) => {
  const [historyStack, setHistoryStack] = useState([]);
  const location = useLocation();

  useEffect(() => {
    setHistoryStack((prevStack) => [...prevStack, location.pathname]);
  }, [location.pathname]);

  const getPreviousPath = () => {
    if (historyStack.length > 1) {
      return historyStack[historyStack.length - 2];
    }
    return null;
  };

  return (
    <HistoryContext.Provider value={{ getPreviousPath }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => useContext(HistoryContext);
