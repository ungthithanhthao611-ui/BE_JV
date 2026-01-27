package com.example.demo.controller;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {

    private final JdbcTemplate jdbcTemplate;

    public DashboardController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/stats")
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        try {
            // 1. Thống kê Doanh thu: Chỉ tính các đơn hàng khác trạng thái 'CANCELLED'
            // Sử dụng COALESCE để trả về 0 nếu không có dữ liệu (tránh lỗi Null)
            String revenueSql = "SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE order_status != 'CANCELLED'";
            Double totalRevenue = jdbcTemplate.queryForObject(revenueSql, Double.class);
            stats.put("revenue", totalRevenue != null ? totalRevenue : 0.0);

            // 2. Thống kê Tổng Đơn hàng
            String orderCountSql = "SELECT COUNT(*) FROM orders";
            Integer totalOrders = jdbcTemplate.queryForObject(orderCountSql, Integer.class);
            stats.put("orders", totalOrders != null ? totalOrders : 0);

            // 3. Thống kê Số lượng Sản phẩm hiện có
            String productCountSql = "SELECT COUNT(*) FROM product WHERE deleted = 0";
            Integer totalProducts = jdbcTemplate.queryForObject(productCountSql, Integer.class);
            stats.put("products", totalProducts != null ? totalProducts : 0);

            // 4. Thống kê Số lượng Khách hàng (Member)
            String userCountSql = "SELECT COUNT(*) FROM users WHERE role = 'USER'";
            Integer totalUsers = jdbcTemplate.queryForObject(userCountSql, Integer.class);
            stats.put("users", totalUsers != null ? totalUsers : 0);

            // 5. Lấy 5 đơn hàng mới nhất (Gần đây)
            // SQL nâng cao: ORDER BY id DESC và LIMIT 5
            String recentOrdersSql = """
                        SELECT order_id, customer_name, total_amount, order_status, created_at
                        FROM orders
                        ORDER BY order_id DESC
                        LIMIT 5
                    """;
            List<Map<String, Object>> recentOrders = jdbcTemplate.queryForList(recentOrdersSql);
            stats.put("recentOrders", recentOrders);

        } catch (Exception e) {
            System.err.println("❌ ERROR FETCHING DASHBOARD STATS: " + e.getMessage());
            e.printStackTrace();
            stats.put("error", "Lỗi Server: " + e.getMessage());

            // Default values
            stats.put("revenue", 0);
            stats.put("orders", 0);
            stats.put("products", 0);
            stats.put("users", 0);
            stats.put("recentOrders", List.of());
        }

        return stats;
    }
}
