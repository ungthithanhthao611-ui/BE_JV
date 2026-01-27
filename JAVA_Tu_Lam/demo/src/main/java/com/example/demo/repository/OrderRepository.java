// package com.example.demo.repository;

// import org.springframework.stereotype.Repository;

// import javax.sql.DataSource;
// import java.sql.*;

// @Repository
// public class OrderRepository {

//     private final DataSource dataSource;

//     public OrderRepository(DataSource dataSource) {
//         this.dataSource = dataSource;
//     }

//     public Long createOrder(String email, double totalAmount, String status) throws SQLException {
//         String sql = """
//             INSERT INTO orders (email, order_date, order_status, total_amount)
//             VALUES (?, CURDATE(), ?, ?)
//         """;

//         try (Connection c = dataSource.getConnection();
//              PreparedStatement ps = c.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

//             ps.setString(1, email);
//             ps.setString(2, status);
//             ps.setDouble(3, totalAmount);
//             ps.executeUpdate();

//             ResultSet rs = ps.getGeneratedKeys();
//             rs.next();
//             return rs.getLong(1);
//         }
//     }

//     public void insertOrderItem(
//             Long orderId,
//             Long productId,
//             int quantity,
//             double price,
//             double discount
//     ) throws SQLException {

//         String sql = """
//             INSERT INTO order_items
//             (order_id, product_id, quantity, ordered_product_price, discount)
//             VALUES (?, ?, ?, ?, ?)
//         """;

//         try (Connection c = dataSource.getConnection();
//              PreparedStatement ps = c.prepareStatement(sql)) {

//             ps.setLong(1, orderId);
//             ps.setLong(2, productId);
//             ps.setInt(3, quantity);
//             ps.setDouble(4, price);
//             ps.setDouble(5, discount);
//             ps.executeUpdate();
//         }
//     }
// }
package com.example.demo.repository;

import com.example.demo.entity.Order;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class OrderRepository {

    private final DataSource dataSource;

    public OrderRepository(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    // --- DTO: Class chứa thông tin chi tiết sản phẩm trong đơn ---
    public static class OrderItemDetail {
        private Long productId;
        private String productName;
        private String productPhoto;
        private int quantity;
        private double price;
        private double discount;

        // Getter & Setter
        public Long getProductId() {
            return productId;
        }

        public void setProductId(Long productId) {
            this.productId = productId;
        }

        public String getProductName() {
            return productName;
        }

        public void setProductName(String productName) {
            this.productName = productName;
        }

        public String getProductPhoto() {
            return productPhoto;
        }

        public void setProductPhoto(String productPhoto) {
            this.productPhoto = productPhoto;
        }

        public int getQuantity() {
            return quantity;
        }

        public void setQuantity(int quantity) {
            this.quantity = quantity;
        }

        public double getPrice() {
            return price;
        }

        public void setPrice(double price) {
            this.price = price;
        }

        public double getDiscount() {
            return discount;
        }

        public void setDiscount(double discount) {
            this.discount = discount;
        }
    }

    // --- 1. LẤY CHI TIẾT SẢN PHẨM TRONG ĐƠN HÀNG (MỚI) ---
    public List<OrderItemDetail> getOrderItems(Long orderId) {
        String sql = """
                    SELECT p.id, p.title, p.photo, oi.quantity, oi.ordered_product_price, oi.discount
                    FROM order_items oi
                    JOIN product p ON oi.product_id = p.id
                    WHERE oi.order_id = ?
                """;

        List<OrderItemDetail> items = new ArrayList<>();
        try (Connection c = dataSource.getConnection();
                PreparedStatement ps = c.prepareStatement(sql)) {

            ps.setLong(1, orderId);

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    OrderItemDetail item = new OrderItemDetail();
                    item.setProductId(rs.getLong("id"));
                    item.setProductName(rs.getString("title"));
                    item.setProductPhoto(rs.getString("photo"));
                    item.setQuantity(rs.getInt("quantity"));
                    item.setPrice(rs.getDouble("ordered_product_price"));
                    item.setDiscount(rs.getDouble("discount"));
                    items.add(item);
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return items;
    }

    // --- 2. TẠO ĐƠN HÀNG (UPDATED - hỗ trợ tất cả trường mới) ---
    public Long createOrder(Long userId, String email, double totalAmount, String status,
            String address, String customerName, String phone, String paymentMethod,
            Double discountAmount, Double shippingFee) throws SQLException {
        String sql = """
                    INSERT INTO orders (user_id, email, order_date, order_status, total_amount,
                                        address, customer_name, phone, payment_method, discount_amount, shipping_fee, created_at, payment_status)
                    VALUES (?, ?, CURDATE(), ?, ?, ?, ?, ?, ?, ?, ?, NOW(), 'PENDING')
                """;
        try (Connection c = dataSource.getConnection();
                PreparedStatement ps = c.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            // 1. user_id
            if (userId != null)
                ps.setLong(1, userId);
            else
                ps.setNull(1, Types.BIGINT);

            // 2. email
            ps.setString(2, email);
            // 3. status
            ps.setString(3, status);
            // 4. total_amount
            ps.setDouble(4, totalAmount);
            // 5. address
            ps.setString(5, address);
            // 6. customer_name
            ps.setString(6, customerName);
            // 7. phone
            ps.setString(7, phone);
            // 8. payment_method
            ps.setString(8, paymentMethod);
            // 9. discount_amount
            if (discountAmount != null)
                ps.setDouble(9, discountAmount);
            else
                ps.setNull(9, Types.DOUBLE);
            // 10. shipping_fee
            if (shippingFee != null)
                ps.setDouble(10, shippingFee);
            else
                ps.setNull(10, Types.DOUBLE);

            ps.executeUpdate();
            ResultSet rs = ps.getGeneratedKeys();
            rs.next();
            return rs.getLong(1);
        }
    }

    // --- 2b. TẠO ĐƠN HÀNG (Legacy - để tương thích với code cũ) ---
    public Long createOrder(Long userId, String email, double totalAmount, String status) throws SQLException {
        return createOrder(userId, email, totalAmount, status, null, null, null, "COD", null, null);
    }

    // --- 3. LƯU CHI TIẾT ĐƠN ---
    public void insertOrderItem(Long orderId, Long productId, int qty, double price, double discount)
            throws SQLException {
        String sql = "INSERT INTO order_items (order_id, product_id, quantity, ordered_product_price, discount) VALUES (?, ?, ?, ?, ?)";
        try (Connection c = dataSource.getConnection();
                PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setLong(1, orderId);
            ps.setLong(2, productId);
            ps.setInt(3, qty);
            ps.setDouble(4, price);
            ps.setDouble(5, discount);
            ps.executeUpdate();
        }
    }

    // --- 4. LẤY TẤT CẢ ĐƠN (ADMIN) ---
    public List<Order> findAll() {
        return queryOrders("SELECT * FROM orders ORDER BY order_id DESC");
    }

    // --- 5. CẬP NHẬT TRẠNG THÁI (ADMIN) ---
    public void updateStatus(Long orderId, String status) {
        String sql = "UPDATE orders SET order_status = ? WHERE order_id = ?";
        try (Connection c = dataSource.getConnection();
                PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, status);
            ps.setLong(2, orderId);
            ps.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    // --- 6. LẤY ĐƠN CỦA USER (Tìm theo user_id) ---
    public List<Order> findByUser(Long userId, String status) {
        // Tìm theo user_id (Chính xác hơn tìm theo email)
        String sql = "SELECT * FROM orders WHERE user_id = ?";
        if (status != null && !status.isEmpty())
            sql += " AND order_status = ?";
        sql += " ORDER BY order_id DESC";

        try (Connection c = dataSource.getConnection();
                PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setLong(1, userId);
            if (status != null && !status.isEmpty())
                ps.setString(2, status.toUpperCase());
            try (ResultSet rs = ps.executeQuery()) {
                return mapOrderList(rs);
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    // ========== MOMO PAYMENT METHODS ==========

    // --- 7. CẬP NHẬT THÔNG TIN THANH TOÁN MOMO ---
    public void updateMomoPaymentInfo(Long orderId, String momoOrderId, Long momoTransId,
            Integer momoResultCode, String paymentStatus) {
        String sql = """
                    UPDATE orders
                    SET momo_order_id = ?, momo_trans_id = ?, momo_result_code = ?, payment_status = ?
                    WHERE order_id = ?
                """;
        try (Connection c = dataSource.getConnection();
                PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, momoOrderId);
            if (momoTransId != null)
                ps.setLong(2, momoTransId);
            else
                ps.setNull(2, Types.BIGINT);
            if (momoResultCode != null)
                ps.setInt(3, momoResultCode);
            else
                ps.setNull(3, Types.INTEGER);
            ps.setString(4, paymentStatus);
            ps.setLong(5, orderId);
            ps.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    // --- 8. TÌM ĐƠN HÀNG THEO MOMO ORDER ID ---
    public Optional<Order> findByMomoOrderId(String momoOrderId) {
        String sql = "SELECT * FROM orders WHERE momo_order_id = ?";
        try (Connection c = dataSource.getConnection();
                PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, momoOrderId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(mapSingleOrder(rs));
                }
                return Optional.empty();
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    // --- 8b. CẬP NHẬT MOMO_ORDER_ID (gọi ngay sau checkout) ---
    public void updateMomoOrderId(Long orderId, String momoOrderId) {
        String sql = "UPDATE orders SET momo_order_id = ? WHERE order_id = ?";
        try (Connection c = dataSource.getConnection();
                PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, momoOrderId);
            ps.setLong(2, orderId);
            ps.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    // --- 9. TÌM ĐƠN HÀNG THEO ID ---
    public Optional<Order> findById(Long orderId) {
        String sql = "SELECT * FROM orders WHERE order_id = ?";
        try (Connection c = dataSource.getConnection();
                PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setLong(1, orderId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(mapSingleOrder(rs));
                }
                return Optional.empty();
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    // Helper: Map ResultSet
    private List<Order> queryOrders(String sql) {
        try (Connection c = dataSource.getConnection();
                Statement st = c.createStatement();
                ResultSet rs = st.executeQuery(sql)) {
            return mapOrderList(rs);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    private List<Order> mapOrderList(ResultSet rs) throws SQLException {
        List<Order> list = new ArrayList<>();
        while (rs.next()) {
            list.add(mapSingleOrder(rs));
        }
        return list;
    }

    // Helper: Map một Order từ ResultSet (đã cập nhật để map tất cả trường)
    private Order mapSingleOrder(ResultSet rs) throws SQLException {
        Order o = new Order();
        o.setOrderId(rs.getLong("order_id"));
        o.setEmail(rs.getString("email"));

        // order_date có thể null
        if (rs.getDate("order_date") != null) {
            o.setOrderDate(rs.getDate("order_date").toLocalDate());
        }

        o.setOrderStatus(rs.getString("order_status"));
        o.setTotalAmount(rs.getDouble("total_amount"));

        // User ID (nếu có)
        long userId = rs.getLong("user_id");
        if (!rs.wasNull())
            o.setUserId(userId);

        // Payment ID (nếu có)
        long paymentId = rs.getLong("payment_id");
        if (!rs.wasNull())
            o.setPaymentId(paymentId);

        // Các trường mới
        o.setAddress(rs.getString("address"));
        o.setCustomerName(rs.getString("customer_name"));
        o.setPaymentMethod(rs.getString("payment_method"));
        o.setPhone(rs.getString("phone"));
        o.setMomoOrderId(rs.getString("momo_order_id"));

        int momoResultCode = rs.getInt("momo_result_code");
        if (!rs.wasNull())
            o.setMomoResultCode(momoResultCode);

        long momoTransId = rs.getLong("momo_trans_id");
        if (!rs.wasNull())
            o.setMomoTransId(momoTransId);

        o.setPaymentStatus(rs.getString("payment_status"));

        // created_at
        Timestamp createdAt = rs.getTimestamp("created_at");
        if (createdAt != null)
            o.setCreatedAt(createdAt.toLocalDateTime());

        o.setCancellationReason(rs.getString("cancellation_reason"));

        double discountAmount = rs.getDouble("discount_amount");
        if (!rs.wasNull())
            o.setDiscountAmount(discountAmount);

        double shippingFee = rs.getDouble("shipping_fee");
        if (!rs.wasNull())
            o.setShippingFee(shippingFee);

        return o;
    }

    // --- 10. TỰ ĐỘNG HỦY ĐƠN MOMO QUÁ HẠN (2 PHÚT) ---
    public int cancelExpiredMomoOrders() {
        String sql = """
                    UPDATE orders
                    SET order_status = 'CANCELLED',
                        cancellation_reason = 'Tự động hủy do quá thời gian thanh toán (2 phút)'
                    WHERE (payment_method LIKE '%MOMO%')
                      AND order_status = 'PENDING'
                      AND (payment_status IS NULL OR payment_status = 'PENDING')
                      AND created_at < DATE_SUB(NOW(), INTERVAL 2 MINUTE)
                """;

        try (Connection c = dataSource.getConnection();
                PreparedStatement ps = c.prepareStatement(sql)) {
            return ps.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("Error executing auto-cancel job", e);
        }
    }
}
