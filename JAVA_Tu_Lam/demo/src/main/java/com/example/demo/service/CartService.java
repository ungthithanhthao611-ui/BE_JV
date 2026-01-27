package com.example.demo.service;

import com.example.demo.dto.cart.AddToCartRequest;
import java.util.Map;

public interface CartService {
    void addToCart(AddToCartRequest request);
    Map<String, Object> getCartByUser(Long userId);
    
    // 👇 Thêm dòng này để sửa lỗi đỏ
    void removeItem(Long userId, Long productId);
}