import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    FaPuzzlePiece, FaListUl, FaTrashAlt, FaCopy, FaPlus, 
    FaFileUpload, FaInfoCircle, FaSignOutAlt, FaEye, FaSave,
    FaHeading, FaCheck, FaChevronDown, FaCheckSquare, FaSpinner
} from 'react-icons/fa';
import quizService from '../services/quizService'; 

const EditQuizLayout = () => {
    const { quizId } = useParams(); 
    const navigate = useNavigate(); 

    const [loading, setLoading] = useState(true);
    const [quizTitle, setQuizTitle] = useState("");
    const [quizDescription, setQuizDescription] = useState(""); 
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const [isOpenCombobox, setIsOpenCombobox] = useState(false);
    const comboboxRef = useRef(null);
    const fileInputRef = useRef(null);

    // ============================================================================
    // LUỒNG TẢI DỮ LIỆU THỰC TẾ & MAPPING TỪ JSON BACKEND SANG FRONTEND STATE
    // ============================================================================
    useEffect(() => {
        const loadQuizDetail = async () => {
            try {
                setLoading(true);
                const response = await quizService.getById(quizId);
                const rawData = response?.data ? response.data : response;

                if (rawData) {
                    setQuizTitle(rawData.title || "");
                    setQuizDescription(rawData.description || "");
                    
                    // Convert cấu trúc Backend (Mảng answers) sang cấu trúc State Dễ Dùng ở Frontend (A, B, C, D)
                    const mappedQuestions = (rawData.questions || []).map((q) => {
                        const frontendOptions = { A: "", B: "", C: "", D: "" };
                        const frontendCorrect = { A: false, B: false, C: false, D: false };
                        
                        const labels = ['A', 'B', 'C', 'D'];
                        (q.answers || []).forEach((ans, idx) => {
                            if (idx < 4) {
                                const currentLabel = labels[idx];
                                frontendOptions[currentLabel] = ans.content || "";
                                frontendCorrect[currentLabel] = ans.isCorrect || false;
                            }
                        });

                        return {
                            id: q.questionId || Date.now() + Math.random(),
                            text: q.content || "",
                            type: q.type === 1 ? "multiple" : "single", // 0: single, 1: multiple
                            options: frontendOptions,
                            correctAnswers: frontendCorrect
                        };
                    });

                    setQuestions(mappedQuestions);
                }
            } catch (err) {
                console.error("Lỗi lấy chi tiết Quiz:", err);
                alert("Không thể tải thông tin bài trắc nghiệm này từ Server!");
                navigate('/quizpage/library');
            } finally {
                setLoading(false);
            }
        };

        if (quizId) {
            loadQuizDetail();
        }
    }, [quizId, navigate]);

    // Click bên ngoài vùng chọn để ẩn Dropdown Combobox
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (comboboxRef.current && !comboboxRef.current.contains(event.target)) {
                setIsOpenCombobox(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const currentQuestion = questions[currentQuestionIndex];

    // ============================================================================
    // LOGIC CHỈNH SỬA DỮ LIỆU ĐỘNG (REALTIME BINDING)
    // ============================================================================
    const handleQuestionTextChange = (value) => {
        const updated = [...questions];
        updated[currentQuestionIndex].text = value;
        setQuestions(updated);
    };

    const handleOptionTextChange = (label, value) => {
        const updated = [...questions];
        updated[currentQuestionIndex].options[label] = value;
        setQuestions(updated);
    };

    const handleSelectCorrect = (label) => {
        const updated = [...questions];
        const currentQ = updated[currentQuestionIndex];

        if (currentQ.type === 'single') {
            currentQ.correctAnswers = {
                A: label === 'A', B: label === 'B', C: label === 'C', D: label === 'D'
            };
        } else {
            currentQ.correctAnswers[label] = !currentQ.correctAnswers[label];
        }
        setQuestions(updated);
    };

    const handleTypeChange = (type) => {
        const updated = [...questions];
        updated[currentQuestionIndex].type = type;
        
        if (type === 'single') {
            const currentQ = updated[currentQuestionIndex];
            let foundFirst = false;
            ['A', 'B', 'C', 'D'].forEach(lbl => {
                if (currentQ.correctAnswers[lbl] && !foundFirst) {
                    foundFirst = true;
                } else {
                    currentQ.correctAnswers[lbl] = false;
                }
            });
            if (!foundFirst) currentQ.correctAnswers.A = true;
        }
        
        setQuestions(updated);
        setIsOpenCombobox(false);
    };

    const handleAddQuestion = () => {
        const newQ = {
            id: Date.now(), 
            text: "",
            type: "single",
            options: { A: "", B: "", C: "", D: "" },
            correctAnswers: { A: true, B: false, C: false, D: false }
        };
        setQuestions([...questions, newQ]);
        setCurrentQuestionIndex(questions.length);
    };

    const handleCopyQuestion = (index, event) => {
        event.stopPropagation();
        const targetQ = questions[index];
        const clonedQ = {
            ...JSON.parse(JSON.stringify(targetQ)),
            id: Date.now()
        };
        const updated = [...questions];
        updated.splice(index + 1, 0, clonedQ);
        setQuestions(updated);
        setCurrentQuestionIndex(index + 1);
    };

    const handleDeleteQuestion = (index, event) => {
        event.stopPropagation();
        if (questions.length === 1) {
            alert("Bài trắc nghiệm phải chứa ít nhất 1 câu hỏi!");
            return;
        }
        const updated = questions.filter((_, i) => i !== index);
        setQuestions(updated);
        
        if (currentQuestionIndex >= updated.length) {
            setCurrentQuestionIndex(updated.length - 1);
        } else if (currentQuestionIndex === index) {
            setCurrentQuestionIndex(Math.max(0, index - 1));
        }
    };

    const triggerFileSelect = () => {
        if (fileInputRef.current) fileInputRef.current.click();
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const textData = e.target.result;
                let importedQuestions = [];

                if (file.name.endsWith('.json')) {
                    const parsedData = JSON.parse(textData);
                    importedQuestions = Array.isArray(parsedData) ? parsedData : (parsedData.questions || []);
                } else {
                    const lines = textData.split('\n').map(l => l.trim()).filter(l => l.length > 0);
                    if (lines.length > 0) {
                        importedQuestions = [{
                            id: Date.now(),
                            text: lines[0] || "Câu hỏi mới...",
                            type: "single",
                            options: { A: lines[1] || "", B: lines[2] || "", C: lines[3] || "", D: lines[4] || "" },
                            correctAnswers: { A: true, B: false, C: false, D: false }
                        }];
                    }
                }

                if (importedQuestions.length > 0) {
                    const normalized = importedQuestions.map((q, i) => ({
                        id: q.id || (Date.now() + i),
                        text: q.text || "",
                        type: q.type || "single",
                        options: q.options || { A: "", B: "", C: "", D: "" },
                        correctAnswers: q.correctAnswers || { A: true, B: false, C: false, D: false }
                    }));

                    setQuestions([...questions, ...normalized]);
                    setCurrentQuestionIndex(questions.length);
                    alert(`Đã nhập thành công ${normalized.length} câu hỏi!`);
                }
            } catch (err) {
                alert("Lỗi định dạng file!");
            }
            event.target.value = null;
        };
        reader.readAsText(file);
    };

    // ============================================================================
    // CHỨC NĂNG CẬP NHẬT (LƯU) QUIZ - MAPPING QUAY LẠI ĐÚNG ĐỊNH DẠNG JSON BACKEND
    // ============================================================================
    const handleSaveQuiz = async () => {
        if (!quizTitle.trim()) {
            alert("Vui lòng nhập tên tiêu đề bài Quiz!");
            return;
        }

        // Tạo payload đúng y hệt cấu trúc JSON yêu cầu từ Backend của bạn
        const updatedPayload = {
            title: quizTitle,
            description: quizDescription || "Bài trắc nghiệm được cập nhật từ hệ thống",
            questions: questions.map((q, qIdx) => ({
                content: q.text,
                type: q.type === "multiple" ? 1 : 0, // Convert ngược lại: single -> 0, multiple -> 1
                score: 10,
                answers: ['A', 'B', 'C', 'D'].map((label, ansIdx) => ({
                    content: q.options[label],
                    isCorrect: q.correctAnswers[label],
                    orderIndex: ansIdx + 1
                }))
            }))
        };

        try {
            setLoading(true);
            const response = await quizService.update(quizId, updatedPayload);
            
            // Chấp nhận cả 2 trường hợp response bọc data hoặc trực tiếp tùy cấu trúc axios của bạn
            if (response && (response.success || response.statusCode === 200)) {
                alert(`🎉 Cập nhật thành công bài viết: "${quizTitle}"!`);
                navigate('/quizpage/library'); 
            } else {
                alert("Cập nhật thất bại: " + (response.message || "Lỗi hệ thống."));
            }
        } catch (error) {
            console.error("Lỗi cập nhật API:", error);
            const serverError = error.response?.data?.message || "Đã xảy ra lỗi kết nối với Backend.";
            alert("Lỗi hệ thống: " + serverError);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 w-screen h-screen flex flex-col items-center justify-center bg-gray-50 z-50">
                <FaSpinner className="animate-spin text-blue-600 text-4xl mb-3" />
                <p className="text-gray-500 font-medium text-sm">Đang đồng bộ dữ liệu với Server...</p>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 w-screen h-screen bg-gray-50 flex flex-col overflow-hidden z-50 font-sans">
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".txt,.json" className="hidden" />

            {/* ================= THANH CÔNG CỤ TRÊN CÙNG TRANG LÀM VIỆC ================= */}
            <div className="w-full h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between gap-4 shrink-0 shadow-sm z-10">
                <div className="flex items-center gap-2 shrink-0">
                    <FaPuzzlePiece className="text-[#2563EB] text-xl" />
                    <strong className="text-[#2563EB] text-xl tracking-tight">
                        QuizMaster <span className="text-[10px] text-amber-600 font-mono bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 ml-1 font-bold">WORKSPACE EDIT</span>
                    </strong>
                </div>

                <div className="flex-grow max-w-md relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-blue-500">
                        <FaHeading className="text-xs" />
                    </span>
                    <input 
                        type="text" 
                        value={quizTitle}
                        onChange={(e) => setQuizTitle(e.target.value)}
                        placeholder="Nhập tên tiêu đề bài Quiz tại đây..." 
                        className="w-full pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm"
                    />
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    
                    <button onClick={handleSaveQuiz} className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-700 shadow-sm transition-all">
                        <FaSave className="text-xs" /> <span>Lưu thay đổi</span>
                    </button>

                    <div className="h-5 w-[1px] bg-gray-200 mx-1"></div>

                    <button 
                        onClick={() => {
                            if(window.confirm("Bạn muốn đóng không gian chỉnh sửa? Tiến trình chưa lưu sẽ bị mất.")) {
                                navigate('/quizpage/library');
                            }
                        }}
                        className="flex items-center gap-1.5 bg-white text-red-600 border border-red-200 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-50 transition-all"
                    >
                        <FaSignOutAlt className="text-xs" /> <span>Thoát</span>
                    </button>
                </div>
            </div>

            {/* ================= KHU VỰC THÂN MÁY LÀM VIỆC CHÍNH ================= */}
            <div className="flex-grow flex w-full overflow-hidden h-[calc(100vh-64px)]">
                
                {/* BÊN TRÁI: PANEL DANH SÁCH CÂU HỎI */}
                <div className="w-80 bg-white border-r border-gray-200 p-4 flex flex-col justify-between shrink-0 h-full">
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
                                    onClick={() => setCurrentQuestionIndex(index)}
                                    className={`group flex items-start justify-between gap-2 p-3 border rounded-lg transition-all cursor-pointer
                                        ${currentQuestionIndex === index 
                                            ? 'border-blue-500 bg-blue-50/50 shadow-sm' 
                                            : 'bg-gray-50 hover:bg-blue-50/50 border-gray-200'}`}
                                >
                                    <p className="text-xs text-gray-600 font-medium text-left line-clamp-2 leading-relaxed">
                                        <span className="font-bold text-blue-600 mr-1">{index + 1}.</span>
                                        {q.text || <span className="text-gray-400 italic">Chưa nhập nội dung...</span>}
                                    </p>
                                    <div className="flex items-center gap-1.5 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
                                        <button onClick={(e) => handleCopyQuestion(index, e)} className="text-gray-400 hover:text-blue-600 p-0.5" title="Sao chép"><FaCopy className="text-xs" /></button>
                                        <button onClick={(e) => handleDeleteQuestion(index, e)} className="text-gray-400 hover:text-red-500 p-0.5" title="Xóa"><FaTrashAlt className="text-xs" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-3 border-t border-gray-100 space-y-2 shrink-0">
                        <button onClick={handleAddQuestion} className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg text-xs font-semibold hover:bg-blue-700 transition-all shadow-sm">
                            <FaPlus /> Thêm câu hỏi
                        </button>
                        <button onClick={triggerFileSelect} className="w-full flex items-center justify-center gap-2 bg-white text-gray-600 border border-gray-200 py-2 rounded-lg text-xs font-semibold hover:bg-gray-50 transition-all">
                            <FaFileUpload /> Nhập từ file
                        </button>
                    </div>
                </div>

                {/* BÊN PHẢI: KHÔNG GIAN SOẠN THẢO CHI TIẾT */}
                <div className="flex-1 bg-white border border-gray-200 rounded-xl p-5 shadow-sm overflow-y-auto m-4">
                    {currentQuestion && (
                        <div className="w-full h-fit">
                            <div className="flex items-center gap-2 text-gray-700 font-bold text-sm mb-4 pb-2 border-b border-gray-100">
                                <FaInfoCircle className="text-blue-500" />
                                <span>Thông tin chi tiết câu hỏi {currentQuestionIndex + 1}</span>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                                <div className="flex-grow">
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5 tracking-wider text-left">Nội dung câu hỏi</label>
                                    <textarea 
                                        rows="2"
                                        value={currentQuestion.text}
                                        onChange={(e) => handleQuestionTextChange(e.target.value)}
                                        placeholder="Nhập câu hỏi trắc nghiệm của bạn tại đây..." 
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner resize-none leading-relaxed"
                                    />
                                </div>
                                
                                <div className="sm:w-60 shrink-0 relative" ref={comboboxRef}>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5 tracking-wider text-left">Loại lựa chọn</label>
                                    <button 
                                        type="button"
                                        onClick={() => setIsOpenCombobox(!isOpenCombobox)}
                                        className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl text-sm font-bold text-blue-600 flex items-center justify-between transition-all hover:bg-blue-100/70"
                                    >
                                        <div className="flex items-center gap-2">
                                            {currentQuestion.type === 'single' ? <FaListUl className="text-xs" /> : <FaCheckSquare className="text-xs" />}
                                            <span>{currentQuestion.type === 'single' ? 'Một lựa chọn' : 'Nhiều lựa chọn'}</span>
                                        </div>
                                        <FaChevronDown className={`text-xs transition-transform duration-200 ${isOpenCombobox ? 'rotate-180' : ''}`} />
                                    </button>

                                    {isOpenCombobox && (
                                        <div className="absolute left-0 mt-1.5 w-full bg-white border border-gray-100 rounded-xl shadow-xl z-20 py-1 overflow-hidden">
                                            <button
                                                type="button"
                                                onClick={() => handleTypeChange('single')}
                                                className={`w-full px-4 py-2.5 text-sm font-semibold flex items-center justify-between transition-colors text-left
                                                    ${currentQuestion.type === 'single' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                                            >
                                                <div className="flex items-center gap-2"><FaListUl className="text-xs opacity-70" /> <span>Một lựa chọn</span></div>
                                                {currentQuestion.type === 'single' && <FaCheck className="text-xs" />}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleTypeChange('multiple')}
                                                className={`w-full px-4 py-2.5 text-sm font-semibold flex items-center justify-between transition-colors text-left
                                                    ${currentQuestion.type === 'multiple' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                                            >
                                                <div className="flex items-center gap-2"><FaCheckSquare className="text-xs opacity-70" /> <span>Nhiều lựa chọn</span></div>
                                                {currentQuestion.type === 'multiple' && <FaCheck className="text-xs" />}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <label className="block text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider text-left">Các tùy chọn đáp án</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {['A', 'B', 'C', 'D'].map((label) => {
                                    const isCorrect = currentQuestion.correctAnswers[label] || false;
                                    return (
                                        <div 
                                            key={label} 
                                            className={`flex items-center gap-3 p-3.5 border rounded-xl transition-all duration-200
                                                ${isCorrect ? 'border-green-500 bg-green-50/20 shadow-sm' : 'border-gray-200 bg-gray-50/50 focus-within:border-blue-400 focus-within:bg-white'}`}
                                        >
                                            <label className="relative flex items-center justify-center cursor-pointer shrink-0">
                                                <input type="checkbox" checked={isCorrect} onChange={() => handleSelectCorrect(label)} className="sr-only" />
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isCorrect ? 'border-green-500 bg-green-500 text-white' : 'border-gray-300 bg-white'}`}>
                                                    {isCorrect && <FaCheck className="text-[10px]" />}
                                                </div>
                                            </label>
                                            <span className={`text-sm font-bold ${isCorrect ? 'text-green-600' : 'text-gray-400'}`}>{label}.</span>
                                            <input 
                                                type="text" 
                                                value={currentQuestion.options[label] || ''}
                                                onChange={(e) => handleOptionTextChange(label, e.target.value)}
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
        </div>
    );
};

export default EditQuizLayout;