import { Link, useLocation } from "react-router-dom";

export default function AdminSidebar() {
  const location = useLocation();
  const menu = [
    { name: "Trang chủ", path: "/admin", icon: "🏠" },
    { name: "Sản phẩm", path: "/admin/products", icon: "📦" },
    { name: "Danh mục", path: "/admin/categories", icon: "📂" },
    { name: "Đơn hàng", path: "/admin/orders", icon: "🧾" },
    { name: "Mã giảm giá", icon: "🎁", path: "/admin/vouchers" },
    { name: "Liên hệ", icon: "✉️", path: "/admin/contacts" },
    { name: "Người dùng", icon: "👥", path: "/admin/users" },
  ];

  return (
    <aside style={styles.sidebar}>
      <div style={styles.brand}>
        <h2 style={{ margin: 0, fontSize: "20px" }}>HaluCafe Admin</h2>
        <span style={{ fontSize: "12px", opacity: 0.8 }}>Quản trị viên</span>
      </div>

      <nav style={styles.nav}>
        {menu.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={index} to={item.path} style={{ textDecoration: "none", color: "inherit" }}>
              <div style={{ ...styles.navItem, backgroundColor: isActive ? "#fff5f5" : "transparent" }}>
                <span style={{ marginRight: 10 }}>{item.icon}</span>
                <span style={{ fontWeight: isActive ? "bold" : "normal", color: isActive ? "#ff5e62" : "#555" }}>
                  {item.name}
                </span>
                <span style={{ marginLeft: "auto", fontSize: 10, opacity: 0.5 }}>›</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: 240,
    background: "#fff",
    boxShadow: "2px 0 10px rgba(0,0,0,0.05)",
    zIndex: 10,
  },
  brand: {
    height: 70,
    background: "linear-gradient(to right, #ff8a65, #ffab91)",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    paddingLeft: 20,
  },
  nav: { padding: "20px 0" },
  navItem: {
    padding: "12px 20px",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    transition: "0.2s",
  },
};
