import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllVouchers, createVoucher, deleteVoucher } from "../../../api/voucherApi";

const AdminVoucherPage = () => {
  // --- STATE QUẢN LÝ DỮ LIỆU ---
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    code: "",
    discount: "",
    minOrderAmount: "0",
    expiryDate: "",
    usageLimit: "100"
  });

  // --- MENU SIDEBAR ---
  const sidebarMenu = [
    { name: "Home", icon: "🏠", path: "/admin" },
    { name: "Product", icon: "📦", path: "/admin/products" },
    { name: "Category", icon: "📂", path: "/admin/categories" },
    { name: "Orders", icon: "🧾", path: "/admin/orders" },
    { name: "Vouchers", icon: "🎫", path: "/admin/vouchers" }, // Menu hiện tại
  ];

  // --- HÀM LOAD DỮ LIỆU ---
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    getAllVouchers()
      .then(res => setVouchers(res.data))
      .catch(err => console.error("Lỗi tải voucher:", err))
      .finally(() => setLoading(false));
  };

  // --- HÀM XỬ LÝ FORM ---
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.code || !form.discount || !form.expiryDate) {
      alert("Vui lòng nhập đủ Mã, Số tiền giảm và Hạn dùng!");
      return;
    }

    createVoucher(form)
      .then(() => {
        alert("🎉 Tạo mã giảm giá thành công!");
        setForm({ 
          code: "", 
          discount: "", 
          minOrderAmount: "0", 
          expiryDate: "", 
          usageLimit: "100" 
        });
        loadData();
      })
      .catch(err => {
        console.error(err);
        alert("Lỗi: " + (err.response?.data?.message || "Không thể tạo mã"));
      });
  };

  // --- HÀM XÓA ---
  const handleDelete = (id) => {
    if (window.confirm("Bạn chắc chắn muốn xóa mã này? Hành động không thể hoàn tác.")) {
      deleteVoucher(id)
        .then(() => {
          alert("Đã xóa thành công!");
          loadData();
        })
        .catch(err => alert("Lỗi khi xóa: " + err.message));
    }
  };

  // --- HELPER: FORMAT TIỀN TỆ ---
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  return (
    <div style={styles.container}>
      {/* ================= SIDEBAR ================= */}
      <aside style={styles.sidebar}>
        <div style={styles.brandBox}>
          <h2 style={{ margin: 0, fontSize: "20px" }}>Admin Panel</h2>
          <span style={{ fontSize: "12px", opacity: 0.8 }}>Manager</span>
        </div>
        <nav style={styles.nav}>
          {sidebarMenu.map((item, index) => (
            <Link key={index} to={item.path} style={{ textDecoration: "none", color: "inherit" }}>
              <div style={styles.navItem}>
                <span style={{ marginRight: 10 }}>{item.icon}</span>
                {item.name}
              </div>
            </Link>
          ))}
        </nav>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main style={styles.mainContent}>
        {/* HEADER */}
        <header style={styles.header}>
          <div style={styles.headerLeft}>🎫 QUẢN LÝ MÃ GIẢM GIÁ</div>
          <div style={styles.userProfile}>👤 Admin</div>
        </header>

        <div style={styles.dashboardContainer}>
          
          {/* 1. FORM TẠO MÃ */}
          <div style={styles.card}>
            <h3 style={{marginTop: 0, marginBottom: 15, color: '#444'}}>+ Tạo Mã Mới</h3>
            <form onSubmit={handleSubmit} style={styles.formGrid}>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Mã Code (VD: SALE50)</label>
                <input 
                  style={styles.input} 
                  placeholder="Nhập mã..." 
                  value={form.code} 
                  onChange={e => setForm({...form, code: e.target.value.toUpperCase()})} 
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Số tiền giảm (VNĐ)</label>
                <input 
                  style={styles.input} 
                  type="number" 
                  placeholder="VD: 50000" 
                  value={form.discount} 
                  onChange={e => setForm({...form, discount: e.target.value})} 
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Đơn tối thiểu</label>
                <input 
                  style={styles.input} 
                  type="number" 
                  placeholder="VD: 100000" 
                  value={form.minOrderAmount} 
                  onChange={e => setForm({...form, minOrderAmount: e.target.value})} 
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Ngày hết hạn</label>
                <input 
                  style={styles.input} 
                  type="date" 
                  value={form.expiryDate} 
                  onChange={e => setForm({...form, expiryDate: e.target.value})} 
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Số lượng mã</label>
                <input 
                  style={styles.input} 
                  type="number" 
                  value={form.usageLimit} 
                  onChange={e => setForm({...form, usageLimit: e.target.value})} 
                />
              </div>

              <div style={{...styles.formGroup, justifyContent: 'flex-end', display: 'flex'}}>
                <button type="submit" style={styles.btnAdd}>Lưu Mã</button>
              </div>
            </form>
          </div>

          <br />

          {/* 2. BẢNG DANH SÁCH */}
          <div style={styles.card}>
            <h3 style={{marginTop: 0, marginBottom: 15, color: '#444'}}>Danh Sách Mã Hiện Có</h3>
            {loading ? (
              <p>Đang tải dữ liệu...</p>
            ) : vouchers.length === 0 ? (
              <p>Chưa có mã giảm giá nào.</p>
            ) : (
              <div style={{overflowX: 'auto'}}>
                <table style={styles.table}>
                  <thead>
                    <tr style={{ background: "#f8f9fa", textAlign: "left" }}>
                      <th style={styles.th}>Mã Code</th>
                      <th style={styles.th}>Giảm giá</th>
                      <th style={styles.th}>Đơn tối thiểu</th>
                      <th style={styles.th}>Hạn sử dụng</th>
                      <th style={styles.th}>Còn lại</th>
                      <th style={styles.th}>Trạng thái</th>
                      <th style={styles.th}>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vouchers.map(v => (
                      <tr key={v.id} style={{ borderBottom: "1px solid #eee" }}>
                        <td style={{...styles.td, fontWeight: "bold", color: "#d63384"}}>
                          {v.code}
                        </td>
                        <td style={{...styles.td, color: "#28a745", fontWeight: "bold"}}>
                          {formatCurrency(v.discount)}
                        </td>
                        <td style={styles.td}>
                          {formatCurrency(v.minOrderAmount)}
                        </td>
                        <td style={styles.td}>
                          {v.expiryDate}
                        </td>
                        <td style={styles.td}>
                          {v.usageLimit} lượt
                        </td>
                        <td style={styles.td}>
                          {v.active ? (
                            <span style={styles.badgeActive}>Hoạt động</span>
                          ) : (
                            <span style={styles.badgeInactive}>Đã khóa</span>
                          )}
                        </td>
                        <td style={styles.td}>
                          <button onClick={() => handleDelete(v.id)} style={styles.btnDelete}>
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

// ================= STYLES =================
const styles = {
  // --- LAYOUT ---
  container: { display: "flex", minHeight: "100vh", fontFamily: "Segoe UI, sans-serif", backgroundColor: "#f2f4f8" },
  sidebar: { width: 240, backgroundColor: "#fff", boxShadow: "2px 0 5px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column" },
  brandBox: { height: 60, background: "linear-gradient(to right, #ff8a65, #ffab91)", color: "#fff", paddingLeft: 20, display: "flex", flexDirection: "column", justifyContent: "center" },
  nav: { padding: "20px 0", flex: 1 },
  navItem: { padding: "12px 20px", display: "flex", alignItems: "center", cursor: "pointer", color: "#555", transition: "0.2s" },
  mainContent: { flex: 1, display: "flex", flexDirection: "column" },
  header: { height: 60, background: "linear-gradient(to right, #ff9966, #ff5e62, #e91e63)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", color: "#fff" },
  dashboardContainer: { padding: 20, flex: 1, overflowY: "auto" },

  // --- CARD & FORM ---
  card: { background: "#fff", padding: 20, borderRadius: 8, boxShadow: "0 2px 5px rgba(0,0,0,0.05)" },
  formGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 15, alignItems: "end" },
  formGroup: { display: "flex", flexDirection: "column", gap: 5 },
  label: { fontSize: 13, fontWeight: "600", color: "#555" },
  input: { padding: "10px", borderRadius: 6, border: "1px solid #ddd", outline: "none", fontSize: 14 },
  
  // --- BUTTONS ---
  btnAdd: { 
    padding: "10px 20px", 
    background: "#20c997", 
    color: "#fff", 
    border: "none", 
    borderRadius: 6, 
    cursor: "pointer", 
    fontWeight: "bold", 
    height: "40px",
    width: "100%"
  },
  btnDelete: { 
    padding: "6px 12px", 
    background: "#ff6b6b", 
    color: "#fff", 
    border: "none", 
    borderRadius: 4, 
    cursor: "pointer", 
    fontSize: 12 
  },

  // --- TABLE ---
  table: { width: "100%", borderCollapse: "collapse", minWidth: 700 },
  th: { padding: "12px", borderBottom: "2px solid #eee", fontSize: 14, color: "#666", whiteSpace: "nowrap" },
  td: { padding: "12px", fontSize: 14, color: "#333", verticalAlign: "middle" },
  
  // --- BADGES ---
  badgeActive: { padding: "4px 8px", borderRadius: 4, background: "#d4edda", color: "#155724", fontSize: 11, fontWeight: "bold" },
  badgeInactive: { padding: "4px 8px", borderRadius: 4, background: "#f8d7da", color: "#721c24", fontSize: 11, fontWeight: "bold" }
};

export default AdminVoucherPage;