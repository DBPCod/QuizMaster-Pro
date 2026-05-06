import { API_ENDPOINTS } from "../config/urls"
import axiosClient from "../api/axiosClient.js";
const authService = {
  login: (data) => {
    return axiosClient.post(API_ENDPOINTS.LOGIN, data);
  },

  register: (data) => {
    return axiosClient.post(API_ENDPOINTS.REGISTER, data);
  },

  getMe: () => {
    return axiosClient.get(API_ENDPOINTS.ME);
  }
}

export default authService;
