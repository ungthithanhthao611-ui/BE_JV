package com.example.demo.controller;

import com.example.demo.dto.cart.AddToCartRequest;
import com.example.demo.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
// @CrossOrigin(origins = "http://localhost:5173")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping("/add")
    public void addToCart(@RequestBody AddToCartRequest request) {
        cartService.addToCart(request);
    }

    @GetMapping("/{userId}")
    public Map<String, Object> getCart(@PathVariable Long userId) {
        return cartService.getCartByUser(userId);
    }

    // 👇 API XÓA SẢN PHẨM (Hết lỗi đỏ)
    @DeleteMapping("/{userId}/remove/{productId}")
    public ResponseEntity<?> removeCartItem(@PathVariable Long userId, @PathVariable Long productId) {
        cartService.removeItem(userId, productId);
        return ResponseEntity.ok("Đã xóa sản phẩm thành công");
    }
}