import api from "./api";

// --- API NGƯỜI DÙNG ---

// Lấy thông tin user đang đăng nhập (dùng cho Header/Context)
export const getMyProfile = () => 
  api.get("/users/me");

// Cập nhật thông tin cá nhân
export const updateProfile = (data) => 
  api.put("/users/me", data);

// --- CÁC HÀM CẦN THÊM ĐỂ KHẮC PHỤC LỖI ---

// 1. Lấy thông tin chi tiết user theo ID (cho ProfilePage)
export const getProfile = (id) => 
  api.get(`/users/${id}`);

// 2. Lấy danh sách đơn hàng của user
export const getOrders = (userId) => 
  api.get(`/orders/user/${userId}`);

// 3. Lấy danh sách đơn hàng ĐÃ HỦY (Hàm bị báo lỗi thiếu)
export const getCancelledOrders = (userId) => 
  api.get(`/orders/user/${userId}?status=cancelled`); 
  // Lưu ý: Kiểm tra lại URL này với bên Backend của bạn (Spring Boot) xem đúng endpoint chưa. 
  // Ví dụ backend có thể là: /orders/cancelled/{userId}

// 4. Lấy danh sách yêu thích
export const getFavorites = (userId) => 
  api.get(`/favorites/user/${userId}`);