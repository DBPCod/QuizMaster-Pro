import HeaderAuth from "../pages/HeaderAuthPage";
import { Outlet } from 'react-router-dom';
import { FaCopyright } from 'react-icons/fa';
import HeaderAuthPage from "../pages/HeaderAuthPage";
const QuizLayout = () =>
{
  return (
      <div className="flex flex-col h-screen overflow-hidden">
        <div className="flex-shrink-0">
          <HeaderAuthPage />
        </div>
        <main className="flex-grow w-full overflow-hidden">
          <Outlet></Outlet>
        </main>
      </div>
    );
};

export default QuizLayout;