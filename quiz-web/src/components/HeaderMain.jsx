import React from 'react';
import { NavLink } from 'react-router-dom';
// Import các icon cần thiết theo mô tả của bạn
import { FaPuzzlePiece, FaSearch, FaPlus, FaBell, FaUserCircle } from 'react-icons/fa';

const HeaderMain = () => {
    
    return (
        // Header bọc ngoài cùng: full độ rộng, có đổ bóng nhẹ, viền dưới và cố định chiều cao
        <header className="w-full bg-white border-b border-gray-200 shadow-sm h-16 px-6 flex items-center justify-between">
            
            {/* DIV 1: KHỐI BÊN TRÁI (Logo + Ô tìm kiếm) */}
            <div className="flex items-center gap-8 flex-1 max-w-xl">
                {/* Logo giữ nguyên của bạn */}
                <div className="flex items-center gap-2 shrink-0">
                    <FaPuzzlePiece className="text-[#2563EB] text-xl" />
                    <strong className="text-[#2563EB] text-xl">QuizMaster</strong>
                </div>

                {/* Ô tìm kiếm có icon bên trong */}
                <div className="relative w-full hidden sm:block">
                    {/* Icon tìm kiếm đặt tuyệt đối bên trái ô input */}
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-900">
                        <FaSearch className="text-sm" />
                    </span>
                    <input
                        type="text"
                        placeholder="Tìm kiếm bài trắc nghiệm, thư mục..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-400 rounded-lg text-sm text-gray-700 placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                    />
                </div>
            </div>

            {/* DIV 2: KHỐI BÊN PHẢI (Nút tạo mới + Icon thông báo + Icon user) */}
            <div className="flex items-center gap-4">
                
                {/* Nút tạo mới có icon */}
                <NavLink 
                    to="/createquiz" 
                    className="flex items-center gap-2 bg-[#2563EB] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm transition-all"
                >
                    <FaPlus className="text-xs" />
                    <span>Tạo mới</span>
                </NavLink>

                {/* Icon thông báo có hiệu ứng hover và chấm đỏ nhỏ báo hiệu (Tùy chọn) */}
                <div className="relative">
                    <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-all">
                        <FaBell className="text-lg" />
                    </button>
                    {/* Chấm đỏ thông báo */}
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </div>

                {/* Đường kẻ dọc ngăn cách nhẹ giữa các icon (Tùy chọn cho đẹp) */}
                <div className="h-6 w-[1px] bg-gray-200 mx-1"></div>

                {/* Icon thông tin người dùng để nhấn */}
                <button className="text-gray-600 hover:text-[#2563EB] p-1 rounded-full transition-all focus:outline-none">
                    <FaUserCircle className="text-2xl" />
                </button>

            </div>

        </header>
    );
};

export default HeaderMain;