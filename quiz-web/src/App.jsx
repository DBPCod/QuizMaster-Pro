import { useState } from 'react';
import './App.css'
import LoginPage from './pages/LoginPage';
import AuthLayout from './layouts/AuthLayout';
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import QuizPage from './pages/Quiz/QuizPage';
import { ToastContainer } from 'react-toastify';
import QuizLayout from './layouts/QuizLayout';
import LibraryPage from './pages/Quiz/LibraryPage';
import CreateQuizLayout from './layouts/CreateQuizLayout';
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

      <Routes>
        <Route element={<QuizLayout></QuizLayout>}>
          <Route path="/quizpage" element={<QuizPage></QuizPage>}>
            <Route path="library" element={<LibraryPage />} />
          </Route>
        </Route>
      </Routes>

      <Routes>
        <Route element={<CreateQuizLayout></CreateQuizLayout>}>
          <Route path="/createquiz" element={<CreateQuizLayout></CreateQuizLayout>}>
          </Route>
        </Route>
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
    </BrowserRouter>
  );
}
export default App
