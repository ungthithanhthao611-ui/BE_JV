package com.example.demo.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Service
public class CloudinaryService {
    private final Cloudinary cloudinary;

    public CloudinaryService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    public String upload(MultipartFile file) {
        try {
            Map<?, ?> res = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", "be_jv/products",
                            "resource_type", "auto"));
            return (String) res.get("secure_url"); // URL https
        } catch (Exception e) {
            throw new RuntimeException("Upload Cloudinary failed: " + e.getMessage(), e);
        }
    }
}
