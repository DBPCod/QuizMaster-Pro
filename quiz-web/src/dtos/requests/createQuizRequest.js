
/**
 * Hàm biến đổi (Map) dữ liệu từ State của Giao diện sang DTO đúng chuẩn Backend
 * @param {string} title - Tiêu đề bài Quiz
 * @param {string} description - Mô tả bài Quiz
 * @param {Array} questions - Mảng câu hỏi từ React State (chứa ID tạm thời)
 * @returns {Object} Payload hoàn chỉnh chuẩn QuizRequest của Backend
 */
export const createQuizRequest = (title, description, questions) => {
    return {
        // 1. Map thông tin chung (QuizRequest)
        title: title ? title.trim() : "",
        description: description ? description.trim() : "",
        
        // 2. Map danh sách câu hỏi (QuestionRequest)
        questions: questions.map(q => ({
            content: q.content ? q.content.trim() : "Câu hỏi chưa đặt tiêu đề",
            type: Number(q.type),        // Đảm bảo là kiểu số (0: Single, 1: Multiple)
            score: Number(q.score) || 0, // Đảm bảo chuyển thành số thực/số nguyên (decimal bên C#)
            
            // 3. Map danh sách đáp án (AnswerRequest)
            answers: q.answers.map((ans, index) => ({
                content: ans.content ? ans.content.trim() : "",
                isCorrect: Boolean(ans.isCorrect), // Luôn luôn là true hoặc false
                orderIndex: index + 1 // Mảng JS chạy từ 0-3, chuyển thành 1-4 khớp Enum OrderIndex
            }))
        }))
    };
};