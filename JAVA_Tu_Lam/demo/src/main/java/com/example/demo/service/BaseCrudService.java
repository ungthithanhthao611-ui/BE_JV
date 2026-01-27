package com.example.demo.service;

/**
 * ============================================
 * BASE SERVICE INTERFACE - ĐA HÌNH (POLYMORPHISM)
 * ============================================
 * Interface chung cho các service CRUD.
 * ✅ TÍNH ĐA HÌNH thể hiện qua việc nhiều class (ProductService, UserService...)
 * sẽ cùng implement interface này nhưng có cách thực thi (logic) khác nhau.
 * ✅ TÍNH TRỪU TƯỢNG: Chỉ định nghĩa các hành động (get, delete...) mà không đi
 * sâu vào chi tiết.
 */
public interface BaseCrudService<T, ID> {

    /**
     * Lấy entity theo ID
     */
    T getById(ID id);

    /**
     * Xóa mềm (soft delete)
     */
    void delete(ID id);

    /**
     * Khôi phục từ trash
     */
    void restore(ID id);

    /**
     * Xóa vĩnh viễn
     */
    void forceDelete(ID id);

    /**
     * Kiểm tra entity có tồn tại không
     */
    default boolean exists(ID id) {
        return getById(id) != null;
    }
}
