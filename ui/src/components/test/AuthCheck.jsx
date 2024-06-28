import React, { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/api/auth/auth-check', { withCredentials: true });
        setIsAuthenticated(response.data.authenticated);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <div>
      {isAuthenticated ? (
        <button>Authorized Button</button>
      ) : (
        <p>Please log in to see the button</p>
      )}
    </div>
  );
};

export default App;
