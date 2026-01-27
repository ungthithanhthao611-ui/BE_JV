// package com.example.demo.service.impl;

// import com.example.demo.dto.cart.CheckoutRequest;
// import com.example.demo.repository.CartRepository;
// import com.example.demo.repository.OrderRepository;
// import com.example.demo.service.OrderService;
// import org.springframework.stereotype.Service;

// import java.sql.ResultSet;

// @Service
// public class OrderServiceImpl implements OrderService {

//     private final CartRepository cartRepository;
//     private final OrderRepository orderRepository;

//     public OrderServiceImpl(CartRepository cartRepository,
//                             OrderRepository orderRepository) {
//         this.cartRepository = cartRepository;
//         this.orderRepository = orderRepository;
//     }

//     @Override
//     public void checkout(CheckoutRequest request) {
//         try {
//             Long cartId = cartRepository.findCartIdByUser(request.getUserId());
//             if (cartId == null) throw new RuntimeException("Giỏ hàng trống");

//             double total = cartRepository.getCartTotal(cartId);

//             // 1️⃣ Tạo order
//             Long orderId = orderRepository.createOrder(
//                     request.getEmail(),
//                     total,
//                     "PENDING"
//             );

//             // 2️⃣ Lưu order_items
//             ResultSet rs = cartRepository.getCartItemsForCheckout(cartId);
//             while (rs.next()) {
//                 orderRepository.insertOrderItem(
//                         orderId,
//                         rs.getLong("product_id"),
//                         rs.getInt("quantity"),
//                         rs.getDouble("product_price"),
//                         rs.getDouble("discount")
//                 );
//             }

//             // 3️⃣ Xóa cart_items
//             cartRepository.clearCartAfterCheckout(cartId);

//         } catch (Exception e) {
//             throw new RuntimeException("Checkout failed", e);
//         }
//     }
// }
package com.example.demo.service.impl;

import com.example.demo.dto.cart.CheckoutRequest;
import com.example.demo.entity.Order;
import com.example.demo.repository.CartRepository;
import com.example.demo.repository.OrderRepository;
import com.example.demo.service.OrderService;
import org.springframework.stereotype.Service;

import java.sql.ResultSet;
import java.util.List;

import com.example.demo.repository.UserRepository;

/**
 * 🔵 SERVICE XỬ LÝ ĐƠN HÀNG (BUSINESS LOGIC)
 * Đây là nơi chứa các quy tắc nghiệp vụ quan trọng nhất như Thanh toán,
 * Kiểm tra trạng thái đơn hàng và Workflow giao hàng.
 */
@Service
public class OrderServiceImpl implements OrderService {

    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public OrderServiceImpl(CartRepository cartRepository,
            OrderRepository orderRepository,
            UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    /**
     * 🔥 LUỒNG THANH TOÁN (CHECKOUT):
     * 1. Tìm giỏ hàng hiện tại của User.
     * 2. Tính toán tổng tiền (đã trừ voucher nếu có).
     * 3. Lưu thông tin đơn hàng chính vào bảng 'orders'.
     * 4. Duyệt các món trong giỏ và lưu vào bảng 'order_items'.
     * 5. Xóa giỏ hàng sau khi đã chuyển thành đơn hàng thành công.
     */
    @Override
    public Long checkout(CheckoutRequest request) {
        try {
            Long cartId = cartRepository.findCartIdByUser(request.getUserId());
            if (cartId == null)
                throw new RuntimeException("Giỏ hàng trống");

            double total = 0;
            if (request.getFinalTotal() != null && request.getFinalTotal() >= 0) {
                total = request.getFinalTotal();
            } else {
                total = cartRepository.getCartTotal(cartId);
            }

            Long finalUserId = request.getUserId();
            if (finalUserId == null) {
                var userOpt = userRepository.findByEmail(request.getEmail());
                if (userOpt.isPresent()) {
                    finalUserId = userOpt.get().getId();
                }
            }

            // Gọi Repository thực hiện lệnh SQL INSERT vào DB
            Long orderId = orderRepository.createOrder(
                    finalUserId,
                    request.getEmail(),
                    total,
                    "PENDING", // Trạng thái mặc định là Chờ xử lý
                    request.getAddress(),
                    request.getFullName(),
                    request.getPhone(),
                    request.getPaymentMethod() != null ? request.getPaymentMethod() : "COD",
                    request.getDiscountAmount(),
                    null);

            // Chuyển từng item từ Cart sang OrderItem
            ResultSet rs = cartRepository.getCartItemsForCheckout(cartId);
            while (rs.next()) {
                orderRepository.insertOrderItem(
                        orderId,
                        rs.getLong("product_id"),
                        rs.getInt("quantity"),
                        rs.getDouble("product_price"),
                        rs.getDouble("discount"));
            }

            // Xóa sạch giỏ hàng của User sau khi checkout
            cartRepository.clearCartAfterCheckout(cartId);

            return orderId;
        } catch (Exception e) {
            throw new RuntimeException("Checkout failed: " + e.getMessage(), e);
        }
    }

    /**
     * 🟢 Cập nhật trạng thái đơn hàng (Có kiểm tra tính hợp lệ)
     */
    @Override
    public void updateOrderStatus(Long orderId, String newStatus) {
        Order currentOrder = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng với ID: " + orderId));

        String currentStatus = currentOrder.getOrderStatus();

        // Kiểm tra xem trạng thái mới có hợp lệ theo quy trình hay không
        if (!isValidStatusTransition(currentStatus, newStatus)) {
            throw new RuntimeException(
                    "Không thể chuyển từ trạng thái '" + currentStatus +
                            "' về '" + newStatus + "'. Chỉ được tiến lên trong quy trình!");
        }

        orderRepository.updateStatus(orderId, newStatus);
    }

    /**
     * ✅ QUY TRÌNH TRẠNG THÁI (WORKFLOW FLOW):
     * PENDING (Chờ) -> CONFIRMED (Duyệt) -> PROCESSING (Đang làm) -> SHIPPING
     * (Giao) -> COMPLETED (Xong)
     * Quy tắc: Không được phép đi lùi trạng thái (Vd: từ Đang giao về Chờ Duyệt)
     */
    private boolean isValidStatusTransition(String currentStatus, String newStatus) {
        if ("CANCELLED".equalsIgnoreCase(newStatus))
            return true; // Luôn cho phép Hủy

        if ("CANCELLED".equalsIgnoreCase(currentStatus) || "COMPLETED".equalsIgnoreCase(currentStatus))
            return false; // Đơn đã Hủy hoặc Hoàn thành thì không được đổi nữa

        String[] workflow = { "PENDING", "CONFIRMED", "PROCESSING", "SHIPPING", "COMPLETED" };

        int currentIndex = -1;
        int newIndex = -1;

        for (int i = 0; i < workflow.length; i++) {
            if (workflow[i].equalsIgnoreCase(currentStatus))
                currentIndex = i;
            if (workflow[i].equalsIgnoreCase(newStatus))
                newIndex = i;
        }

        // Trạng thái mới phải bằng hoặc đứng sau trạng thái hiện tại
        return newIndex >= currentIndex;
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public List<OrderRepository.OrderItemDetail> getOrderItems(Long orderId) {
        return orderRepository.getOrderItems(orderId);
    }

    @Override
    public List<Order> getOrdersByUser(Long userId, String status) {
        return orderRepository.findByUser(userId, status);
    }

    @Override
    public Order getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng với ID: " + orderId));
    }

    @Override
    public Order findByMomoOrderId(String momoOrderId) {
        return orderRepository.findByMomoOrderId(momoOrderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng với MoMo Order ID: " + momoOrderId));
    }

    @Override
    public void updateMomoOrderId(Long orderId, String momoOrderId) {
        orderRepository.updateMomoOrderId(orderId, momoOrderId);
    }
}
