import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { getOrderById, getOrderItems } from "../../api/orderApi";

// CSS Styles
const cssStyles = `
  .order-detail-wrapper {
    font-family: 'Segoe UI', sans-serif;
    background: #f5f5f5;
    min-height: 100vh;
  }

  .container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 15px;
  }

  /* BREADCRUMB */
  .breadcrumb-section {
    background: #fff;
    padding: 15px 0;
    border-bottom: 1px solid #eee;
    margin-bottom: 30px;
  }

  .breadcrumb {
    font-size: 14px;
    color: #666;
  }

  .breadcrumb a {
    color: #333;
    text-decoration: none;
    transition: 0.2s;
  }

  .breadcrumb a:hover {
    color: #d32f2f;
  }

  .breadcrumb .current {
    color: #999;
  }

  /* MAIN CONTENT */
  .order-detail-content {
    padding-bottom: 60px;
  }

  /* ORDER HEADER CARD */
  .order-header-card {
    background: linear-gradient(135deg, #fff 0%, #fafafa 100%);
    border-radius: 16px;
    padding: 30px;
    margin-bottom: 25px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
    border: 1px solid #f0f0f0;
  }

  .order-header-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 25px;
    flex-wrap: wrap;
    gap: 15px;
  }

  .order-id-section h1 {
    font-size: 26px;
    font-weight: 800;
    color: #333;
    margin: 0 0 8px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .order-date {
    font-size: 14px;
    color: #888;
  }

  .status-badge {
    padding: 10px 24px;
    border-radius: 30px;
    font-size: 14px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .status-badge.pending {
    background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
    color: #e65100;
    border: 1px solid #ffcc80;
  }

  .status-badge.processing {
    background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
    color: #1565c0;
    border: 1px solid #90caf9;
  }

  .status-badge.shipped {
    background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
    color: #2e7d32;
    border: 1px solid #a5d6a7;
  }

  .status-badge.delivered {
    background: linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%);
    color: #00695c;
    border: 1px solid #80deea;
  }

  .status-badge.cancelled {
    background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
    color: #c62828;
    border: 1px solid #ef9a9a;
  }

  /* ORDER INFO GRID */
  .order-info-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  .info-block {
    background: #fff;
    border: 1px solid #f0f0f0;
    border-radius: 12px;
    padding: 20px;
  }

  .info-block-title {
    font-size: 12px;
    font-weight: 700;
    color: #999;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .info-block-content {
    font-size: 15px;
    color: #333;
    line-height: 1.6;
  }

  .info-block-content strong {
    display: block;
    font-size: 16px;
    margin-bottom: 4px;
  }

  /* PRODUCTS SECTION */
  .products-section {
    background: #fff;
    border-radius: 16px;
    padding: 30px;
    margin-bottom: 25px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  }

  .section-title {
    font-size: 20px;
    font-weight: 800;
    color: #333;
    margin: 0 0 25px;
    padding-bottom: 15px;
    border-bottom: 2px solid #f5f5f5;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .product-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .product-item {
    display: flex;
    gap: 20px;
    padding: 18px;
    background: #fafafa;
    border-radius: 12px;
    border: 1px solid #f0f0f0;
    transition: 0.25s;
  }

  .product-item:hover {
    border-color: #ddd;
    background: #fff;
  }

  .product-image {
    width: 90px;
    height: 90px;
    border-radius: 10px;
    overflow: hidden;
    flex-shrink: 0;
    background: #f0f0f0;
  }

  .product-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .product-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .product-name {
    font-size: 16px;
    font-weight: 700;
    color: #333;
    margin-bottom: 6px;
  }

  .product-meta {
    font-size: 14px;
    color: #888;
  }

  .product-price-section {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    min-width: 140px;
  }

  .product-unit-price {
    font-size: 14px;
    color: #888;
    margin-bottom: 4px;
  }

  .product-total-price {
    font-size: 18px;
    font-weight: 800;
    color: #d32f2f;
  }

  /* SUMMARY SECTION */
  .summary-section {
    background: #fff;
    border-radius: 16px;
    padding: 30px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  }

  .summary-rows {
    max-width: 400px;
    margin-left: auto;
  }

  .summary-row {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    font-size: 15px;
    color: #555;
    border-bottom: 1px dashed #eee;
  }

  .summary-row.discount {
    color: #2e7d32;
  }

  .summary-row.total {
    border-bottom: none;
    border-top: 2px solid #333;
    margin-top: 10px;
    padding-top: 18px;
    font-size: 20px;
    font-weight: 800;
    color: #333;
  }

  .summary-row.total span:last-child {
    color: #d32f2f;
    font-size: 24px;
  }

  /* ACTIONS */
  .order-actions {
    display: flex;
    gap: 15px;
    margin-top: 30px;
    justify-content: flex-end;
  }

  .btn {
    padding: 12px 28px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: 0.25s;
    border: none;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
  }

  .btn-outline {
    background: #fff;
    color: #333;
    border: 2px solid #ddd;
  }

  .btn-outline:hover {
    border-color: #333;
  }

  .btn-primary {
    background: linear-gradient(135deg, #d32f2f 0%, #f44336 100%);
    color: #fff;
    box-shadow: 0 4px 15px rgba(211, 47, 47, 0.3);
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(211, 47, 47, 0.4);
  }

  /* LOADING & ERROR */
  .loading-state, .error-state {
    text-align: center;
    padding: 80px 20px;
    background: #fff;
    border-radius: 16px;
    margin: 40px 0;
  }

  .loading-state {
    font-size: 18px;
    color: #666;
  }

  .error-state {
    color: #d32f2f;
  }

  .error-state h2 {
    margin-bottom: 15px;
  }

  /* RESPONSIVE */
  @media (max-width: 768px) {
    .order-info-grid {
      grid-template-columns: 1fr;
    }

    .product-item {
      flex-direction: column;
      text-align: center;
    }

    .product-image {
      margin: 0 auto;
    }

    .product-price-section {
      align-items: center;
      margin-top: 10px;
    }

    .order-actions {
      flex-direction: column;
    }

    .btn {
      width: 100%;
      justify-content: center;
    }
  }

  /* STEP PROGRESS */
  .step-progress-wrapper {
      margin: 20px 0 40px;
      padding: 0 20px;
  }
  .step-progress-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      max-width: 800px;
      margin: 0 auto;
  }
  
  .step-progress-bar::before {
      content: '';
      position: absolute;
      top: 15px;
      left: 0;
      right: 0;
      height: 4px;
      background: #f0f0f0;
      z-index: 0;
      border-radius: 4px;
  }

  .step-active-line {
      position: absolute;
      top: 15px;
      left: 0;
      height: 4px;
      background: #2e7d32;
      z-index: 0;
      transition: width 0.4s ease;
      border-radius: 4px;
  }

  .step-item {
      position: relative;
      z-index: 1;
      text-align: center;
      width: 25%;
      opacity: 1;
  }

  .step-icon-box {
      width: 34px;
      height: 34px;
      background: #fff;
      border: 4px solid #f0f0f0;
      border-radius: 50%;
      margin: 0 auto 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ccc;
      font-weight: bold;
      font-size: 14px;
      transition: 0.3s;
  }
  
  /* Active / Completed State */
  .step-item.active .step-icon-box,
  .step-item.completed .step-icon-box {
      border-color: #2e7d32;
      background: #2e7d32;
      color: #fff;
      box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.1);
  }
  
  .step-item.current .step-icon-box {
      transform: scale(1.15);
      box-shadow: 0 0 0 5px rgba(46, 125, 50, 0.2);
  }

  .step-label {
      font-size: 13px;
      color: #999;
      font-weight: 600;
      transition: 0.3s;
  }
  
  .step-item.active .step-label,
  .step-item.completed .step-label {
      color: #2e7d32;
      font-weight: 700;
  }

  /* CANCELLED STATE */
  .step-progress-wrapper.cancelled .step-active-line {
      background: #c62828;
  }
  .step-progress-wrapper.cancelled .step-item.active .step-icon-box {
      background: #c62828;
      border-color: #c62828;
  }
  .step-progress-wrapper.cancelled .step-item.active .step-label {
      color: #c62828;
  }
  
  .btn-cancel {
      background: #fff;
      border: 1px solid #c62828;
      color: #c62828;
  }
  .btn-cancel:hover {
      background: #c62828;
      color: #fff;
  }
`;

const CLOUD_NAME = "dpetnxe5v";
const FOLDER = "coffee"; // folder bạn upload trên Cloudinary

const getImg = (photo) => {
  if (!photo) return ""; // để bạn show No Image
  if (photo?.startsWith("http")) return photo; // đã là URL thì dùng luôn
  // photo chỉ là tên file -> ghép thành URL Cloudinary
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${FOLDER}/${encodeURIComponent(photo)}`;
};

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Reload function (có hỗ trợ silent update)
  const fetchOrderDetail = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    setError(null);

    try {
      const [orderRes, itemsRes] = await Promise.all([
        getOrderById(id),
        getOrderItems(id),
      ]);

      setOrder(orderRes.data);
      setItems(itemsRes.data || []);
    } catch (err) {
      console.error("Lỗi tải chi tiết đơn hàng:", err);
      if (!isBackground) setError("Không thể tải thông tin đơn hàng. Vui lòng thử lại.");
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  useEffect(() => {
    // Gọi lần đầu
    fetchOrderDetail();

    // Auto Polling mỗi 2 giây (cập nhật nhanh)
    const intervalId = setInterval(() => {
      fetchOrderDetail(true); // Silent update
    }, 2000);

    return () => clearInterval(intervalId);
  }, [id]);

  // ✅ TIMELINE LOGIC
  const STEPS = [
    { status: "PENDING", label: "Đặt hàng", icon: "📝" },
    { status: "PROCESSING", label: "Đang xử lý", icon: "⚙️" },
    { status: "SHIPPED", label: "Đang giao", icon: "🚚" },
    { status: "DELIVERED", label: "Đã giao", icon: "✅" },
  ];

  const getCurrentStepIndex = (status) => {
    if (!status) return 0;
    if (status === "CANCELLED") return -1;
    const index = STEPS.findIndex(s => s.status === status);
    return index === -1 ? 0 : index;
  };

  const currentStep = getCurrentStepIndex(order?.orderStatus);
  const isCancelled = order?.orderStatus === "CANCELLED";

  // Helper: Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return "---";
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Helper: Get status label
  const getStatusLabel = (status) => {
    const map = {
      // Tiếng Anh từ backend
      "PENDING": "Chờ xác nhận",
      "CONFIRMED": "Đã xác nhận",
      "PROCESSING": "Đang xử lý",
      "PREPARING": "Đang chế biến",
      "SHIPPED": "Đang giao hàng",
      "SHIPPING": "Đang giao hàng",
      "DELIVERED": "Giao thành công",
      "COMPLETED": "Giao thành công",
      "CANCELLED": "Đã hủy",
      "CANCELED": "Đã hủy",

      // Tiếng Việt (nếu có)
      "Chờ xác nhận": "Chờ xác nhận",
      "Đã xác nhận": "Đã xác nhận",
      "Đang xử lý": "Đang xử lý",
      "Đang chế biến": "Đang chế biến",
      "Đang giao": "Đang giao hàng",
      "Đã giao": "Giao thành công",
      "Đã hủy": "Đã hủy"
    };
    return map[status] || status;
  };

  // Helper: Get payment method label
  const getPaymentLabel = (method) => {
    const map = {
      COD: "Thanh toán khi nhận hàng",
      BANK: "Chuyển khoản ngân hàng",
      MOMO: "Ví MoMo",
    };
    return map[method?.toUpperCase()] || method || "Không xác định";
  };

  // Fallback image
  const fallbackImage = (e) => {
    e.target.src = "/no-image.png";
  };

  // Calculate subtotal from items
  const subtotal = items.reduce((sum, item) => {
    return sum + (item.price || 0) * (item.quantity || 1);
  }, 0);

  const discount = order?.discountAmount || 0;
  const shipping = order?.shippingFee || 0;
  const total = order?.totalAmount || subtotal - discount + shipping;

  return (
    <div className="order-detail-wrapper">
      <style>{cssStyles}</style>
      <Header />

      {/* BREADCRUMB */}
      <div className="breadcrumb-section">
        <div className="container breadcrumb">
          <Link to="/">Trang chủ</Link> / <Link to="/profile">Tài khoản</Link> /{" "}
          <span className="current">Chi tiết đơn hàng #{id}</span>
        </div>
      </div>

      <div className="container order-detail-content">
        {loading ? (
          <div className="loading-state">⏳ Đang tải thông tin đơn hàng...</div>
        ) : error ? (
          <div className="error-state">
            <h2>❌ Lỗi</h2>
            <p>{error}</p>
            <button className="btn btn-outline" onClick={() => navigate("/profile")}>
              ← Quay lại
            </button>
          </div>
        ) : (
          <>
            {/* ✅ TIMELINE PROGRESS BAR */}
            {isCancelled ? (
              <div className="step-progress-wrapper cancelled" style={{ textAlign: 'center', marginBottom: 30 }}>
                <div style={{ fontSize: 50, marginBottom: 10 }}>❌</div>
                <h2 style={{ color: '#c62828' }}>Đơn hàng đã hủy</h2>
                <p style={{ color: '#777' }}>Đơn hàng này đã bị hủy và không được thực hiện.</p>
              </div>
            ) : (
              <div className="step-progress-wrapper">
                <div className="step-progress-bar">
                  <div
                    className="step-active-line"
                    style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
                  />
                  {STEPS.map((step, index) => {
                    const isActive = index <= currentStep;
                    const isCurrent = index === currentStep;
                    return (
                      <div key={index} className={`step-item ${isActive ? "active" : ""} ${isCurrent ? "current" : ""}`}>
                        <div className="step-icon-box">{step.icon}</div>
                        <div className="step-label">{step.label}</div>
                        {isCurrent && order?.orderDate && index === 0 && (
                          <div style={{ fontSize: 11, color: '#aaa', marginTop: 4 }}>
                            {new Date(order.orderDate).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ORDER HEADER */}
            <div className="order-header-card">
              <div className="order-header-top">
                <div className="order-id-section">
                  <h1>
                    📦 Đơn hàng #{order.orderId}
                  </h1>
                  <div className="order-date">
                    Đặt ngày: {formatDate(order.orderDate || order.createdAt)}
                  </div>
                </div>
                <span className={`status-badge ${order.orderStatus?.toLowerCase()}`}>
                  {getStatusLabel(order.orderStatus)}
                </span>
              </div>

              {/* INFO GRID */}
              <div className="order-info-grid">
                {/* Người nhận */}
                <div className="info-block">
                  <div className="info-block-title">👤 Người nhận</div>
                  <div className="info-block-content">
                    <strong>{order.customerName || "Không có tên"}</strong>
                    {order.phone && <div>📱 {order.phone}</div>}
                    {order.email && <div>✉️ {order.email}</div>}
                  </div>
                </div>

                {/* Địa chỉ */}
                <div className="info-block">
                  <div className="info-block-title">📍 Địa chỉ giao hàng</div>
                  <div className="info-block-content">
                    {order.address || "Không có địa chỉ"}
                  </div>
                </div>

                {/* Thanh toán */}
                <div className="info-block">
                  <div className="info-block-title">💳 Thanh toán</div>
                  <div className="info-block-content">
                    <strong>{getPaymentLabel(order.paymentMethod)}</strong>
                    <div style={{ color: order.paymentStatus === 'PAID' ? '#2e7d32' : '#e65100' }}>
                      {order.paymentStatus === 'PAID' ? '✅ Đã thanh toán' : '⏳ Chưa thanh toán'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* PRODUCTS */}
            <div className="products-section">
              <h2 className="section-title">🛒 Sản phẩm đã đặt ({items.length})</h2>

              {items.length === 0 ? (
                <div style={{ textAlign: "center", padding: "30px", color: "#999" }}>
                  Không có sản phẩm nào trong đơn hàng.
                </div>
              ) : (
                <div className="product-list">
                  {items.map((item, index) => (
                    <div key={index} className="product-item">
                      <div className="product-image">
                        <img
                          src={getImg(item.productPhoto)}
                          alt={item.productName}
                          onError={fallbackImage}
                        />
                      </div>
                      <div className="product-info">
                        <div className="product-name">{item.productName || "Sản phẩm"}</div>
                        <div className="product-meta">
                          Số lượng: <strong>{item.quantity}</strong>
                          {item.size && <span> | Size: {item.size}</span>}
                        </div>
                      </div>
                      <div className="product-price-section">
                        <div className="product-unit-price">
                          {(item.price || 0).toLocaleString()} đ/sp
                        </div>
                        <div className="product-total-price">
                          {((item.price || 0) * (item.quantity || 1)).toLocaleString()} đ
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SUMMARY */}
            <div className="summary-section">
              <h2 className="section-title">💰 Tổng thanh toán</h2>
              <div className="summary-rows">
                <div className="summary-row">
                  <span>Tạm tính ({items.length} sản phẩm)</span>
                  <span>{subtotal.toLocaleString()} đ</span>
                </div>
                {discount > 0 && (
                  <div className="summary-row discount">
                    <span>Giảm giá</span>
                    <span>-{discount.toLocaleString()} đ</span>
                  </div>
                )}
                <div className="summary-row">
                  <span>Phí vận chuyển</span>
                  <span>{shipping > 0 ? shipping.toLocaleString() + " đ" : "Miễn phí"}</span>
                </div>
                <div className="summary-row total">
                  <span>Tổng cộng</span>
                  <span>{total.toLocaleString()} đ</span>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="order-actions">
                <button className="btn btn-outline" onClick={() => navigate("/profile")}>
                  ← Quay lại
                </button>

                {/* Nút Hủy Đơn (Chỉ hiện khi Pending) */}
                {order.orderStatus === 'PENDING' && (
                  <button className="btn btn-cancel" onClick={() => {
                    if (window.confirm("Bạn muốn hủy đơn hàng này?")) {
                      alert("Đã gửi yêu cầu hủy đơn hàng!");
                      // TODO: Gọi API hủy đơn
                    }
                  }}>
                    ❌ Hủy đơn hàng
                  </button>
                )}

                <Link to="/san-pham" className="btn btn-primary">
                  🛒 Tiếp tục mua sắm
                </Link>
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div >
  );
};

export default OrderDetailPage;
