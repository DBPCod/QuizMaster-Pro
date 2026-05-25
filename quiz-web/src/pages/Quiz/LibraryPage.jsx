import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaSortAmountDown, FaEllipsisH, FaEdit, FaTrashAlt, 
  FaRegClock, FaListOl, FaSpinner, FaExclamationCircle,
  FaChevronLeft, FaChevronRight 
} from 'react-icons/fa';
import quizService from '../../services/quizService'; 

const LibraryPage = () => {
    const navigate = useNavigate();
    const [openMenuId, setOpenMenuId] = useState(null);
    
    // --- CÁC STATE QUẢN LÝ DỮ LIỆU VÀ TRẠNG THÁI API ---
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- STATE QUẢN LÝ PHÂN TRANG ---
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const PAGE_LIMIT = 6; // Số lượng item trên mỗi trang

    // Ảnh mặc định cho tất cả quiz
    const defaultQuizImage = "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=500&auto=format&fit=crop&q=60";

    // --- GỌI API KHI COMPONENT MOUNT HOẶC ĐỔI PAGE ---
    useEffect(() => {
        const loadQuizzes = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Truyền currentPage và limit vào service
                const response = await quizService.quizzes(currentPage, PAGE_LIMIT);
                
                const data = response?.data ? response.data : response;
                
                setQuizzes(data?.items || []);
                
                // Lấy totalPages từ Backend trả về (Giả định BE trả về totalPages hoặc tổng số record 'totalCount')
                // Nếu BE trả về totalCount, bạn tính: Math.ceil(data.totalCount / PAGE_LIMIT)
                setTotalPages(data?.totalPages || 1);

            } catch (err) {
                console.error("Lỗi khi tải danh sách bài Quiz:", err);
                setError("Không thể tải danh sách bài trắc nghiệm. Vui lòng kiểm tra lại kết nối!");
            } finally {
                setLoading(false);
            }
        };

        loadQuizzes();
    }, [currentPage]); // Theo dõi sát sao currentPage để kích hoạt gọi lại API

    // Hàm định dạng thời gian sang kiểu Việt Nam
    const formatDate = (dateString) => {
        if (!dateString) return "Không rõ thời gian";
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const toggleMenu = (id, event) => {
        event.stopPropagation();
        setOpenMenuId(openMenuId === id ? null : id);
    };

    const handleEditQuizClick = (id) => {
        setOpenMenuId(null);
        navigate(`/editquiz/${id}`);
    };

    // Hàm xử lý chuyển trang an toàn
    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            setOpenMenuId(null); // Đóng các menu đang mở nếu có
            // Tùy chọn: Cuộn mượt lên đầu trang khi qua trang mới
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // --- GIAO DIỆN KHI ĐANG TẢI DỮ LIỆU ---
    if (loading) {
        return (
            <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
                <FaSpinner className="animate-spin text-blue-600 text-4xl mb-3" />
                <p className="text-gray-500 font-medium text-sm">Đang tải danh sách thư viện...</p>
            </div>
        );
    }

    // --- GIAO DIỆN KHI XẢY RA LỖI MẠNG / API ---
    if (error) {
        return (
            <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
                <FaExclamationCircle className="text-red-500 text-4xl mb-3" />
                <p className="text-gray-700 font-semibold text-base mb-2">{error}</p>
                <button 
                    onClick={() => setCurrentPage(1)} // Thử reset lại về trang 1
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-all shadow-sm"
                >
                    Thử lại
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full min-h-screen bg-gray-50 p-6 animate-fadeIn justify-between">
            <div>
                {/* THÀNH PHẦN 1: TIÊU ĐỀ THƯ VIỆN & SORT */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-gray-200 gap-4">
                    <div>
                        <h5 className="text-2xl font-bold text-gray-800 text-left">Thư viện của tôi</h5>
                        <p className="text-sm text-gray-500 mt-1">Quản lý và tổ chức các bài trắc nghiệm của bạn</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                        <button className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-all">
                            <FaSortAmountDown /> Gần đây nhất
                        </button>
                    </div>
                </div>

                {/* THÀNH PHẦN 2: GRID LƯỚI DANH SÁCH BÀI QUIZ */}
                {quizzes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center pt-20">
                        <p className="text-gray-400 font-medium text-sm">Thư viện hiện tại đang rỗng. Hãy tạo bài Quiz mới!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
                        {quizzes.map((quiz) => (
                            <div key={quiz.quizId} className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col">
                                <div className="h-40 w-full overflow-hidden bg-gray-200 relative">
                                    <img src={defaultQuizImage} alt={quiz.title} className="w-full h-full object-cover" />
                                    {quiz.description && (
                                        <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] font-medium px-2 py-0.5 rounded backdrop-blur-xs max-w-[90%] truncate">
                                            {quiz.description}
                                        </span>
                                    )}
                                </div>

                                <div className="p-4 flex-grow flex flex-col justify-between">
                                    <div className="flex justify-between items-start gap-2 relative">
                                        <h3 className="font-semibold text-gray-800 line-clamp-2 text-left block text-base flex-grow">
                                            {quiz.title}
                                        </h3>
                                        
                                        <div className="relative">
                                            <button 
                                                onClick={(e) => toggleMenu(quiz.quizId, e)} 
                                                className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-all"
                                            >
                                                <FaEllipsisH />
                                            </button>

                                            {openMenuId === quiz.quizId && (
                                                <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10">
                                                    <button 
                                                        onClick={() => handleEditQuizClick(quiz.quizId)}
                                                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-all"
                                                    >
                                                        <FaEdit className="text-blue-500" /> Chỉnh sửa
                                                    </button>
                                                    <button 
                                                        onClick={() => { alert(`Xóa quiz id: ${quiz.quizId}`); setOpenMenuId(null); }}
                                                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-all border-t border-gray-100"
                                                    >
                                                        <FaTrashAlt className="text-red-500" /> Xóa
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between text-xs text-gray-400 mt-4 pt-3 border-t border-gray-50">
                                        <div className="flex items-center gap-1">
                                            <FaListOl />
                                            <span>{quiz.totalQuestions} câu hỏi</span>
                                        </div>
                                        <div className="flex items-center gap-1" title="Ngày khởi tạo">
                                            <FaRegClock />
                                            <span>{formatDate(quiz.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* THÀNH PHẦN 3: THANH PHÂN TRANG (PAGINATION PANEL) */}
            {quizzes.length > 0 && totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12 pt-6 border-t border-gray-200">
                    {/* Nút Previous */}
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-lg border transition-all ${
                            currentPage === 1
                                ? 'text-gray-300 border-gray-200 cursor-not-allowed'
                                : 'text-gray-600 border-gray-300 hover:bg-gray-100 active:scale-95'
                        }`}
                    >
                        <FaChevronLeft className="w-3.5 h-3.5" />
                    </button>

                    {/* Danh sách các số trang */}
                    {[...Array(totalPages)].map((_, index) => {
                        const pageNum = index + 1;
                        return (
                            <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={`w-9 h-9 text-sm font-semibold rounded-lg border transition-all ${
                                    currentPage === pageNum
                                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                        : 'text-gray-600 border-gray-300 hover:bg-gray-100 hover:border-gray-400 active:scale-95'
                                }`}
                            >
                                {pageNum}
                            </button>
                        );
                    })}

                    {/* Nút Next */}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-lg border transition-all ${
                            currentPage === totalPages
                                ? 'text-gray-300 border-gray-200 cursor-not-allowed'
                                : 'text-gray-600 border-gray-300 hover:bg-gray-100 active:scale-95'
                        }`}
                    >
                        <FaChevronRight className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default LibraryPage;