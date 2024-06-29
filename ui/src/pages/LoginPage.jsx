import Login from '../components/Login'
import { useNavigate } from 'react-router-dom'
const LoginPage = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/');
  }
  return (
    <div>
        <button onClick={handleClick} className='mt-6 ml-6 bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline'>Back to home</button>
        <Login></Login>
    </div>
  )
}

export default LoginPage