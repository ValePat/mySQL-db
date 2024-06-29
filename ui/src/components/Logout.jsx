import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/shared/AuthContext';
import { toast } from 'react-toastify';

const LogoutButton = () => {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try{
      const response = await axios.get('/api/auth/logout', { withCredentials: true });
    } catch (e){
      console.log(e)
    }
    await logout();
    toast.success('Succesfully logged out')
  };

  return (
    <button
      className={!isAuthenticated? 'hidden' : 'bg-indigo-950 hover:bg-indigo-900 text-white font-bold py-2 px-4 rounded-full'}
      onClick={handleLogout}
    >
      Logout
    </button>
  );
};

export default LogoutButton;
