
USE `defaultdb`;
-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 20, 2026 at 01:48 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `teashop_java_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `carts`
--

CREATE TABLE `carts` (
  `cart_id` bigint(20) NOT NULL,
  `total_price` double DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`cart_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `carts`
--

INSERT INTO `carts` (`cart_id`, `total_price`, `user_id`) VALUES
(1, 0, 1),
(2, 210000, 27),
(3, 0, 17),
(4, 0, 16);

-- --------------------------------------------------------

--
-- Table structure for table `cart_items`
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
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `name`, `slug`, `deleted`) VALUES
(5, 'Cà phê', 'ca phe', 0),
(6, 'Trà', 'tra', 0),
(7, 'Nước ép', 'nuoc ep ', 0),
(8, 'Bánh ngọt', 'banh ngot', 0),
(9, 'banh kem', 'banh-kem', 1);

-- --------------------------------------------------------

--
-- Table structure for table `contact`
--

CREATE TABLE `contact` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `content` mediumtext NOT NULL,
  `reply_content` text DEFAULT NULL,
  `reply_id` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `created_by` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `updated_by` int(10) UNSIGNED DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `status` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `contact`
--

INSERT INTO `contact` (`id`, `user_id`, `name`, `email`, `phone`, `title`, `content`, `reply_content`, `reply_id`, `created_by`, `updated_by`, `deleted_at`, `created_at`, `updated_at`, `status`) VALUES
(1, 1, 'Liên hệ 1', 'lien@example.com', '0987654321', 'Tiêu đề liên hệ 1', 'Nội dung liên hệ', 'what your name', 2, 1, NULL, NULL, '2025-03-18 18:11:52', '2025-05-09 12:49:21', 1),
(2, 1, 'Liên hệ 2', 'lien@example.com', '0987654322', 'Tiêu đề liên hệ 2', 'Nội dung liên hệ', 'hello it me', 2, 1, NULL, NULL, '2025-03-18 18:11:52', '2025-05-09 12:49:29', 1),
(3, 1, 'Liên hệ 3', 'lien@example.com', '0987654323', 'Tiêu đề liên hệ 3', 'Nội dung liên hệ', 'what', 3, 1, NULL, NULL, '2025-03-18 18:11:52', '2025-05-10 04:57:29', 1),
(4, 1, 'Liên hệ 4', 'lien@example.com', '0987654324', 'Tiêu đề liên hệ 4', 'Nội dung liên hệ', NULL, 0, 1, NULL, NULL, '2025-03-18 18:11:52', NULL, 1),
(5, 1, 'Liên hệ 5', 'lien@example.com', '0987654325', 'Tiêu đề liên hệ 5', 'Nội dung liên hệ', NULL, 0, 1, NULL, NULL, '2025-03-18 18:11:52', NULL, 1),
(6, 1, 'Liên hệ 6', 'lien@example.com', '0987654326', 'Tiêu đề liên hệ 6', 'Nội dung liên hệ', NULL, 0, 1, NULL, NULL, '2025-03-18 18:11:52', NULL, 1),
(7, 1, 'Liên hệ 7', 'lien@example.com', '0987654327', 'Tiêu đề liên hệ 7', 'Nội dung liên hệ', NULL, 0, 1, NULL, NULL, '2025-03-18 18:11:52', NULL, 1),
(8, 1, 'Liên hệ 8', 'lien@example.com', '0987654328', 'Tiêu đề liên hệ 8', 'Nội dung liên hệ', NULL, 0, 1, NULL, NULL, '2025-03-18 18:11:52', NULL, 1),
(9, 1, 'Liên hệ 9', 'lien@example.com', '0987654329', 'Tiêu đề liên hệ 9', 'Nội dung liên hệ', NULL, 0, 1, NULL, NULL, '2025-03-18 18:11:52', NULL, 1),
(10, NULL, '12345ê', '123@gmail.com', '11345', '12345', '12345', NULL, 0, 1, NULL, '2025-05-08 08:38:38', '2025-05-04 02:26:19', '2025-05-08 08:38:38', 1),
(11, NULL, '6666', 'ductin@gmail.com', '6666', '666', '666', NULL, 0, 1, 30, '2025-05-08 10:13:44', '2025-05-08 10:13:16', '2025-10-06 03:41:52', 1),
(12, NULL, 'pppp', 'pppp@gmail.com', '123456789', '123', 'ttttttt', 'po;ioil', 2, 0, NULL, '2025-05-10 04:06:05', '2025-05-09 06:50:21', '2025-05-10 04:06:05', 1),
(13, NULL, 'tinphan', 'tinphan13022005@gmail.com', '123456456', 'Liên hệ từ tinphan', 'ưqdqwdwq', NULL, 0, 0, 0, NULL, '2025-10-05 07:07:44', '2025-10-05 07:07:44', 0),
(14, NULL, 'tinnnnn nen', 'tinphan13022005@gmail.com', 'ưddwawd', 'Liên hệ từ tinnnnn nen', 'ưdawdawd', NULL, 0, 0, 0, NULL, '2025-10-05 07:07:55', '2025-10-05 07:07:55', 0),
(15, NULL, 'tinnnn', 'tinphan13022005@gmail.com', '01545455', 'Liên hệ từ tinnnn', 'đawwda', NULL, 0, 0, 30, NULL, '2025-10-05 09:34:08', '2025-10-06 03:42:02', 1),
(16, NULL, 'mmmmmm', 'tinphan13022005@gmail.com', '1231232', 'Liên hệ từ mmmmmm', 'nnnnnnnnnnnnnnnn', NULL, 0, 0, 30, NULL, '2025-10-05 09:35:41', '2025-10-06 03:41:55', 0),
(17, 17, 'phan thanh duc tin', 'phanthanhductin@gmail.com', '0123456', 'web bị lỗi ', 'bạn hãy khắc phục ', NULL, 0, 0, NULL, NULL, '2026-01-15 17:12:32', NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `favorites`
--

CREATE TABLE `favorites` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `favorites`
--

INSERT INTO `favorites` (`id`, `user_id`, `product_id`, `created_at`) VALUES
(5, 17, 53, '2026-01-20 11:32:57'),
(9, 17, 55, '2026-01-20 11:33:12'),
(10, 17, 56, '2026-01-20 11:36:43'),
(11, 17, 52, '2026-01-20 11:40:26'),
(12, 16, 56, '2026-01-20 11:40:47'),
(13, 16, 55, '2026-01-20 11:40:47');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` bigint(20) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `order_date` date DEFAULT NULL,
  `order_status` varchar(255) DEFAULT NULL,
  `total_amount` double DEFAULT NULL,
  `payment_id` bigint(20) DEFAULT NULL,
  `address` varchar(500) DEFAULT NULL,
  `customer_name` varchar(255) DEFAULT NULL,
  `payment_method` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `momo_order_id` varchar(255) DEFAULT NULL,
  `momo_result_code` int(11) DEFAULT NULL,
  `momo_trans_id` bigint(20) DEFAULT NULL,
  `payment_status` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `cancellation_reason` varchar(255) DEFAULT NULL,
  `discount_amount` double DEFAULT NULL,
  `shipping_fee` double DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `email`, `order_date`, `order_status`, `total_amount`, `payment_id`, `address`, `customer_name`, `payment_method`, `phone`, `momo_order_id`, `momo_result_code`, `momo_trans_id`, `payment_status`, `created_at`, `cancellation_reason`, `discount_amount`, `shipping_fee`, `user_id`) VALUES
(63, 'tinnn@gmail.com', '2026-01-16', 'CANCELLED', 161002, NULL, '123123', 'Tinphan PhanTin', 'MOMO', '123123123123', NULL, NULL, NULL, 'PENDING', '2026-01-16 11:29:41.000000', 'Tự động hủy do quá thời gian thanh toán (2 phút)', 50000, NULL, 16),
(64, 'tinnn@gmail.com', '2026-01-16', 'CANCELLED', 229000, NULL, '1231', 'Tinphan PhanTin', 'MOMO', '123123123', NULL, NULL, NULL, 'PENDING', '2026-01-16 11:33:23.000000', 'Tự động hủy do quá thời gian thanh toán (2 phút)', 50000, NULL, 16),
(65, 'tinnn@gmail.com', '2026-01-16', 'CANCELLED', 161000, NULL, '89', 'Tinphan PhanTin', 'MOMO', '89898989889', NULL, NULL, NULL, 'PENDING', '2026-01-16 11:42:52.000000', NULL, 50000, NULL, 16),
(66, 'phanthanhductin@gmail.com', '2026-01-16', 'CANCELLED', 55000, NULL, '565', 'ductin Tinphan', 'MOMO', '56565556565', NULL, NULL, NULL, 'PENDING', '2026-01-16 11:47:28.000000', 'Tự động hủy do quá thời gian thanh toán (2 phút)', 15000, NULL, 17),
(67, 'phanthanhductin@gmail.com', '2026-01-16', 'CANCELLED', 161000, NULL, '123', 'ductin Tinphan', 'MOMO', '123412341234', NULL, NULL, NULL, 'PENDING', '2026-01-16 11:53:44.000000', 'Tự động hủy do quá thời gian thanh toán (2 phút)', 50000, NULL, 17),
(68, 'phanthanhductin@gmail.com', '2026-01-16', 'CANCELLED', 330000, NULL, '123', 'ductin Tinphan', 'MOMO', '12312312312', NULL, NULL, NULL, 'PENDING', '2026-01-16 15:45:14.000000', 'Tự động hủy do quá thời gian thanh toán (2 phút)', 50000, NULL, 17),
(69, 'phanthanhductin@gmail.com', '2026-01-16', 'CANCELLED', 18000, NULL, '123', 'ductin Tinphan', 'MOMO', '123123123123', NULL, NULL, NULL, 'PENDING', '2026-01-16 15:52:27.000000', 'Tự động hủy do quá thời gian thanh toán (2 phút)', 10000, NULL, 17),
(70, 'phanthanhductin@gmail.com', '2026-01-16', 'CANCELLED', 55000, NULL, '345', 'ductin Tinphan', 'MOMO', '0934534534', NULL, NULL, NULL, 'PENDING', '2026-01-16 15:55:43.000000', 'Tự động hủy do quá thời gian thanh toán (2 phút)', 15000, NULL, 17),
(71, 'phanthanhductin@gmail.com', '2026-01-16', 'CANCELLED', 85000, NULL, '123', 'ductin Tinphan', 'MOMO', '123123123123', NULL, NULL, NULL, 'PENDING', '2026-01-16 16:00:32.000000', 'Tự động hủy do quá thời gian thanh toán (2 phút)', 15000, NULL, 17),
(72, 'phanthanhductin@gmail.com', '2026-01-16', 'CANCELLED', 55000, NULL, '56', 'ductin Tinphan', 'MOMO', '6556565656', NULL, NULL, NULL, 'PENDING', '2026-01-16 16:06:34.000000', 'Tự động hủy do quá thời gian thanh toán (2 phút)', 15000, NULL, 17),
(73, 'phanthanhductin@gmail.com', '2026-01-16', 'CANCELLED', 55000, NULL, '123123', 'ductin Tinphan', 'MOMO', '123123123', NULL, NULL, NULL, 'PENDING', '2026-01-16 16:09:28.000000', 'Tự động hủy do quá thời gian thanh toán (2 phút)', 15000, NULL, 17),
(74, 'phanthanhductin@gmail.com', '2026-01-16', 'CANCELLED', 161000, NULL, '345', 'ductin Tinphan', 'MOMO', '43543534345345', NULL, NULL, NULL, 'PENDING', '2026-01-16 16:12:09.000000', 'Tự động hủy do quá thời gian thanh toán (2 phút)', 50000, NULL, 17),
(75, 'phanthanhductin@gmail.com', '2026-01-16', 'CANCELLED', 161000, NULL, '345', 'ductin Tinphan', 'MOMO', '43543534345345', NULL, NULL, NULL, 'PENDING', '2026-01-16 16:12:13.000000', 'Tự động hủy do quá thời gian thanh toán (2 phút)', 50000, NULL, 17),
(76, 'phanthanhductin@gmail.com', '2026-01-16', 'CANCELLED', 161000, NULL, '456', 'ductin Tinphan', 'MOMO', '564654645645', NULL, NULL, NULL, 'PENDING', '2026-01-16 16:15:15.000000', 'Tự động hủy do quá thời gian thanh toán (2 phút)', 50000, NULL, 17),
(77, 'phanthanhductin@gmail.com', '2026-01-16', 'CANCELLED', 161000, NULL, '123', 'ductin Tinphan', 'MOMO', '12312312312', NULL, NULL, NULL, 'PENDING', '2026-01-16 16:17:54.000000', 'Tự động hủy do quá thời gian thanh toán (2 phút)', 50000, NULL, 17),
(78, 'phanthanhductin@gmail.com', '2026-01-16', 'CANCELLED', 161000, NULL, '123123', 'ductin Tinphan', 'MOMO', '12312312', NULL, NULL, NULL, 'PENDING', '2026-01-16 16:21:21.000000', 'Tự động hủy do quá thời gian thanh toán (2 phút)', 50000, NULL, 17),
(79, 'phanthanhductin@gmail.com', '2026-01-16', 'CANCELLED', 161000, NULL, '567', 'ductin Tinphan', 'MOMO', '567567567', NULL, NULL, NULL, 'PENDING', '2026-01-16 16:26:01.000000', 'Tự động hủy do quá thời gian thanh toán (2 phút)', 50000, NULL, 17),
(80, 'phanthanhductin@gmail.com', '2026-01-16', 'PROCESSING', 55000, NULL, '234', 'ductin Tinphan', 'MOMO', '3242342323423', NULL, NULL, NULL, 'PENDING', '2026-01-16 17:06:44.000000', NULL, 15000, NULL, 17),
(81, 'phanthanhductin@gmail.com', '2026-01-16', 'COMPLETED', 55000, NULL, '456', 'ductin Tinphan', 'MOMO', '45645645456', NULL, NULL, NULL, 'PENDING', '2026-01-16 17:09:46.000000', NULL, 15000, NULL, 17),
(82, 'tinnn@gmail.com', '2026-01-20', 'COMPLETED', 161000, NULL, '226, Phường Linh Trung, TP. Thủ Đức, TP. Hồ Chí Minh', 'Tinphan PhanTin', 'COD', '123123123123', NULL, NULL, NULL, 'PENDING', '2026-01-20 16:25:38.000000', NULL, 50000, NULL, 16),
(83, 'tinnn@gmail.com', '2026-01-20', 'COMPLETED', 229000, NULL, '123, Phường Hiệp Bình Phước, TP. Thủ Đức, TP. Hồ Chí Minh', 'Tinphan PhanTin', 'COD', '123123123', NULL, NULL, NULL, 'PENDING', '2026-01-20 16:47:42.000000', NULL, 50000, NULL, 16),
(84, 'tinnn@gmail.com', '2026-01-20', 'CANCELLED', 161000, NULL, '123, Phường Thuận Phước, Quận Hải Châu, Đà Nẵng', 'Tinphan PhanTin', 'MOMO', '123123123', NULL, NULL, NULL, 'PENDING', '2026-01-20 17:15:59.000000', 'Tự động hủy do quá thời gian thanh toán (2 phút)', 50000, NULL, 16),
(85, 'tinnn@gmail.com', '2026-01-20', 'CANCELLED', 55000, NULL, '123, Phường 3, Quận Phú Nhuận, TP. Hồ Chí Minh', 'Tinphan PhanTin', 'MOMO', '123123123', NULL, NULL, NULL, 'PENDING', '2026-01-20 17:18:39.000000', 'Tự động hủy do quá thời gian thanh toán (2 phút)', 15000, NULL, 16),
(86, 'tinnn@gmail.com', '2026-01-20', 'CANCELLED', 161000, NULL, '123, Phường Hàng Bài, Quận Hoàn Kiếm, Hà Nội', 'Tinphan PhanTin', 'MOMO', '123123123', NULL, NULL, NULL, 'PENDING', '2026-01-20 17:24:30.000000', 'Tự động hủy do quá thời gian thanh toán (2 phút)', 50000, NULL, 16),
(87, 'tinnn@gmail.com', '2026-01-20', 'CANCELLED', 85000, NULL, '123, Phường 12, Quận Bình Thạnh, TP. Hồ Chí Minh', 'Tinphan PhanTin', 'MOMO', '12312312123', NULL, NULL, NULL, 'PENDING', '2026-01-20 17:41:06.000000', 'Tự động hủy do quá thời gian thanh toán (2 phút)', 15000, NULL, 16),
(88, 'tinnn@gmail.com', '2026-01-20', 'CONFIRMED', 161000, NULL, '123, Phường 12, Quận Gò Vấp, TP. Hồ Chí Minh', 'Tinphan PhanTin', 'MOMO', '12312312312', 'ORDER_88_1768906840076', NULL, NULL, 'PENDING', '2026-01-20 18:00:40.000000', NULL, 50000, NULL, 16),
(89, 'phanthanhductin@gmail.com', '2026-01-20', 'COMPLETED', 161000, NULL, '123, Phường Thanh Bình, Quận Hải Châu, Đà Nẵng', 'ductin Tinphan', 'COD', '123123', NULL, NULL, NULL, 'PENDING', '2026-01-20 19:37:19.000000', NULL, 50000, NULL, 17),
(90, 'phanthanhductin@gmail.com', '2026-01-20', 'PENDING', 161000, NULL, '123, Phường 4, Quận Phú Nhuận, TP. Hồ Chí Minh', 'ductin Tinphan', 'COD', '123123123', NULL, NULL, NULL, 'PENDING', '2026-01-20 19:45:23.000000', NULL, 50000, NULL, 17);

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `order_item_id` bigint(20) NOT NULL,
  `discount` double NOT NULL,
  `ordered_product_price` double NOT NULL,
  `quantity` int(11) DEFAULT NULL,
  `order_id` bigint(20) DEFAULT NULL,
  `product_id` bigint(20) DEFAULT NULL,
  `size` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`order_item_id`, `discount`, `ordered_product_price`, `quantity`, `order_id`, `product_id`, `size`) VALUES
(72, 0, 2, 1, 63, 55, NULL),
(73, 39000, 250000, 1, 63, 53, NULL),
(74, 0, 279000, 1, 64, 52, NULL),
(75, 39000, 250000, 1, 65, 53, NULL),
(76, 0, 70000, 1, 66, 56, NULL),
(77, 39000, 250000, 1, 67, 53, NULL),
(78, 39000, 250000, 1, 68, 53, NULL),
(79, 0, 169000, 1, 68, 50, NULL),
(80, 0, 28000, 1, 69, 32, NULL),
(81, 0, 70000, 1, 70, 56, NULL),
(82, 0, 100000, 1, 71, 51, NULL),
(83, 0, 70000, 1, 72, 56, NULL),
(84, 0, 70000, 1, 73, 56, NULL),
(85, 39000, 250000, 1, 74, 53, NULL),
(86, 39000, 250000, 1, 76, 53, NULL),
(87, 39000, 250000, 1, 77, 53, NULL),
(88, 39000, 250000, 1, 78, 53, NULL),
(89, 39000, 250000, 1, 79, 53, NULL),
(90, 0, 70000, 1, 80, 56, NULL),
(91, 0, 70000, 1, 81, 56, NULL),
(92, 39000, 250000, 1, 82, 53, NULL),
(93, 0, 279000, 1, 83, 52, NULL),
(94, 39000, 250000, 1, 84, 53, NULL),
(95, 0, 70000, 1, 85, 56, NULL),
(96, 39000, 250000, 1, 86, 53, NULL),
(97, 0, 100000, 1, 87, 51, NULL),
(98, 39000, 250000, 1, 88, 53, NULL),
(99, 39000, 250000, 1, 89, 53, NULL),
(100, 39000, 250000, 1, 90, 53, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `product`
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
-- Dumping data for table `product`
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
-- Table structure for table `product_images`
--

CREATE TABLE `product_images` (
  `id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `is_main` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_sizes`
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
-- Table structure for table `toppings`
--

CREATE TABLE `toppings` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` double NOT NULL,
  `stock_qty` int(11) DEFAULT 10
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `toppings`
--

INSERT INTO `toppings` (`id`, `name`, `price`, `stock_qty`) VALUES
(1, 'Trân châu trắng', 5000, 10),
(2, 'Pudding trứng', 5000, 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` bigint(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `first_name` varchar(20) DEFAULT NULL,
  `last_name` varchar(20) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `mobile_number` varchar(10) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `otp` varchar(255) DEFAULT NULL,
  `otp_expiry` datetime(6) DEFAULT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `email`, `first_name`, `last_name`, `gender`, `mobile_number`, `password`, `image`, `role`, `otp`, `otp_expiry`, `reset_token`, `phone`, `address`, `avatar`) VALUES
(12, 'anh@gmail.com', 'Vananh', 'vannnh', NULL, '0963258774', '$2a$10$vUBkESDN1yC4vZ3jfIO65uuNs/Lx3tJZL11KXJrHBYTj.zW8jdkeC', NULL, 'USER', NULL, NULL, NULL, NULL, NULL, NULL),
(13, 'tinn@gmail.com', 'PhanThanh', 'Tinphan', NULL, '0963854721', '$2a$10$eKmc27xCHIstPi865qOkMO5kmUGcKU77mO2MXosc1CNviQ.o8vXbu', NULL, 'USER', NULL, NULL, NULL, NULL, NULL, NULL),
(14, 'newuser2025test@gmail.com', 'NewUser', 'Testing', NULL, '0987654321', '$2a$10$efNsee8jEJMpE.LGkDbScO75WZ9HPawqucNKE.uPQoDN5E2Jf5kvm', NULL, 'USER', NULL, NULL, NULL, NULL, NULL, NULL),
(16, 'tinnn@gmail.com', 'PhanTin', 'Tinphan', NULL, '0963587440', '$2a$10$kTH7e50NUFi5JqFkWbeRWu.l.h1HEOaNpbjXWsjccwxoDILvxJPv6', NULL, 'USER', NULL, NULL, NULL, NULL, NULL, NULL),
(17, 'phanthanhductin@gmail.com', 'Tinphan', 'ductin', 'Nam', '0963258774', '$2a$10$ezQtjhyRLLOQD6tqdEIFnO08N0HRHUXcGg7Jze4/duk9zZeAtpAfa', 'b9b56cc6-793e-4ad4-b064-6fab12157034.jpg', 'ADMIN', NULL, NULL, NULL, NULL, NULL, NULL),
(18, 'thanh@gmail.com', 'PhanThanh', 'Thanhphan', NULL, '0875412365', '$2a$10$4Yu6vl0YcCxXq85QEtxdm.AaLHxph899mBaGbHAuKI8XvJczpQUT.', NULL, 'USER', NULL, NULL, NULL, NULL, NULL, NULL),
(19, 'duc@gmail.com', 'PhanThanh', 'tinne', NULL, '0986788898', '$2a$10$JrYYbzbLnUAhHmwpOPu.eegR6QvOfRJ1UsgUdhnmVZ.FehffkFgZK', NULL, 'USER', NULL, NULL, NULL, NULL, NULL, NULL),
(20, 'anhtin@gmail.com', 'anhtin', 'tinne', NULL, '0963258846', '$2a$10$yhG3oT5Wn42f0jGoAQmtNuby7cBMWoh/EDssH6J8.MwSzxFaYBDJ2', NULL, 'USER', NULL, NULL, NULL, NULL, NULL, NULL),
(21, 'phanthanhductin111@gmail.com', 'phanthanh', 'ductinne', NULL, '0987654343', '$2a$10$cjqR6nEBVR.EaHMcf6e37ea/.lwoWuWmsk4Eo6s4CiT9k2/z12GBe', NULL, 'USER', NULL, NULL, NULL, NULL, NULL, NULL),
(22, 'phanthanhductin1@gmail.com', 'tinne', 'ductin', NULL, '0987654445', '$2a$10$1OPB2.UsxqyDhOCw198enumxdpZn7OyBLsnLZZM6PJ/7VDgBuIKt.', NULL, 'USER', NULL, NULL, NULL, NULL, NULL, NULL),
(23, 'phanthanhductin11@gmail.com', 'ductinnn', 'tinnn', 'Nữ', '0987567263', '$2a$10$MZInVcLgqD4s/g0/.oChKOgfu.F9IzDyi9MxOspmKS28ngMmnMnLG', NULL, 'USER', NULL, NULL, NULL, NULL, NULL, NULL),
(26, 'admin@gmail.com', 'Admin', 'System', NULL, '0123456789', '$2a$10$VVa8ZHzNEcJBnuE11nl4kueCnaiSmDP70IOuRIYwGUL2dAzPedZ4i', NULL, 'ADMIN', NULL, NULL, NULL, NULL, NULL, NULL),
(27, 'phantin1302@gmail.com', 'PhanTin', 'DucThanh', 'Nữ', '0987678998', '$2a$10$VY6i/3gmroj7gdGnIUWDFedPX0piX05AWgrOdQT/XtYoM30Cdj5I6', NULL, 'USER', NULL, NULL, 'c646a94d-7b6c-401d-b733-5d19ee826312', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `vouchers`
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
-- Dumping data for table `vouchers`
--

INSERT INTO `vouchers` (`id`, `code`, `discount`, `min_order_amount`, `expiry_date`, `usage_limit`, `is_active`) VALUES
(1, 'WELCOME50', 50000, 150000, '2026-11-20', 100, 1),
(2, 'FREESHIP', 15000, 50000, '2026-06-20', 500, 1),
(3, 'TRA10', 10000, 0, '2026-05-20', 200, 1),
(4, 'PARTY100', 100000, 500000, '2025-12-31', 100, 1),
(5, 'FLASH30', 30000, 99000, '2025-12-20', 100, 1),
(6, 'THANKS20', 20000, 100000, '2025-12-30', 10, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`cart_id`);

--
-- Indexes for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`cart_item_id`),
  ADD KEY `FKpcttvuq4mxppo8sxggjtn5i2c` (`cart_id`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contact`
--
ALTER TABLE `contact`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_fav` (`user_id`,`product_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD UNIQUE KEY `UKhaujdjk1ohmeixjhnhslchrp1` (`payment_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`order_item_id`),
  ADD KEY `FKbioxgbv59vetrxe0ejfubep1w` (`order_id`),
  ADD KEY `FKocimc7dtr037rh4ls4l95nlfi` (`product_id`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `FK1mtsbur82frn64de7balymq9s` (`category_id`);

--
-- Indexes for table `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `product_sizes`
--
ALTER TABLE `product_sizes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `toppings`
--
ALTER TABLE `toppings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`);

--
-- Indexes for table `vouchers`
--
ALTER TABLE `vouchers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `carts`
--
ALTER TABLE `carts`
  MODIFY `cart_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `cart_item_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `contact`
--
ALTER TABLE `contact`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `favorites`
--
ALTER TABLE `favorites`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=91;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `order_item_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT for table `product_images`
--
ALTER TABLE `product_images`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product_sizes`
--
ALTER TABLE `product_sizes`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `toppings`
--
ALTER TABLE `toppings`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `vouchers`
--
ALTER TABLE `vouchers`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `FKpcttvuq4mxppo8sxggjtn5i2c` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`cart_id`);

--
-- Constraints for table `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `FKbioxgbv59vetrxe0ejfubep1w` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`);

--
-- Constraints for table `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `FK1mtsbur82frn64de7balymq9s` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`);

--
-- Constraints for table `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`);

--
-- Constraints for table `product_sizes`
--
ALTER TABLE `product_sizes`
  ADD CONSTRAINT `product_sizes_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
