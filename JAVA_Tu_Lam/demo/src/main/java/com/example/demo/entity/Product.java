package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonProperty; // 1. BẮT BUỘC IMPORT

// ✅ KẾ THỪA TỪ BaseEntity (YÊU CẦU ĐỀ BÀI)
/**
 * ✅ TÍNH TRỪU TƯỢNG (ABSTRACTION) & KẾ THỪA (INHERITANCE)
 * BaseEntity là abstract class, chứa các thuộc tính chung cho tất cả Entity.
 * Không thể khởi tạo trực tiếp BaseEntity mà phải thông qua lớp con.
 */
/**
 * ✅ TÍNH KẾ THỪA (INHERITANCE)
 * Product kế thừa từ BaseEntity để sử dụng lại id và các phương thức chung.
 */
public class Product extends BaseEntity {

    // ❌ BỎ: private Long id; (đã kế thừa từ BaseEntity)
    // ✅ TÍNH ĐÓNG GÓI (ENCAPSULATION)
    // Các trường dữ liệu để private, chỉ truy cập qua getter/setter
    private String title;
    private String slug;
    private String description;
    private String photo;

    private double price; // GIÁ GỐC

    // 2. THÊM DÒNG NÀY ĐỂ MAP VỚI JSON TỪ REACT
    @JsonProperty("price_root")
    private double priceRoot; // GIÁ SALE

    private int qty; // SỐ LƯỢNG

    private Long categoryId;
    private boolean deleted;

    public Product() {
        super(); // Gọi constructor của BaseEntity
    }

    // ✅ IMPLEMENT abstract method từ BaseEntity
    @Override
    public String getDisplayName() {
        return this.title;
    }

    // Getter & Setter (BỎ getId/setId vì đã có ở BaseEntity)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public double getPriceRoot() {
        return priceRoot;
    }

    public void setPriceRoot(double priceRoot) {
        this.priceRoot = priceRoot;
    }

    public int getQty() {
        return qty;
    }

    public void setQty(int qty) {
        this.qty = qty;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public boolean isDeleted() {
        return deleted;
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }
}