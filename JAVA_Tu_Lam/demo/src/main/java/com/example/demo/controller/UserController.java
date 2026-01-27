package com.example.demo.controller;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
// @CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Lấy thông tin user theo ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setPassword(null); // Không trả về password
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Cập nhật thông tin (Frontend gọi PUT /users/me hoặc /users/{id})
    // Ở đây mình demo update theo ID truyền vào body hoặc path
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            User existingUser = userOpt.get();

            // Chỉ cập nhật các trường cho phép
            if (userDetails.getFirstName() != null)
                existingUser.setFirstName(userDetails.getFirstName());
            if (userDetails.getLastName() != null)
                existingUser.setLastName(userDetails.getLastName());
            if (userDetails.getMobileNumber() != null)
                existingUser.setMobileNumber(userDetails.getMobileNumber());
            if (userDetails.getImage() != null)
                existingUser.setImage(userDetails.getImage());
            if (userDetails.getGender() != null)
                existingUser.setGender(userDetails.getGender());

            userRepository.update(existingUser);

            return ResponseEntity.ok("Cập nhật thành công");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // ✅ List all users
    @GetMapping
    public java.util.List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // ✅ Delete user
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
    }
}
