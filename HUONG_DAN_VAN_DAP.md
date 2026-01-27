# 🎯 TỔNG HỢP SIÊU LÝ THUYẾT & HƯỚNG DAN VẤN ĐÁP ĐỒ ÁN (FULL TRỌN BỘ)

Đây là tài liệu duy nhất bạn cần để ôn tập. Tôi đã gom tất cả các phần: Luồng hoạt động, OOP, Spring Boot, JDBC, Security và MoMo vào một nơi.

---

## 1. LUỒNG HOẠT ĐỘNG CHÍNH (Workflows)

### A. Luồng Đặt hàng & Thanh toán (Checkout)
1.  **Frontend:** Người dùng chọn món -> Giỏ hàng -> Nhấn "Đặt hàng".
2.  **Controller:** `PaymentController` nhận dữ liệu.
3.  **Service:** `OrderService` xử lý logic: Kiểm tra giỏ hàng -> Lưu thông tin vào bảng `orders` -> Lưu chi tiết món vào bảng `order_items`.
4.  **Database:** Gọi **Stored Procedure** (`sp_update_product_inventory`) để trừ số lượng sản phẩm trong kho.
5.  **Admin:** Nhận thông báo và xem đơn hàng mới nhất trên Dashboard.

### B. Luồng Đăng ký (Register)
1.  **Frontend:** User nhập tên, email, mật khẩu... gửi request POST tới `/api/auth/register`.
2.  **Backend (Service):** 
    - Kiểm tra email đã tồn tại trong DB chưa.
    - **Mã hóa mật khẩu:** Dùng `BCryptPasswordEncoder` để biến mật khẩu thành chuỗi ký tự lạ (bảo mật).
    - Lưu User vào Database qua `UserRepository`.
    - Tạo một chuỗi **JWT Token** để User có thể đăng nhập ngay lập tức.
    
### C. Luồng Đăng nhập (Login)
1.  **Frontend:** User gửi Email + Password tới `/api/auth/login`.
2.  **Backend (Service):**
    - Lấy User từ Database dựa trên Email.
    - Kiểm tra mật khẩu: Dùng hàm `matches()` của BCrypt để so sánh mật khẩu nhập vào với mật khẩu đã mã hóa trong DB.
    - Nếu đúng, tạo **JWT Token** gửi về cho Frontend.
    - **Frontend:** Lưu Token vào `sessionStorage` để dùng cho các yêu cầu tiếp theo.

### D. Luồng Thanh toán MoMo / VNPay (Online Payment)
1.  **Gửi yêu cầu:** User chọn MoMo -> Backend gọi API của MoMo kèm thông tin đơn hàng và chữ ký bảo mật (Signature).
2.  **Chuyển hướng:** MoMo trả về một đường link (`payUrl`) -> Frontend chuyển hướng người dùng sang trang thanh toán của MoMo.
3.  **Xác nhận:** User trả tiền trên app MoMo.
4.  **Kết quả (Callback/IPN):** MoMo gửi thông báo kết quả (thành công/thất bại) về cổng `IPN` của Backend. Backend cập nhật trạng thái đơn hàng thành `PAID` (Đã thanh toán) và hiển thị thông báo thành công cho User.

### E. Luồng Hoạt Động Của Halu AI (Chatbot thông minh)
1.  **Gửi yêu cầu:** Người dùng gửi văn bản hoặc **Hình ảnh sản phẩm** qua khung Chat.
2.  **Xử lý AI (Spring Boot - Java):** Backend (Java) gọi trực tiếp API của Gemini thông qua `GeminiService`. 
3.  **Tự động chuyển Key:** Hệ thống được lập trình sẵn cơ chế tự động xoay vòng 5 API Key dự phòng ngay trong code Java nếu gặp lỗi giới hạn lượt gọi.
4.  **Tương tác dữ liệu:** Trước khi gửi câu hỏi tới AI, Java tự động truy vấn danh sách món ăn từ Database để cung cấp "ngữ cảnh" giúp AI trả lời chính xác các món đang có tại quán.
5.  **Hành động thông minh:** AI trả về câu trả lời tiếng Việt thân thiện, hỗ trợ tư vấn món và hướng dẫn mua hàng.

---

## 2. NGUYÊN LÝ LẬP TRÌNH HƯỚNG ĐỐI TƯỢNG (OOP) - CẦN THUỘC FILE

**Hỏi: Em áp dụng 4 tính chất OOP như thế nào? Chỉ đích danh file.**
- **Tính Trừu tượng (Abstraction):** 
    - File: `BaseCrudService.java` (Interface) và `BaseEntity.java` (Abstract class).
    - Giải thích: Em chỉ định nghĩa khung (hàm get, delete...) mà không cài đặt chi tiết ở đây.
- **Tính Kế thừa (Inheritance):** 
    - File: `Product.java`, `User.java`, `Favorite.java`.
    - Giải thích: Các class này đều `extends BaseEntity` để dùng lại thuộc tính `id`.
- **Tính Đa hình (Polymorphism):** 
    - File: `ProductService.java`.
    - Giải thích: Interface `BaseCrudService` được nhiều lớp khác nhau thực thi theo các logic khác nhau.
- **Tính Đóng gói (Encapsulation):** 
    - File: Toàn bộ folder **Entity** (`User.java`, `Category.java`...).
    - Giải thích: Dùng `private` cho biến và `public` cho `Getter/Setter`.

---

## 3. KIẾN TRÚC SPRING BOOT & JDBC

### A. Các thành phần 3 tầng
- **Controller:** Lễ tân tiếp nhận request (VD: `ProductController`).
- **Service:** Nhà bếp xử lý logic (VD: `OrderServiceImpl`).
- **Repository:** Kho hàng lưu trữ Database (VD: `ProductRepository`).

### B. Giải thích Code JDBC (Hỏi về kỹ thuật)
- **Tại sao dùng JDBC thay vì JPA?** Để kiểm soát SQL tuyệt đối, tối ưu hiệu năng và hiểu sâu bản chất kết nối Java-Database.
- **try-with-resources:** Tự động đóng kết nối DB, tránh tràn bộ nhớ.
- **PreparedStatement (?):** Ngăn chặn lỗi bảo mật **SQL Injection**.
- **ResultSet:** Là bảng dữ liệu thô từ SQL, cần dùng hàm `mapList` để chuyển nó về Object Java cho dễ xử lý.

---

## 4. CƠ SỞ DỮ LIỆU NĂNG CAO

- **Soft Delete (Xóa mềm):** `deleted = 1` thay vì xóa hẳn. Giúp báo cáo doanh thu chính xác và khôi phục dữ liệu nếu cần.
- **Stored Procedures:** Viết logic trừ kho ngay trong DB để tăng tốc độ xử lý và đảm bảo tính nhất quán dữ liệu.
- **Transaction:** Đảm bảo một hành động (như đặt hàng) phải thành công toàn bộ, nếu lỗi ở bước nào thì sẽ hủy bỏ (Rollback) toàn bộ để tránh dữ liệu rác.

---

## 5. CÁC ĐIỂM SÁNG TẠO (Điểm 9-10)

1.  **AI Gemini:** Cho phép tìm kiếm sản phẩm thông minh bằng ngôn ngữ tự nhiên hoặc hình ảnh.
2.  **Tích hợp Đa kênh Thanh toán:** Xử lý luồng MoMo, VNPay phức tạp bao gồm cả Chữ ký số (Signature) và Callback.
3.  **Premium UI/UX:** Sử dụng **Skeleton Loaders** (khung tải mờ) và **Stagger Animations** (hiện món ăn lần lượt) giúp trang web trông "xịn" như các trang quốc tế.
