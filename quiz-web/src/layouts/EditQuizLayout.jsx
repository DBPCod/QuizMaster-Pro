import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Thêm hooks để đọc Params và Điều hướng Route
import { 
    FaPuzzlePiece, FaListUl, FaTrashAlt, FaCopy, FaPlus, 
    FaFileUpload, FaInfoCircle, FaSignOutAlt, FaEye, FaSave,
    FaHeading, FaCheck, FaChevronDown, FaCheckSquare, FaSpinner
} from 'react-icons/fa';

// ============================================================================
// MOCK DATABASE & API TÍCH HỢP TRONG FILE CHUYÊN BIỆT CHO LUỒNG EDIT
// ============================================================================
const mockQuizDatabase = {
  1: {
    id: 1,
    title: "Lịch sử cuộc Khởi nghĩa Lam Sơn",
    questions: [
      {
        id: 101,
        text: "Cuộc khởi nghĩa Lam Sơn do ai lãnh đạo?",
        type: "single", // 'single' hoặc 'multiple'
        options: {
          A: "Lê Lợi",
          B: "Nguyễn Trãi",
          C: "Trần Hưng Đạo",
          D: "Nguyễn Huệ"
        },
        correctAnswers: { A: true, B: false, C: false, D: false }
      },
      {
        id: 102,
        text: "Nguyễn Trãi dâng Bình Ngô sách ở đâu?",
        type: "single",
        options: {
          A: "Đông Quan",
          B: "Lỗi Giang",
          C: "Hội Thề Lũng Nhai",
          D: "Căn cứ Lam Sơn"
        },
        correctAnswers: { A: false, B: true, C: false, D: false }
      }
    ]
  },
  2: {
    id: 2,
    title: "Kiến trúc máy tính & Hệ điều hành",
    questions: [
      {
        id: 201,
        text: "Thành phần nào sau đây được coi là brain bộ của máy tính?",
        type: "single",
        options: { A: "RAM", B: "CPU", C: "Hard Disk", D: "GPU" },
        correctAnswers: { A: false, B: true, C: false, D: false }
      }
    ]
  },
  3: {
    id: 3,
    title: "Lập trình Web nâng cao với React",
    questions: [
      {
        id: 301,
        text: "Các React Hook nào sau đây được sử dụng để tối ưu hiệu năng? (Chọn nhiều đáp án)",
        type: "multiple",
        options: { A: "useState", B: "useMemo", C: "useCallback", D: "useEffect" },
        correctAnswers: { A: false, B: true, C: true, D: false }
      }
    ]
  }
};

// Giả lập lệnh gọi API tải chi tiết bài Quiz bằng Promise và Delay
const fetchQuizDataFromApi = (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const quiz = mockQuizDatabase[id];
      if (quiz) {
        resolve(JSON.parse(JSON.stringify(quiz)));
      } else {
        resolve({
          id: id,
          title: "Bài Quiz mới chưa đặt tên",
          questions: [
            {
              id: Date.now(),
              text: "Nội dung câu hỏi mẫu?",
              type: "single",
              options: { A: "", B: "", C: "", D: "" },
              correctAnswers: { A: true, B: false, C: false, D: false }
            }
          ]
        });
      }
    }, 450);
  });
};

// ============================================================================
// MAIN WORKSPACE LAYOUT (TƯƠNG ĐỒNG VỚI CREATEQUIZ VỀ PHONG CÁCH HIỂN THỊ)
// ============================================================================
const EditQuizLayout = () => {
    const { quizId } = useParams(); // Đọc tự động mã quizId từ thanh địa chỉ URL
    const navigate = useNavigate(); // Khởi tạo lệnh điều hướng trang

    const [loading, setLoading] = useState(true);
    const [quizTitle, setQuizTitle] = useState("");
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    // Trạng thái điều khiển đóng mở Custom Combobox loại câu hỏi
    const [isOpenCombobox, setIsOpenCombobox] = useState(false);
    const comboboxRef = useRef(null);
    
    // Khởi tạo Ref điều khiển thẻ input file ẩn phục vụ luồng Nhập từ file
    const fileInputRef = useRef(null);

    // Chạy ngầm hàm lấy dữ liệu từ API dựa theo quizId nhận diện từ URL
    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        
        fetchQuizDataFromApi(Number(quizId)).then((data) => {
            if (isMounted) {
                setQuizTitle(data.title);
                setQuestions(data.questions);
                setCurrentQuestionIndex(0);
                setLoading(false);
            }
        });

        return () => { isMounted = false; };
    }, [quizId]);

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
                A: label === 'A',
                B: label === 'B',
                C: label === 'C',
                D: label === 'D'
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

    // Luồng kích hoạt chọn file ẩn khi người dùng click vào nút "Nhập từ file"
    const triggerFileSelect = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // Hàm xử lý phân tích cú pháp dữ liệu file được đẩy lên (JSON hoặc chuỗi cấu trúc thô)
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
                            text: lines[0] || "Câu hỏi được nhập từ file text...",
                            type: "single",
                            options: {
                                A: lines[1] || "Đáp án A",
                                B: lines[2] || "Đáp án B",
                                C: lines[3] || "Đáp án C",
                                D: lines[4] || "Đáp án D"
                            },
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
                    alert(`Đã nhập thành công ${normalized.length} câu hỏi vào bài viết!`);
                } else {
                    alert("Không tìm thấy cấu trúc câu hỏi hợp lệ trong file!");
                }
            } catch (err) {
                alert("Lỗi đọc cấu trúc file, vui lòng kiểm tra lại định dạng dữ liệu!");
                console.error(err);
            }
            event.target.value = null;
        };
        reader.readAsText(file);
    };

    const handleSaveQuiz = () => {
        const updatedPayload = {
            id: quizId,
            title: quizTitle,
            questions: questions
        };
        console.log(">>> DỮ LIỆU ĐÃ SỬA GỬI LÊN SERVER:", updatedPayload);
        alert(`Đã cập nhật thành công bài viết: "${quizTitle}"!`);
        navigate('/library'); 
    };

    if (loading) {
        return (
            <div className="fixed inset-0 w-screen h-screen flex flex-col items-center justify-center bg-gray-50 z-50">
                <FaSpinner className="animate-spin text-blue-600 text-4xl mb-3" />
                <p className="text-gray-500 font-medium text-sm">Đang tải cấu trúc dữ liệu chỉnh sửa bài Quiz...</p>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 w-screen h-screen bg-gray-50 flex flex-col overflow-hidden z-50 font-sans">
            
            {/* Thẻ input file ẩn phục vụ tính năng nhập từ file */}
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept=".txt,.json" 
                className="hidden" 
            />

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
                        className="w-full pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:font-normal placeholder:text-gray-400"
                    />
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <button className="flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-gray-200 transition-all">
                        <FaEye className="text-xs" /> <span>Xem trước</span>
                    </button>
                    
                    <button 
                        onClick={handleSaveQuiz}
                        className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-700 shadow-sm shadow-blue-100 transition-all"
                    >
                        <FaSave className="text-xs" /> <span>Lưu thay đổi</span>
                    </button>

                    <div className="h-5 w-[1px] bg-gray-200 mx-1"></div>

                    <button 
                        onClick={() => navigate('/library')}
                        className="flex items-center gap-1.5 bg-white text-red-600 border border-red-200 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-50 transition-all"
                    >
                        <FaSignOutAlt className="text-xs" /> <span>Đóng</span>
                    </button>
                </div>
            </div>

            {/* ================= KHU VỰC THÂN MÁY LÀM VIỆC CHÍNH ================= */}
            <div className="flex-grow flex w-full overflow-hidden h-[calc(100vh-64px)]">
                
                {/* BÊN TRÁI: PANEL LIÊN KẾT DANH SÁCH CÂU HỎI */}
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

                    {/* ĐÃ ĐỒNG BỘ: Cụm nút Thêm câu hỏi và Nhập từ file xếp chồng dạng dọc chuẩn xác theo Create Layout */}
                    <div className="pt-3 border-t border-gray-100 space-y-2 shrink-0">
                        <button 
                            onClick={handleAddQuestion}
                            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg text-xs font-semibold hover:bg-blue-700 transition-all shadow-sm"
                        >
                            <FaPlus /> Thêm câu hỏi
                        </button>
                        <button 
                            onClick={triggerFileSelect}
                            className="w-full flex items-center justify-center gap-2 bg-white text-gray-600 border border-gray-200 py-2 rounded-lg text-xs font-semibold hover:bg-gray-50 transition-all"
                        >
                            <FaFileUpload /> Nhập từ file
                        </button>
                    </div>
                </div>

                {/* BÊN PHẢI: KHÔNG GIAN SOẠN THẢO CHI TIẾT CÂU HỎI ĐANG CHỌN */}
                <div className="flex-1 bg-white border border-gray-200 rounded-xl p-5 shadow-sm overflow-y-auto m-4">
                    {currentQuestion && (
                        <div className="w-full h-fit">
                            <div className="flex items-center gap-2 text-gray-700 font-bold text-sm mb-4 pb-2 border-b border-gray-100">
                                <FaInfoCircle className="text-blue-500" />
                                <span>Thông tin chi tiết câu hỏi {currentQuestionIndex + 1}</span>
                            </div>

                            {/* Văn bản nhập liệu và Khối Combobox lọc cấu trúc */}
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
                                
                                {/* Khối Custom Combobox cấu trúc phương án lựa chọn */}
                                <div className="sm:w-60 shrink-0 relative" ref={comboboxRef}>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5 tracking-wider text-left">Loại lựa chọn</label>
                                    
                                    <button 
                                        type="button"
                                        onClick={() => setIsOpenCombobox(!isOpenCombobox)}
                                        className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl text-sm font-bold text-blue-600 flex items-center justify-between transition-all hover:bg-blue-100/70 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                                    >
                                        <div className="flex items-center gap-2">
                                            {currentQuestion.type === 'single' ? <FaListUl className="text-xs" /> : <FaCheckSquare className="text-xs" />}
                                            <span>{currentQuestion.type === 'single' ? 'Một lựa chọn' : 'Nhiều lựa chọn'}</span>
                                        </div>
                                        <FaChevronDown className={`text-xs transition-transform duration-200 ${isOpenCombobox ? 'rotate-180' : ''}`} />
                                    </button>

                                    {isOpenCombobox && (
                                        <div className="absolute left-0 mt-1.5 w-full bg-white border border-gray-100 rounded-xl shadow-xl z-20 py-1 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                                            <button
                                                type="button"
                                                onClick={() => handleTypeChange('single')}
                                                className={`w-full px-4 py-2.5 text-sm font-semibold flex items-center justify-between transition-colors text-left
                                                    ${currentQuestion.type === 'single' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <FaListUl className="text-xs opacity-70" />
                                                    <span>Một lựa chọn</span>
                                                </div>
                                                {currentQuestion.type === 'single' && <FaCheck className="text-xs" />}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleTypeChange('multiple')}
                                                className={`w-full px-4 py-2.5 text-sm font-semibold flex items-center justify-between transition-colors text-left
                                                    ${currentQuestion.type === 'multiple' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <FaCheckSquare className="text-xs opacity-70" />
                                                    <span>Nhiều lựa chọn</span>
                                                </div>
                                                {currentQuestion.type === 'multiple' && <FaCheck className="text-xs" />}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Khu vực cấu hình đáp án */}
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider text-left">Các tùy chọn đáp án</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {['A', 'B', 'C', 'D'].map((label) => {
                                    const isCorrect = currentQuestion.correctAnswers[label] || false;
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
                                                    className="sr-only" 
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