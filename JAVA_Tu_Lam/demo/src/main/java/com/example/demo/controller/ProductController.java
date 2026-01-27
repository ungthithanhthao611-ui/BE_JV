package com.example.demo.controller;

import com.example.demo.entity.Product;
import com.example.demo.service.ProductService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

/**
 * 🟡 CONTROLLER QUẢN LÝ SẢN PHẨM (CRUD)
 * Cung cấp các API để xem, thêm, sửa, xóa sản phẩm.
 */
@RestController
@RequestMapping("/api/products")
// @CrossOrigin(origins = "http://localhost:5173") // Cho phép Frontend gọi API
public class ProductController {

    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    /**
     * 🟢 Lấy danh sách sản phẩm (có thể lọc theo Danh mục)
     * 
     * @RequestParam: categoryId là tham số tùy chọn trên URL
     */
    @GetMapping
    public List<Product> getActive(@RequestParam(required = false) Long categoryId) {
        return service.getActive(categoryId);
    }

    /**
     * 🟢 Tìm kiếm sản phẩm theo tên
     */
    @GetMapping("/search")
    public List<Product> search(
            @RequestParam("q") String q,
            @RequestParam(required = false) Long categoryId) {
        return service.search(q, categoryId);
    }

    /**
     * 🟢 Xử lý Upload ảnh sản phẩm
     */
    @PostMapping("/upload")
    public String uploadImage(@RequestParam("file") MultipartFile file) throws IOException {
        return service.saveImage(file);
    }

    /**
     * 🟢 Thêm mới sản phẩm (Dùng Multipart để nhận file ảnh)
     */
    @PostMapping
    public void create(
            @RequestParam("image") MultipartFile image,
            @RequestParam("title") String title,
            @RequestParam("slug") String slug,
            @RequestParam("description") String description,
            @RequestParam("price") double price,
            @RequestParam(value = "price_root", defaultValue = "0") double priceRoot,
            @RequestParam("qty") int qty,
            @RequestParam("categoryId") Long categoryId) throws IOException {
        // Ánh xạ các tham số từ Request vào Object Product
        Product p = new Product();
        p.setTitle(title);
        p.setSlug(slug);
        p.setDescription(description);
        p.setPrice(price);
        p.setPriceRoot(priceRoot);
        p.setQty(qty);
        p.setCategoryId(categoryId);
        // Chuyển xuống Service để lưu
        service.create(p, image);
    }

    /**
     * 🟢 Lấy sản phẩm đã bị xóa tạm (Thùng rác)
     */
    @GetMapping("/trash")
    public List<Product> getTrash() {
        return service.getTrash();
    }

    /**
     * 🟢 Lấy chi tiết 1 sản phẩm theo ID
     */
    @GetMapping("/{id}")
    public Product getById(@PathVariable Long id) {
        return service.getById(id);
    }

    /**
     * 🟢 Cập nhật thông tin sản phẩm
     */
    @PutMapping("/{id}")
    public void update(@PathVariable Long id, @RequestBody Product p) {
        service.update(id, p);
    }

    /**
     * 🟢 Xóa tạm (Soft Delete): Chỉ đổi trạng thái deleted = 1
     */
    @DeleteMapping("/{id}")
    public void softDelete(@PathVariable Long id) {
        service.delete(id);
    }

    /**
     * 🟢 Khôi phục sản phẩm từ thùng rác
     */
    @PutMapping("/{id}/restore")
    public void restore(@PathVariable Long id) {
        service.restore(id);
    }

    /**
     * 🟢 Xóa vĩnh viễn khỏi Database
     */
    @DeleteMapping("/{id}/force")
    public void forceDelete(@PathVariable Long id) {
        service.forceDelete(id);
    }
}
