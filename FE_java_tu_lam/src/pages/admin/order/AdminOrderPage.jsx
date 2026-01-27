import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios"; // Import axios trực tiếp để gọi API chi tiết
import { getAllOrders, updateOrderStatus } from "../../../api/orderApi";

const AdminOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [loading, setLoading] = useState(false);

  // State cho Modal Xem chi tiết
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);

  // --- MENU ---
  const sidebarMenu = [
    { name: "Home", icon: "🏠", path: "/admin" },
    { name: "Product", icon: "📦", path: "/admin/products" },
    { name: "Category", icon: "📂", path: "/admin/categories" },
    { name: "Orders", icon: "🧾", path: "/admin/orders" },
  ];

  // --- QUY TRÌNH ĐƠN HÀNG (Shopee Style) ---
  const ORDER_STEPS = [
    { value: "PENDING", label: "Chờ xác nhận", color: "#ffc107" }, // Vàng
    { value: "CONFIRMED", label: "Đã xác nhận", color: "#17a2b8" }, // Xanh dương nhạt
    { value: "PROCESSING", label: "Đang chế biến", color: "#6610f2" }, // Tím
    { value: "SHIPPING", label: "Đang giao", color: "#007bff" }, // Xanh dương
    { value: "COMPLETED", label: "Đã giao", color: "#28a745" }, // Xanh lá
    { value: "CANCELLED", label: "Đã hủy", color: "#dc3545" }, // Đỏ
  ];

  // --- LẤY DỮ LIỆU ---
  const fetchOrders = () => {
    setLoading(true);
    getAllOrders()
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // Gọi lần đầu
    fetchOrders();

    // ✅ Auto Polling mỗi 3 giây để cập nhật realtime khi có thanh toán MoMo
    const intervalId = setInterval(() => {
      // Reload ngầm (không hiện loading để tránh flicker)
      getAllOrders()
        .then((res) => setOrders(res.data))
        .catch((err) => console.error(err));
    }, 3000);

    // Cleanup khi unmount
    return () => clearInterval(intervalId);
  }, []);

  // ✅ KIỂM TRA TRẠNG THÁI CÓ HỢP LỆ KHÔNG (ONE-WAY WORKFLOW)
  const isValidStatusTransition = (currentStatus, newStatus) => {
    // Luôn cho phép CANCELLED từ bất kỳ trạng thái nào
    if (newStatus === "CANCELLED") return true;

    // Không cho phép từ CANCELLED sang trạng thái khác
    if (currentStatus === "CANCELLED") return false;

    // Không cho phép từ COMPLETED sang trạng thái khác (trừ CANCELLED đã check ở trên)
    if (currentStatus === "COMPLETED") return false;

    // Quy trình: PENDING → CONFIRMED → PROCESSING → SHIPPING → COMPLETED
    const workflow = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPING", "COMPLETED"];
    const currentIndex = workflow.indexOf(currentStatus);
    const newIndex = workflow.indexOf(newStatus);

    // Cho phép chuyển sang status cùng cấp hoặc cao hơn (không cho lùi)
    return newIndex >= currentIndex;
  };

  // --- CẬP NHẬT TRẠNG THÁI ---
  const handleStatusChange = (orderId, newStatus) => {
    const order = orders.find(o => o.orderId === orderId);
    const currentStatus = order?.orderStatus;

    // ✅ Kiểm tra workflow
    if (!isValidStatusTransition(currentStatus, newStatus)) {
      alert(`❌ Không thể chuyển từ "${ORDER_STEPS.find(s => s.value === currentStatus)?.label}" về "${ORDER_STEPS.find(s => s.value === newStatus)?.label}"!\n\nChỉ được tiến lên, không được lùi lại.`);
      return;
    }

    if (window.confirm(`Cập nhật trạng thái đơn #${orderId}?`)) {
      updateOrderStatus(orderId, newStatus)
        .then(() => {
          setOrders((prev) =>
            prev.map((o) =>
              o.orderId === orderId ? { ...o, orderStatus: newStatus } : o
            )
          );
        })
        .catch((err) => alert("Lỗi: " + err.message));
    }
  };

  // --- XEM CHI TIẾT ---
  const handleViewDetail = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
    // Gọi API lấy items
    axios.get(`http://localhost:8080/api/orders/${order.orderId}/items`)
      .then(res => setOrderItems(res.data))
      .catch(err => console.error(err));
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
    setOrderItems([]);
  };

  // --- LỌC ---
  const filteredOrders = filterStatus === "ALL"
    ? orders
    : orders.filter((o) => o.orderStatus === filterStatus);

  return (
    <div style={styles.container}>
      {/* SIDEBAR */}
      <aside style={styles.sidebar}>
        <div style={styles.brandBox}>
          <h2 style={{ margin: 0, fontSize: "20px" }}>Admin Panel</h2>
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

      {/* MAIN CONTENT */}
      <main style={styles.mainContent}>
        <header style={styles.header}>
          <div style={styles.headerLeft}>QUẢN LÝ ĐƠN HÀNG</div>
          <div style={styles.userProfile}>👤 Admin</div>
        </header>

        <div style={styles.dashboardContainer}>
          {/* TOOLBAR */}
          <div style={styles.card}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <strong>Lọc trạng thái:</strong>
              <select
                style={styles.select}
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="ALL">Tất cả</option>
                {ORDER_STEPS.map(step => (
                  <option key={step.value} value={step.value}>{step.label}</option>
                ))}
              </select>
              <button onClick={fetchOrders} style={styles.btnReload}>🔄 Tải lại</button>
            </div>
          </div>

          <br />

          {/* TABLE */}
          <div style={styles.card}>
            <table style={styles.table}>
              <thead>
                <tr style={{ background: "#f8f9fa", textAlign: "left" }}>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Khách hàng</th>
                  <th style={styles.th}>Ngày đặt</th>
                  <th style={styles.th}>Tổng tiền</th>
                  <th style={styles.th}>Trạng thái (Quy trình)</th>
                  <th style={styles.th}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.orderId} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={styles.td}>#{order.orderId}</td>
                    <td style={styles.td}><strong>{order.email}</strong></td>
                    <td style={styles.td}>{order.orderDate}</td>
                    <td style={{ ...styles.td, color: "#d63384", fontWeight: "bold" }}>
                      {order.totalAmount?.toLocaleString()} đ
                    </td>
                    <td style={styles.td}>
                      {/* Dropdown thay đổi trạng thái nhanh */}
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                        style={{
                          padding: "6px",
                          borderRadius: "4px",
                          border: `1px solid ${ORDER_STEPS.find(s => s.value === order.orderStatus)?.color || "#ccc"}`,
                          fontWeight: "bold",
                          color: ORDER_STEPS.find(s => s.value === order.orderStatus)?.color || "#333"
                        }}
                      >
                        {ORDER_STEPS.map(step => {
                          // ✅ Chỉ cho phép các option hợp lệ theo workflow
                          const isDisabled = !isValidStatusTransition(order.orderStatus, step.value);
                          return (
                            <option
                              key={step.value}
                              value={step.value}
                              disabled={isDisabled}
                              style={{ color: isDisabled ? '#ccc' : 'inherit' }}
                            >
                              {step.label} {isDisabled ? '🔒' : ''}
                            </option>
                          );
                        })}
                      </select>
                    </td>
                    <td style={styles.td}>
                      <button
                        style={{ ...styles.btnAction, background: "#339af0" }}
                        onClick={() => handleViewDetail(order)}
                      >
                        👁️ Xem
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* MODAL CHI TIẾT ĐƠN HÀNG */}
      {showModal && selectedOrder && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3>Chi tiết đơn hàng #{selectedOrder.orderId}</h3>
              <button onClick={closeModal} style={styles.closeBtn}>×</button>
            </div>

            <div style={styles.modalBody}>
              <p><strong>Khách hàng:</strong> {selectedOrder.email}</p>
              <p><strong>Ngày đặt:</strong> {selectedOrder.orderDate}</p>
              <p><strong>Trạng thái:</strong> {ORDER_STEPS.find(s => s.value === selectedOrder.orderStatus)?.label}</p>

              <hr style={{ margin: "15px 0", borderTop: "1px solid #eee" }} />

              <h4 style={{ marginBottom: 10 }}>Sản phẩm:</h4>
              <div style={styles.itemList}>
                {orderItems.map((item, idx) => (
                  <div key={idx} style={styles.itemRow}>
                    <img
                      src={`http://localhost:8080/images/${item.productPhoto}`}
                      alt={item.productName}
                      style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 4 }}
                    />
                    <div style={{ flex: 1, marginLeft: 10 }}>
                      <div style={{ fontWeight: "bold" }}>{item.productName}</div>
                      <div style={{ fontSize: 12, color: "#666" }}>x{item.quantity}</div>
                    </div>
                    <div style={{ fontWeight: "bold", color: "#d63384" }}>
                      {item.price.toLocaleString()} đ
                    </div>
                  </div>
                ))}
              </div>

              <hr style={{ margin: "15px 0", borderTop: "1px solid #eee" }} />

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, fontWeight: "bold" }}>
                <span>Tổng cộng:</span>
                <span style={{ color: "#d63384" }}>{selectedOrder.totalAmount.toLocaleString()} đ</span>
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button onClick={closeModal} style={styles.btnClose}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ================= STYLES =================
const styles = {
  container: { display: "flex", minHeight: "100vh", fontFamily: "Segoe UI", backgroundColor: "#f2f4f8" },
  sidebar: { width: 240, backgroundColor: "#fff", boxShadow: "2px 0 5px rgba(0,0,0,0.05)" },
  brandBox: { height: 70, background: "linear-gradient(to right, #ff8a65, #ffab91)", color: "#fff", paddingLeft: 20, display: "flex", flexDirection: "column", justifyContent: "center" },
  nav: { padding: "20px 0" },
  navItem: { padding: "12px 20px", display: "flex", alignItems: "center", cursor: "pointer", color: "#555" },
  mainContent: { flex: 1 },
  header: { height: 60, background: "linear-gradient(to right, #ff9966, #ff5e62, #e91e63)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", color: "#fff" },
  dashboardContainer: { padding: 20 },
  card: { background: "#fff", borderRadius: 8, padding: 20, boxShadow: "0 2px 5px rgba(0,0,0,0.05)", overflowX: "auto" },
  select: { padding: "8px 12px", borderRadius: 4, border: "1px solid #ddd" },
  btnReload: { marginLeft: "auto", padding: "8px 12px", cursor: "pointer", background: "#f8f9fa", border: "1px solid #ddd", borderRadius: 4 },
  table: { width: "100%", borderCollapse: "collapse", minWidth: 600 },
  th: { padding: "12px", borderBottom: "2px solid #eee", fontSize: 14, color: "#666", whiteSpace: "nowrap" },
  td: { padding: "12px", fontSize: 14, color: "#333", verticalAlign: "middle" },
  btnAction: { border: "none", color: "#fff", padding: "6px 12px", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: "bold", transition: "opacity 0.2s" },

  // MODAL STYLES
  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
  modalContent: { background: "#fff", width: "500px", borderRadius: 8, boxShadow: "0 5px 15px rgba(0,0,0,0.3)", overflow: "hidden", animation: "fadeIn 0.3s" },
  modalHeader: { padding: "15px 20px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8f9fa" },
  closeBtn: { background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#aaa" },
  modalBody: { padding: "20px" },
  modalFooter: { padding: "15px 20px", borderTop: "1px solid #eee", textAlign: "right" },
  itemList: { display: "flex", flexDirection: "column", gap: 10 },
  itemRow: { display: "flex", alignItems: "center", paddingBottom: 10, borderBottom: "1px dashed #eee" },
  btnClose: { padding: "8px 16px", background: "#6c757d", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }
};

export default AdminOrderPage;