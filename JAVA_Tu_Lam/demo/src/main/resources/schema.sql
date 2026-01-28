-- 1. Bảng Users
CREATE TABLE IF NOT EXISTS users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    mobile_number VARCHAR(20),
    image VARCHAR(255),
    role VARCHAR(50),
    gender VARCHAR(10),
    reset_token VARCHAR(255),
    address VARCHAR(500)
);

-- 2. Bảng Category
CREATE TABLE IF NOT EXISTS category (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    slug VARCHAR(255),
    deleted TINYINT(1) DEFAULT 0
);

-- 3. Bảng Product
CREATE TABLE IF NOT EXISTS product (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    slug VARCHAR(255),
    description TEXT,
    photo VARCHAR(255),
    price DOUBLE,
    price_root DOUBLE,
    qty INT,
    category_id BIGINT,
    deleted TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 4. Bảng Carts
CREATE TABLE IF NOT EXISTS carts (
    cart_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    total_price DOUBLE DEFAULT 0
);

-- 5. Bảng Cart Items
CREATE TABLE IF NOT EXISTS cart_items (
    cart_item_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cart_id BIGINT,
    product_id BIGINT,
    quantity INT,
    product_price DOUBLE,
    discount DOUBLE,
    CONSTRAINT fk_cart_items_cart FOREIGN KEY (cart_id) REFERENCES carts(cart_id) ON DELETE CASCADE
);

-- 6. Bảng Orders (JPA Managed - Tạo sẵn để tránh lỗi FK nếu có)
CREATE TABLE IF NOT EXISTS orders (
    order_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    email VARCHAR(255),
    order_date DATE,
    order_status VARCHAR(50),
    total_amount DOUBLE,
    payment_id BIGINT,
    address VARCHAR(500),
    customer_name VARCHAR(255),
    payment_method VARCHAR(50),
    phone VARCHAR(20),
    momo_order_id VARCHAR(255),
    momo_result_code INT,
    momo_trans_id BIGINT,
    payment_status VARCHAR(50),
    created_at DATETIME,
    cancellation_reason VARCHAR(255),
    discount_amount DOUBLE,
    shipping_fee DOUBLE
);

-- 7. Bảng Order Items (JPA Managed)
CREATE TABLE IF NOT EXISTS order_items (
    order_item_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT,
    product_id BIGINT,
    quantity INT,
    ordered_product_price DOUBLE,
    discount DOUBLE,
    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);

-- DATA MẪU (Chỉ chạy khi bảng trống)
INSERT IGNORE INTO users (user_id, email, password, first_name, last_name, role) 
VALUES (1, 'admin@gmail.com', '$2a$10$N.zmdr9k7uOCQb376ye.5.XY.j3.j3.j3.j3.j3.j3.j3.j3', 'Admin', 'User', 'ADMIN');

INSERT IGNORE INTO category (id, name, slug) VALUES (1, 'Trà Sữa', 'tra-sua');
