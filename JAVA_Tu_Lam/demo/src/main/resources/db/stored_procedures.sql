-- ============================================
-- STORED PROCEDURES - YÊU CẦU ĐỀ BÀI
-- ============================================
-- File này chứa các Stored Procedure phục vụ yêu cầu
-- "Các câu truy vấn phức tạp" trong đề bài giữa kỳ.
--
-- HƯỚNG DẪN CHẠY:
-- 1. Mở MySQL Workbench hoặc terminal
-- 2. Kết nối tới database: teashop_java_db
-- 3. Copy và chạy từng procedure bên dưới
-- ============================================

USE teashop_java_db;

-- ============================================
-- SP 1: THỐNG KÊ DOANH THU THEO DANH MỤC
-- ============================================
-- Mục đích: Tính tổng doanh thu của từng danh mục sản phẩm
-- Input: Không
-- Output: category_name, total_revenue, total_orders

DELIMITER $$
DROP PROCEDURE IF EXISTS sp_get_revenue_by_category$$
CREATE PROCEDURE sp_get_revenue_by_category()
BEGIN
    SELECT 
        c.name AS category_name,
        COUNT(DISTINCT o.order_id) AS total_orders,
        SUM(oi.quantity * oi.ordered_product_price * (1 - oi.discount / 100)) AS total_revenue
    FROM category c
    LEFT JOIN product p ON c.id = p.category_id
    LEFT JOIN order_items oi ON p.id = oi.product_id
    LEFT JOIN orders o ON oi.order_id = o.order_id
    WHERE o.order_status != 'ORDER_CANCELLED'
       OR o.order_status IS NULL
    GROUP BY c.id, c.name
    ORDER BY total_revenue DESC;
END$$
DELIMITER ;

-- ============================================
-- SP 2: CẬP NHẬT INVENTORY KHI ĐẶT HÀNG
-- ============================================
-- Mục đích: Giảm số lượng sản phẩm khi có đơn hàng mới
-- Input: p_product_id, p_quantity
-- Output: Cập nhật qty trong bảng product

DELIMITER $$
DROP PROCEDURE IF EXISTS sp_update_product_inventory$$
CREATE PROCEDURE sp_update_product_inventory(
    IN p_product_id BIGINT,
    IN p_quantity INT
)
BEGIN
    DECLARE current_qty INT;
    
    -- Lấy số lượng hiện tại
    SELECT qty INTO current_qty
    FROM product
    WHERE id = p_product_id;
    
    -- Kiểm tra đủ hàng không
    IF current_qty >= p_quantity THEN
        UPDATE product
        SET qty = qty - p_quantity
        WHERE id = p_product_id;
        
        SELECT 'SUCCESS' AS status, 
               (current_qty - p_quantity) AS new_qty;
    ELSE
        SELECT 'INSUFFICIENT_STOCK' AS status, 
               current_qty AS available_qty;
    END IF;
END$$
DELIMITER ;

-- ============================================
-- SP 3: LẤY TOP SẢN PHẨM BÁN CHẠY
-- ============================================
-- Mục đích: Thống kê sản phẩm bán chạy nhất
-- Input: p_limit (số lượng top muốn lấy)
-- Output: product_id, title, total_sold, total_revenue

DELIMITER $$
DROP PROCEDURE IF EXISTS sp_get_top_selling_products$$
CREATE PROCEDURE sp_get_top_selling_products(
    IN p_limit INT
)
BEGIN
    SELECT 
        p.id AS product_id,
        p.title,
        p.photo,
        p.price,
        SUM(oi.quantity) AS total_sold,
        SUM(oi.quantity * oi.ordered_product_price * (1 - oi.discount / 100)) AS total_revenue
    FROM product p
    INNER JOIN order_items oi ON p.id = oi.product_id
    INNER JOIN orders o ON oi.order_id = o.order_id
    WHERE o.order_status != 'ORDER_CANCELLED'
    GROUP BY p.id, p.title, p.photo, p.price
    ORDER BY total_sold DESC
    LIMIT p_limit;
END$$
DELIMITER ;

-- ============================================
-- HƯỚNG DẪN TEST CÁC STORED PROCEDURES
-- ============================================

-- Test SP 1: Doanh thu theo danh mục
CALL sp_get_revenue_by_category();

-- Test SP 2: Cập nhật inventory (giảm 2 sản phẩm id=1)
CALL sp_update_product_inventory(1, 2);

-- Test SP 3: Top 5 sản phẩm bán chạy
CALL sp_get_top_selling_products(5);
