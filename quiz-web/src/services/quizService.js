import { API_ENDPOINTS } from "../config/urls";
import axiosClient from "../api/axiosClient.js";

const quizService = {
  // Thêm tham số page và limit (mặc định là page 1, mỗi trang 6 items)
  quizzes: (page = 1, limit = 6) => {
    return axiosClient.get(API_ENDPOINTS.QUIZZES, {
      params: {
        page,
        limit
      }
    });
  }
};

export default quizService;