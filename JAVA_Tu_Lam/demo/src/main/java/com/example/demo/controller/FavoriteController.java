package com.example.demo.controller;

import com.example.demo.entity.Product;
import com.example.demo.repository.FavoriteRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
// @CrossOrigin(origins = "http://localhost:5173")
public class FavoriteController {

    private final FavoriteRepository favoriteRepository;

    public FavoriteController(FavoriteRepository favoriteRepository) {
        this.favoriteRepository = favoriteRepository;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getFavorites(@PathVariable Long userId) {
        try {
            List<Product> favorites = favoriteRepository.findByUserId(userId);
            return ResponseEntity.ok(favorites);
        } catch (Exception e) {
            e.printStackTrace(); // Log lỗi ra console server
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving favorites: " + e.getMessage());
        }
    }

    // Thêm sản phẩm vào danh sách yêu thích
    @PostMapping("/add")
    public void addFavorite(@RequestParam Long userId, @RequestParam Long productId) {
        favoriteRepository.addFavorite(userId, productId);
    }

    // Xóa sản phẩm khỏi danh sách yêu thích
    @DeleteMapping("/remove")
    public void removeFavorite(@RequestParam Long userId, @RequestParam Long productId) {
        favoriteRepository.removeFavorite(userId, productId);
    }

    // Kiểm tra sản phẩm có được yêu thích không
    @GetMapping("/check")
    public boolean isFavorite(@RequestParam Long userId, @RequestParam Long productId) {
        return favoriteRepository.isFavorite(userId, productId);
    }
}
