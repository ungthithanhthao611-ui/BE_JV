import axios from "axios";

// Đổi port nếu cần (mặc định 8080)
const API_URL = "http://localhost:8080/api/cart";

export const addToCart = (data) => {
  return axios.post(`${API_URL}/add`, data);
};

export const getCartByUser = (userId) => {
  return axios.get(`${API_URL}/${userId}`);
};

// 👇 HÀM XÓA QUAN TRỌNG
export const removeCartItem = (userId, productId) => {
  return axios.delete(`${API_URL}/${userId}/remove/${productId}`);
};