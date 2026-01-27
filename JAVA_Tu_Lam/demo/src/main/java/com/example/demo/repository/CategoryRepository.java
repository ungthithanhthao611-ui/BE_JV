package com.example.demo.repository;

import org.springframework.stereotype.Repository;

import com.example.demo.entity.Category;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class CategoryRepository {

    private final DataSource dataSource;

    public CategoryRepository(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    // Lấy tất cả (trừ danh mục đã xóa)
    public List<Category> findAll() {
        List<Category> list = new ArrayList<>();
        // Nếu database của bạn chưa có cột deleted, hãy xóa "WHERE deleted = 0"
        String sql = "SELECT * FROM category WHERE deleted = 0"; 
        
        try (Connection c = dataSource.getConnection();
             PreparedStatement ps = c.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
             
            while (rs.next()) {
                Category cat = new Category();
                cat.setId(rs.getLong("id"));
                cat.setName(rs.getString("name"));
                
                // Kiểm tra xem cột có tồn tại không trước khi get để tránh lỗi
                try { cat.setSlug(rs.getString("slug")); } catch (Exception e) {}
                try { cat.setDeleted(rs.getBoolean("deleted")); } catch (Exception e) {}
                
                list.add(cat);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    public Category findById(Long id) {
        String sql = "SELECT * FROM category WHERE id = ?";
        try (Connection c = dataSource.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setLong(1, id);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                Category cat = new Category();
                cat.setId(rs.getLong("id"));
                cat.setName(rs.getString("name"));
                try { cat.setSlug(rs.getString("slug")); } catch (Exception e) {}
                return cat;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public void save(Category cat) {
        String sql = "INSERT INTO category (name, slug, deleted) VALUES (?, ?, 0)";
        try (Connection c = dataSource.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, cat.getName());
            ps.setString(2, cat.getSlug());
            ps.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public void update(Long id, Category cat) {
        String sql = "UPDATE category SET name=?, slug=? WHERE id=?";
        try (Connection c = dataSource.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, cat.getName());
            ps.setString(2, cat.getSlug());
            ps.setLong(3, id);
            ps.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public void delete(Long id) {
        // Soft Delete (Ẩn đi)
        String sql = "UPDATE category SET deleted = 1 WHERE id=?";
        try (Connection c = dataSource.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setLong(1, id);
            ps.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}