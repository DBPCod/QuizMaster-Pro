import React, { useState, useRef, useEffect } from 'react';
import { 
    FaPuzzlePiece, FaListUl, FaTrashAlt, FaCopy, FaPlus, 
    FaFileUpload, FaInfoCircle, FaSignOutAlt, FaEye, FaSave,
    FaHeading, FaCheck, FaChevronDown, FaCheckSquare
} from 'react-icons/fa';
import {createQuizRequest} from '../dtos/requests/createQuizRequest';
import { useNavigate } from 'react-router-dom';
import quizService from '../services/quizService';
const CreateQuizLayout = () => {
    // --- STATE THÔNG TIN CHUNG ---
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('Bài trắc nghiệm được tạo từ hệ thống');

    // --- STATE DANH SÁCH CÂU HỎI TOÀN DIỆN ---
    const [questions, setQuestions] = useState([
        { 
            id: 1, 
            content: "", 
            type: 0, // Mặc định Single Choice
            score: 10,
            answers: [
                { content: "", isCorrect: true },
                { content: "", isCorrect: false },
                { content: "", isCorrect: false },
                { content: "", isCorrect: false }
            ]
        }
    ]);

    // Track câu hỏi nào đang được mở ra chỉnh sửa ở vùng bên phải
    const [activeQuestionId, setActiveQuestionId] = useState(1);

    // Lấy object dữ liệu của câu hỏi hiện tại đang active
    const currentQuestion = questions.find(q => q.id === activeQuestionId) || questions[0];

    // --- STATE CUSTOM COMBOBOX ---
    const [isOpen, setIsOpen] = useState(false);
    const comboboxRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (comboboxRef.current && !comboboxRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // ================= 2. CÁC HÀM XỬ LÝ LOGIC NGHIỆP VỤ =================

    // Cập nhật trường bất kỳ (content, score, type) của câu hỏi hiện tại
    const updateCurrentQuestionField = (field, value) => {
        setQuestions(questions.map(q => 
            q.id === activeQuestionId ? { ...q, [field]: value } : q
        ));
    };

    // Thêm một câu hỏi mới tinh với template 4 đáp án trống
    const handleAddQuestion = () => {
        const newQuestion = {
            id: Date.now(), // Sinh ID duy nhất ở Client
            content: "",
            type: 0, 
            score: 10,
            answers: [
                { content: "", isCorrect: true }, // Mặc định cho A đúng ban đầu
                { content: "", isCorrect: false },
                { content: "", isCorrect: false },
                { content: "", isCorrect: false }
            ]
        };
        setQuestions([...questions, newQuestion]);
        setActiveQuestionId(newQuestion.id);
    };

    // Sao chép câu hỏi hiện tại
    const handleCopyQuestion = (targetQuestion, e) => {
        e.stopPropagation();
        const duplicated = {
            ...targetQuestion,
            id: Date.now(),
            content: `${targetQuestion.content} (Bản sao)`,
            answers: targetQuestion.answers.map(a => ({ ...a }))
        };
        setQuestions([...questions, duplicated]);
        setActiveQuestionId(duplicated.id);
    };

    // Xóa câu hỏi khỏi danh sách
    const handleDeleteQuestion = (id, e) => {
        e.stopPropagation();
        if (questions.length === 1) {
            alert("Bài trắc nghiệm phải có tối thiểu 1 câu hỏi!");
            return;
        }
        const remains = questions.filter(q => q.id !== id);
        setQuestions(remains);
        if (activeQuestionId === id) {
            setActiveQuestionId(remains[0].id);
        }
    };

    // Xử lý đổi nội dung văn bản của từng phương án đáp án (A, B, C, D)
    const handleAnswerTextChange = (index, value) => {
        const updatedAnswers = currentQuestion.answers.map((ans, idx) => 
            idx === index ? { ...ans, content: value } : ans
        );
        updateCurrentQuestionField('answers', updatedAnswers);
    };

    // Xử lý tích chọn đáp án đúng (Hỗ trợ cả chế độ Single-0 và Multiple-1)
    const handleSelectCorrect = (index) => {
        let updatedAnswers = [];
        
        if (currentQuestion.type === 0) {
            // Chế độ Một lựa chọn: Chỉ duy nhất index này được true, còn lại hủy kích hoạt
            updatedAnswers = currentQuestion.answers.map((ans, idx) => ({
                ...ans,
                isCorrect: idx === index
            }));
        } else {
            // Chế độ Nhiều lựa chọn: Bật/Tắt (Toggle) độc lập giữa các đáp án
            updatedAnswers = currentQuestion.answers.map((ans, idx) => 
                idx === index ? { ...ans, isCorrect: !ans.isCorrect } : ans
            );
        }
        updateCurrentQuestionField('answers', updatedAnswers);
    };

    // Xử lý thay đổi Loại câu hỏi (Nếu chuyển về một lựa chọn, tự động reset chỉ giữ lại 1 đáp án đúng đầu tiên)
    const handleTypeChange = (newType) => {
        let updatedAnswers = [...currentQuestion.answers];
        if (newType === 0) {
            let foundFirstCorrect = false;
            updatedAnswers = currentQuestion.answers.map((ans) => {
                if (ans.isCorrect && !foundFirstCorrect) {
                    foundFirstCorrect = true;
                    return ans;
                }
                return { ...ans, isCorrect: false };
            });
            // Phòng trường hợp chưa có đáp án nào đúng thì gán mặc định cái đầu tiên
            if (!foundFirstCorrect) updatedAnswers[0].isCorrect = true;
        }
        
        setQuestions(questions.map(q => 
            q.id === activeQuestionId ? { ...q, type: newType, answers: updatedAnswers } : q
        ));
        setIsOpen(false);
    };

    // ================= 3. HÀM LƯU & GỌI MAPPING DTO REQUEST =================
    const handleSaveQuiz = async () => {
        if (!title.trim()) {
            alert("Vui lòng nhập tên tiêu đề bài Quiz!");
            return;
        }

        // Gọi hàm biến đổi định dạng sang DTO Request chuẩn Backend
        const quizPayload = createQuizRequest(title, description, questions);

        console.log("Cục Payload DTO đã sẵn sàng gửi lên Backend:", quizPayload);
        
        try {
            // Gửi dữ liệu lên Backend qua Service
            const response = await quizService.create(quizPayload);
            
            // Kiểm tra điều kiện thành công (phụ thuộc vào thuộc tính 'Success' từ ApiResponse của C#)
            if (response && response.success) {
                alert("🎉 Tạo bài trắc nghiệm mới thành công!");
                
                // Tự động chuyển hướng về trang thư viện
                navigate('/quizpage/library');
            } else {
                // Trường hợp Backend trả về status 200 nhưng Success = false (lỗi logic nội bộ)
                alert("Tạo thất bại: " + (response.message || "Không rõ nguyên nhân."));
            }
        } catch (error) {
            console.error("Lỗi khi gọi API tạo Quiz:", error);
            
            // Bóc tách thông báo lỗi chi tiết từ ModelState.IsValid hoặc lỗi hệ thống của Backend
            const serverError = error.response?.data?.message 
                || "Đã xảy ra lỗi kết nối hoặc dữ liệu gửi lên không đúng định dạng.";
                
            alert("Lỗi hệ thống: " + serverError);
        }
    };

    return (
        <div className="flex flex-col w-full h-screen bg-gray-50 flex-grow">
            
            {/* ================= DIV 1: HEADER CHỨA CÁC NÚT HÀNH ĐỘNG ================= */}
            <div className="w-full h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between gap-4 shrink-0 shadow-sm z-10">
                <div className="flex items-center gap-2 shrink-0">
                    <FaPuzzlePiece className="text-[#2563EB] text-xl" />
                    <strong className="text-[#2563EB] text-xl">QuizMaster</strong>
                </div>

                {/* Input nhập tiêu đề Quiz */}
                <div className="flex-grow max-w-md relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-blue-500">
                        <FaHeading className="text-xs" />
                    </span>
                    <input 
                        type="text" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Nhập tên tiêu đề bài Quiz tại đây..." 
                        className="w-full pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:font-normal placeholder:text-gray-400"
                    />
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    
                    {/* Nút trigger hàm đóng gói */}
                    <button 
                        onClick={handleSaveQuiz} 
                        className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-700 shadow-sm shadow-blue-100 transition-all"
                    >
                        <FaSave className="text-xs" /> <span>Lưu bộ câu hỏi</span>
                    </button>

                    <div className="h-5 w-[1px] bg-gray-200 mx-1"></div>

                    {/* Nút Thoát: Tự động chuyển hướng về trang thư viện */}
                    <button 
                        onClick={() => navigate('/quizpage/library')} 
                        className="flex items-center gap-1.5 bg-white text-red-600 border border-red-200 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-50 transition-all"
                    >
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
                                <div 
                                    key={q.id} 
                                    onClick={() => setActiveQuestionId(q.id)}
                                    className={`group flex items-start justify-between gap-2 p-3 border rounded-lg transition-all cursor-pointer text-left
                                        ${q.id === activeQuestionId ? 'bg-blue-50 border-blue-400' : 'bg-gray-50 hover:bg-blue-50/30 border-gray-200'}`}
                                >
                                    <p className="text-xs text-gray-600 font-medium line-clamp-2 flex-grow">
                                        <span className="font-bold text-blue-600 mr-1">{index + 1}.</span>
                                        {q.content || <span className="text-gray-400 italic">Chưa nhập nội dung...</span>}
                                    </p>
                                    <div className="flex items-center gap-1.5 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
                                        <button onClick={(e) => handleCopyQuestion(q, e)} className="text-gray-400 hover:text-blue-600 p-0.5" title="Sao chép"><FaCopy className="text-xs" /></button>
                                        <button onClick={(e) => handleDeleteQuestion(q.id, e)} className="text-gray-400 hover:text-red-500 p-0.5" title="Xóa"><FaTrashAlt className="text-xs" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-3 border-t border-gray-100 space-y-2 shrink-0">
                        <button onClick={handleAddQuestion} className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg text-xs font-semibold hover:bg-blue-700 transition-all shadow-sm">
                            <FaPlus /> Thêm câu hỏi
                        </button>
                        <button className="w-full flex items-center justify-center gap-2 bg-white text-gray-600 border border-gray-200 py-2 rounded-lg text-xs font-semibold hover:bg-gray-50 transition-all">
                            <FaFileUpload /> Nhập từ file
                        </button>
                    </div>
                </div>

                {/* --- DIV CON 2: THÔNG TIN CHI TIẾT & ĐÁP ÁN (BÊN PHẢI) --- */}
                {currentQuestion && (
                    <div className="flex-1 bg-white border border-gray-200 rounded-xl p-5 shadow-sm overflow-y-auto">
                        <div className="flex items-center justify-between text-gray-700 font-bold text-sm mb-4 pb-2 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <FaInfoCircle className="text-blue-500" />
                                <span>Thông tin chi tiết</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="text-xs text-gray-400 font-bold mr-1">Điểm:</span>
                                <input 
                                    type="number"
                                    value={currentQuestion.score}
                                    onChange={(e) => updateCurrentQuestionField('score', e.target.value)}
                                    className="w-16 p-1 bg-gray-50 border border-gray-200 rounded text-center text-xs font-bold text-blue-600 focus:outline-none focus:bg-white focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            <div className="flex-grow">
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5 tracking-wider text-left">Nội dung câu hỏi</label>
                                <textarea 
                                    rows="2"
                                    value={currentQuestion.content}
                                    onChange={(e) => updateCurrentQuestionField('content', e.target.value)}
                                    placeholder="Nhập câu hỏi trắc nghiệm của bạn tại đây..." 
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-blue-500 focus:bg-white transition-all resize-none shadow-inner"
                                />
                            </div>
                            
                            {/* CUSTOM COMBOBOX LOẠI LỰA CHỌN */}
                            <div className="sm:w-60 shrink-0 relative" ref={comboboxRef}>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5 tracking-wider text-left">Loại lựa chọn</label>
                                
                                <button 
                                    type="button"
                                    onClick={() => setIsOpen(!isOpen)}
                                    className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl text-sm font-bold text-blue-600 flex items-center justify-between transition-all hover:bg-blue-100/70 focus:outline-none"
                                >
                                    <div className="flex items-center gap-2">
                                        {currentQuestion.type === 0 ? <FaListUl className="text-xs" /> : <FaCheckSquare className="text-xs" />}
                                        <span>{currentQuestion.type === 0 ? 'Một lựa chọn' : 'Nhiều lựa chọn'}</span>
                                    </div>
                                    <FaChevronDown className={`text-xs transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isOpen && (
                                    <div className="absolute left-0 mt-1.5 w-full bg-white border border-gray-100 rounded-xl shadow-xl z-20 py-1 overflow-hidden">
                                        <button
                                            type="button"
                                            onClick={() => handleTypeChange(0)}
                                            className={`w-full px-4 py-2.5 text-sm font-semibold flex items-center justify-between transition-colors text-left
                                                ${currentQuestion.type === 0 ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <FaListUl className="text-xs opacity-70" />
                                                <span>Một lựa chọn</span>
                                            </div>
                                            {currentQuestion.type === 0 && <FaCheck className="text-xs" />}
                                        </button>

                                        {/* <button
                                            type="button"
                                            onClick={() => handleTypeChange(1)}
                                            className={`w-full px-4 py-2.5 text-sm font-semibold flex items-center justify-between transition-colors text-left
                                                ${currentQuestion.type === 1 ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <FaCheckSquare className="text-xs opacity-70" />
                                                <span>Nhiều lựa chọn</span>
                                            </div>
                                            {currentQuestion.type === 1 && <FaCheck className="text-xs" />}
                                        </button> */}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Danh sách 4 đáp án liên kết trực tiếp data */}
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider text-left">Các tùy chọn đáp án</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {['A', 'B', 'C', 'D'].map((label, idx) => {
                                const answerItem = currentQuestion.answers[idx] || { content: "", isCorrect: false };
                                return (
                                    <div 
                                        key={label} 
                                        className={`flex items-center gap-3 p-3.5 border rounded-xl transition-all duration-200
                                            ${answerItem.isCorrect 
                                                ? 'border-green-500 bg-green-50/20 shadow-sm' 
                                                : 'border-gray-200 bg-gray-50/50 focus-within:border-blue-400 focus-within:bg-white'}`}
                                    >
                                        <label className="relative flex items-center justify-center cursor-pointer shrink-0">
                                            <input 
                                                type={currentQuestion.type === 0 ? "radio" : "checkbox"} 
                                                name={`correct-ans-${currentQuestion.id}`}
                                                checked={answerItem.isCorrect}
                                                onChange={() => handleSelectCorrect(idx)}
                                                className="sr-only" 
                                            />
                                            <div className={`w-5 h-5 flex items-center justify-center transition-all border-2
                                                ${currentQuestion.type === 0 ? 'rounded-full' : 'rounded-md'}
                                                ${answerItem.isCorrect 
                                                    ? 'border-green-500 bg-green-500 text-white' 
                                                    : 'border-gray-300 bg-white hover:border-gray-400'}`}
                                            >
                                                {answerItem.isCorrect && <FaCheck className="text-[10px]" />}
                                            </div>
                                        </label>

                                        <span className={`text-sm font-bold ${answerItem.isCorrect ? 'text-green-600' : 'text-gray-400'}`}>
                                            {label}.
                                        </span>
                                        <input 
                                            type="text" 
                                            value={answerItem.content}
                                            onChange={(e) => handleAnswerTextChange(idx, e.target.value)}
                                            placeholder={`Nhập nội dung cho đáp án ${label}...`}
                                            className="w-full bg-transparent text-sm text-gray-700 focus:outline-none font-medium"
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateQuizLayout;