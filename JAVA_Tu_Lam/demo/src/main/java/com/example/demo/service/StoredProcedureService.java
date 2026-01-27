package com.example.demo.service;

import com.example.demo.repository.StoredProcedureRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * ============================================
 * STORED PROCEDURE SERVICE
 * ============================================
 * Service layer cho các Stored Procedures
 */
@Service
public class StoredProcedureService {

    private final StoredProcedureRepository repository;

    public StoredProcedureService(StoredProcedureRepository repository) {
        this.repository = repository;
    }

    /**
     * Lấy thống kê doanh thu theo danh mục
     */
    public List<Map<String, Object>> getRevenueByCategory() {
        return repository.getRevenueByCategory();
    }

    /**
     * Cập nhật inventory khi đặt hàng
     */
    public Map<String, Object> updateInventory(Long productId, int quantity) {
        return repository.updateProductInventory(productId, quantity);
    }

    /**
     * Lấy top sản phẩm bán chạy
     */
    public List<Map<String, Object>> getTopSellingProducts(int limit) {
        // Giới hạn tối đa 100 sản phẩm
        if (limit > 100)
            limit = 100;
        if (limit < 1)
            limit = 5;

        return repository.getTopSellingProducts(limit);
    }
}
