package com.example.demo.controller;

import com.example.demo.service.GeminiService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*") // Cho phép mọi nguồn gọi API
public class GeminiController {

    private final GeminiService geminiService;

    public GeminiController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    /**
     * 🤖 API CHAT VỚI AI GEMINI (CHẠY TRỰC TIẾP TRÊN SPRING BOOT)
     */
    @PostMapping("/chat")
    public Map<String, Object> chat(@RequestBody Map<String, String> request) {
        String message = request.get("message");
        String image = request.get("image"); // Base64

        return geminiService.chat(message, image);
    }
}
