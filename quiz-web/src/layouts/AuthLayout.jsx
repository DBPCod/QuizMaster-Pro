import HeaderAuth from "../pages/HeaderAuth";
import { Outlet } from 'react-router-dom';
export default function AuthLayout() {
  return (
    <div className="flex flex-col">
      <HeaderAuth></HeaderAuth>
      <main className="flex-grow flex items-center justify-center">
        <Outlet></Outlet>
      </main>
      <footer className="py-4 text-center border-t">2026 My App</footer>
    </div>
  );
}
