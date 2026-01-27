package com.example.demo.service.impl;

import com.example.demo.dto.cart.AddToCartRequest;
import com.example.demo.repository.CartRepository;
import com.example.demo.service.CartService;
import org.springframework.stereotype.Service;
import java.util.Map;

@Service
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;

    public CartServiceImpl(CartRepository cartRepository) {
        this.cartRepository = cartRepository;
    }

    @Override
    public void addToCart(AddToCartRequest request) {
        try {
            Long cartId = cartRepository.findCartIdByUser(request.getUserId());
            if (cartId == null) {
                cartId = cartRepository.createCart(request.getUserId());
            }
            Integer currentQty = cartRepository.findCartItemQty(cartId, request.getProductId());

            if (currentQty == null) {
                cartRepository.insertCartItem(cartId, request.getProductId(), request.getQuantity(), request.getProductPrice(), request.getDiscount());
            } else {
                cartRepository.updateCartItem(cartId, request.getProductId(), currentQty + request.getQuantity());
            }
            cartRepository.updateTotalPrice(cartId);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi thêm giỏ hàng", e);
        }
    }

    @Override
    public Map<String, Object> getCartByUser(Long userId) {
        try {
            return cartRepository.getCartByUser(userId);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi lấy giỏ hàng", e);
        }
    }

    // 👇 TRIỂN KHAI HÀM XÓA
    @Override
    public void removeItem(Long userId, Long productId) {
        try {
            Long cartId = cartRepository.findCartIdByUser(userId);
            if (cartId != null) {
                cartRepository.deleteCartItem(cartId, productId); // Xóa item
                cartRepository.updateTotalPrice(cartId);          // Cập nhật lại tổng tiền
            }
        } catch (Exception e) {
            throw new RuntimeException("Lỗi xóa sản phẩm", e);
        }
    }
}