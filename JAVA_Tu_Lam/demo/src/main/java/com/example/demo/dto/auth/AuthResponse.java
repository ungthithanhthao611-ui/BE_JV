package com.example.demo.dto.auth;

public class AuthResponse {
    public String token;
    public String tokenType = "Bearer";
    public Long userId;
    public String name;
    public String role;
    public String email;

    public AuthResponse(String token, Long userId, String name, String role, String email) {
        this.token = token;
        this.userId = userId;
        this.name = name;
        this.role = role;
        this.email = email;
    }
}
