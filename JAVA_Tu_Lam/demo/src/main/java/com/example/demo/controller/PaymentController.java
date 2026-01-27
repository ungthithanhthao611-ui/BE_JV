package com.example.demo.controller;

import com.example.demo.dto.payment.MomoPaymentRequest;
import com.example.demo.repository.OrderRepository;
import com.example.demo.service.MomoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
// CORS đã được cấu hình trong SecurityConfig - không cần @CrossOrigin ở đây
public class PaymentController {

    private final MomoService momoService;
    private final OrderRepository orderRepository;
    private final com.example.demo.service.OrderService orderService; // ✅ Thêm OrderService

    public PaymentController(MomoService momoService, OrderRepository orderRepository,
            com.example.demo.service.OrderService orderService) {
        this.momoService = momoService;
        this.orderRepository = orderRepository;
        this.orderService = orderService; // ✅ Inject OrderService
    }

    @PostMapping("/create-momo")
    public ResponseEntity<?> createMomoPayment(@RequestBody MomoPaymentRequest request) {
        try {
            // Validate request
            if (request.getOrderId() == null || request.getAmount() == null) {
                return ResponseEntity.badRequest().body("OrderId and Amount are required");
            }

            String payUrl = momoService.createPayment(request.getOrderId(), String.valueOf(request.getAmount()),
                    request.getOrderInfo());

            // Return JSON object
            Map<String, String> result = new HashMap<>();
            result.put("payUrl", payUrl);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace(); // Log error to backend console
            Map<String, String> error = new HashMap<>();
            error.put("message", "Lỗi tạo thanh toán MoMo: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    /**
     * MoMo IPN (Instant Payment Notification) endpoint
     * MoMo sẽ gọi endpoint này sau khi user thanh toán xong
     */
    @PostMapping("/momo-ipn")
    public ResponseEntity<?> handleMomoIPN(@RequestBody Map<String, Object> payload) {
        System.out.println(">>> MoMo IPN Callback received: " + payload);

        try {
            String orderId = (String) payload.get("orderId");
            Integer resultCode = (Integer) payload.get("resultCode");
            Object transIdObj = payload.get("transId");
            Long transId = transIdObj != null ? Long.valueOf(transIdObj.toString()) : null;
            String message = (String) payload.get("message");

            System.out.println(">>> MoMo Payment Result: orderId=" + orderId + ", resultCode=" + resultCode
                    + ", transId=" + transId);

            // Tìm order theo momo_order_id và cập nhật
            // Note: orderId từ MoMo là chuỗi ta tự sinh (VD: ORDER_16_1234567890)
            // Ta cần extract ra order_id thực sự hoặc tìm theo momo_order_id

            // Cập nhật payment status
            String paymentStatus = (resultCode != null && resultCode == 0) ? "PAID" : "FAILED";

            // ✅ Logic tự động chuyển trạng thái khi thanh toán thành công
            // - Nếu thanh toán THÀNH CÔNG (resultCode = 0) → Chuyển sang CONFIRMED
            // - Nếu thanh toán THẤT BẠI → Không thay đổi trạng thái (giữ PENDING)

            // Tìm và cập nhật order
            var orderOpt = orderRepository.findByMomoOrderId(orderId);
            if (orderOpt.isPresent()) {
                Long dbOrderId = orderOpt.get().getOrderId();

                // Cập nhật thông tin thanh toán MoMo
                orderRepository.updateMomoPaymentInfo(dbOrderId, orderId, transId, resultCode, paymentStatus);

                // ✅ Tự động chuyển sang CONFIRMED nếu thanh toán thành công
                if (resultCode != null && resultCode == 0) {
                    try {
                        // Gọi qua OrderService để có validation workflow
                        orderService.updateOrderStatus(dbOrderId, "CONFIRMED");
                        System.out.println(
                                ">>> ✅ Thanh toán thành công! Đơn #" + dbOrderId + " tự động chuyển sang CONFIRMED");
                    } catch (Exception e) {
                        System.err.println(">>> ❌ Lỗi khi update order status: " + e.getMessage());
                        // Vẫn tiếp tục - payment info đã được lưu
                    }
                } else {
                    System.out
                            .println(">>> ⚠️ Thanh toán thất bại! Giữ nguyên trạng thái PENDING cho đơn #" + dbOrderId);
                }
            } else {
                System.out.println(">>> Order not found for momoOrderId: " + orderId);
            }

            // MoMo yêu cầu trả về HTTP 204 No Content để xác nhận đã nhận IPN
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Endpoint để frontend redirect về sau khi thanh toán MoMo xong
     * Query params: orderId, resultCode, transId, message, etc.
     */
    @GetMapping("/momo-return")
    public ResponseEntity<?> handleMomoReturn(
            @RequestParam(required = false) String orderId,
            @RequestParam(required = false) Integer resultCode,
            @RequestParam(required = false) Long transId,
            @RequestParam(required = false) String message) {

        System.out.println(">>> MoMo Return: orderId=" + orderId + ", resultCode=" + resultCode);

        Map<String, Object> result = new HashMap<>();
        result.put("orderId", orderId);
        result.put("resultCode", resultCode);
        result.put("transId", transId);
        result.put("message", message);
        result.put("success", resultCode != null && resultCode == 0);

        return ResponseEntity.ok(result);
    }
}
