package com.example.demo.service;

import com.example.demo.entity.Product;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class GeminiService {

    private final ProductService productService;
    private final RestTemplate restTemplate;

    // ✅ DANH SÁCH API KEYS DỰ PHÒNG
    private final String[] API_KEYS = {
            "AIzaSyCxU8NJOMWpGp3W4wpreZJ-iwBqrujP6t4",
            "AIzaSyBsxAPmjZCuf6zczg2d9cY-D2ADCSDHRi8",
            "AIzaSyAJGPe0RJRj-1Y-_3UcVkwq1GzxUhnHgDw",
            "AIzaSyAtTNfMprkISdFdEYOpJm_4kvs2G6usS58",
            "AIzaSyDTVF6sLCWAj3uMv0McAFJca7yZrUySfCQ"
    };

    private int currentKeyIndex = 0;

    public GeminiService(ProductService productService, RestTemplate restTemplate) {
        this.productService = productService;
        this.restTemplate = restTemplate;
    }

    public Map<String, Object> chat(String message, String base64Image) {
        // Thử lần lượt các Key nếu bị giới hạn
        for (int i = 0; i < API_KEYS.length; i++) {
            try {
                return callGeminiApi(API_KEYS[currentKeyIndex], message, base64Image);
            } catch (Exception e) {
                String error = e.getMessage();
                if (error != null && (error.contains("429") || error.contains("quota") || error.contains("403"))) {
                    currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
                    continue;
                }
                throw new RuntimeException("AI Error: " + e.getMessage());
            }
        }
        throw new RuntimeException("Tất cả API Keys đều bị giới hạn!");
    }

    private Map<String, Object> callGeminiApi(String apiKey, String message, String base64Image) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key="
                + apiKey;

        // 1. Tạo Context từ sản phẩm (Giúp AI biết về shop)
        List<Product> products = productService.getActive(null);
        StringBuilder context = new StringBuilder("Bạn là trợ lý Halu AI của shop HaluCafe. ");
        context.append("Danh sách sản phẩm của shop: ");
        for (Product p : products) {
            context.append(String.format("[%s - Giá: %,.0fđ], ", p.getTitle(), p.getPrice()));
        }
        context.append(". Hãy trả lời thân thiện bằng tiếng Việt. Nếu khách muốn mua, hãy gợi ý món phù hợp.");

        // 2. Build Request Body
        Map<String, Object> requestBody = new HashMap<>();
        List<Map<String, Object>> contents = new ArrayList<>();
        Map<String, Object> content = new HashMap<>();
        List<Map<String, Object>> parts = new ArrayList<>();

        // Part 1: System Instruction + User Message
        parts.add(Map.of("text",
                context.toString() + "\nKHÁCH HÀNG: " + (message != null ? message : "Phân tích ảnh này giúp tôi")));

        // Part 2: Image (nếu có)
        if (base64Image != null && !base64Image.isEmpty()) {
            String cleanBase64 = base64Image.contains(",") ? base64Image.split(",")[1] : base64Image;
            parts.add(Map.of("inline_data", Map.of(
                    "mime_type", "image/jpeg",
                    "data", cleanBase64)));
        }

        content.put("parts", parts);
        contents.add(content);
        requestBody.put("contents", contents);

        // 3. Gọi API
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<Map<String, Object>> response = restTemplate.postForEntity(url, entity,
                (Class<Map<String, Object>>) (Class<?>) Map.class);

        // 4. Parse Response
        try {
            Map<?, ?> body = response.getBody();
            if (body == null)
                throw new RuntimeException("API trả về trống");

            List<?> candidates = (List<?>) body.get("candidates");
            Map<?, ?> firstCandidate = (Map<?, ?>) candidates.get(0);
            Map<?, ?> contentResp = (Map<?, ?>) firstCandidate.get("content");
            List<?> partsResp = (List<?>) contentResp.get("parts");
            Map<?, ?> firstPart = (Map<?, ?>) partsResp.get(0);
            String text = (String) firstPart.get("text");

            return Map.of("reply", text, "status", "success");
        } catch (Exception e) {
            throw new RuntimeException("Lỗi xử lý kết quả AI: " + e.getMessage());
        }
    }
}
