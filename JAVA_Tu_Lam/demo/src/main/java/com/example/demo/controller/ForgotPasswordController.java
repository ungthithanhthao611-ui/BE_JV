package com.example.demo.controller;

import com.example.demo.dto.auth.ForgotPasswordRequest;
import com.example.demo.dto.auth.ResetPasswordRequest;
import com.example.demo.service.ForgotPasswordService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class ForgotPasswordController {

    private final ForgotPasswordService forgotPasswordService;

    public ForgotPasswordController(ForgotPasswordService forgotPasswordService) {
        this.forgotPasswordService = forgotPasswordService;
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        try {
            forgotPasswordService.initiateForgotPassword(request.email);
            return ResponseEntity.ok("Email đặt lại mật khẩu đã được gửi.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        try {
            forgotPasswordService.resetPassword(request.token, request.newPassword);
            return ResponseEntity.ok("Đặt lại mật khẩu thành công.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
