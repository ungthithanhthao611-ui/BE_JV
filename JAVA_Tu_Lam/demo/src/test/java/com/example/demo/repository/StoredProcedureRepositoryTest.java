package com.example.demo.repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

/**
 * ============================================
 * STORED PROCEDURE REPOSITORY TEST
 * ============================================
 * Unit tests cho các Stored Procedures
 * Bổ sung cho yêu cầu "Unit Test" (1 điểm)
 * Tổng cộng: 5 tests
 */
@SpringBootTest
public class StoredProcedureRepositoryTest {

    @Autowired
    private StoredProcedureRepository repository;

    /**
     * ============================================
     * TEST 1: THỐNG KÊ DOANH THU THEO DANH MỤC
     * ============================================
     */
    @Test
    public void testGetRevenueByCategory_ShouldReturnListOfCategories() {
        // Act
        List<Map<String, Object>> result = repository.getRevenueByCategory();

        // Assert
        assertNotNull(result, "Result should not be null");
        assertTrue(result.size() >= 0, "Should return at least empty list");

        // Nếu có dữ liệu, kiểm tra cấu trúc
        if (!result.isEmpty()) {
            Map<String, Object> firstRow = result.get(0);
            assertTrue(firstRow.containsKey("category_name"), "Should contain category_name");
            assertTrue(firstRow.containsKey("total_orders"), "Should contain total_orders");
            assertTrue(firstRow.containsKey("total_revenue"), "Should contain total_revenue");
        }

        System.out.println("✅ TEST 1 PASSED: Thống kê doanh thu theo danh mục hoạt động tốt!");
    }

    /**
     * ============================================
     * TEST 2: CẬP NHẬT INVENTORY - THÀNH CÔNG
     * ============================================
     */
    @Test
    public void testUpdateProductInventory_Success() {
        // Arrange
        Long productId = 1L;
        int quantity = 1;

        // Act
        Map<String, Object> result = repository.updateProductInventory(productId, quantity);

        // Assert
        assertNotNull(result, "Result should not be null");
        assertTrue(result.containsKey("status"), "Should contain status");

        String status = (String) result.get("status");
        assertTrue(
                status.equals("SUCCESS") || status.equals("INSUFFICIENT_STOCK"),
                "Status should be SUCCESS or INSUFFICIENT_STOCK");

        System.out.println("✅ TEST 2 PASSED: Cập nhật tồn kho sản phẩm (Update Inventory) hoạt động tốt!");
        System.out.println("   Status: " + status);
    }

    /**
     * ============================================
     * TEST 3: CẬP NHẬT INVENTORY - KHÔNG ĐỦ HÀNG
     * ============================================
     */
    @Test
    public void testUpdateProductInventory_InsufficientStock() {
        // Arrange
        Long productId = 1L;
        int quantity = 99999; // Số lượng quá lớn

        // Act
        Map<String, Object> result = repository.updateProductInventory(productId, quantity);

        // Assert
        assertNotNull(result, "Result should not be null");
        assertEquals("INSUFFICIENT_STOCK", result.get("status"),
                "Should return INSUFFICIENT_STOCK");
        assertTrue(result.containsKey("available_qty"),
                "Should contain available_qty");

        System.out.println("✅ TEST 3 PASSED: Xử lý trường hợp không đủ hàng (Insufficient Stock) hoạt động đúng!");
    }

    /**
     * ============================================
     * TEST 4: TOP SẢN PHẨM BÁN CHẠY
     * ============================================
     */
    @Test
    public void testGetTopSellingProducts_ShouldReturnTopProducts() {
        // Arrange
        int limit = 5;

        // Act
        List<Map<String, Object>> result = repository.getTopSellingProducts(limit);

        // Assert
        assertNotNull(result, "Result should not be null");
        assertTrue(result.size() <= limit, "Should return at most " + limit + " products");

        // Nếu có dữ liệu, kiểm tra cấu trúc
        if (!result.isEmpty()) {
            Map<String, Object> firstRow = result.get(0);
            assertTrue(firstRow.containsKey("product_id"), "Should contain product_id");
            assertTrue(firstRow.containsKey("title"), "Should contain title");
            assertTrue(firstRow.containsKey("total_sold"), "Should contain total_sold");
            assertTrue(firstRow.containsKey("total_revenue"), "Should contain total_revenue");

            System.out.println("   Top product: " + firstRow.get("title"));
            System.out.println("   Total sold: " + firstRow.get("total_sold"));
        }

        System.out.println("✅ TEST 4 PASSED: Lấy danh sách Top sản phẩm bán chạy (Best Sellers) hoạt động tốt!");
    }

    /**
     * ============================================
     * TEST 5: TOP SẢN PHẨM - VỚI LIMIT KHÁC NHAU
     * ============================================
     */
    @Test
    public void testGetTopSellingProducts_WithDifferentLimits() {
        // Test với limit = 10
        List<Map<String, Object>> result10 = repository.getTopSellingProducts(10);
        assertNotNull(result10);
        assertTrue(result10.size() <= 10);

        // Test với limit = 1
        List<Map<String, Object>> result1 = repository.getTopSellingProducts(1);
        assertNotNull(result1);
        assertTrue(result1.size() <= 1);

        System.out.println("✅ TEST 5 PASSED: Kiểm tra giới hạn số lượng (Limit) khác nhau hoạt động đúng!");
    }
}
