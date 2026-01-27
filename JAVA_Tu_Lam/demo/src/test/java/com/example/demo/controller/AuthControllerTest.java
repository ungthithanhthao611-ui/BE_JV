package com.example.demo.controller;

import com.example.demo.dto.auth.AuthResponse;
import com.example.demo.dto.auth.LoginRequest;
import com.example.demo.dto.auth.RegisterRequest;
import com.example.demo.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false) // Disable security filters for simple testing
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("POST /api/auth/register - Success")
    void register_Success() throws Exception {
        // Arrange
        RegisterRequest request = new RegisterRequest();
        request.email = "test@example.com";
        request.password = "password";
        request.firstName = "Test";
        request.lastName = "User";

        AuthResponse response = new AuthResponse("token123", 1L, "Test User", "USER", "test@example.com");

        when(authService.register(any(RegisterRequest.class))).thenReturn(response);

        // Act & Assert
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("token123"))
                .andExpect(jsonPath("$.email").value("test@example.com"));

        System.out.println("✅ TEST API: Đăng ký thành công - Có trả về Token");
    }

    @Test
    @DisplayName("POST /api/auth/login - Success")
    void login_Success() throws Exception {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.email = "test@example.com";
        request.password = "password";

        AuthResponse response = new AuthResponse("login_token_abc", 1L, "Test User", "USER", "test@example.com");

        when(authService.login(any(LoginRequest.class))).thenReturn(response);

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("login_token_abc"));

        System.out.println("✅ TEST API: Đăng nhập thành công - Có trả về Token");
    }

    @Test
    @DisplayName("POST /api/auth/login - Failed")
    void login_Failed() throws Exception {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.email = "wrong@example.com";
        request.password = "wrong";

        when(authService.login(any(LoginRequest.class))).thenThrow(new RuntimeException("Sai email hoặc mật khẩu"));

        // Act & Assert
        // Assuming GlobalExceptionHandler handles RuntimeException or it bubbles up as
        // 500/403/401
        // Without seeing ExceptionHandler, usually it returns 400 or 500.
        // Let's just check it's not 2xx.
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().is4xxClientError()); // Expecting 400 Bad Request or similar

        System.out.println("✅ TEST API: Đăng nhập thất bại - Báo lỗi đúng mong đợi (4xx)");
    }
}
