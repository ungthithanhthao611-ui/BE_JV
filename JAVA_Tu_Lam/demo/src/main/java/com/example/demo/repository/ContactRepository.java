package com.example.demo.repository;

import com.example.demo.entity.Contact;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public class ContactRepository {

    private final JdbcTemplate jdbcTemplate;

    public ContactRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void save(Contact contact) {
        String sql = "INSERT INTO contact (user_id, name, email, phone, title, content, created_at, status) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql,
                contact.getUserId(),
                contact.getName(),
                contact.getEmail(),
                contact.getPhone(),
                contact.getTitle(),
                contact.getContent(),
                LocalDateTime.now(),
                1 // Default status = 1 (Active/Pending)
        );
    }

    // START: ADMIN METHODS
    public java.util.List<Contact> findAll() {
        String sql = "SELECT * FROM contact ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Contact c = new Contact();
            c.setId(rs.getLong("id"));
            c.setUserId(rs.getLong("user_id"));
            c.setName(rs.getString("name"));
            c.setEmail(rs.getString("email"));
            c.setPhone(rs.getString("phone"));
            c.setTitle(rs.getString("title"));
            c.setContent(rs.getString("content"));

            java.sql.Timestamp ts = rs.getTimestamp("created_at");
            if (ts != null)
                c.setCreatedAt(ts.toLocalDateTime());

            c.setStatus(rs.getInt("status"));
            return c;
        });
    }

    public void deleteById(Long id) {
        String sql = "DELETE FROM contact WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    public void updateStatus(Long id, Integer status) {
        String sql = "UPDATE contact SET status = ? WHERE id = ?";
        jdbcTemplate.update(sql, status, id);
    }
}
