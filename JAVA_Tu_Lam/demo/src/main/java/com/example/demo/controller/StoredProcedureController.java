package com.example.demo.controller;

import com.example.demo.service.StoredProcedureService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * ============================================
 * STORED PROCEDURE CONTROLLER - YÊU CẦU ĐỀ BÀI
 * ============================================
 * Controller này expose các Stored Procedures qua REST API
 * Phục vụ yêu cầu "Các câu truy vấn phức tạp" (2 điểm)
 */
@RestController
@RequestMapping("/api/stored-procedures")
@CrossOrigin(origins = "http://localhost:5173")
public class StoredProcedureController {

    private final StoredProcedureService service;

    public StoredProcedureController(StoredProcedureService service) {
        this.service = service;
    }

    /**
     * ============================================
     * API 1: THỐNG KÊ DOANH THU THEO DANH MỤC
     * ============================================
     * GET /api/stored-procedures/revenue-by-category
     * 
     * Response example:
     * [
     * {
     * "category_name": "Trà Sữa",
     * "total_orders": 15,
     * "total_revenue": 1250000.0
     * },
     * ...
     * ]
     */
    @GetMapping("/revenue-by-category")
    public List<Map<String, Object>> getRevenueByCategory() {
        return service.getRevenueByCategory();
    }

    /**
     * ============================================
     * API 2: CẬP NHẬT INVENTORY
     * ============================================
     * POST /api/stored-procedures/update-inventory
     * 
     * Request body:
     * {
     * "productId": 1,
     * "quantity": 2
     * }
     * 
     * Response example (SUCCESS):
     * {
     * "status": "SUCCESS",
     * "new_qty": 48
     * }
     * 
     * Response example (FAIL):
     * {
     * "status": "INSUFFICIENT_STOCK",
     * "available_qty": 1
     * }
     */
    @PostMapping("/update-inventory")
    public Map<String, Object> updateInventory(@RequestBody Map<String, Object> request) {
        Long productId = ((Number) request.get("productId")).longValue();
        int quantity = ((Number) request.get("quantity")).intValue();

        return service.updateInventory(productId, quantity);
    }

    /**
     * ============================================
     * API 3: TOP SẢN PHẨM BÁN CHẠY
     * ============================================
     * GET /api/stored-procedures/top-selling?limit=5
     * 
     * Query params:
     * - limit: Số lượng top sản phẩm (default: 5)
     * 
     * Response example:
     * [
     * {
     * "product_id": 3,
     * "title": "Trà Sữa Trân Châu",
     * "photo": "trasua.jpg",
     * "price": 45000.0,
     * "total_sold": 120,
     * "total_revenue": 5400000.0
     * },
     * ...
     * ]
     */
    @GetMapping("/top-selling")
    public List<Map<String, Object>> getTopSellingProducts(
            @RequestParam(defaultValue = "5") int limit) {
        return service.getTopSellingProducts(limit);
    }
}
