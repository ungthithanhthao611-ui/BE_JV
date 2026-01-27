// // import axios from "axios";

// // const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/products`;

// // // --- SỬA HÀM NÀY ---
// // // Hàm này giờ nhận thêm categoryId
// // export const getAllProducts = (categoryId) => {
// //   // Nếu có categoryId thì tạo params: ?categoryId=...
// //   const params = categoryId ? { categoryId } : {};
// //   return axios.get(API_URL, { params });
// // };
// // // -------------------

// // export const getTrashProducts = () => axios.get(`${API_URL}/trash`);

// // export const getProductById = (id) => axios.get(`${API_URL}/${id}`);

// // export const createProduct = (formData) => {
// //   return axios.post(API_URL, formData, {
// //     headers: { "Content-Type": "multipart/form-data" },
// //   });
// // };

// // export const updateProduct = (id, data) => axios.put(`${API_URL}/${id}`, data);
// // export const deleteProduct = (id) => axios.delete(`${API_URL}/${id}`);
// // export const restoreProduct = (id) => axios.put(`${API_URL}/${id}/restore`);
// // export const forceDeleteProduct = (id) => axios.delete(`${API_URL}/${id}/force`);

// import axios from "axios";

// // ===============================
// // BASE URL BACKEND
// // ===============================
// const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/products`;

// // ===============================
// // GET: DANH SÁCH SẢN PHẨM
// // (có hoặc không có categoryId)
// // ===============================
// export const getAllProducts = (categoryId) => {
//   const params = categoryId ? { categoryId } : {};
//   return axios.get(API_URL, { params });
// };

// // ===============================
// // GET: THÙNG RÁC
// // ===============================
// export const getTrashProducts = () => {
//   return axios.get(`${API_URL}/trash`);
// };

// // ===============================
// // GET: CHI TIẾT SẢN PHẨM
// // ===============================
// export const getProductById = (id) => {
//   return axios.get(`${API_URL}/${id}`);
// };

// // ===============================
// // POST: THÊM SẢN PHẨM + UPLOAD ẢNH
// // ⚠️ KHÔNG SET Content-Type
// // ===============================
// export const createProduct = (formData) => {
//   return axios.post(API_URL, formData);
// };

// // ===============================
// // PUT: CẬP NHẬT SẢN PHẨM
// // (không upload ảnh – JSON)
// // ===============================
// export const updateProduct = (id, data) => {
//   return axios.put(`${API_URL}/${id}`, data);
// };

// // ===============================
// // DELETE: XOÁ MỀM
// // ===============================
// export const deleteProduct = (id) => {
//   return axios.delete(`${API_URL}/${id}`);
// };

// // ===============================
// // PUT: KHÔI PHỤC
// // ===============================
// export const restoreProduct = (id) => {
//   return axios.put(`${API_URL}/${id}/restore`);
// };

// // ===============================
// // DELETE: XOÁ VĨNH VIỄN
// // ===============================
// export const forceDeleteProduct = (id) => {
//   return axios.delete(`${API_URL}/${id}/force`);
// };
// // ===============================
// // GET: TÌM KIẾM SẢN PHẨM
// // ===============================
// export const searchProducts = (keyword) => {
//   return axios.get(`${API_URL}/search`, { 
//     params: { q: keyword } // Gửi query param ?q=... cho Backend
//   });
// };

import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/products`;

export const getAllProducts = (categoryId) => {
  const params = categoryId ? { categoryId } : {};
  return axios.get(API_URL, { params });
};

export const getTrashProducts = () => axios.get(`${API_URL}/trash`);

export const getProductById = (id) => axios.get(`${API_URL}/${id}`);

export const createProduct = (formData) => axios.post(API_URL, formData);

export const updateProduct = (id, data) => axios.put(`${API_URL}/${id}`, data);

export const deleteProduct = (id) => axios.delete(`${API_URL}/${id}`);

export const restoreProduct = (id) => axios.put(`${API_URL}/${id}/restore`);

export const forceDeleteProduct = (id) => axios.delete(`${API_URL}/${id}/force`);
// ✅ SEARCH: /api/products/search?q=...
export const searchProducts = (keyword, config = {}) => {
  return axios.get(`${API_URL}/search`, {
    params: { q: keyword },
    ...config,
  });
};
