import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FaThLarge, FaBook, FaFolder, FaChartBar } from 'react-icons/fa'; // Lưu ý: đổi thành 'react-icons/fa' nếu bị lỗi chữ index

const QuizPage = () => {
    const navItems = [
        { path: 'dashboard', label: 'Bảng điều khiển', icon: <FaThLarge /> },
        { path: 'library', label: 'Thư viện', icon: <FaBook /> },
        { path: 'folders', label: 'Thư mục', icon: <FaFolder /> },
        { path: 'reports', label: 'Báo cáo', icon: <FaChartBar /> },
    ];

    return (
        // Đổi sang grid 10 cột, chiều cao h-full cố định
        <div className="grid grid-cols-10 w-full h-full gap-4 p-4 bg-gray-50 overflow-hidden">
            
            {/* DIV CON 1: Menu bên trái chiếm 2 phần (20%) */}
            <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col overflow-y-auto">
                <h2 className="text-xs font-bold !text-[#2563EB] uppercase tracking-wider mb-4 px-2">
                    Hệ thống Quiz
                </h2>
                <ul className="space-y-1">
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) => `
                                    w-full flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-all duration-200
                                    ${isActive 
                                        ? 'bg-blue-600 text-white shadow-md' 
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                    }
                                `}
                            >
                                <span className="text-base">{item.icon}</span>
                                <span>{item.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>

            {/* DIV CON 2: Nội dung thay đổi chiếm 8 phần (80%) */}
            <div className="col-span-8 h-full bg-white border border-gray-200 rounded-xl p-6 shadow-sm overflow-y-auto">
                <Outlet />
            </div>
        </div>
    );
};

export default QuizPage;
