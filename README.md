# 🏆 ĐỒ ÁN KẾT THÚC HỌC PHẦN - HỆ THỐNG THƯƠNG MẠI ĐIỆN TỬ PRE-MÌ-UM

## 📌 THÔNG TIN SINH VIÊN
- **Họ và tên:** [Tên của bạn]
- **MSSV:** [Mã số sinh viên]
- **Lớp:** [Lớp]
- **Đề tài:** Xây dựng hệ thống bán lẻ Tiệm Trà & Bánh tích hợp đa nền tảng.

---

## 🚀 CÔNG NGHỆ SỬ DỤNG (TECH STACK)
Dự án được xây dựng với kiến trúc hiện đại, tập trung vào hiệu năng và trải nghiệm người dùng.

- **Backend:** `Spring Boot 3.5.8`, `Spring Security`, `JPA/Hibernate`, `MySQL`.
- **Admin Panel:** `React` + `React Admin` + `MUI` (Giao diện Dashboard chuyên nghiệp).
- **Mobile App:** `React Native` + `Expo` + `Reanimated` + `Lottie` (Hiệu ứng siêu mượt).
- **AI Integration:** `Google Gemini AI` (Tìm kiếm bằng hình ảnh & Chatbot).
- **Payment Gateway:** `MoMo`, `VNPay` (Tích hợp thanh toán thật/sandbox).
- **Documentation:** `Swagger UI / OpenAPI 3.0`.

---

## ✅ DANH SÁCH TÍNH NĂNG (SCORECARD - 10/10)

### 1. 🏗️ Kiến trúc & Mã nguồn (1.5đ)
- Tuân thủ mô hình **Controller - Service - Repository**.
- Áp dụng nguyên lý **OOP** (Kế thừa từ BaseEntity, Đa hình trong Service).
- Sử dụng **DTO** để tối ưu dữ liệu truyền tải.

### 2. 📦 Chức năng cốt lõi (3.0đ)
- **Quản lý sản phẩm:** CRUD đầy đủ + Soft Delete.
- **Quản lý Category:** Phân loại sản phẩm thông minh.
- **Xác thực:** Đăng ký/Đăng nhập bảo mật với **JWT (JSON Web Token)**.
- **Giỏ hàng & Thanh toán:** Quy trình mượt mà từ chọn món đến checkout.

### 3. 🌟 Chức năng nâng cao (2.5đ)
- **Thanh toán trực tuyến:** Tích hợp cổng MoMo và VNPay chính thức.
- **Smart Search (AI):** Tìm kiếm sản phẩm bằng ảnh qua Gemini AI.
- **Hệ thống Voucher:** Mã giảm giá tự động tính toán theo giá trị đơn hàng.
- **Dashboard Thống kê:** Biểu đồ doanh thu, số lượng khách hàng, đơn hàng mới nhất cho Admin.
- **Chat hỗ trợ:** Chat trực tuyến giữa khách hàng và quản trị viên.

### 4. 📱 UI/UX & Trải nghiệm (0.5đ)
- **Mượt mà:** Sử dụng `Reanimated` cho hiệu ứng chuyển trang.
- **Skeleton Loading:** Trải nghiệm sang trọng khi tải dữ liệu.
- **Lottie Animations:** Các animation động cho Success, Empty Cart, Loading...
- **Haptic Feedback:** Rung phản hồi khi tương tác nút bấm.

### 5. 🧪 Kiểm thử - Testing & QA (1.0đ)
- **20+ Unit Tests** cover các logic quan trọng (Auth, Product, Order).
- Kiểm thử Stored Procedures trong Java.
- Chứng minh qua file `TEST_REPORT.md`.

### 6. 📝 Tài liệu & Trình bày (0.5đ)
- **Swagger UI:** Tài liệu API tương tác tại `http://localhost:8080/swagger-ui/index.html`.
- **README:** Hướng dẫn chi tiết, cấu trúc rõ ràng.

### 7. ☁️ Triển khai (1.0đ)
- Sẵn sàng deploy lên các nền tảng (AWS/Netlify...).

---

## 🛠️ HƯỚNG DẪN CÀI ĐẶT

### 1. Cấu hình Backend (Java)
1. Tạo Database MySQL: `CREATE DATABASE teashop_java_db;`
2. Chạy file SQL Script: `teashop_java_db.sql` (để có dữ liệu mẫu và Stored Procedures).
3. Cập nhật `application.properties` (Database credentials, Gemini API Key).
4. Chạy: `mvn spring-boot:run`

### 2. Cấu hình Admin & Web
1. `cd FE_java_tu_lam`
2. `npm install` && `npm run dev`

### 3. Cấu hình Mobile App
1. `cd Demo2`
2. `npm install`
3. `npx expo start` (Sử dụng App Expo Go trên điện thoại để quét QR).

---

## 📖 TÀI LIỆU API (SWAGGER)
Truy cập sau khi chạy Backend:  
👉 [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)

---

## 📸 HÌNH ẢNH DỰ ÁN
*(Chèn screenshot App Mobile & Admin Dashboard tại đây)*

---
**Dự án được thực hiện với sự tâm huyết nhằm mang lại giải pháp thương mại điện tử hoàn chỉnh.**
