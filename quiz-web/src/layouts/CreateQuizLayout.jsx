import React, { useState, useRef, useEffect } from 'react';
import { 
    FaPuzzlePiece, FaListUl, FaTrashAlt, FaCopy, FaPlus, 
    FaFileUpload, FaInfoCircle, FaSignOutAlt, FaEye, FaSave,
    FaHeading, FaCheck, FaChevronDown, FaCheckSquare
} from 'react-icons/fa';

const CreateQuizLayout = () => {
    // State giả lập danh sách câu hỏi
    const [questions, setQuestions] = useState([
        { id: 1, text: "Cuộc khởi nghĩa Lam Sơn do ai lãnh đạo?" },
        { id: 2, text: "Nguyễn Trãi dâng Bình Ngô sách ở đâu?" }
    ]);

    // State chọn câu trả lời đúng cho 4 đáp án (đáp án A, B, C, D)
    const [correctAnswers, setCorrectAnswers] = useState({
        A: true, 
        B: false,
        C: false,
        D: false
    });

    // --- CÁC STATE NÂNG CẤP CHO CUSTOM COMBOBOX ---
    const [isOpen, setIsOpen] = useState(false);
    const [selectedType, setSelectedType] = useState('single'); // 'single' hoặc 'multiple'
    const comboboxRef = useRef(null);

    // Đóng combobox khi người dùng click ra ngoài màn hình
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (comboboxRef.current && !comboboxRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Hàm xử lý khi check vào đáp án đúng (Mặc định chế độ Một lựa chọn)
    const handleSelectCorrect = (key) => {
        setCorrectAnswers({
            A: key === 'A',
            B: key === 'B',
            C: key === 'C',
            D: key === 'D'
        });
    };

    return (
        <div className="flex flex-col w-full h-screen bg-gray-50 flex-grow">
            
            {/* ================= DIV 1: HEADER CHỨA CÁC NÚT HÀNH ĐỘNG ================= */}
            <div className="w-full h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between gap-4 shrink-0 shadow-sm z-10">
                {/* Logo bên trái */}
                <div className="flex items-center gap-2 shrink-0">
                    <FaPuzzlePiece className="text-[#2563EB] text-xl" />
                    <strong className="text-[#2563EB] text-xl">QuizMaster</strong>
                </div>

                {/* Input nhập tiêu đề Quiz ở giữa */}
                <div className="flex-grow max-w-md relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-blue-500">
                        <FaHeading className="text-xs" />
                    </span>
                    <input 
                        type="text" 
                        placeholder="Nhập tên tiêu đề bài Quiz tại đây..." 
                        className="w-full pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:font-normal placeholder:text-gray-400"
                    />
                </div>

                {/* Nhóm nút hành động dạt hết sang bên phải Header */}
                <div className="flex items-center gap-2 shrink-0">
                    <button className="flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-gray-200 transition-all">
                        <FaEye className="text-xs" /> <span>Xem trước</span>
                    </button>
                    
                    <button className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-700 shadow-sm shadow-blue-100 transition-all">
                        <FaSave className="text-xs" /> <span>Lưu bộ câu hỏi</span>
                    </button>

                    <div className="h-5 w-[1px] bg-gray-200 mx-1"></div>

                    <button className="flex items-center gap-1.5 bg-white text-red-600 border border-red-200 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-50 transition-all">
                        <FaSignOutAlt className="text-xs" /> <span>Thoát</span>
                    </button>
                </div>
            </div>

            {/* ================= DIV 2: THÂN MÁY ================= */}
            <div className="flex-grow flex flex-col md:flex-row w-full max-w-7xl mx-auto p-4 gap-4 overflow-hidden h-[calc(100vh-64px)]">
                
                {/* --- DIV CON 1: DANH SÁCH CÂU HỎI (BÊN TRÁI) --- */}
                <div className="w-full md:w-80 bg-white border border-gray-200 rounded-xl p-4 flex flex-col justify-between shadow-sm shrink-0">
                    <div className="flex flex-col flex-grow overflow-y-auto pr-1">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3 shrink-0">
                            <div className="flex items-center gap-2 text-gray-700 font-bold text-sm">
                                <FaListUl className="text-blue-500" />
                                <span>Danh sách câu hỏi</span>
                            </div>
                            <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-2 py-1 rounded-full">
                                {questions.length} câu
                            </span>
                        </div>

                        <div className="space-y-2 mb-4">
                            {questions.map((q, index) => (
                                <div key={q.id} className="group flex items-start justify-between gap-2 p-3 bg-gray-50 hover:bg-blue-50/50 border border-gray-200 rounded-lg transition-all cursor-pointer">
                                    <p className="text-xs text-gray-600 font-medium line-clamp-2">
                                        <span className="font-bold text-blue-600 mr-1">{index + 1}.</span>
                                        {q.text}
                                    </p>
                                    <div className="flex items-center gap-1.5 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
                                        <button className="text-gray-400 hover:text-blue-600 p-0.5" title="Sao chép"><FaCopy className="text-xs" /></button>
                                        <button className="text-gray-400 hover:text-red-500 p-0.5" title="Xóa"><FaTrashAlt className="text-xs" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-3 border-t border-gray-100 space-y-2 shrink-0">
                        <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg text-xs font-semibold hover:bg-blue-700 transition-all shadow-sm">
                            <FaPlus /> Thêm câu hỏi
                        </button>
                        <button className="w-full flex items-center justify-center gap-2 bg-white text-gray-600 border border-gray-200 py-2 rounded-lg text-xs font-semibold hover:bg-gray-50 transition-all">
                            <FaFileUpload /> Nhập từ file
                        </button>
                    </div>
                </div>

                {/* --- DIV CON 2: THÔNG TIN CHI TIẾT & ĐÁP ÁN (BÊN PHẢI) --- */}
                <div className="flex-1 bg-white border border-gray-200 rounded-xl p-5 shadow-sm overflow-y-auto">
                    <div className="flex items-center gap-2 text-gray-700 font-bold text-sm mb-4 pb-2 border-b border-gray-100">
                        <FaInfoCircle className="text-blue-500" />
                        <span>Thông tin cơ bản</span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="flex-grow">
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5 tracking-wider text-left">Nội dung câu hỏi</label>
                            <textarea 
                                rows="2"
                                placeholder="Nhập câu hỏi trắc nghiệm của bạn tại đây..." 
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-blue-500 focus:bg-white transition-all resize-none shadow-inner"
                            />
                        </div>
                        
                        {/* ĐÃ CẬP NHẬT: THAY THẾ SELECT THUẦN THÀNH CUSTOM COMBOBOX XỊN SÒ */}
                        <div className="sm:w-60 shrink-0 relative" ref={comboboxRef}>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5 tracking-wider text-left">Loại lựa chọn</label>
                            
                            {/* Nút bấm kích hoạt Combobox Dropdown */}
                            <button 
                                type="button"
                                onClick={() => setIsOpen(!isOpen)}
                                className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl text-sm font-bold text-blue-600 flex items-center justify-between transition-all hover:bg-blue-100/70 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                            >
                                <div className="flex items-center gap-2">
                                    {selectedType === 'single' ? <FaListUl className="text-xs" /> : <FaCheckSquare className="text-xs" />}
                                    <span>{selectedType === 'single' ? 'Một lựa chọn' : 'Nhiều lựa chọn'}</span>
                                </div>
                                <FaChevronDown className={`text-xs transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Menu danh sách các Tùy chọn đổ xuống khi bấm mở */}
                            {isOpen && (
                                <div className="absolute left-0 mt-1.5 w-full bg-white border border-gray-100 rounded-xl shadow-xl z-20 py-1 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                                    {/* Option 1: Một lựa chọn */}
                                    <button
                                        type="button"
                                        onClick={() => { setSelectedType('single'); setIsOpen(false); }}
                                        className={`w-full px-4 py-2.5 text-sm font-semibold flex items-center justify-between transition-colors text-left
                                            ${selectedType === 'single' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <FaListUl className="text-xs opacity-70" />
                                            <span>Một lựa chọn</span>
                                        </div>
                                        {selectedType === 'single' && <FaCheck className="text-xs" />}
                                    </button>

                                    {/* Option 2: Nhiều lựa chọn (Giả lập disable hoặc cho chọn tùy ý bạn) */}
                                    <button
                                        type="button"
                                        disabled
                                        className="w-full px-4 py-2.5 text-sm font-semibold flex items-center justify-between text-gray-300 bg-gray-50/50 cursor-not-allowed text-left"
                                    >
                                        <div className="flex items-center gap-2">
                                            <FaCheckSquare className="text-xs opacity-50" />
                                            <span>Nhiều lựa chọn</span>
                                        </div>
                                        <span className="text-[10px] bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded font-normal">Sắp có</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Danh sách 4 đáp án chia thành 2 cột */}
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider">Các tùy chọn đáp án</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {['A', 'B', 'C', 'D'].map((label) => {
                            const isCorrect = correctAnswers[label];
                            return (
                                <div 
                                    key={label} 
                                    className={`flex items-center gap-3 p-3.5 border rounded-xl transition-all duration-200
                                        ${isCorrect 
                                            ? 'border-green-500 bg-green-50/20 shadow-sm' 
                                            : 'border-gray-200 bg-gray-50/50 focus-within:border-blue-400 focus-within:bg-white'}`}
                                >
                                    <label className="relative flex items-center justify-center cursor-pointer shrink-0">
                                        <input 
                                            type="checkbox" 
                                            checked={isCorrect}
                                            onChange={() => handleSelectCorrect(label)}
                                            className="sr-only peer" 
                                        />
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                                            ${isCorrect 
                                                ? 'border-green-500 bg-green-500 text-white' 
                                                : 'border-gray-300 bg-white hover:border-gray-400'}`}
                                        >
                                            {isCorrect && <FaCheck className="text-[10px]" />}
                                        </div>
                                    </label>

                                    <span className={`text-sm font-bold ${isCorrect ? 'text-green-600' : 'text-gray-400'}`}>
                                        {label}.
                                    </span>
                                    <input 
                                        type="text" 
                                        placeholder={`Nhập nội dung cho đáp án ${label}...`}
                                        className="w-full bg-transparent text-sm text-gray-700 focus:outline-none font-medium"
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>

        </div>
    );
};

export default CreateQuizLayout;