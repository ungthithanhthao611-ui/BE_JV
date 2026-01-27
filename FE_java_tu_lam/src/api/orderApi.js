// import axios from "axios";

// export const checkout = (data) => {
//   return axios.post("http://localhost:8080/api/orders/checkout", data);
// };

import axios from "axios";

// Định nghĩa URL gốc cho Order
const API_URL = "http://localhost:8080/api/orders";

// 1. Tạo đơn hàng (Checkout)
export const checkout = (data) => {
  return axios.post(`${API_URL}/checkout`, data);
};

// 2. Lấy danh sách tất cả đơn hàng (Dành cho Admin) -> KHẮC PHỤC LỖI
export const getAllOrders = () => {
  return axios.get(API_URL);
};

// 3. Cập nhật trạng thái đơn hàng (Duyệt/Hủy) -> KHẮC PHỤC LỖI
export const updateOrderStatus = (orderId, status) => {
  // Gọi API: PUT /api/orders/{id}/status?status={status}
  return axios.put(`${API_URL}/${orderId}/status`, null, {
    params: { status }
  });
};

// 4. Lấy đơn hàng của user (Client)
export const getOrders = (userId) => {
  return axios.get(`${API_URL}/user/${userId}`);
};

// 5. Lấy đơn hàng đã hủy (Dùng cho trang Profile nếu cần)
export const getCancelledOrders = (userId) => {
  return axios.get(`${API_URL}/user/${userId}?status=cancelled`);
};

// 6. Lấy thông tin đơn hàng theo ID
export const getOrderById = (orderId) => {
  return axios.get(`${API_URL}/${orderId}`);
};

// 7. Lấy chi tiết sản phẩm trong đơn hàng
export const getOrderItems = (orderId) => {
  return axios.get(`${API_URL}/${orderId}/items`);
};