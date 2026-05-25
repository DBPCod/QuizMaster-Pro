import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { FaPuzzlePiece, FaSearch, FaPlus, FaBell, FaUserCircle } from 'react-icons/fa';

const HeaderMain = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    // Lấy từ khóa ban đầu từ URL nếu có (ví dụ khi người dùng F5 trang)
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

    // Kỹ thuật Debounce: Đồng bộ dữ liệu từ ô Input lên URL Search Params
    useEffect(() => {
        const handler = setTimeout(() => {
            // Chuẩn hóa chuỗi tìm kiếm
            const cleanSearch = searchTerm.trim();
            
            if (cleanSearch) {
                // Đẩy sang trang thư viện kèm theo query tham số tìm kiếm
                navigate(`/quizpage/library?search=${encodeURIComponent(cleanSearch)}`);
            } else {
                // Nếu xóa trống ô input, quay về trang library gốc không có params
                // Kiểm tra nếu đang ở trang library thì mới navigate xóa để tránh chuyển trang ngoài ý muốn
                if (window.location.pathname === '/library') {
                    navigate('/library');
                }
            }
        }, 500); // Người dùng dừng gõ 500ms mới kích hoạt đẩy lên URL

        return () => clearTimeout(handler);
    }, [searchTerm, navigate]);

    return (
        <header className="w-full bg-white border-b border-gray-200 shadow-sm h-16 px-6 flex items-center justify-between">
            {/* DIV 1: KHỐI BÊN TRÁI (Logo + Ô tìm kiếm) */}
            <div className="flex items-center gap-8 flex-1 max-w-xl">
                <div className="flex items-center gap-2 shrink-0">
                    <FaPuzzlePiece className="text-[#2563EB] text-xl" />
                    <strong className="text-[#2563EB] text-xl">QuizMaster</strong>
                </div>

                {/* Ô tìm kiếm */}
                <div className="relative w-full hidden sm:block">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-900">
                        <FaSearch className="text-sm" />
                    </span>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Tìm kiếm bài trắc nghiệm, thư mục..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-400 rounded-lg text-sm text-gray-700 placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                    />
                </div>
            </div>

            {/* DIV 2: KHỐI BÊN PHẢI (Giữ nguyên code cũ của bạn) */}
            <div className="flex items-center gap-4">
                <NavLink 
                    to="/createquiz" 
                    className="flex items-center gap-2 bg-[#2563EB] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm transition-all"
                >
                    <FaPlus className="text-xs" />
                    <span>Tạo mới</span>
                </NavLink>

                <div className="relative">
                    <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-all">
                        <FaBell className="text-lg" />
                    </button>
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </div>

                <div className="h-6 w-[1px] bg-gray-200 mx-1"></div>

                <button className="text-gray-600 hover:text-[#2563EB] p-1 rounded-full transition-all focus:outline-none">
                    <FaUserCircle className="text-2xl" />
                </button>
            </div>
        </header>
    );
};

export default HeaderMain;