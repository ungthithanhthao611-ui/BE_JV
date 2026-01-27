
package com.example.demo.repository;

import com.example.demo.entity.Product;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class ProductRepository {

    private final DataSource dataSource;

    public ProductRepository(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    // ACTIVE (deleted = 0) + optional categoryId
    // 🟢 Lấy danh sách sản phẩm đang bán (deleted = 0)
    public List<Product> findActive(Long categoryId) {
        // Viết câu lệnh SQL thuần (Native SQL)
        String sql = "SELECT * FROM product WHERE deleted = 0";
        if (categoryId != null)
            sql += " AND category_id = ?";
        sql += " ORDER BY id DESC";

        /**
         * 🛡️ Kỹ thuật try-with-resources (Java 7+):
         * Tự động đóng Connection và PreparedStatement ngay sau khi chạy xong,
         * tránh lỗi tràn kết nối (Resource Leak).
         */
        try (Connection c = dataSource.getConnection();
                PreparedStatement ps = c.prepareStatement(sql)) {

            // 🛡️ Chống SQL Injection: Truyền tham số thông qua PreparedStatement
            if (categoryId != null)
                ps.setLong(1, categoryId);

            // Thực thi câu lệnh SELECT và nhận về ResultSet (Kết quả dạng bảng)
            try (ResultSet rs = ps.executeQuery()) {
                // Chuyển đổi từ dữ liệu bảng sang danh sách Object Java
                return mapList(rs);
            }
        } catch (Exception e) {
            // Xử lý lỗi nếu có vấn đề về kết nối hoặc câu lệnh SQL
            throw new RuntimeException(e);
        }
    }

    // ✅ SỬA LẠI HÀM NÀY: CHỈ TÌM THEO TÊN (TITLE)
    public List<Product> searchActive(String q, Long categoryId) {
        // 👇 1. Sửa SQL: Bỏ đoạn "OR description LIKE ?"
        String sql = """
                    SELECT * FROM product
                    WHERE deleted = 0
                      AND title LIKE ?
                """;

        if (categoryId != null) {
            sql += " AND category_id = ? ";
        }

        sql += " ORDER BY id DESC";

        String keyword = "%" + q + "%";

        try (Connection c = dataSource.getConnection();
                PreparedStatement ps = c.prepareStatement(sql)) {

            // 👇 2. Sửa tham số: Chỉ set 1 lần cho title
            ps.setString(1, keyword);

            // 👇 3. Sửa index: categoryId bây giờ là tham số thứ 2 (do bỏ description)
            if (categoryId != null) {
                ps.setLong(2, categoryId);
            }

            try (ResultSet rs = ps.executeQuery()) {
                return mapList(rs);
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public void save(Product p) {
        String sql = """
                    INSERT INTO product
                    (title, slug, description, photo, price, price_root, qty, category_id, deleted)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)
                """;
        try (Connection c = dataSource.getConnection();
                PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, p.getTitle());
            ps.setString(2, p.getSlug());
            ps.setString(3, p.getDescription());
            ps.setString(4, p.getPhoto());
            ps.setDouble(5, p.getPrice());
            ps.setDouble(6, p.getPriceRoot());
            ps.setInt(7, p.getQty());
            ps.setLong(8, p.getCategoryId());
            ps.executeUpdate();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public List<Product> findTrash() {
        String sql = "SELECT * FROM product WHERE deleted = 1 ORDER BY id DESC";
        try (Connection c = dataSource.getConnection();
                PreparedStatement ps = c.prepareStatement(sql);
                ResultSet rs = ps.executeQuery()) {
            return mapList(rs);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public Product findById(Long id) {
        String sql = "SELECT * FROM product WHERE id = ?";
        try (Connection c = dataSource.getConnection();
                PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setLong(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                List<Product> list = mapList(rs);
                return list.isEmpty() ? null : list.get(0);
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public void update(Long id, Product p) {
        String sql = """
                    UPDATE product
                    SET title=?, slug=?, description=?, photo=?,
                        price=?, price_root=?, qty=?, category_id=?
                    WHERE id=?
                """;
        try (Connection c = dataSource.getConnection();
                PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, p.getTitle());
            ps.setString(2, p.getSlug());
            ps.setString(3, p.getDescription());
            ps.setString(4, p.getPhoto());
            ps.setDouble(5, p.getPrice());
            ps.setDouble(6, p.getPriceRoot());
            ps.setInt(7, p.getQty());
            ps.setLong(8, p.getCategoryId());
            ps.setLong(9, id);
            ps.executeUpdate();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public void softDelete(Long id) {
        execute("UPDATE product SET deleted=1 WHERE id=?", id);
    }

    public void restore(Long id) {
        execute("UPDATE product SET deleted=0 WHERE id=?", id);
    }

    public void forceDelete(Long id) {
        execute("DELETE FROM product WHERE id=?", id);
    }

    private void execute(String sql, Long id) {
        try (Connection c = dataSource.getConnection();
                PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setLong(1, id);
            ps.executeUpdate();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    // 🟢 Chuyển đổi dữ liệu từ ResultSet (Bảng SQL) sang danh sách đối tượng Java
    // (Class Product)
    private List<Product> mapList(ResultSet rs) throws SQLException {
        List<Product> list = new ArrayList<>();
        // Lặp qua từng hàng (row) dữ liệu lấy được từ Database
        while (rs.next()) {
            Product p = new Product();
            // Lấy giá trị theo tên cột DB và gán vào thuộc tính Class
            p.setId(rs.getLong("id"));
            p.setTitle(rs.getString("title"));
            p.setSlug(rs.getString("slug"));
            p.setDescription(rs.getString("description"));
            p.setPhoto(rs.getString("photo"));
            p.setPrice(rs.getDouble("price"));
            p.setPriceRoot(rs.getDouble("price_root"));
            p.setQty(rs.getInt("qty"));
            p.setCategoryId(rs.getLong("category_id"));
            p.setDeleted(rs.getBoolean("deleted"));

            // Thêm đối tượng vào danh sách kết quả
            list.add(p);
        }
        return list;
    }
}