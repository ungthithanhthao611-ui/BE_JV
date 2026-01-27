// package com.example.demo.controller;

// import com.example.demo.dto.cart.CheckoutRequest;
// import com.example.demo.service.OrderService;
// import org.springframework.web.bind.annotation.*;

// @RestController
// @RequestMapping("/api/orders")
// @CrossOrigin(origins = "http://localhost:5173")
// public class OrderController {

//     private final OrderService orderService;

//     public OrderController(OrderService orderService) {
//         this.orderService = orderService;
//     }

//     @PostMapping("/checkout")
//     public void checkout(@RequestBody CheckoutRequest request) {
//         orderService.checkout(request);
//     }
// }
package com.example.demo.controller;

import com.example.demo.dto.cart.CheckoutRequest;
import com.example.demo.entity.Order;
import com.example.demo.repository.OrderRepository;
import com.example.demo.service.OrderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // 1. CHECKOUT
    @PostMapping("/checkout")
    public Long checkout(@RequestBody CheckoutRequest request) {
        return orderService.checkout(request);
    }

    // 2. ADMIN: Lấy tất cả đơn hàng
    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    // 3. ADMIN: Cập nhật trạng thái (Quy trình Shopee)
    @PutMapping("/{id}/status")
    public void updateStatus(@PathVariable Long id, @RequestParam String status) {
        orderService.updateOrderStatus(id, status);
    }

    // 4. ADMIN & CLIENT: Lấy chi tiết sản phẩm trong đơn hàng (Cho nút Xem)
    @GetMapping("/{id}/items")
    public List<OrderRepository.OrderItemDetail> getOrderItems(@PathVariable Long id) {
        return orderService.getOrderItems(id);
    }

    // 6. CLIENT: Lấy thông tin đơn hàng theo ID
    @GetMapping("/{id}")
    public Order getOrderById(@PathVariable Long id) {
        return orderService.getOrderById(id);
    }

    // 7. TÌM ORDER QUA MOMO_ORDER_ID (cho payment return fallback)
    @GetMapping("/find-by-momo")
    public Order findByMomoOrderId(@RequestParam String momoOrderId) {
        return orderService.findByMomoOrderId(momoOrderId);
    }

    // 8. CẬP NHẬT MOMO_ORDER_ID (gọi sau khi checkout với MoMo)
    @PutMapping("/{id}/momo-order-id")
    public void updateMomoOrderId(@PathVariable Long id, @RequestBody java.util.Map<String, String> payload) {
        String momoOrderId = payload.get("momoOrderId");
        orderService.updateMomoOrderId(id, momoOrderId);
    }

    // 5. CLIENT: Lấy đơn hàng theo User
    @GetMapping("/user/{userId}")
    public List<Order> getOrdersByUser(
            @PathVariable Long userId,
            @RequestParam(required = false) String status) {
        return orderService.getOrdersByUser(userId, status);
    }
}