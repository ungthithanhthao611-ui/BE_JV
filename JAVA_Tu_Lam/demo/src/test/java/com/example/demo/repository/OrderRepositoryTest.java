package com.example.demo.repository;

import com.example.demo.entity.Order;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * ============================================
 * ORDER REPOSITORY TEST - YÊU CẦU ĐỀ BÀI
 * ============================================
 * Integration tests cho OrderRepository
 * Test với database thật (Spring Boot Test)
 * Tổng cộng: 7 tests
 */
@SpringBootTest
@Transactional
public class OrderRepositoryTest {

    @Autowired
    private OrderRepository repository;

    /**
     * ============================================
     * TEST 1: TẠO ĐƠN HÀNG MỚI
     * ============================================
     */
    @Test
    void testCreateOrder_ShouldReturnOrderId() throws Exception {
        // Arrange
        String email = "test@example.com";
        double totalAmount = 100000.0;
        String status = "ORDER_PENDING";
        Long userId = 1L;

        // Act
        Long orderId = repository.createOrder(userId, email, totalAmount, status);

        // Assert
        assertNotNull(orderId, "Order ID should not be null");
        assertTrue(orderId > 0, "Order ID should be positive");

        System.out.println("✅ TEST 1 PASSED: Tạo đơn hàng mới thành công - Order ID: " + orderId);
    }

    /**
     * ============================================
     * TEST 2: TẠO ĐƠN VỚI EMAIL NULL - EXCEPTION
     * ============================================
     */
    @Test
    void testCreateOrder_WithNullEmail_ShouldThrowException() {
        // Arrange
        String email = null;
        double totalAmount = 100000.0;
        String status = "ORDER_PENDING";
        Long userId = 1L;

        // Act & Assert
        assertThrows(Exception.class, () -> {
            repository.createOrder(userId, email, totalAmount, status);
        }, "Should throw exception when email is null");

        System.out.println("✅ TEST 2 PASSED: Bắt lỗi khi tạo đơn hàng với Email null thành công");
    }

    /**
     * ============================================
     * TEST 3: INSERT ORDER ITEM
     * ============================================
     */
    @Test
    void testInsertOrderItem_ShouldExecuteSuccessfully() throws Exception {
        // Arrange
        Long orderId = repository.createOrder(1L, "test@example.com", 50000.0, "ORDER_PENDING");
        Long productId = 1L;
        int quantity = 2;
        double price = 25000.0;
        double discount = 0.0;

        // Act
        assertDoesNotThrow(() -> {
            repository.insertOrderItem(orderId, productId, quantity, price, discount);
        }, "Should not throw exception when inserting order item");

        System.out.println("✅ TEST 3 PASSED: Thêm sản phẩm vào chi tiết đơn hàng (Order Items) thành công");
    }

    /**
     * ============================================
     * TEST 4: LẤY TẤT CẢ ĐƠN HÀNG
     * ============================================
     */
    @Test
    void testFindAll_ShouldReturnListOfOrders() throws Exception {
        // Arrange
        repository.createOrder(1L, "test1@example.com", 100000.0, "ORDER_PENDING");
        repository.createOrder(2L, "test2@example.com", 150000.0, "ORDER_COMPLETED");

        // Act
        List<Order> orders = repository.findAll();

        // Assert
        assertNotNull(orders, "Orders list should not be null");
        assertTrue(orders.size() >= 2, "Should have at least 2 orders");

        System.out.println("✅ TEST 4 PASSED: Lấy tất cả danh sách đơn hàng thành công - Số lượng: " + orders.size());
    }

    /**
     * ============================================
     * TEST 5: CẬP NHẬT TRẠNG THÁI
     * ============================================
     */
    @Test
    void testUpdateStatus_ShouldUpdateSuccessfully() throws Exception {
        // Arrange
        Long orderId = repository.createOrder(1L, "test@example.com", 100000.0, "ORDER_PENDING");
        String newStatus = "ORDER_COMPLETED";

        // Act
        assertDoesNotThrow(() -> {
            repository.updateStatus(orderId, newStatus);
        }, "Should update status without exception");

        System.out.println("✅ TEST 5 PASSED: Cập nhật trạng thái đơn hàng (Status Update) thành công");
    }

    /**
     * ============================================
     * TEST 6: LẤY ĐƠN CỦA USER
     * ============================================
     */
    @Test
    void testFindByUser_ShouldReturnUserOrders() throws Exception {
        // Arrange
        Long userId = 1L;

        // Ensure user has an order
        repository.createOrder(userId, "user1@example.com", 200000.0, "PENDING");

        String status = null; // Lấy tất cả

        // Act
        List<Order> orders = repository.findByUser(userId, status);

        // Assert
        assertNotNull(orders, "Orders list should not be null");
        // We just created one, so it should be at least 1
        assertTrue(orders.size() >= 1, "Should return orders for user");

        System.out.println(
                "✅ TEST 6 PASSED: Tìm đơn hàng theo User ID thành công - Đã tìm thấy: " + orders.size() + " đơn");
    }

    /**
     * ============================================
     * TEST 7: LẤY CHI TIẾT SẢN PHẨM TRONG ĐƠN
     * ============================================
     */
    @Test
    void testGetOrderItems_ShouldReturnItemsList() throws Exception {
        // Arrange
        Long orderId = repository.createOrder(1L, "test@example.com", 100000.0, "ORDER_PENDING");
        repository.insertOrderItem(orderId, 1L, 2, 25000.0, 0.0);

        // Act
        List<OrderRepository.OrderItemDetail> items = repository.getOrderItems(orderId);

        // Assert
        assertNotNull(items, "Items list should not be null");
        assertTrue(items.size() >= 1, "Should have at least 1 item");

        if (!items.isEmpty()) {
            OrderRepository.OrderItemDetail item = items.get(0);
            assertNotNull(item.getProductId(), "Product ID should not be null");
            assertNotNull(item.getProductName(), "Product name should not be null");
            assertEquals(2, item.getQuantity(), "Quantity should match");
        }

        System.out.println(
                "✅ TEST 7 PASSED: Lấy chi tiết đơn hàng (Order Items) thành công - Số lượng item: " + items.size());
    }
}
