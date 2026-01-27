package com.example.demo.controller;

import com.example.demo.dto.auth.AuthResponse;
import com.example.demo.dto.auth.LoginRequest;
import com.example.demo.dto.auth.RegisterRequest;
import com.example.demo.service.AuthService;
import org.springframework.web.bind.annotation.*;

/**
 * 🟡 CONTROLLER XÁC THỰC (AUTHENTICATION)
 * Đóng vai trò là cửa ngõ cho việc Đăng ký và Đăng nhập.
 * Chấp nhận các request từ Frontend và chuyển tới AuthService xử lý.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    // ✅ Dependency Injection: Tiêm bean AuthService vào để sử dụng
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * 🟢 API Đăng ký tài khoản mới
     * 
     * @RequestBody: Lấy toàn bộ dữ liệu JSON từ Frontend map vào RegisterRequest
     *               object
     */
    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    /**
     * 🟢 API Đăng nhập
     * Trả về JWT Token nếu thông tin tài khoản chính xác
     */
    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
}
