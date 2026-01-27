package com.example.demo.service;

import com.example.demo.dto.auth.LoginRequest;
import com.example.demo.dto.auth.RegisterRequest;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    // ===== REGISTER =====
    public com.example.demo.dto.auth.AuthResponse register(RegisterRequest request) {

        userRepository.findByEmail(request.email)
                .ifPresent(u -> {
                    throw new RuntimeException("Email đã tồn tại");
                });

        String hashedPassword = passwordEncoder.encode(request.password);

        userRepository.save(
                request.firstName,
                request.lastName,
                request.email,
                hashedPassword,
                request.mobileNumber,
                request.gender,
                request.address);

        User user = userRepository.findByEmail(request.email).orElseThrow();
        String token = jwtService.generateToken(user.getEmail());

        return new com.example.demo.dto.auth.AuthResponse(
                token,
                user.getId(),
                user.getFullName(),
                user.getRole(),
                user.getEmail());
    }

    // ===== LOGIN =====
    public com.example.demo.dto.auth.AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.email)
                .orElseThrow(() -> new RuntimeException("Sai email hoặc mật khẩu"));

        if (!passwordEncoder.matches(request.password, user.getPassword())) {
            throw new RuntimeException("Sai email hoặc mật khẩu");
        }

        String token = jwtService.generateToken(user.getEmail());

        return new com.example.demo.dto.auth.AuthResponse(
                token,
                user.getId(),
                user.getFullName(),
                user.getRole(),
                user.getEmail());
    }
}
