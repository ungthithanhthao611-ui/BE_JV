package com.example.demo.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("API Hệ Thống Quản Lý Tiệm Trà & Bánh")
                        .version("1.0.0")
                        .description(
                                "Tài liệu API đầy đủ cho dự án kết thúc học phần Java Spring Boot. Bao gồm quản lý sản phẩm, giỏ hàng, thanh toán MoMo/VNPay và tích hợp AI.")
                        .contact(new Contact()
                                .name("Đội ngũ phát triển")
                                .email("support@teashop.com"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("http://springdoc.org")));
    }
}
