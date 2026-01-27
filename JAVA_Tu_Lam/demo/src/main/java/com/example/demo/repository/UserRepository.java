package com.example.demo.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.User;

import java.util.Optional;

@Repository
public class UserRepository {

    private final JdbcTemplate jdbcTemplate;

    public UserRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<User> mapper = (rs, rowNum) -> {
        User u = new User();
        // Map columns correctly based on user's screenshot
        u.setId(rs.getLong("user_id")); // PK Changed from 'id' to 'user_id'
        u.setFirstName(rs.getString("first_name"));
        u.setLastName(rs.getString("last_name"));
        u.setEmail(rs.getString("email"));
        u.setPassword(rs.getString("password"));
        u.setMobileNumber(rs.getString("mobile_number"));
        u.setImage(rs.getString("image"));
        u.setRole(rs.getString("role"));
        u.setGender(rs.getString("gender"));
        try {
            u.setResetToken(rs.getString("reset_token"));
        } catch (Exception e) {
        } // Column might not exist yet
        return u;
    };

    public void updateResetToken(String email, String token) {
        jdbcTemplate.update("UPDATE users SET reset_token = ? WHERE email = ?", token, email);
    }

    public Optional<User> findByResetToken(String token) {
        try {
            var list = jdbcTemplate.query("SELECT * FROM users WHERE reset_token = ?", mapper, token);
            return list.isEmpty() ? Optional.empty() : Optional.of(list.get(0));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public void updatePassword(Long userId, String newPassword) {
        jdbcTemplate.update("UPDATE users SET password = ?, reset_token = NULL WHERE user_id = ?", newPassword, userId);
    }

    public Optional<User> findByEmail(String email) {
        try {
            var list = jdbcTemplate.query(
                    "SELECT * FROM users WHERE email = ?",
                    mapper,
                    email);
            return list.isEmpty() ? Optional.empty() : Optional.of(list.get(0));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public Optional<User> findById(Long id) {
        var list = jdbcTemplate.query(
                "SELECT * FROM users WHERE user_id = ?",
                mapper,
                id);
        return list.isEmpty() ? Optional.empty() : Optional.of(list.get(0));
    }

    public void save(String firstName, String lastName, String email, String password, String mobileNumber,
            String gender, String address) {
        jdbcTemplate.update(
                "INSERT INTO users(first_name, last_name, email, password, mobile_number, gender, address, role) VALUES (?, ?, ?, ?, ?, ?, ?, 'USER')",
                firstName, lastName, email, password, mobileNumber, gender, address);
    }

    public void update(User user) {
        jdbcTemplate.update(
                "UPDATE users SET first_name=?, last_name=?, mobile_number=?, image=?, gender=? WHERE user_id=?",
                user.getFirstName(),
                user.getLastName(),
                user.getMobileNumber(),
                user.getImage(),
                user.getGender(),
                user.getId());
    }

    // ✅ List all users
    public java.util.List<User> findAll() {
        return jdbcTemplate.query("SELECT * FROM users ORDER BY user_id DESC", mapper);
    }

    // ✅ Delete user by ID
    public void deleteById(Long id) {
        jdbcTemplate.update("DELETE FROM users WHERE user_id = ?", id);
    }
}
