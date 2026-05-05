import { useState } from 'react';
import './App.css'
import LoginPage from './pages/LoginPage';
import AuthLayout from './layouts/AuthLayout';
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout></AuthLayout>}>
          <Route path="/login" element={<LoginPage></LoginPage>}></Route>
          <Route path="/register" element={<RegisterPage></RegisterPage>}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App
