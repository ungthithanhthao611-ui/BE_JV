package com.example.demo.task;

import com.example.demo.repository.OrderRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class OrderCleanupTask {

    private final OrderRepository orderRepository;

    public OrderCleanupTask(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    // Chạy mỗi 30 giây để quét các đơn MoMo quá hạn
    @Scheduled(fixedRate = 30000)
    public void cleanupExpiredOrders() {
        // System.out.println("Running order cleanup task...");
        try {
            int count = orderRepository.cancelExpiredMomoOrders();
            if (count > 0) {
                System.out.println(
                        ">>> [AUTO-CLEANUP] Đã tự động hủy " + count + " đơn MoMo quá hạn thanh toán (2 phút).");
            }
        } catch (Exception e) {
            System.err.println(">>> [AUTO-CLEANUP] Lỗi: " + e.getMessage());
        }
    }
}
