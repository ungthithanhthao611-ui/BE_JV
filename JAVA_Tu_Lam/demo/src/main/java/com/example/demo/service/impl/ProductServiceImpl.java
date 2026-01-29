// package com.example.demo.service.impl;

// import com.example.demo.entity.Product;
// import com.example.demo.repository.ProductRepository;
// import com.example.demo.service.ProductService;
// import org.springframework.stereotype.Service;
// import org.springframework.web.multipart.MultipartFile;

// import java.io.IOException;
// import java.io.InputStream;
// import java.nio.file.Files;
// import java.nio.file.Path;
// import java.nio.file.Paths;
// import java.nio.file.StandardCopyOption;
// import java.util.List;
// import java.util.UUID;

// @Service
// public class ProductServiceImpl implements ProductService {

//     private final ProductRepository repo;

//     // Thư mục lưu ảnh: project_root/uploads/images
//     private final Path uploadPath = Paths.get("uploads/images");

//     public ProductServiceImpl(ProductRepository repo) {
//         this.repo = repo;

//         // Tạo thư mục nếu chưa tồn tại
//         try {
//             if (!Files.exists(uploadPath)) {
//                 Files.createDirectories(uploadPath);
//             }
//         } catch (IOException e) {
//             throw new RuntimeException("Không thể tạo thư mục uploads/images", e);
//         }
//     }

//     // ================= CREATE =================
//     @Override
//     public void create(Product p, MultipartFile image) throws IOException {

//         if (image != null && !image.isEmpty()) {
//             String fileName = UUID.randomUUID() + "_" + image.getOriginalFilename();

//             try (InputStream is = image.getInputStream()) {
//                 Files.copy(
//                         is,
//                         uploadPath.resolve(fileName),
//                         StandardCopyOption.REPLACE_EXISTING
//                 );
//             }

//             p.setPhoto(fileName);
//         } else {
//             p.setPhoto(null);
//         }

//         repo.save(p);
//     }

//     // ================= GET ACTIVE (FIX CHUẨN) =================
//     @Override
//     public List<Product> getActive(Long categoryId) {
//         return repo.findActive(categoryId);
//     }

//     // ================= OTHERS =================
//     @Override
//     public List<Product> getTrash() {
//         return repo.findTrash();
//     }

//     @Override
//     public Product getById(Long id) {
//         return repo.findById(id);
//     }

//     @Override
//     public void update(Long id, Product p) {
//         repo.update(id, p);
//     }

//     @Override
//     public void delete(Long id) {
//         repo.softDelete(id);
//     }

//     @Override
//     public void restore(Long id) {
//         repo.restore(id);
//     }

//     @Override
//     public void forceDelete(Long id) {
//         repo.forceDelete(id);
//     }

// }

package com.example.demo.service.impl;

import com.example.demo.entity.Product;
import com.example.demo.repository.ProductRepository;
import com.example.demo.service.CloudinaryService;
import com.example.demo.service.ProductService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository repo;
    private final CloudinaryService cloudinaryService;

    // Thư mục lưu ảnh: project_root/uploads/images
    private final Path uploadPath = Paths.get("uploads/images");

    public ProductServiceImpl(ProductRepository repo, CloudinaryService cloudinaryService) {
        this.repo = repo;
        this.cloudinaryService = cloudinaryService;

        try {
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
        } catch (IOException e) {
            throw new RuntimeException("Không thể tạo thư mục uploads/images", e);
        }
    }

    @org.springframework.beans.factory.annotation.Value("${app.storage.type}")
    private String storageType;

    @Override
    public void create(Product p, MultipartFile image) throws IOException {
        String fileName = saveImage(image);
        p.setPhoto(fileName);
        repo.save(p);
    }

    @Override
    public String saveImage(MultipartFile image) throws IOException {
        if (image == null || image.isEmpty()) {
            return null;
        }

        // 1. CLOUD STORAGE (Render)
        if ("cloud".equalsIgnoreCase(storageType)) {
            return cloudinaryService.upload(image);
        }

        // 2. LOCAL STORAGE (XAMPP / Localhost)
        String fileName = UUID.randomUUID() + "_" + image.getOriginalFilename();
        try (InputStream is = image.getInputStream()) {
            Files.copy(is, uploadPath.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);
        }
        return fileName; // Trả về tên file (frontend sẽ tự ghép với base url)
    }

    @Override
    public List<Product> getActive(Long categoryId) {
        return repo.findActive(categoryId);
    }

    // ✅ SEARCH
    @Override
    public List<Product> search(String q, Long categoryId) {
        return repo.searchActive(q, categoryId);
    }

    @Override
    public List<Product> getTrash() {
        return repo.findTrash();
    }

    @Override
    public Product getById(Long id) {
        return repo.findById(id);
    }

    @Override
    public void update(Long id, Product p) {
        repo.update(id, p);
    }

    @Override
    public void delete(Long id) {
        repo.softDelete(id);
    }

    @Override
    public void restore(Long id) {
        repo.restore(id);
    }

    @Override
    public void forceDelete(Long id) {
        repo.forceDelete(id);
    }
}
