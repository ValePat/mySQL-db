import { useState } from 'react'
import EmailCollector from './components/EmailCollector'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <ToastContainer />
      <EmailCollector/>
    </>
  )
}

export default App
