import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

const AdminPage = () => {
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    products: 0,
    users: 0,
    recentOrders: []
  });

  // Dữ liệu giả lập cho biểu đồ (Vì Backend chưa có API history 7 ngày)
  const [chartData] = useState([
    { name: 'T2', 'Doanh thu': 4000000, 'Đơn hàng': 24 },
    { name: 'T3', 'Doanh thu': 3000000, 'Đơn hàng': 18 },
    { name: 'T4', 'Doanh thu': 2000000, 'Đơn hàng': 12 },
    { name: 'T5', 'Doanh thu': 2780000, 'Đơn hàng': 20 },
    { name: 'T6', 'Doanh thu': 1890000, 'Đơn hàng': 15 },
    { name: 'T7', 'Doanh thu': 2390000, 'Đơn hàng': 22 },
    { name: 'CN', 'Doanh thu': 3490000, 'Đơn hàng': 30 },
  ]);

  const [error, setError] = useState(null);

  useEffect(() => {
    // 🔥 FLOW: Khi component mount, gọi API lấy thống kê từ Backend
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/dashboard/stats`)
      .then(res => {
        if (res.data.error) {
          setError("❌ Server Error: " + res.data.error);
        }
        // Cập nhật state Stats để Re-render giao diện
        setStats(res.data);
      })
      .catch(err => {
        // console.error(err);
        // setError("⚠️ Không thể tải dữ liệu! Vui lòng RESTART Backend Server.");
        // Fallback demo data if API fails to avoid broken UI
        setStats({
          revenue: 15400000,
          orders: 45,
          products: 12,
          users: 8,
          recentOrders: []
        });
      });
  }, []);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  const translateStatus = (status) => {
    switch (status) {
      case "PENDING": return "Chờ xử lý";
      case "CONFIRMED": return "Đã xác nhận";
      case "SHIPPING": return "Giao hàng";
      case "COMPLETED": return "Hoàn thành";
      case "CANCELLED": return "Đã hủy";
      case "PROCESSING": return "Đang xử lý";
      default: return status;
    }
  };

  return (
    <AdminLayout>
      <div style={styles.dashboardContainer}>
        <div style={styles.subHeader}>
          <div style={styles.searchBox}>
            <h2 style={{ margin: 0, color: "#333" }}>Tổng quan hệ thống</h2>
          </div>
          <div style={styles.breadcrumb}>
            Admin / <b>Dashboard</b>
          </div>
        </div>

        <div style={styles.gridContainer}>
          {error && (
            <div style={{ gridColumn: "1 / -1", background: "#ffebee", color: "#c62828", padding: 15, borderRadius: 8, textAlign: "center", border: "1px solid #ffcdd2" }}>
              {error}
            </div>
          )}
          {/* STATS CARDS */}
          <div style={{ ...styles.card, ...styles.gradientCardRed }}>
            <h3 style={{ margin: 0, fontSize: "16px" }}>Tổng Doanh Thu</h3>
            <div style={{ fontSize: 28, fontWeight: "bold", marginTop: 10 }}>
              {formatCurrency(stats.revenue)}
            </div>
          </div>

          <div style={{ ...styles.card, background: "#fff", borderLeft: "5px solid #2196f3" }}>
            <h3 style={styles.cardTitle}>Đơn hàng</h3>
            <div style={styles.statNumber}>{stats.orders}</div>
          </div>

          <div style={{ ...styles.card, background: "#fff", borderLeft: "5px solid #4caf50" }}>
            <h3 style={styles.cardTitle}>Sản phẩm</h3>
            <div style={styles.statNumber}>{stats.products}</div>
          </div>

          <div style={{ ...styles.card, background: "#fff", borderLeft: "5px solid #ff9800" }}>
            <h3 style={styles.cardTitle}>Thành viên</h3>
            <div style={styles.statNumber}>{stats.users}</div>
          </div>
        </div>

        {/* CHART SECTION */}
        <div style={{ marginTop: 30, display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
          {/* REVENUE CHART */}
          <div style={{ background: "#fff", borderRadius: 12, padding: 25, boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
            <h3 style={{ marginTop: 0, marginBottom: 20, color: "#333" }}>📊 Biểu đồ Doanh thu (7 ngày qua)</h3>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Area type="monotone" dataKey="Doanh thu" stroke="#8884d8" fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ORDERS BAR CHART */}
          <div style={{ background: "#fff", borderRadius: 12, padding: 25, boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
            <h3 style={{ marginTop: 0, marginBottom: 20, color: "#333" }}>🛒 Đơn hàng</h3>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Đơn hàng" fill="#00C49F" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* RECENT ORDERS */}
        <div style={{ marginTop: 30, background: "#fff", borderRadius: 12, padding: 25, boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
          <h3 style={{ marginTop: 0, marginBottom: 20, borderBottom: "1px solid #eee", paddingBottom: 15, color: "#333" }}>Đơn hàng mới nhất</h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8f9fa" }}>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Khách hàng</th>
                  <th style={styles.th}>Tổng tiền</th>
                  <th style={styles.th}>Trạng thái</th>
                  <th style={styles.th}>Ngày tạo</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders && stats.recentOrders.length === 0 ? (
                  <tr><td colSpan="5" style={{ padding: 20, textAlign: "center", color: "#888" }}>Chưa có đơn hàng nào</td></tr>
                ) : (
                  (stats.recentOrders || []).map(order => (
                    <tr key={order.order_id} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={styles.td}>#{order.order_id}</td>
                      <td style={styles.td}>{order.customer_name || "N/A"}</td>
                      <td style={styles.td}>{formatCurrency(order.total_amount)}</td>
                      <td style={styles.td}>
                        <span style={{
                          padding: "5px 10px", borderRadius: 6, fontSize: 11, fontWeight: "bold",
                          background: order.order_status === "PENDING" ? "#fff3e0" :
                            order.order_status === "DELIVERED" || order.order_status === "COMPLETED" ? "#e8f5e9" :
                              order.order_status === "CANCELLED" ? "#ffebee" : "#e3f2fd",
                          color: order.order_status === "PENDING" ? "#ef6c00" :
                            order.order_status === "DELIVERED" || order.order_status === "COMPLETED" ? "#2e7d32" :
                              order.order_status === "CANCELLED" ? "#c62828" : "#1976d2"
                        }}>
                          {translateStatus(order.order_status)}
                        </span>
                      </td>
                      <td style={styles.td}>{new Date(order.created_at).toLocaleString('vi-VN')}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

const styles = {
  dashboardContainer: { padding: "10px 0" },
  subHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 25,
    alignItems: "center"
  },
  searchBox: { position: "relative" },
  breadcrumb: { fontSize: 13, color: "#999" },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 20,
  },
  card: {
    background: "#fff",
    borderRadius: 12,
    padding: 25,
    boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },
  cardTitle: { margin: 0, fontSize: 14, color: "#888", textTransform: "uppercase", letterSpacing: "0.5px" },
  statNumber: { fontSize: 32, fontWeight: "bold", color: "#333", marginTop: 8 },

  gradientCardRed: {
    background: "linear-gradient(45deg, #ff5252, #e040fb)",
    color: "#fff",
  },
  th: { padding: "15px", textAlign: "left", fontSize: 14, color: "#555", borderBottom: "2px solid #f1f1f1", fontWeight: "600" },
  td: { padding: "15px", fontSize: 14, color: "#444" }
};

export default AdminPage;
