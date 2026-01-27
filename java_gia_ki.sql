-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th1 10, 2026 lúc 04:33 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `teashop_java_db`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `carts`
--

CREATE TABLE `carts` (
  `cart_id` bigint(20) NOT NULL,
  `total_price` double DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `carts`
--

INSERT INTO `carts` (`cart_id`, `total_price`, `user_id`) VALUES
(1, 0, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cart_items`
--

CREATE TABLE `cart_items` (
  `cart_item_id` bigint(20) NOT NULL,
  `discount` double NOT NULL,
  `product_id` bigint(20) DEFAULT NULL,
  `product_price` double NOT NULL,
  `quantity` int(11) DEFAULT NULL,
  `cart_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `category`
--

CREATE TABLE `category` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `category`
--

INSERT INTO `category` (`id`, `name`, `slug`, `deleted`) VALUES
(5, 'Cà phê', NULL, 0),
(6, 'Trà', NULL, 0),
(7, 'Nước ép', NULL, 0),
(8, 'Bánh ngọt', NULL, 0),
(9, 'banh kem', 'banh-kem', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orders`
--

CREATE TABLE `orders` (
  `order_id` bigint(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `order_date` date DEFAULT NULL,
  `order_status` varchar(255) DEFAULT NULL,
  `payment_id` bigint(20) DEFAULT NULL,
  `total_amount` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `orders`
--

INSERT INTO `orders` (`order_id`, `email`, `order_date`, `order_status`, `payment_id`, `total_amount`) VALUES
(1, 'godofwarkratop123@gmail.com', '2025-12-20', 'PROCESSING', NULL, 72000),
(2, 'an@gmail.com', '2025-12-20', 'PENDING', NULL, 121000),
(3, 'Hahaha@gmail.com', '2025-12-20', 'PENDING', NULL, 86000),
(4, 'mery@gmail.com', '2025-12-20', 'COMPLETED', NULL, 112000),
(5, 'godofwarkratop123@gmail.com', '2026-01-10', 'PENDING', NULL, 300000);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `order_items`
--

CREATE TABLE `order_items` (
  `order_item_id` bigint(20) NOT NULL,
  `discount` double NOT NULL,
  `ordered_product_price` double NOT NULL,
  `product_id` bigint(20) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `order_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `order_items`
--

INSERT INTO `order_items` (`order_item_id`, `discount`, `ordered_product_price`, `product_id`, `quantity`, `order_id`) VALUES
(1, 34000, 56000, 47, 2, 1),
(2, 0, 28000, 32, 1, 1),
(3, 37000, 123000, 48, 1, 2),
(4, 0, 35000, 30, 1, 2),
(5, 37000, 123000, 48, 1, 3),
(6, 0, 28000, 32, 4, 4),
(7, 0, 100000, 51, 3, 5);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product`
--

CREATE TABLE `product` (
  `id` bigint(20) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `price` double NOT NULL,
  `price_root` double NOT NULL DEFAULT 0,
  `qty` int(11) NOT NULL DEFAULT 0,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `category_id` bigint(20) DEFAULT NULL,
  `status` tinyint(1) DEFAULT 1,
  `deleted` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `product`
--

INSERT INTO `product` (`id`, `description`, `photo`, `price`, `price_root`, `qty`, `title`, `slug`, `category_id`, `status`, `deleted`, `created_at`, `updated_at`) VALUES
(30, 'Cà phê sữa béo ngậy kiểu Sài Gòn', 'bacxiu.jpg', 35000, 0, 30, 'Bạc xỉu', 'product-30', 5, 1, 0, '2025-12-17 09:01:12', '2025-12-20 09:54:33'),
(31, 'Trà đào thanh mát, thơm cam sả', 'sodadau.jpg', 30000, 0, 54, 'Trà đào cam sả', 'product-31', 6, 1, 0, '2025-12-17 09:01:12', '2025-12-20 09:54:45'),
(32, 'Nước ép trái cây chua ngọt xí muội', 'ximuoi.jpg', 28000, 0, 5, 'Nước ép xí muội', 'product-32', 7, 1, 0, '2025-12-17 09:01:12', '2025-12-20 09:54:54'),
(33, 'Bánh ngọt vị xoài mềm mịn', 'banhxoai.jpg', 40000, 0, 0, 'Bánh xoài', 'product-33', 8, 1, 0, '2025-12-17 09:01:12', '2025-12-17 09:01:26'),
(44, 'ss', '57cdcad1-6362-4fef-a475-a913500843f6_a57d01ea7d02746af73b73b31238a19a-removebg-preview.png', 8900, 90, 7, 's', 'cam-sanheeff', 5, 1, 0, '2025-12-17 12:43:46', '2025-12-17 12:43:46'),
(45, 'Nước có màu đỏ cam đậm, thường là các loại trái cây có vị chua gắt như Mận, Xí muội, hoặc Sấu.', '70421864-b304-461d-8827-ef6d000fb180_sodadau.jpg', 80000, 67000, 5, 'Trà Ổi', 'tra-oi', 6, 1, 1, '2025-12-20 08:43:50', '2025-12-20 08:51:34'),
(47, 'hhgghhghg', 'e7d992fc-3839-4bff-9175-36b69235aca8_sodadau.jpg', 90000, 56000, 6, 'Trà Ổi', 'trai-cay', 6, 1, 0, '2025-12-20 08:57:01', '2025-12-20 08:57:01'),
(48, 'bánh việt quốc nhập khẩu', '28f42eea-163f-4302-8d13-39fa5aef2b55_vietquoc.jpg', 160000, 123000, 7, 'Bánh Việt Quốc', 'banh-viet-quoc', 8, 1, 0, '2025-12-20 13:07:27', '2025-12-20 13:07:27'),
(49, 'Thưởng thức combo bánh và nước thơm ngon, được chọn lọc từ những món được yêu thích nhất tại cửa hàng.\r\nMỗi combo bao gồm bánh tươi mềm – đồ uống mát lành, dùng kèm túi xách xinh xắn miễn phí, tiện lợi khi mang đi hoặc làm quà tặng.', '710353ab-d7fe-4510-b4c2-24b91ffa5f81_tải xuống (1).png', 170000, 0, 5, 'Combo Noel 1', 'no-enl-1', 8, 1, 0, '2025-12-20 14:58:43', '2025-12-20 14:58:43'),
(50, '✨ Điểm nổi bật:\r\n\r\nBánh ngọt mềm, hương vị hài hòa, làm mới mỗi ngày\r\n\r\nNước uống thơm ngon, giải khát, dễ uống\r\n\r\n🎁 Tặng kèm túi xách tiện dụng – đẹp, gọn, thân thiện môi trường\r\n\r\nPhù hợp dùng cá nhân, đi học, đi làm hoặc làm quà', '242d6483-5d25-4821-9d83-7288a9666e29_tải xuống (2).png', 169000, 0, 7, 'Combo Noel 2', 'com-bo-2', 8, 1, 0, '2025-12-20 14:59:38', '2025-12-20 14:59:38'),
(51, 'Combo bánh & nước thơm ngon – tiện lợi mỗi ngày\r\n🎁 Tặng kèm túi xinh • Tiết kiệm • Dễ man', '41d942af-615e-414b-8ebb-27e7359f5529_tải xuống.png', 100000, 0, 7, 'Combo Noel 3', 'c-b-3', 8, 1, 0, '2025-12-20 15:00:22', '2025-12-20 15:00:22'),
(52, 'Combo tiết kiệm dành cho nhóm bạn, gia đình hoặc team nhỏ.\r\nGồm 3 loại bánh ngọt thơm mềm kết hợp cùng 3 loại nước uống mát lành, mang đến trải nghiệm trọn vị – tiện lợi – tiết kiệm.', 'b4fb759d-1819-43d0-b1cc-25c781b0d029_tải xuống (3).png', 279000, 0, 5, 'ComBo 3 bánh+ 3 nước ', 'banh-nuoc', 8, 1, 0, '2025-12-20 15:01:30', '2025-12-20 15:01:30'),
(53, '✨ Điểm nổi bật:\r\n\r\n3 bánh đa dạng hương vị, bánh tươi mỗi ngày\r\n\r\n3 nước uống dễ uống, giải khát tốt\r\n\r\nPhù hợp đi học, đi làm, họp nhóm, sinh nhật nhỏ\r\n\r\nGiá ưu đãi hơn mua lẻ từng món', 'ae17832a-8867-440b-832b-ba021ce8d235_tải xuống (4).png', 289000, 250000, 8, 'Combo 3 bánh + 3 nước (1)', 'ba-ba', 8, 1, 0, '2025-12-20 15:02:24', '2025-12-20 15:02:24'),
(54, 'kkk', '701363c6-b53a-4ae4-84a0-4f472967c659_sg-11134201-7rccv-m6km0sqb9dvt59.jpg', 122222, 0, 11, 'kkk', 'kk', 5, 1, 1, '2025-12-20 15:08:57', '2025-12-20 15:09:03'),
(55, 'kkkkk', '1ff0365d-f781-4229-8d84-5f160345271f_sg-11134201-7rccv-m6km0sqb9dvt59.jpg', 2, 0, 6, 'Túi Tote', 'tui-tq', 8, 1, 0, '2025-12-20 15:09:36', '2025-12-20 15:09:36'),
(56, 'socoooooo', '5192a093-0ef5-4644-bddf-3d0ad8173286_socola.jpg', 70000, 0, 5, 'Bánh socola', 'so-co-la', 8, 1, 0, '2025-12-21 08:02:42', '2025-12-21 08:02:42');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product_images`
--

CREATE TABLE `product_images` (
  `id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `is_main` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product_sizes`
--

CREATE TABLE `product_sizes` (
  `id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `size_name` varchar(50) NOT NULL,
  `price_extra` double DEFAULT 0,
  `stock_qty` int(11) DEFAULT 10
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `toppings`
--

CREATE TABLE `toppings` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` double NOT NULL,
  `stock_qty` int(11) DEFAULT 10
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `toppings`
--

INSERT INTO `toppings` (`id`, `name`, `price`, `stock_qty`) VALUES
(1, 'Trân châu trắng', 5000, 10),
(2, 'Pudding trứng', 5000, 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Tu', 'tu@gmail.com', NULL, '$2a$10$iYU3QnGYR8zlaKSO73yLue822xq2CnQce64BwLPxO0ZWXDvdCdEvS', NULL, '2025-12-19 11:48:15', '2025-12-19 11:48:15'),
(2, 'tin', 'phanthanhductin@gmail.com', NULL, '$2a$10$R.dxxcdcfvXANvLJzPaxWetV62jH.yBUcklvW7eBASvy9Vc9xJrZG', NULL, '2025-12-19 12:42:43', '2025-12-19 12:42:43'),
(3, 'Thanh Thao', 'thanhthao@gmail.com', NULL, '$2a$10$0j.ERlVISxrvJI4rt5AdKe6J5luVHbQIz8RzAD4mrEnl.lii5P9TC', NULL, '2025-12-20 02:26:04', '2025-12-20 02:26:04');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `vouchers`
--

CREATE TABLE `vouchers` (
  `id` bigint(20) NOT NULL,
  `code` varchar(50) NOT NULL,
  `discount` double NOT NULL,
  `min_order_amount` double DEFAULT 0,
  `expiry_date` date DEFAULT NULL,
  `usage_limit` int(11) DEFAULT 100,
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `vouchers`
--

INSERT INTO `vouchers` (`id`, `code`, `discount`, `min_order_amount`, `expiry_date`, `usage_limit`, `is_active`) VALUES
(1, 'WELCOME50', 50000, 150000, '2026-11-20', 100, 1),
(2, 'FREESHIP', 15000, 50000, '2026-06-20', 500, 1),
(3, 'TRA10', 10000, 0, '2026-05-20', 200, 1),
(4, 'PARTY100', 100000, 500000, '2025-12-31', 100, 1),
(5, 'FLASH30', 30000, 99000, '2025-12-20', 100, 1),
(6, 'THANKS20', 20000, 100000, '2025-12-30', 10, 1);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`cart_id`);

--
-- Chỉ mục cho bảng `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`cart_item_id`),
  ADD KEY `FKpcttvuq4mxppo8sxggjtn5i2c` (`cart_id`);

--
-- Chỉ mục cho bảng `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`);

--
-- Chỉ mục cho bảng `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`order_item_id`),
  ADD KEY `FKbioxgbv59vetrxe0ejfubep1w` (`order_id`);

--
-- Chỉ mục cho bảng `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `FK1mtsbur82frn64de7balymq9s` (`category_id`);

--
-- Chỉ mục cho bảng `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Chỉ mục cho bảng `product_sizes`
--
ALTER TABLE `product_sizes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Chỉ mục cho bảng `toppings`
--
ALTER TABLE `toppings`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Chỉ mục cho bảng `vouchers`
--
ALTER TABLE `vouchers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `carts`
--
ALTER TABLE `carts`
  MODIFY `cart_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `cart_item_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT cho bảng `category`
--
ALTER TABLE `category`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT cho bảng `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `order_items`
--
ALTER TABLE `order_items`
  MODIFY `order_item_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `product`
--
ALTER TABLE `product`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT cho bảng `product_images`
--
ALTER TABLE `product_images`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `product_sizes`
--
ALTER TABLE `product_sizes`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `toppings`
--
ALTER TABLE `toppings`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `vouchers`
--
ALTER TABLE `vouchers`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `FKpcttvuq4mxppo8sxggjtn5i2c` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`cart_id`);

--
-- Các ràng buộc cho bảng `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `FKbioxgbv59vetrxe0ejfubep1w` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`);

--
-- Các ràng buộc cho bảng `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `FK1mtsbur82frn64de7balymq9s` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`);

--
-- Các ràng buộc cho bảng `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`);

--
-- Các ràng buộc cho bảng `product_sizes`
--
ALTER TABLE `product_sizes`
  ADD CONSTRAINT `product_sizes_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
