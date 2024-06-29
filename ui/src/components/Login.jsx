import React, { useState } from 'react';
import { useAuth } from './shared/AuthContext';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useHistory } from './shared/HistoryProvider';

const LoginForm = () => {
  const [isRegistered, setRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const { addToHistory, getPreviousPath } = useHistory();
   

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const USER_NAME = username;
      const PASSWORD = password;
      const response = await axios.post('/api/auth/users/login', { USER_NAME, PASSWORD });

      if (response.status === 200) {
        login();
        setRegister(true);
        var previousPath = getPreviousPath();
        if (previousPath === '/Register' || previousPath === '/Login'){
          previousPath = '/';
        }
        if (previousPath !== undefined && previousPath !== '')
        navigate(previousPath);
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      toast.error(error.response.data || "Something went wrong");
      setRegister(true)
    }
  };

  const handleClick = async (e) => {
    navigate('/Register');
  }

  return (
    <div className="flex-colcontainer m-auto max-w-2xl py-24 flex justify-center items-center min-h-screen">
      <ToastContainer></ToastContainer>
      <div className="w-[80%] md:max-w-[500px] bg-white px-6 py-8 mb-4 shadow-md rounded-md border md:m-0">
        <form className=" max-w-[500px] m-auto" onSubmit={handleSubmit}>
          <h2 className="text-3xl text-center font-bold mb-6">Login</h2>
          <div className="pb-4">
            <label className=" font-semibold">Username:</label>
            <input
              className="border-2 border-gray-300 rounded w-full py-2 pl-2"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="pb-4">
            <label className=" font-semibold">Password:</label>
            <input
              className="border-2 border-gray-300 rounded w-full py-2 pl-2"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            className=" mt-6 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Login
          </button>
          <button
            onClick={handleClick}
            className={isRegistered ? " mt-6 bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline" : ' hidden'}>
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
