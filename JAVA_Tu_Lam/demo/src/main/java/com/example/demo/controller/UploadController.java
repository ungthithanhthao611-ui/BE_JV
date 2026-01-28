package com.example.demo.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@RestController
@RequestMapping("/api")
// @CrossOrigin(origins = "http://localhost:5173")
public class UploadController {

    @org.springframework.beans.factory.annotation.Value("${app.storage.type}")
    private String storageType;

    @org.springframework.beans.factory.annotation.Value("${cloudinary.cloud-name}")
    private String cloudName;

    @org.springframework.beans.factory.annotation.Value("${cloudinary.api-key}")
    private String apiKey;

    @org.springframework.beans.factory.annotation.Value("${cloudinary.api-secret}")
    private String apiSecret;

    private static final String UPLOAD_DIR = "uploads/images";

    @PostMapping("/upload")
    public String uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            // 1. CLOUD STORAGE
            if ("cloud".equalsIgnoreCase(storageType)) {
                com.cloudinary.Cloudinary cloudinary = new com.cloudinary.Cloudinary(
                        com.cloudinary.utils.ObjectUtils.asMap(
                                "cloud_name", cloudName,
                                "api_key", apiKey,
                                "api_secret", apiSecret));
                java.util.Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                        com.cloudinary.utils.ObjectUtils.asMap("resource_type", "auto"));
                return (String) uploadResult.get("secure_url");
            }

            // 2. LOCAL STORAGE
            File dir = new File(UPLOAD_DIR);
            if (!dir.exists())
                dir.mkdirs();

            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path path = Paths.get(UPLOAD_DIR, fileName);
            Files.write(path, file.getBytes());

            return fileName;

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Upload failed");
        }
    }
}
