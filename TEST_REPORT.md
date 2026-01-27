# 🧪 BÁO CÁO KIỂM THỬ (TEST REPORT)

## 📌 THÔNG TIN CHUNG
- **Dự án:** Quản lý cửa hàng Trà Sữa (Tea Shop)
- **Framework kiểm thử:** JUnit 5, Mockito, Spring Boot Test
- **Thời gian thực hiện:** 25/01/2026

---

## 🏗️ 1. DANH SÁCH UNIT TESTS (AUTOMATION)

Đã thực hiện bổ sung các unit test cover các chức năng quan trọng: Authentication, Product Management, Order Processing.

### 🔑 Authentication (AuthServiceTest)
| Test Case ID | Tên Test Case | Mô tả | Trạng thái |
|---|---|---|---|
| AUTH_01 | `register_Success` | Đăng ký thành công với thông tin hợp lệ | ✅ PASSED |
| AUTH_02 | `register_EmailExists` | Đăng ký thất bại khi email đã tồn tại | ✅ PASSED |
| AUTH_03 | `login_Success` | Đăng nhập thành công, trả về JWT Token | ✅ PASSED |
| AUTH_04 | `login_WrongPassword` | Đăng nhập thất bại do sai mật khẩu | ✅ PASSED |
| AUTH_05 | `login_EmailNotFound` | Đăng nhập thất bại do email không tồn tại | ✅ PASSED |

### 🛍️ Product Management (ProductServiceTest)
| Test Case ID | Tên Test Case | Mô tả | Trạng thái |
|---|---|---|---|
| PROD_01 | `testFindById_Success` | Tìm sản phẩm theo ID thành công | ✅ PASSED |
| PROD_02 | `testFindById_NotFound` | Tìm sản phẩm không tồn tại trả về null/exception | ✅ PASSED |
| PROD_03 | `testFindActiveProducts` | Lấy danh sách sản phẩm đang kinh doanh | ✅ PASSED |
| PROD_04 | `testSearchByKeyword` | Tìm kiếm sản phẩm theo tên | ✅ PASSED |
| PROD_05 | `testSoftDelete` | Xóa mềm sản phẩm (đánh dấu deleted = 1) | ✅ PASSED |

### 🧾 Order Processing (OrderRepositoryTest)
| Test Case ID | Tên Test Case | Mô tả | Trạng thái |
|---|---|---|---|
| ORD_01 | `createOrder_Success` | Tạo đơn hàng mới vào database | ✅ PASSED |
| ORD_02 | `findByUser_Success` | Lấy lịch sử đơn hàng của User | ✅ PASSED |
| ORD_03 | `updateStatus_Success` | Cập nhật trạng thái đơn (PENDING -> CONFIRMED) | ✅ PASSED |

---

## 🔗 2. INTEGRATION TESTS (API LEVEL)

Kiểm thử tích hợp các API endpoint sử dụng `MockMvc`.

| Endpoint | Test Class | Kịch bản | Kết quả mong đợi | Trạng thái |
|---|---|---|---|---|
| `POST /api/auth/register` | `AuthControllerTest` | Gửi JSON đăng ký hợp lệ | HTTP 200 + Token | ✅ PASSED |
| `POST /api/auth/login` | `AuthControllerTest` | Gửi JSON đăng nhập đúng | HTTP 200 + Token | ✅ PASSED |
| `POST /api/auth/login` | `AuthControllerTest` | Gửi JSON đăng nhập sai | HTTP 4xx Client Error | ✅ PASSED |

---

## ✅ 3. MANUAL TEST CHECKLIST (KIỂM THỬ THỦ CÔNG)

Dành cho các chức năng giao diện (Frontend) và luồng nghiệp vụ phức tạp.

**Tester:** [Tên Sinh Viên]

| STT | Chức năng | Kịch bản kiểm thử (Test Scenario) | Kết quả thực tế |
|---|---|---|---|
| 1 | **Đăng ký** | Nhập thiếu họ tên -> Hiển thị lỗi "Vui lòng nhập họ tên" | ✅ OK (Đã fix) |
| 2 | **Đăng ký** | Nhập email sai định dạng (abc.com) -> Báo lỗi Format | ✅ OK (Đã fix) |
| 3 | **Đăng ký** | Nhập SĐT quá ngắn/quá dài -> Báo lỗi "Phải đúng 10 số" | ✅ OK (Đã fix) |
| 4 | **Đặt hàng** | Chọn địa chỉ ngoài HCM -> Báo lỗi "Chỉ giao HCM" | ✅ OK (Đã fix) |
| 5 | **Thanh toán** | Chọn phương thức MoMo -> Chuyển luồng sang cổng thanh toán | ✅ OK |
| 6 | **Giỏ hàng** | Thêm Combo Noel -> Tự động thêm quà tặng (Túi Canvas) | ✅ OK |

---

## 🚀 HƯỚNG DẪN CHẠY TEST

Để chạy toàn bộ test suite và xuất report:

1. Mở terminal tại thư mục backend: `d:/JAVA_KT_CUOI_KY/JAVA_Tu_Lam/demo`
2. Chạy lệnh Maven:
   ```bash
   mvn test
   ```
3. Xem kết quả chi tiết tại console hoặc thư mục `target/surefire-reports`.

---
*Ghi chú: Báo cáo này được cập nhật tự động dựa trên cấu trúc source code hiện tại.*
