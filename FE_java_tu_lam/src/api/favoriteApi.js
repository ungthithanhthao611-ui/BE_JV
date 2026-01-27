import axios from "axios";

const API_URL = "http://localhost:8080/api/favorites";

// 1. Lấy danh sách sản phẩm yêu thích
export const getFavorites = (userId) => {
    return axios.get(`${API_URL}/user/${userId}`);
};

// 2. Thêm sản phẩm vào yêu thích
export const addFavorite = (userId, productId) => {
    return axios.post(`${API_URL}/add`, null, {
        params: { userId, productId }
    });
};

// 3. Xóa sản phẩm khỏi yêu thích
export const removeFavorite = (userId, productId) => {
    return axios.delete(`${API_URL}/remove`, {
        params: { userId, productId }
    });
};

// 4. Kiểm tra sản phẩm có được yêu thích không
export const isFavorite = (userId, productId) => {
    return axios.get(`${API_URL}/check`, {
        params: { userId, productId }
    });
};
