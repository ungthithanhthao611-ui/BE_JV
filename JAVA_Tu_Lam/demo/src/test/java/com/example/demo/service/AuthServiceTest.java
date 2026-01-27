package com.example.demo.service;

import com.example.demo.dto.auth.AuthResponse;
import com.example.demo.dto.auth.LoginRequest;
import com.example.demo.dto.auth.RegisterRequest;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // --- REGISTER TESTS ---

    @Test
    @DisplayName("Test Register - Success")
    void register_Success() {
        // Arrange
        RegisterRequest request = new RegisterRequest();
        request.email = "new@example.com";
        request.password = "password123";
        request.firstName = "Nguyen";
        request.lastName = "Van A";
        request.mobileNumber = "0123456789";

        User mockUser = new User();
        mockUser.setId(1L);
        mockUser.setEmail(request.email);
        mockUser.setFirstName(request.firstName);
        mockUser.setRole("USER");

        when(userRepository.findByEmail(request.email)).thenReturn(Optional.empty()).thenReturn(Optional.of(mockUser));
        when(passwordEncoder.encode(request.password)).thenReturn("hashed_password");
        when(jwtService.generateToken(request.email)).thenReturn("dummy_token");

        // Act
        AuthResponse response = authService.register(request);
        System.out.println("✅ TEST AUTH_01 PASSED: Đăng ký thành công với thông tin hợp lệ");

        // Assert
        assertNotNull(response);
        assertEquals("dummy_token", response.token);
        assertEquals(request.email, response.email);
        verify(userRepository, times(1)).save(
                eq(request.firstName), eq(request.lastName), eq(request.email),
                eq("hashed_password"), eq(request.mobileNumber), eq(request.gender), eq(request.address));
    }

    @Test
    @DisplayName("Test Register - Email Exists")
    void register_EmailExists() {
        // Arrange
        RegisterRequest request = new RegisterRequest();
        request.email = "exist@example.com";

        when(userRepository.findByEmail(request.email)).thenReturn(Optional.of(new User()));

        // Act & Assert
        Exception exception = assertThrows(RuntimeException.class, () -> authService.register(request));
        System.out.println("✅ TEST AUTH_02 PASSED: Đăng ký thất bại khi Email đã tồn tại (Đúng mong đợi)");
        assertEquals("Email đã tồn tại", exception.getMessage());
        verify(userRepository, never()).save(any(), any(), any(), any(), any(), any(), any());
    }

    // --- LOGIN TESTS ---

    @Test
    @DisplayName("Test Login - Success")
    void login_Success() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.email = "user@example.com";
        request.password = "password123";

        User mockUser = new User();
        mockUser.setId(1L);
        mockUser.setEmail(request.email);
        mockUser.setPassword("encoded_password");
        mockUser.setRole("USER");

        when(userRepository.findByEmail(request.email)).thenReturn(Optional.of(mockUser));
        when(passwordEncoder.matches(request.password, mockUser.getPassword())).thenReturn(true);
        when(jwtService.generateToken(request.email)).thenReturn("login_token");

        // Act
        AuthResponse response = authService.login(request);
        System.out.println("✅ TEST AUTH_03 PASSED: Đăng nhập thành công (Trả về Token)");

        // Assert
        assertNotNull(response);
        assertEquals("login_token", response.token);
        assertEquals(request.email, response.email);
    }

    @Test
    @DisplayName("Test Login - Wrong Password")
    void login_WrongPassword() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.email = "user@example.com";
        request.password = "wrongpass";

        User mockUser = new User();
        mockUser.setEmail(request.email);
        mockUser.setPassword("encoded_password");

        when(userRepository.findByEmail(request.email)).thenReturn(Optional.of(mockUser));
        when(passwordEncoder.matches(request.password, mockUser.getPassword())).thenReturn(false);

        // Act & Assert
        Exception exception = assertThrows(RuntimeException.class, () -> authService.login(request));
        System.out.println("✅ TEST AUTH_04 PASSED: Đăng nhập thất bại do sai mật khẩu (Đúng mong đợi)");
        assertEquals("Sai email hoặc mật khẩu", exception.getMessage());
    }

    @Test
    @DisplayName("Test Login - Email Not Found")
    void login_EmailNotFound() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.email = "unknown@example.com";

        when(userRepository.findByEmail(request.email)).thenReturn(Optional.empty());

        // Act & Assert
        Exception exception = assertThrows(RuntimeException.class, () -> authService.login(request));
        System.out.println("✅ TEST AUTH_05 PASSED: Đăng nhập thất bại do Email không tồn tại (Đúng mong đợi)");
        assertEquals("Sai email hoặc mật khẩu", exception.getMessage());
    }
}
