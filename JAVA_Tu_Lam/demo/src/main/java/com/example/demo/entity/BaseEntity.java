package com.example.demo.entity;

/**
 * ============================================
 * BASE ENTITY - KẾ THỪA (YÊU CẦU ĐỀ BÀI)
 * ============================================
 * Class cơ sở cho tất cả các entity
 * ✅ TÍNH TRỪU TƯỢNG (ABSTRACTION) & KẾ THỪA (INHERITANCE)
 * BaseEntity là abstract class, chứa các thuộc tính chung cho tất cả các bảng.
 * Demo tính kế thừa: Các class Product, User... sẽ extends BaseEntity.
 */
public abstract class BaseEntity {

    // ✅ TÍNH ĐÓNG GÓI (ENCAPSULATION)
    // Thuộc tính id được bảo vệ, truy cập thông qua Getter/Setter
    protected Long id;

    // Constructor mặc định
    public BaseEntity() {
    }

    // Constructor với id
    public BaseEntity(Long id) {
        this.id = id;
    }

    // Getter/Setter
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    // Abstract method - buộc các class con phải implement
    public abstract String getDisplayName();

    // Method chung cho tất cả entity
    public boolean isNew() {
        return this.id == null;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null || getClass() != obj.getClass())
            return false;
        BaseEntity that = (BaseEntity) obj;
        return id != null && id.equals(that.id);
    }

    @Override
    public int hashCode() {
        return id != null ? id.hashCode() : 0;
    }
}
