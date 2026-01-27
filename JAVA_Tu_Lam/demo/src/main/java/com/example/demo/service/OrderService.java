// package com.example.demo.service;

// import com.example.demo.dto.cart.CheckoutRequest;

// public interface OrderService {
//     void checkout(CheckoutRequest request);
// }
package com.example.demo.service;

import com.example.demo.dto.cart.CheckoutRequest;
import com.example.demo.entity.Order;
import com.example.demo.repository.OrderRepository; // 👉 Import này quan trọng
import java.util.List;

public interface OrderService {
    // Trả về orderId sau khi checkout
    Long checkout(CheckoutRequest request);

    List<Order> getAllOrders();

    void updateOrderStatus(Long orderId, String newStatus);

    // 👉 THÊM DÒNG NÀY ĐỂ SỬA LỖI
    List<OrderRepository.OrderItemDetail> getOrderItems(Long orderId);

    List<Order> getOrdersByUser(Long userId, String status);

    // Lấy thông tin đơn hàng theo ID
    Order getOrderById(Long orderId);

    // Tìm đơn hàng qua MoMo Order ID
    Order findByMomoOrderId(String momoOrderId);

    // Cập nhật MoMo Order ID sau khi checkout
    void updateMomoOrderId(Long orderId, String momoOrderId);
}