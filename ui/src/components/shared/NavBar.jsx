import {NavLink} from 'react-router-dom';
import LogoutButton from '../Logout';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../shared/AuthContext';

const NavBar = () => {
  const {isAuthenticated} = useAuth();
  console.log(isAuthenticated)

  const navigate = useNavigate();
  const handleClick = (e) => {
    navigate('/Login')
  }
  const linkClass = ({isActive}) => isActive ? 'bg-indigo-800 text-white hover:bg-indigo-800 hover:text-white rounded-full px-3 py-2' : 'text-white hover:bg-indigo-800 hover:text-white rounded-full px-3 py-2';
  return (
    <nav className="bg-indigo-600 border-b border-indigo-500">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
            <div className="md:ml-auto">
              <div className="flex space-x-2">
                <NavLink
                  to="/"
                  className={linkClass}
                >
                  Home
                </NavLink>
                <NavLink
                  to="/jobs"
                  className={linkClass}
                >
                  Jobs
                </NavLink>
                <NavLink
                  to="/add-job"
                  className={linkClass}
                >
                  Add Job
                </NavLink>
                <button className={!isAuthenticated? ' text-slate-50 bg-orange-400 hover:bg-orange-500 font-bold py-2 px-4 rounded-full' : 'hidden'} onClick={handleClick}>Login</button>
                <LogoutButton></LogoutButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
