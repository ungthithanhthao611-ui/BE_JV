import { Link, useNavigate } from "react-router-dom";

export default function AdminHeader() {
  const navigate = useNavigate();
  const userName = sessionStorage.getItem("userName") || "Admin";
  const userRole = sessionStorage.getItem("userRole") || "Quản trị";

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc muốn đăng xuất?")) {
      sessionStorage.clear();
      navigate("/admin/login");
    }
  };

  return (
    <header style={styles.header}>
      <div style={styles.headerLeft}>
        <div style={{ cursor: "pointer", fontSize: "20px", marginRight: "20px" }}>☰</div>
        <nav style={{ display: "flex", gap: 20 }}>
          <Link to="/" style={styles.link}>Xem Trang Khách</Link>
          <Link to="/admin/products" style={styles.link}>Sản phẩm</Link>
          <Link to="/admin/orders" style={styles.link}>Đơn hàng</Link>
        </nav>
      </div>

      <div style={styles.headerRight}>
        <span style={{ fontSize: "20px", cursor: "pointer" }}>💬</span>
        <span style={{ margin: "0 15px", fontSize: "20px", cursor: "pointer" }}>🔔</span>
        <div style={styles.userProfile}>
          <span style={{ fontWeight: 600 }}>👤 {userName} ({userRole})</span>
        </div>
        <button onClick={handleLogout} style={styles.btnLogout}>
          Đăng xuất
        </button>
      </div>
    </header>
  );
}

const styles = {
  header: {
    height: 60,
    background: "linear-gradient(to right, #ff9966, #ff5e62, #e91e63)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
    color: "#fff",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  headerLeft: { display: "flex", alignItems: "center" },
  headerRight: { display: "flex", alignItems: "center" },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "14px",
    opacity: 0.9,
    transition: "0.2s",
  },
  userProfile: { marginLeft: 10, fontSize: "14px" },
  btnLogout: {
    marginLeft: 15,
    padding: "6px 12px",
    borderRadius: 6,
    border: "none",
    background: "rgba(255,255,255,0.2)",
    color: "#fff",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 600,
    transition: "0.2s",
  },
};
