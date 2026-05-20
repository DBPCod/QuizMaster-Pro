import React, { useState } from 'react';
// Import các icon cần thiết
import { FaSortAmountDown, FaEllipsisH, FaEdit, FaTrashAlt, FaRegClock, FaListOl } from 'react-icons/fa';

const LibraryPage = () => {
    // State quản lý việc hiển thị Menu 3 chấm (lưu ID của quiz đang được chọn mở menu)
    const [openMenuId, setOpenMenuId] = useState(null);

    // Dữ liệu giả lập (Mock Data) để hiển thị danh sách Quiz
    const quizData = [
        {
            id: 1,
            title: "Lịch sử cuộc Khởi nghĩa Lam Sơn",
            image: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=500&auto=format&fit=crop&q=60",
            questionsCount: 20,
            updatedAt: "2 giờ trước"
        },
        {
            id: 2,
            title: "Kiến trúc máy tính & Hệ điều hành",
            image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&auto=format&fit=crop&q=60",
            questionsCount: 15,
            updatedAt: "1 ngày trước"
        },
        {
            id: 3,
            title: "Lập trình Web nâng nâng cao với React",
            image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&auto=format&fit=crop&q=60",
            questionsCount: 25,
            updatedAt: "3 ngày trước"
        },
        {
            id: 4,
            title: "Lập trình Web nâng nâng cao với React",
            image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&auto=format&fit=crop&q=60",
            questionsCount: 25,
            updatedAt: "5 ngày trước"
        }
    ];

    // Hàm đóng/mở menu 3 chấm
    const toggleMenu = (id) => {
        if (openMenuId === id) {
            setOpenMenuId(null); // Nếu đang mở thì bấm lại sẽ đóng
        } else {
            setOpenMenuId(id); // Mở menu của quiz tương ứng
        }
    };

    return (
        <div className="flex flex-col w-full min-h-screen bg-gray-50 p-6">
            
            {/* DIV CON 1: Title và Thanh Lọc (Sort) */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-gray-200 gap-4">
                <div>
                    <h5 className="text-2xl font-bold text-gray-800 text-left">Thư viện của tôi</h5>
                    <p className="text-sm text-gray-500 mt-1">Quản lý và tổ chức các bài trắc nghiệm của bạn</p>
                </div>
                
                {/* 3 Nút lọc bên phải */}
                <div className="flex flex-wrap gap-2">
                    <button className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-all">
                        <FaSortAmountDown /> Gần đây nhất
                    </button>
                    <button className="bg-white text-gray-600 border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all">
                        Tên A-Z
                    </button>
                    <button className="bg-white text-gray-600 border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all">
                        Tên Z-a
                    </button>
                </div>
            </div>

            {/* DIV CON 2: Danh sách Quiz */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
                {quizData.map((quiz) => (
                    <div key={quiz.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
                        
                        {/* Ảnh Quiz */}
                        <div className="h-40 w-full overflow-hidden bg-gray-200">
                            <img 
                                src={quiz.image} 
                                alt={quiz.title} 
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                        </div>

                        {/* Nội dung thông tin Quiz */}
                        <div className="p-4 flex-grow flex flex-col justify-between">
                            
                            {/* Dòng Tiêu đề và Nút 3 chấm ngang hàng */}
                            <div className="flex justify-between items-start gap-2 relative">
                                <h3 className="font-semibold text-gray-800 line-clamp-2 text-left block text-base flex-grow">
                                    {quiz.title}
                               </h3>
                                
                                {/* Nút 3 chấm */}
                                <div className="relative">
                                    <button 
                                        onClick={() => toggleMenu(quiz.id)}
                                        className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-all"
                                    >
                                        <FaEllipsisH />
                                    </button>

                                    {/* Dropdown Menu (Hiển thị khi openMenuId trùng với ID của card) */}
                                    {openMenuId === quiz.id && (
                                        <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 animate-fadeIn">
                                            <button 
                                                onClick={() => { alert(`Sửa quiz: ${quiz.id}`); setOpenMenuId(null); }}
                                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-all"
                                            >
                                                <FaEdit className="text-blue-500" /> Chỉnh sửa
                                            </button>
                                            <button 
                                                onClick={() => { alert(`Xóa quiz: ${quiz.id}`); setOpenMenuId(null); }}
                                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-all border-t border-gray-100"
                                            >
                                                <FaTrashAlt className="text-red-500" /> Xóa
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Thông tin số câu hỏi & thời gian cập nhật */}
                            <div className="flex items-center justify-between text-xs text-gray-400 mt-4 pt-3 border-t border-gray-50">
                                <div className="flex items-center gap-1">
                                    <FaListOl />
                                    <span>{quiz.questionsCount} câu hỏi</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <FaRegClock />
                                    <span>{quiz.updatedAt}</span>
                                </div>
                            </div>

                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default LibraryPage;