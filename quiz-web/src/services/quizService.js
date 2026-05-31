import { API_ENDPOINTS } from "../config/urls";
import axiosClient from "../api/axiosClient.js";

const quizService = {
    quizzes: async (page, pageSize, search = '') => {
        const response = await axiosClient.get('/quizzes', {
            params: {
                page: page,
                pageSize: pageSize,
                search: search || undefined 
            }
        });
        return response.data;
    },

    // Viết gọn nhẹ như thế này là chuẩn bài:
    create: async (quizData) => {
        const response = await axiosClient.post('/quizzes', quizData);
        return response.data;
    },

    delete: async (id) => {
        const response = await axiosClient.delete(`quizzes/${id}`);
        return response.data;
    },
    update: async (id, quizData) => {
        const response = await axiosClient.put(`/quizzes/${id}`, quizData);
        return response.data;
    },
    
    // Thêm hàm lấy chi tiết 1 bài quiz từ Backend thực tế
    getById: async (id) => {
        const response = await axiosClient.get(`/quizzes/${id}`);
        return response.data;
    },
};

export default quizService;