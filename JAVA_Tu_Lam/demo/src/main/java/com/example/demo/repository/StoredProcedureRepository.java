package com.example.demo.repository;

import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * ============================================
 * STORED PROCEDURE REPOSITORY - YÊU CẦU ĐỀ BÀI
 * ============================================
 * Repository này demo cách gọi Stored Procedures từ Java
 * Phục vụ yêu cầu "Các câu truy vấn phức tạp" (2 điểm)
 */
@Repository
public class StoredProcedureRepository {

    private final DataSource dataSource;

    public StoredProcedureRepository(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    /**
     * ============================================
     * SP 1: THỐNG KÊ DOANH THU THEO DANH MỤC
     * ============================================
     * CALL sp_get_revenue_by_category()
     * 
     * Output: List<Map> với keys:
     * - category_name: Tên danh mục
     * - total_orders: Tổng số đơn hàng
     * - total_revenue: Tổng doanh thu
     */
    public List<Map<String, Object>> getRevenueByCategory() {
        String sql = "{CALL sp_get_revenue_by_category()}";
        List<Map<String, Object>> result = new ArrayList<>();

        try (Connection conn = dataSource.getConnection();
                CallableStatement stmt = conn.prepareCall(sql);
                ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                Map<String, Object> row = new HashMap<>();
                row.put("category_name", rs.getString("category_name"));
                row.put("total_orders", rs.getInt("total_orders"));
                row.put("total_revenue", rs.getDouble("total_revenue"));
                result.add(row);
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error calling sp_get_revenue_by_category: " + e.getMessage(), e);
        }

        return result;
    }

    /**
     * ============================================
     * SP 2: CẬP NHẬT INVENTORY KHI ĐẶT HÀNG
     * ============================================
     * CALL sp_update_product_inventory(productId, quantity)
     * 
     * Input:
     * - productId: ID sản phẩm
     * - quantity: Số lượng cần trừ
     * 
     * Output: Map với keys:
     * - status: "SUCCESS" hoặc "INSUFFICIENT_STOCK"
     * - new_qty hoặc available_qty
     */
    public Map<String, Object> updateProductInventory(Long productId, int quantity) {
        String sql = "{CALL sp_update_product_inventory(?, ?)}";
        Map<String, Object> result = new HashMap<>();

        try (Connection conn = dataSource.getConnection();
                CallableStatement stmt = conn.prepareCall(sql)) {

            stmt.setLong(1, productId);
            stmt.setInt(2, quantity);

            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                result.put("status", rs.getString("status"));

                // Nếu thành công, trả về new_qty; nếu không đủ hàng, trả về available_qty
                if ("SUCCESS".equals(rs.getString("status"))) {
                    result.put("new_qty", rs.getInt("new_qty"));
                } else {
                    result.put("available_qty", rs.getInt("available_qty"));
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error calling sp_update_product_inventory: " + e.getMessage(), e);
        }

        return result;
    }

    /**
     * ============================================
     * SP 3: LẤY TOP SẢN PHẨM BÁN CHẠY
     * ============================================
     * CALL sp_get_top_selling_products(limit)
     * 
     * Input:
     * - limit: Số lượng top sản phẩm muốn lấy (vd: 5, 10)
     * 
     * Output: List<Map> với keys:
     * - product_id: ID sản phẩm
     * - title: Tên sản phẩm
     * - photo: URL ảnh
     * - price: Giá
     * - total_sold: Tổng số lượng đã bán
     * - total_revenue: Tổng doanh thu
     */
    public List<Map<String, Object>> getTopSellingProducts(int limit) {
        String sql = "{CALL sp_get_top_selling_products(?)}";
        List<Map<String, Object>> result = new ArrayList<>();

        try (Connection conn = dataSource.getConnection();
                CallableStatement stmt = conn.prepareCall(sql)) {

            stmt.setInt(1, limit);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                Map<String, Object> row = new HashMap<>();
                row.put("product_id", rs.getLong("product_id"));
                row.put("title", rs.getString("title"));
                row.put("photo", rs.getString("photo"));
                row.put("price", rs.getDouble("price"));
                row.put("total_sold", rs.getInt("total_sold"));
                row.put("total_revenue", rs.getDouble("total_revenue"));
                result.add(row);
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error calling sp_get_top_selling_products: " + e.getMessage(), e);
        }

        return result;
    }
}
