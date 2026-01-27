package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * 🔐 CLASS CẤU HÌNH BẢO MẬT (SPRING SECURITY)
 * Đây là "trạm kiểm soát" trung tâm của ứng dụng.
 * Mọi yêu cầu từ web đều phải đi qua các bộ lọc (Filters) ở đây.
 */
@Configuration
public class SecurityConfig {

    // ✅ Mã hóa Password bằng thuật toán BCrypt (Một chiều, không thể giải mã ngược)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // ✅ CẤU HÌNH CORS (Cross-Origin Resource Sharing)
    // Giúp Frontend (Localhost:5173) có thể gọi được API của Backend
    // (Localhost:8080)
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("*")); // Trong thực tế nên giới hạn chỉ port 5173
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    // ✅ CHÍNH SÁCH PHÂN QUYỀN (Security Filter Chain)
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // Tắt CSRF vì ứng dụng Stateless (dùng JWT thay vì Session)
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(auth -> auth
                        // Cho phép truy cập công khai các API đăng nhập/đăng ký
                        .requestMatchers("/api/auth/**").permitAll()
                        // Cho phép các link tài liệu API (Swagger)
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                        // Tạm thời cho phép tất cả để dễ phát triển,
                        // sau này sẽ dùng .authenticated() để bắt buộc đăng nhập
                        .anyRequest().permitAll());

        return http.build();
    }
}
