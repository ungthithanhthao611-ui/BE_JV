package com.example.demo.repository;

import com.example.demo.entity.Voucher;
import org.springframework.stereotype.Repository;
import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class VoucherRepository {
    private final DataSource dataSource;

    public VoucherRepository(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    // 1. Tạo Voucher mới (Admin)
    public void save(Voucher v) {
        String sql = "INSERT INTO vouchers (code, discount, min_order_amount, expiry_date, usage_limit, is_active) VALUES (?, ?, ?, ?, ?, 1)";
        try (Connection c = dataSource.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, v.getCode().toUpperCase());
            ps.setDouble(2, v.getDiscount());
            ps.setDouble(3, v.getMinOrderAmount());
            ps.setDate(4, Date.valueOf(v.getExpiryDate()));
            ps.setInt(5, v.getUsageLimit());
            ps.executeUpdate();
        } catch (SQLException e) { throw new RuntimeException(e); }
    }

    // 2. Lấy danh sách Voucher (Admin)
    public List<Voucher> findAll() {
        List<Voucher> list = new ArrayList<>();
        try (Connection c = dataSource.getConnection();
             PreparedStatement ps = c.prepareStatement("SELECT * FROM vouchers ORDER BY id DESC");
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                Voucher v = new Voucher();
                v.setId(rs.getLong("id"));
                v.setCode(rs.getString("code"));
                v.setDiscount(rs.getDouble("discount"));
                v.setMinOrderAmount(rs.getDouble("min_order_amount"));
                v.setExpiryDate(rs.getDate("expiry_date").toLocalDate());
                v.setUsageLimit(rs.getInt("usage_limit"));
                v.setActive(rs.getBoolean("is_active"));
                list.add(v);
            }
        } catch (SQLException e) { throw new RuntimeException(e); }
        return list;
    }

    // 3. Xóa/Vô hiệu hóa Voucher (Admin)
    public void delete(Long id) {
        try (Connection c = dataSource.getConnection();
             PreparedStatement ps = c.prepareStatement("DELETE FROM vouchers WHERE id=?")) {
            ps.setLong(1, id);
            ps.executeUpdate();
        } catch (SQLException e) { throw new RuntimeException(e); }
    }
    
    // 4. Kiểm tra Voucher hợp lệ (User)
    public Voucher findByCode(String code) {
        String sql = "SELECT * FROM vouchers WHERE code = ? AND is_active = 1 AND usage_limit > 0 AND expiry_date >= CURDATE()";
        try (Connection c = dataSource.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, code);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    Voucher v = new Voucher();
                    v.setId(rs.getLong("id"));
                    v.setCode(rs.getString("code"));
                    v.setDiscount(rs.getDouble("discount"));
                    v.setMinOrderAmount(rs.getDouble("min_order_amount"));
                    return v;
                }
            }
        } catch (SQLException e) { throw new RuntimeException(e); }
        return null; // Không tìm thấy hoặc hết hạn
    }


    // Lấy danh sách Voucher đang hoạt động (Cho trang chủ/sản phẩm)
public List<Voucher> findActiveVouchers() {
    String sql = "SELECT * FROM vouchers WHERE is_active = 1 AND usage_limit > 0 AND expiry_date >= CURDATE() ORDER BY discount DESC";
    List<Voucher> list = new ArrayList<>();
    try (Connection c = dataSource.getConnection();
         PreparedStatement ps = c.prepareStatement(sql);
         ResultSet rs = ps.executeQuery()) {
        while (rs.next()) {
            Voucher v = new Voucher();
            v.setId(rs.getLong("id"));
            v.setCode(rs.getString("code"));
            v.setDiscount(rs.getDouble("discount"));
            v.setMinOrderAmount(rs.getDouble("min_order_amount"));
            v.setExpiryDate(rs.getDate("expiry_date").toLocalDate());
            list.add(v);
        }
    } catch (SQLException e) { throw new RuntimeException(e); }
    return list;
}
}