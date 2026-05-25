import { API_ENDPOINTS } from "../config/urls";
import axiosClient from "../api/axiosClient.js";

const quizService = {
  // Thêm tham số page và limit (mặc định là page 1, mỗi trang 6 items)
    quizzes: async (page, pageSize, search = '') => {
        // Khởi tạo query param, nếu có search thì gửi đi, ngược lại để trống
        const response = await axiosClient.get('/quizzes', {
            params: {
                page: page,
                pageSize: pageSize,
                search: search || undefined // Nếu search rỗng thì không gửi trường này lên để URL gọn sạch
            }
        });
        return response.data;
    }
};

export default quizService;