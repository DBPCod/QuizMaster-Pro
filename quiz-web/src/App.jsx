import { useState } from 'react';
import './App.css'
import LoginPage from './pages/LoginPage';
import AuthLayout from './layouts/AuthLayout';

function App() {
  const [count, setCount] = useState(0)

  return (
    AuthLayout()
  );
}
export default App
