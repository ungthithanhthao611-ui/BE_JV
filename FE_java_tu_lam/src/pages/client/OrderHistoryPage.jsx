import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { getOrders, getCancelledOrders } from "../../api/orderApi";

const OrderHistoryPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderFilter, setOrderFilter] = useState("all");

  // ✅ STATE CHO MODAL HỦY ĐƠN
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelOtherReason, setCancelOtherReason] = useState("");
  const [cancellingOrder, setCancellingOrder] = useState(false);

  // ✅ DANH SÁCH LÝ DO HỦY
  const CANCEL_REASONS = [
    "Muốn thay đổi địa chỉ giao hàng",
    "Muốn thêm/thay đổi mã giảm giá",
    "Thủ tục thanh toán rắc rối",
    "Tìm thấy chỗ mua rẻ hơn",
    "Đổi ý, không muốn mua nữa",
    "Đặt nhầm sản phẩm",
    "Khác"
  ];

  // ✅ ORDER TABS CONFIGURATION
  const ORDER_TABS = [
    { id: "all", label: "Tất cả", icon: "📦" },
    { id: "pending", label: "Chờ xác nhận", icon: "⏳" },
    { id: "processing", label: "Đang xử lý", icon: "🔄" },
    { id: "shipping", label: "Đang giao", icon: "🚚" },
    { id: "completed", label: "Đã giao", icon: "✅" },
    { id: "cancelled", label: "Đã hủy", icon: "❌" },
  ];

  // ✅ LOAD ORDERS
  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    if (!userId) {
      navigate("/login");
      return;
    }

    const fetchOrdersData = async () => {
      try {
        const [resOrders, resCancelled] = await Promise.all([
          getOrders(userId),
          getCancelledOrders(userId)
        ]);

        const allOrders = [...(resOrders.data || []), ...(resCancelled.data || [])];
        const uniqueOrders = allOrders.filter((order, index, self) =>
          index === self.findIndex((o) => o.orderId === order.orderId)
        );
        setOrders(uniqueOrders);

        // Debug log
        if (uniqueOrders.length > 0) {
          console.log("📦 DEBUG - First order status:", uniqueOrders[0].orderStatus);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersData();

    // ✅ Auto Polling mỗi 2 giây
    const intervalId = setInterval(() => {
      const userId = sessionStorage.getItem("userId");
      if (userId) {
        Promise.all([getOrders(userId), getCancelledOrders(userId)])
          .then(([resOrders, resCancelled]) => {
            const allOrders = [...(resOrders.data || []), ...(resCancelled.data || [])];
            const uniqueOrders = allOrders.filter((order, index, self) =>
              index === self.findIndex((o) => o.orderId === order.orderId)
            );
            setOrders(uniqueOrders);
          })
          .catch(err => console.error(err));
      }
    }, 2000);

    return () => clearInterval(intervalId);
  }, [navigate]);

  // ✅ FILTER & COUNT LOGIC
  const tabStatusMapping = {
    pending: ["pending", "chờ xác nhận"],
    processing: ["confirmed", "processing", "preparing", "đã xác nhận", "đang xử lý", "đang chế biến"],
    shipping: ["shipping", "shipped", "đang giao", "đang giao hàng"],
    completed: ["completed", "delivered", "đã giao", "giao thành công"],
    cancelled: ["cancelled", "canceled", "đã hủy"],
  };

  const getFilteredOrders = () => {
    if (orderFilter === "all") return orders;

    const validStatuses = tabStatusMapping[orderFilter] || [];
    return orders.filter((order) => {
      const status = (order.orderStatus || "").trim().toLowerCase();
      return validStatuses.includes(status);
    });
  };

  const getOrderCount = (tabId) => {
    if (tabId === "all") return orders.length;
    const validStatuses = tabStatusMapping[tabId] || [];
    return orders.filter((order) => {
      const status = (order.orderStatus || "").trim().toLowerCase();
      return validStatuses.includes(status);
    }).length;
  };

  const filteredOrders = getFilteredOrders();

  // ✅ GET STATUS LABEL IN VIETNAMESE
  const getStatusLabel = (status) => {
    const map = {
      pending: "Chờ xác nhận",
      confirmed: "Đã xác nhận",
      processing: "Đang xử lý",
      preparing: "Đang chế biến",
      shipping: "Đang giao hàng",
      shipped: "Đang giao hàng",
      completed: "Giao thành công",
      delivered: "Giao thành công",
      cancelled: "Đã hủy",
      canceled: "Đã hủy",
    };
    return map[status?.toLowerCase()] || status || "---";
  };

  // ✅ CANCEL ORDER HANDLERS
  const handleCancelOrder = (orderId) => {
    setSelectedOrderId(orderId);
    setCancelReason("");
    setCancelOtherReason("");
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    if (!cancelReason) {
      alert("Vui lòng chọn lý do hủy đơn hàng");
      return;
    }

    if (cancelReason === "Khác" && !cancelOtherReason.trim()) {
      alert("Vui lòng nhập lý do hủy đơn hàng");
      return;
    }

    const finalReason = cancelReason === "Khác" ? cancelOtherReason : cancelReason;

    try {
      setCancellingOrder(true);

      await fetch(`http://localhost:8080/api/orders/${selectedOrderId}/status?status=CANCELLED`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });

      setShowCancelModal(false);

      const userId = sessionStorage.getItem("userId");
      const [resOrders, resCancelled] = await Promise.all([
        getOrders(userId),
        getCancelledOrders(userId)
      ]);

      const allOrders = [...(resOrders.data || []), ...(resCancelled.data || [])];
      const uniqueOrders = allOrders.filter((order, index, self) =>
        index === self.findIndex((o) => o.orderId === order.orderId)
      );
      setOrders(uniqueOrders);

      alert("Đã hủy đơn hàng thành công!");
    } catch (error) {
      console.error("Lỗi khi hủy đơn:", error);
      alert("Không thể hủy đơn hàng. Vui lòng thử lại.");
    } finally {
      setCancellingOrder(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Header />

      <main className="orders-page">
        <div className="orders-container">
          <div className="orders-header">
            <Link to="/profile" className="back-link">
              ← Quay lại trang cá nhân
            </Link>
            <h1 className="page-title">Đơn hàng của tôi</h1>
          </div>

          {/* ORDER STATUS TABS */}
          <div className="order-tabs">
            {ORDER_TABS.map((tab) => {
              const count = getOrderCount(tab.id);
              return (
                <button
                  key={tab.id}
                  className={`order-tab ${orderFilter === tab.id ? "active" : ""}`}
                  onClick={() => setOrderFilter(tab.id)}
                >
                  <span className="order-tab-icon">{tab.icon}</span>
                  <span className="order-tab-label">{tab.label}</span>
                  {count > 0 && (
                    <span className="order-tab-count">{count}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ORDER LIST */}
          {loading ? (
            <div className="loading-state">Đang tải đơn hàng...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <div className="empty-text">
                {orderFilter === "all"
                  ? "Bạn chưa có đơn hàng nào."
                  : `Không có đơn hàng "${ORDER_TABS.find(t => t.id === orderFilter)?.label}".`}
              </div>
            </div>
          ) : (
            <div className="order-list">
              {filteredOrders.map((order) => (
                <div key={order.orderId} className="order-card">
                  <div className="order-header">
                    <div className="order-header-left">
                      <span className="order-id">#{order.orderId}</span>
                      <span className="order-date">
                        {order.orderDate
                          ? new Date(order.orderDate).toLocaleDateString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                          : "---"}
                      </span>
                    </div>
                    <span className={`order-status ${order.orderStatus?.toLowerCase()}`}>
                      {getStatusLabel(order.orderStatus)}
                    </span>
                  </div>

                  <div className="order-body">
                    <div className="order-info-row">
                      <span className="order-label">Người nhận:</span>
                      <span className="order-value">{order.customerName || "---"}</span>
                    </div>
                    <div className="order-info-row">
                      <span className="order-label">Địa chỉ:</span>
                      <span className="order-value order-address">{order.address || "---"}</span>
                    </div>
                    <div className="order-info-row">
                      <span className="order-label">Thanh toán:</span>
                      <span className="order-value">{order.paymentMethod || "COD"}</span>
                    </div>
                  </div>

                  <div className="order-footer">
                    <div className="order-total">
                      <span>Tổng tiền:</span>
                      <span className="price-text">{order.totalAmount?.toLocaleString()} đ</span>
                    </div>
                    <div className="order-actions">
                      <button
                        className="btn-detail"
                        onClick={() => navigate(`/orders/${order.orderId}`)}
                      >
                        Xem chi tiết
                      </button>

                      {/* Nút Hủy đơn - chỉ hiện với đơn Chờ xác nhận */}
                      {order.orderStatus?.toUpperCase() === "PENDING" && (
                        <button
                          className="btn-cancel-order"
                          onClick={() => handleCancelOrder(order.orderId)}
                        >
                          ❌ Hủy đơn hàng
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* MODAL HỦY ĐƠN HÀNG */}
      {showCancelModal && (
        <div className="cancel-modal-overlay" onClick={() => setShowCancelModal(false)}>
          <div className="cancel-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cancel-modal-header">
              <h3>Lý do hủy đơn hàng</h3>
              <button className="close-btn" onClick={() => setShowCancelModal(false)}>✕</button>
            </div>

            <div className="cancel-modal-body">
              <p className="cancel-hint">Vui lòng chọn lý do hủy đơn hàng:</p>

              {CANCEL_REASONS.map((reason, index) => (
                <label key={index} className="cancel-reason-option">
                  <input
                    type="radio"
                    name="cancelReason"
                    value={reason}
                    checked={cancelReason === reason}
                    onChange={(e) => setCancelReason(e.target.value)}
                  />
                  <span>{reason}</span>
                </label>
              ))}

              {cancelReason === "Khác" && (
                <textarea
                  className="cancel-other-input"
                  placeholder="Nhập lý do hủy đơn hàng..."
                  value={cancelOtherReason}
                  onChange={(e) => setCancelOtherReason(e.target.value)}
                  rows={3}
                />
              )}
            </div>

            <div className="cancel-modal-footer">
              <button
                className="btn-modal-cancel"
                onClick={() => setShowCancelModal(false)}
                disabled={cancellingOrder}
              >
                Quay lại
              </button>
              <button
                className="btn-modal-confirm"
                onClick={handleConfirmCancel}
                disabled={cancellingOrder}
              >
                {cancellingOrder ? "Đang xử lý..." : "Xác nhận hủy"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />

      {/* CSS STYLES */}
      <style>{`
        .page-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .orders-page {
          flex: 1;
          background: linear-gradient(135deg, #fef5e7 0%, #fdebd0 100%);
          padding: 40px 20px;
        }

        .orders-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .orders-header {
          margin-bottom: 30px;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #8B4513;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 15px;
          transition: 0.3s;
        }

        .back-link:hover {
          color: #5D2E0C;
          transform: translateX(-4px);
        }

        .page-title {
          font-size: 32px;
          font-weight: 700;
          color: #333;
          margin: 0;
        }

        /* ORDER TABS */
        .order-tabs {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          padding: 20px 0;
          margin-bottom: 30px;
          border-bottom: 2px solid #e0e0e0;
        }

        .order-tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: white;
          border: 2px solid #e0e0e0;
          border-radius: 25px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          color: #666;
          transition: all 0.3s;
          white-space: nowrap;
          position: relative;
        }

        .order-tab:hover {
          border-color: #8B4513;
          background: #fef5e7;
        }

        .order-tab.active {
          background: linear-gradient(135deg, #8B4513, #A0522D);
          color: white;
          border-color: #8B4513;
          box-shadow: 0 4px 12px rgba(139, 69, 19, 0.3);
        }

        .order-tab-count {
          background: #ff4444;
          color: white;
          font-size: 11px;
          padding: 2px 8px;
          border-radius: 10px;
          font-weight: 700;
        }

        .order-tab.active .order-tab-count {
          background: white;
          color: #8B4513;
        }

        /* ORDER LIST */
        .order-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .order-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: 0.3s;
        }

        .order-card:hover {
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          background: #f8f9fa;
          border-bottom: 1px solid #e0e0e0;
        }

        .order-header-left {
          display: flex;
          gap: 15px;
          align-items: center;
        }

        .order-id {
          font-weight: 700;
          color: #8B4513;
          font-size: 16px;
        }

        .order-date {
          color: #666;
          font-size: 14px;
        }

        .order-status {
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
        }

        .order-status.pending { background: #fff3cd; color: #856404; }
        .order-status.confirmed { background: #d1ecf1; color: #0c5460; }
        .order-status.processing { background: #e7d9f5; color: #6610f2; }
        .order-status.shipping { background: #cfe2ff; color: #084298; }
        .order-status.completed { background: #d1e7dd; color: #0f5132; }
        .order-status.cancelled { background: #f8d7da; color: #842029; }

        .order-body {
          padding: 20px;
        }

        .order-info-row {
          display: flex;
          margin-bottom: 12px;
        }

        .order-label {
          width: 120px;
          color: #666;
          font-size: 14px;
        }

        .order-value {
          flex: 1;
          color: #333;
          font-size: 14px;
          font-weight: 500;
        }

        .order-address {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 400px;
        }

        .order-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-top: 1px solid #e0e0e0;
          background: #fafafa;
        }

        .order-total {
          display: flex;
          gap: 10px;
          align-items: center;
          font-size: 14px;
        }

        .price-text {
          font-size: 18px;
          font-weight: 700;
          color: #d32f2f;
        }

        .order-actions {
          display: flex;
          gap: 10px;
        }

        .btn-detail {
          padding: 8px 16px;
          background: linear-gradient(135deg, #8B4513, #A0522D);
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: 0.3s;
        }

        .btn-detail:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(139, 69, 19, 0.3);
        }

        .btn-cancel-order {
          padding: 8px 16px;
          background: #fff;
          border: 1px solid #d32f2f;
          color: #d32f2f;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.3s;
        }

        .btn-cancel-order:hover {
          background: #d32f2f;
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(211, 47, 47, 0.2);
        }

        /* EMPTY & LOADING STATES */
        .empty-state, .loading-state {
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .empty-icon {
          font-size: 64px;
          margin-bottom: 15px;
        }

        .empty-text {
          font-size: 16px;
          font-weight: 500;
          color: #666;
        }

        .loading-state {
          color: #666;
          font-weight: 600;
        }

        /* CANCEL MODAL */
        .cancel-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: fadeIn 0.2s;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .cancel-modal {
          background: white;
          border-radius: 12px;
          width: 90%;
          max-width: 500px;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
          animation: slideUp 0.3s;
        }

        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .cancel-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid #eee;
        }

        .cancel-modal-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 700;
          color: #333;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          color: #999;
          cursor: pointer;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: 0.2s;
        }

        .close-btn:hover {
          background: #f5f5f5;
          color: #333;
        }

        .cancel-modal-body {
          padding: 24px;
        }

        .cancel-hint {
          margin: 0 0 16px;
          font-size: 14px;
          color: #666;
        }

        .cancel-reason-option {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          margin-bottom: 10px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cancel-reason-option:hover {
          border-color: #8B4513;
          background: #fef5f0;
        }

        .cancel-reason-option input[type="radio"] {
          margin-right: 12px;
          cursor: pointer;
          width: 18px;
          height: 18px;
          accent-color: #8B4513;
        }

        .cancel-reason-option span {
          font-size: 14px;
          color: #333;
          flex: 1;
        }

        .cancel-other-input {
          width: 100%;
          margin-top: 12px;
          padding: 12px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          font-size: 14px;
          font-family: inherit;
          resize: vertical;
          transition: 0.2s;
        }

        .cancel-other-input:focus {
          outline: none;
          border-color: #8B4513;
          box-shadow: 0 0 0 3px rgba(139, 69, 19, 0.1);
        }

        .cancel-modal-footer {
          display: flex;
          gap: 12px;
          padding: 16px 24px;
          border-top: 1px solid #eee;
        }

        .btn-modal-cancel,
        .btn-modal-confirm {
          flex: 1;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          border: none;
        }

        .btn-modal-cancel {
          background: #f5f5f5;
          color: #666;
        }

        .btn-modal-cancel:hover {
          background: #e0e0e0;
        }

        .btn-modal-confirm {
          background: #d32f2f;
          color: white;
        }

        .btn-modal-confirm:hover {
          background: #b71c1c;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(211, 47, 47, 0.3);
        }

        .btn-modal-confirm:disabled,
        .btn-modal-cancel:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .page-title {
            font-size: 24px;
          }

          .order-tabs {
            gap: 8px;
          }

          .order-tab {
            padding: 10px 16px;
            font-size: 13px;
          }

          .order-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }

          .order-footer {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
          }

          .order-actions {
            justify-content: center;
          }

          .order-address {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default OrderHistoryPage;
