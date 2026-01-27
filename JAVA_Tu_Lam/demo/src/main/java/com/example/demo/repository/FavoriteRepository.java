package com.example.demo.repository;

import com.example.demo.entity.Product;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class FavoriteRepository {
    private final JdbcTemplate jdbcTemplate;

    public FavoriteRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Product> productMapper = (rs, rowNum) -> {
        Product p = new Product();
        p.setId(rs.getLong("id"));
        p.setTitle(rs.getString("title"));
        p.setSlug(rs.getString("slug"));
        p.setPhoto(rs.getString("photo"));
        p.setPrice(rs.getDouble("price"));

        // Thử lấy price_root, nếu lỗi (do cột không tồn tại hoặc null) thì set 0
        try {
            double pr = rs.getDouble("price_root");
            p.setPriceRoot(pr);
        } catch (Exception e) {
            p.setPriceRoot(0);
        }

        return p;
    };

    public List<Product> findByUserId(Long userId) {
        // Cố gắng lấy thêm price_root
        String sql = """
                    SELECT p.id, p.title, p.slug, p.photo, p.price, p.price_root
                    FROM favorites f
                    JOIN product p ON f.product_id = p.id
                    WHERE f.user_id = ?
                """;
        try {
            return jdbcTemplate.query(sql, productMapper, userId);
        } catch (Exception e) {
            // Fallback nếu lỗi (ví dụ không có cột price_root), thử query cũ
            System.err.println("Error querying favorites with price_root: " + e.getMessage());
            String fallbackSql = """
                        SELECT p.id, p.title, p.slug, p.photo, p.price
                        FROM favorites f
                        JOIN product p ON f.product_id = p.id
                        WHERE f.user_id = ?
                    """;
            return jdbcTemplate.query(fallbackSql, productMapper, userId);
        }
    }

    // Thêm sản phẩm vào yêu thích (Dùng INSERT IGNORE để tránh lỗi duplicate entry)
    public void addFavorite(Long userId, Long productId) {
        String sql = "INSERT IGNORE INTO favorites (user_id, product_id) VALUES (?, ?)";
        jdbcTemplate.update(sql, userId, productId);
    }

    // Xóa sản phẩm khỏi yêu thích
    public void removeFavorite(Long userId, Long productId) {
        String sql = "DELETE FROM favorites WHERE user_id = ? AND product_id = ?";
        jdbcTemplate.update(sql, userId, productId);
    }

    // Kiểm tra sản phẩm có được yêu thích không
    public boolean isFavorite(Long userId, Long productId) {
        String sql = "SELECT COUNT(*) FROM favorites WHERE user_id = ? AND product_id = ?";
        try {
            Integer count = jdbcTemplate.queryForObject(sql, Integer.class, userId, productId);
            return count != null && count > 0;
        } catch (Exception e) {
            return false;
        }
    }
}
