package com.example.demo.controller;

import com.example.demo.entity.Voucher;
import com.example.demo.repository.VoucherRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/vouchers")
@CrossOrigin(origins = "http://localhost:5173")
public class VoucherController {

    private final VoucherRepository voucherRepository;

    public VoucherController(VoucherRepository voucherRepository) {
        this.voucherRepository = voucherRepository;
    }

    // Admin: Lấy danh sách
    @GetMapping
    public List<Voucher> getAll() {
        return voucherRepository.findAll();
    }

    // Admin: Tạo mới
    @PostMapping
    public void create(@RequestBody Voucher voucher) {
        voucherRepository.save(voucher);
    }

    // Admin: Xóa
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        voucherRepository.delete(id);
    }

    // User: Kiểm tra mã giảm giá
    // URL: /api/vouchers/check?code=SALE50&total=100000
    @GetMapping("/check")
    public Voucher checkVoucher(@RequestParam String code, @RequestParam double total) {
        Voucher v = voucherRepository.findByCode(code.toUpperCase());
        if (v == null) {
            throw new RuntimeException("Mã giảm giá không tồn tại hoặc đã hết hạn!");
        }
        if (total < v.getMinOrderAmount()) {
            throw new RuntimeException("Đơn hàng phải tối thiểu " + v.getMinOrderAmount() + "đ mới được dùng mã này!");
        }
        return v;
    }
    // API Công khai: Lấy danh sách voucher còn hiệu lực
@GetMapping("/public")
public List<Voucher> getPublicVouchers() {
    return voucherRepository.findActiveVouchers();
}
}