import HeaderAuth from "../pages/HeaderAuthPage";
import { Outlet } from 'react-router-dom';
import { FaCopyright } from 'react-icons/fa';
import HeaderAuthPage from "../pages/HeaderAuthPage";
export default function AuthLayout() {
  return (
    <div className="flex flex-col">
      <HeaderAuthPage></HeaderAuthPage>
      <main className="flex-grow flex items-center justify-center">
        <Outlet></Outlet>
      </main>
      <footer className="flex items-center justify-center py-4 text-center border-t">
        <FaCopyright className="mx-1"></FaCopyright> 2026 QuizMaster học hỏi không ngừng!
      </footer>
    </div>
  );
}
