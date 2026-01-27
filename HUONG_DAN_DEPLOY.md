# Hướng Dẫn Deploy Ứng Dụng (Spring Boot + MySQL + React)

Chào bạn, mình đã chuẩn bị code để sẵn sàng deploy. Vì bạn đang dùng XAMPP (local), để đưa lên mạng, bạn cần chuyển Database, Backend và Frontend lên Cloud.

Dưới đây là các bước chi tiết:

## 1. Chuẩn bị Database (MySQL)
Vì XAMPP chỉ chạy trên máy bạn, bạn cần một Database online.
1. Vào **phpMyAdmin** trên máy (http://localhost/phpmyadmin).
2. Chọn database `teashop_java_db`.
3. Bấm **Export** (Xuất) -> **Quick** -> **Go**. Bạn sẽ tải về file `.sql`.
4. Đăng ký tài khoản tại [Aiven](https://aiven.io/) (có gói Free MySQL) hoặc [Railway](https://railway.app/).
5. Tạo một database MySQL mới.
6. Copy thông tin kết nối:
   - **Host** (ví dụ: `mysql-service.aivencloud.com`)
   - **Port** (ví dụ: `25060`)
   - **Username**
   - **Password**
   - **Database Name**
7. Dùng công cụ như MySQL Workbench hoặc DBeaver kết nối vào Database online đó và chạy file `.sql` vừa tải về để nạp dữ liệu.

## 2. Deploy Backend (Spring Boot)
Mình đã tạo file `Dockerfile` và cập nhật `application.properties` để hỗ trợ deploy.
1. Đẩy code lên **GitHub**.
2. Đăng ký tài khoản [Render](https://render.com/) hoặc [Railway](https://railway.app/).
3. **Nếu dùng Render (Free)**:
   - Chọn **New Web Service**.
   - Kết nối với GitHub repo của bạn.
   - Root Directory: `JAVA_Tu_Lam/demo` (Quan trọng: trỏ đúng vào thư mục chứa Dockerfile).
   - Environment: **Docker**.
   - Kéo xuống phần **Environment Variables**, thêm các biến sau:
     - `DB_URL`: Chuỗi kết nối JDBC tới database online của bạn (VD: `jdbc:mysql://host:port/dbname`)
     - `DB_USERNAME`: User DB online
     - `DB_PASSWORD`: Pass DB online
     - `JWT_SECRET`: Điền một chuỗi ký tự ngẫu nhiên dài.
   - Bấm **Create Web Service**. Chờ nó build và deploy.
   - Sau khi xong, bạn sẽ có một link ví dụ: `https://my-backend.onrender.com`.

## 3. Deploy Frontend (React/Vite)
1. Đăng ký tài khoản [Vercel](https://vercel.com).
2. Bấm **Add New Project**.
3. Chọn repo GitHub của bạn.
4. **Build & Config Settings**:
   - Framework Preset: **Vite**.
   - Root Directory: chọn `FE_java_tu_lam` (bấm Edit để chọn đúng thư mục).
5. **Environment Variables**:
   - Thêm biến `VITE_API_BASE_URL` với giá trị là link Backend vừa có ở bước 2 (VD: `https://my-backend.onrender.com`). **Lưu ý: Không có dấu / ở cuối**.
6. Bấm **Deploy**.

## Lưu ý quan trọng về Ảnh (Uploads)
- Vì deploy miễn phí (Render/Railway), file ảnh bạn upload sẽ **mất đi khi server khởi động lại** (do server không có ổ cứng lưu trữ vĩnh viễn).
- Các ảnh cũ trong thư mục `uploads` trên máy bạn cần được copy thủ công lên server hoặc bạn phải upload lại từ đầu trên trang Admin đã deploy.
- Giải pháp tốt nhất là dùng Cloudinary hoặc AWS S3 để lưu ảnh, nhưng để báo cáo cuối kỳ thì bạn chỉ cần lưu ý giáo viên vấn đề này là được.

Chúc bạn thành công! Nếu cần hỗ trợ đoạn nào cứ nhắn mình.
