package com.example.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // ✅ CORS – CẤU HÌNH CHO PHÉP FRONTEND GỌI API
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                // Cho phép tất cả các domain (bao gồm cả localhost và Render)
                .allowedOriginPatterns("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }

    // 🔥🔥🔥 PUBLIC THƯ MỤC ẢNH (DYNAMIC PATH)
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Lấy đường dẫn tuyệt đối tới thư mục uploads/images trong thư mục chạy ứng
        // dụng
        String path = java.nio.file.Paths.get("uploads/images").toAbsolutePath().toUri().toString();

        registry
                .addResourceHandler("/images/**")
                .addResourceLocations(path);
    }
}
