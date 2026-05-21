import HeaderAuth from "../pages/HeaderAuthPage";
import { Outlet } from 'react-router-dom';
import { FaCopyright } from 'react-icons/fa';
import HeaderMain from "../components/HeaderMain";
const QuizLayout = () =>
{
  return (
      <div className="flex flex-col h-screen overflow-hidden">
        <div className="flex-shrink-0">
          <HeaderMain />
        </div>
        <main className="flex-grow w-full overflow-hidden">
          <Outlet></Outlet>
        </main>
      </div>
    );
};

export default QuizLayout;