package com.example.demo.service;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class ForgotPasswordService {

    private final UserRepository userRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    public ForgotPasswordService(UserRepository userRepository, EmailService emailService,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
    }

    public void initiateForgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email không tồn tại trong hệ thống."));

        String token = UUID.randomUUID().toString();
        userRepository.updateResetToken(email, token);

        String resetLink = "http://localhost:5173/reset-password?token=" + token;

        String subject = "HaluCafe - Đặt lại mật khẩu";
        String body = "<h3>Xin chào " + user.getFirstName() + ",</h3>" +
                "<p>Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng nhấp vào liên kết bên dưới để tiếp tục:</p>" +
                "<a href=\"" + resetLink + "\">Đặt lại mật khẩu</a>" +
                "<p>Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>";

        emailService.sendEmail(email, subject, body);
    }

    public void resetPassword(String token, String newPassword) {
        User user = userRepository.findByResetToken(token)
                .orElseThrow(() -> new RuntimeException("Token không hợp lệ hoặc đã hết hạn."));

        String encodedPassword = passwordEncoder.encode(newPassword);
        userRepository.updatePassword(user.getId(), encodedPassword);
    }
}
