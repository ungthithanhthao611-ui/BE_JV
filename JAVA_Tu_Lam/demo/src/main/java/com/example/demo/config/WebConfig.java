package com.example.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // ✅ CORS – GIỮ NGUYÊN
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }

    // 🔥🔥🔥 PUBLIC THƯ MỤC ẢNH
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Sử dụng đường dẫn tuyệt đối để đảm bảo tìm thấy ảnh
        String path = "file:///d:/JAVA_KT_CUOI_KY/JAVA_Tu_Lam/demo/uploads/images/";
        registry
                .addResourceHandler("/images/**")
                .addResourceLocations(path);
    }
}
