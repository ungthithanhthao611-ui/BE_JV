// package com.example.demo.service;

// import org.springframework.web.multipart.MultipartFile;

// import com.example.demo.entity.Product;

// import java.io.IOException;
// import java.util.List;

// public interface ProductService {

//     void create(Product p, MultipartFile image) throws IOException;

//     // ✅ SỬA: NHẬN categoryId
//     List<Product> getActive(Long categoryId);

//     List<Product> getTrash();
//     Product getById(Long id);
//     void update(Long id, Product p);
//     void delete(Long id);
//     void restore(Long id);
//     void forceDelete(Long id);

// }

package com.example.demo.service;

import com.example.demo.entity.Product;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

/**
 * ✅ KẾ THỪA Interface BaseCrudService - DEMO ĐA HÌNH (POLYMORPHISM)
 * ProductService implement các method của BaseCrudService theo cách riêng
 */
public interface ProductService extends BaseCrudService<Product, Long> {

    void create(Product p, MultipartFile image) throws IOException;

    // ✅ Method mới: Lưu ảnh và trả về tên file
    String saveImage(MultipartFile image) throws IOException;

    List<Product> getActive(Long categoryId);

    // ✅ thêm search
    List<Product> search(String q, Long categoryId);

    List<Product> getTrash();

    // Các method getById, delete, restore, forceDelete
    // đã được kế thừa từ BaseCrudService

    void update(Long id, Product p);
}
