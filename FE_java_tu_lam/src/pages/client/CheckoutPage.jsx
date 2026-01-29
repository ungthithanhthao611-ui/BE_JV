
import React, { useState, useEffect } from "react";
import { checkout } from "../../api/orderApi";
import { getCartByUser } from "../../api/cartApi";
import { getPublicVouchers } from "../../api/voucherApi";
import { getProfile } from "../../api/userApi"; // Import getProfile
import { createMomoPayment } from "../../api/paymentApi"; // Import payment API
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import AddressSelector from "../../components/AddressSelector"; // Import AddressSelector
import { useNavigate, Link } from "react-router-dom";

// --- CSS STYLES ---
const cssStyles = `
  .page-wrapper { font-family: 'Segoe UI', sans-serif; color: #333; background: #fdfdfd; padding-bottom: 80px; }
  .container { max-width: 1200px; margin: 0 auto; padding: 0 15px; }
  .page-header { margin: 40px 0; border-bottom: 1px solid #eee; padding-bottom: 20px; }
  .page-title { font-size: 36px; font-weight: 800; color: #333; margin: 0; text-transform: uppercase; }
  .breadcrumb { font-size: 14px; color: #999; margin-top: 10px; }
  .breadcrumb a { color: #8B4513; text-decoration: none; font-weight: 600; }

  .checkout-layout { display: flex; gap: 50px; align-items: flex-start; }
  .col-left { flex: 1.5; }
  .col-right { flex: 1; position: sticky; top: 100px; }

  .card-box { background: #fff; border-radius: 15px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); margin-bottom: 30px; }
  .section-title { font-size: 22px; font-weight: 800; margin-bottom: 25px; color: #333; border-left: 5px solid #d32f2f; padding-left: 15px; }
  
  .form-group { margin-bottom: 20px; }
  .form-label { display: block; font-weight: 700; font-size: 14px; color: #555; margin-bottom: 8px; }
  .form-control { width: 100%; padding: 12px 15px; border: 1px solid #ddd; border-radius: 8px; outline: none; transition: 0.3s; font-family: inherit; }
  .form-control:focus { border-color: #d32f2f; box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.1); }
  textarea.form-control { min-height: 100px; resize: vertical; }

  /* Order Box */
  .order-list { max-height: 400px; overflow-y: auto; margin-bottom: 20px; padding-right: 10px; }
  .order-item { display: flex; gap: 15px; border-bottom: 1px solid #f5f5f5; padding-bottom: 15px; margin-bottom: 15px; }
  .order-img { width: 65px; height: 65px; object-fit: cover; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
  .order-info { flex: 1; }
  .order-name { font-size: 15px; font-weight: 700; margin-bottom: 4px; color: #333; }
  .order-meta { font-size: 13px; color: #888; margin-bottom: 4px; }
  .order-price { font-weight: 800; color: #d32f2f; }

  /* GIFT ITEM */
  .gift-item { background: #fff9f9; border: 1px solid #ffeded; }
  .gift-tag { background: #d32f2f; color: white; font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight: 700; }

  /* Voucher */
  .voucher-section { margin-top: 20px; }
  .voucher-list { display: flex; flex-direction: column; gap: 10px; margin-top: 15px; }
  .voucher-item { display: flex; align-items: center; gap: 12px; padding: 15px; border: 2px solid #eee; border-radius: 10px; cursor: pointer; transition: 0.3s; position: relative; }
  .voucher-item:hover { border-color: #d32f2f; }
  .voucher-item.selected { border-color: #d32f2f; background: #fff5f5; }
  .voucher-item.disabled { opacity: 0.5; cursor: not-allowed; filter: grayscale(1); }
  .v-icon { font-size: 24px; }
  .v-code { font-weight: 800; color: #d32f2f; font-size: 14px; }
  .v-desc { font-size: 12px; color: #666; margin-top: 2px; }

  /* Prices */
  .prices-box { border-top: 2px dashed #eee; padding-top: 20px; margin-top: 20px; }
  .summary-row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 15px; color: #666; }
  .summary-row.discount { color: #2ecc71; font-weight: 700; }
  .order-total { display: flex; justify-content: space-between; font-size: 22px; font-weight: 900; color: #d32f2f; margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee; }

  /* Payment */
  .payment-options { display: grid; grid-template-columns: 1fr; gap: 12px; margin-top: 20px; }
  .payment-option { 
    display: flex; align-items: center; justify-content: space-between; padding: 18px; 
    border: 2px solid #eee; border-radius: 12px; cursor: pointer; transition: 0.3s; 
  }
  .payment-option:hover { border-color: #d32f2f; }
  .payment-option.selected { border-color: #d32f2f; background: #fff5f5; }
  .payment-left { display: flex; align-items: center; gap: 12px; font-weight: 700; }
  .payment-logo { width: 30px; height: 30px; object-fit: contain; }

  .btn-submit { 
    width: 100%; padding: 20px; background: #333; color: white; border: none; 
    border-radius: 35px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;
    cursor: pointer; transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1); margin-top: 30px;
  }
  .btn-submit:hover { background: #d32f2f; transform: translateY(-5px); box-shadow: 0 10px 20px rgba(211, 47, 47, 0.3); }
  .btn-submit:active { transform: scale(0.95); }

  /* MOBILE RESPONSIVE */
  @media (max-width: 992px) {
    .checkout-layout { flex-direction: column; }
    .col-left, .col-right { width: 100%; }
    .col-right { position: static; }
    .page-title { font-size: 28px; }
  }

  @media (max-width: 576px) {
    .card-box { padding: 20px; }
    .section-title { font-size: 18px; }
    .payment-option { padding: 15px; font-size: 14px; }
  }
`;

import { getImg, FALLBACK, handleImgError } from "../../utils/imageUtils";

export default function CheckoutPage() {
  const navigate = useNavigate();
  // Get userId from session
  const storedUserId = sessionStorage.getItem("userId");

  // Redirect if not logged in
  useEffect(() => {
    if (!storedUserId) {
      navigate("/login");
    }
  }, [storedUserId, navigate]);

  const userId = storedUserId;

  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [giftItem, setGiftItem] = useState(null); // Quà tặng

  // Form State
  // Remove hardcoded email, default to session or empty
  const [email, setEmail] = useState(sessionStorage.getItem("userEmail") || "");
  const [name, setName] = useState(sessionStorage.getItem("userName") || "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");

  // ✅ STATE KIỂM TRA ĐỊA CHỈ CÓ ĐƯỢC HỖ TRỢ KHÔNG
  const [isAddressSupported, setIsAddressSupported] = useState(false);

  // Voucher State
  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  // --- HÀM XỬ LÝ QUÀ TẶNG (Đã đồng bộ logic với Giỏ hàng) ---
  const processCartWithGift = (cartData) => {
    const items = cartData.items || [];

    // 1. Đếm số lượng Combo Noel
    const comboQty = items.reduce((sum, item) => {
      if (item.title.toLowerCase().includes("combo noel")) {
        return sum + item.quantity;
      }
      return sum;
    }, 0);

    // 2. Kiểm tra mua lẻ (Bánh + Nước)
    const hasCake = items.some(i => i.title.toLowerCase().includes("bánh") || i.title.toLowerCase().includes("cake"));
    const hasDrink = items.some(i => i.title.toLowerCase().includes("trà") || i.title.toLowerCase().includes("nước") || i.title.toLowerCase().includes("tea"));
    const looseGift = (hasCake && hasDrink) ? 1 : 0;

    // Tổng số lượng quà
    const totalGifts = comboQty + looseGift;

    if (totalGifts > 0) {
      setGiftItem({
        productId: 55, // ID Túi
        title: "Túi Tote Canvas HaluCafe",
        // ✅ Dùng link ảnh Online để đảm bảo hiển thị đẹp (Fix lỗi ảnh 404)
        photo: "1ff0365d-f781-4229-8d84-5f160345271f_sg-11134201-7rccv-m6km0sqb9dvt59.jpg",
        quantity: totalGifts,
        price: 0,
        isGift: true
      });
    } else {
      setGiftItem(null);
    }
    setCart(cartData);
  };

  // Load Data
  useEffect(() => {
    if (!userId) return;

    // 1. Fetch Cart
    getCartByUser(userId)
      .then((res) => processCartWithGift(res.data))
      .catch((err) => console.error("Lỗi giỏ hàng:", err));

    // 2. Fetch User Profile to Auto-fill (Robust fallback if session is missing email)
    getProfile(userId)
      .then((res) => {
        const u = res.data;
        if (u) {
          // Only fill if local state is empty to avoid overwriting user input
          if (!name) setName(u.fullName || "");
          if (!email) setEmail(u.email || "");
          if (!phone && u.phoneNumber) setPhone(u.phoneNumber); // Assuming backend returns phoneNumber
          if (!address && u.address) setAddress(u.address);
        }
      })
      .catch(err => console.log("Profile load err", err));

    getPublicVouchers()
      .then((res) => setVouchers(res.data))
      .catch((err) => console.error("Lỗi voucher:", err));
  }, [userId]);

  // Auto-select Voucher
  useEffect(() => {
    if (cart.items.length > 0 && vouchers.length > 0 && !selectedVoucher) {
      const eligible = vouchers.filter(v => cart.totalPrice >= v.minOrderAmount);
      if (eligible.length > 0) {
        eligible.sort((a, b) => b.discount - a.discount);
        setSelectedVoucher(eligible[0]);
      }
    }
  }, [cart, vouchers]);

  const handleSelectVoucher = (v) => {
    if (cart.totalPrice >= v.minOrderAmount) {
      if (selectedVoucher?.id === v.id) setSelectedVoucher(null);
      else setSelectedVoucher(v);
    }
  };

  // Tính toán tiền
  const discountAmount = selectedVoucher ? selectedVoucher.discount : 0;
  const finalTotal = Math.max(0, cart.totalPrice - discountAmount);

  // Submit Order
  const handleCheckout = async () => {
    if (!email || !name || !phone || !address) {
      alert("❌ Vui lòng điền đủ thông tin!"); return;
    }
    if (!isAddressSupported) {
      alert("❌ Vui lòng điền đầy đủ thông tin địa chỉ (Tỉnh/Thành, Quận/Huyện, Phường/Xã và Tên đường) trong khu vực TP. Hồ Chí Minh để tiếp tục!");
      return;
    }
    if (cart.items.length === 0) {
      alert("❌ Giỏ hàng trống!"); return;
    }

    // 🎁 GHI CHÚ QUÀ TẶNG
    const giftNote = giftItem ? ` [🎁 KÈM QUÀ TẶNG: ${giftItem.quantity} x Túi Canvas Noel]` : "";
    const finalNote = note + giftNote;

    try {
      // ALWAYS create order in database first (for both COD and MoMo)
      const checkoutResponse = await checkout({
        userId, email, paymentMethod, fullName: name, phone, address,
        note: finalNote,
        voucherCode: selectedVoucher ? selectedVoucher.code : null,
        discountAmount, finalTotal
      });

      // ✅ Lấy orderId từ response
      const dbOrderId = checkoutResponse.data?.orderId || checkoutResponse.data;
      console.log(">>> Order created with ID:", dbOrderId);

      if (paymentMethod === "MOMO") {
        // Generate unique orderId for MoMo (must be unique per transaction)
        const momoOrderId = "ORDER_" + dbOrderId + "_" + Date.now();
        console.log(">>> Generated MoMo Order ID:", momoOrderId);

        // ✅ LƯU MOMO_ORDER_ID VÀO DATABASE
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/orders/${dbOrderId}/momo-order-id`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ momoOrderId })
        });
        console.log(">>> Saved momo_order_id to database");

        // Initiate MoMo Payment
        const res = await createMomoPayment({
          orderId: momoOrderId,
          amount: finalTotal,
          orderInfo: "Thanh toán đơn hàng - " + name + " - " + phone
        });

        if (res.data && res.data.payUrl) {
          // Redirect user to MoMo Payment Page
          window.location.href = res.data.payUrl;
        } else {
          alert("❌ Không thể tạo thanh toán MoMo. Vui lòng thử lại. Đơn hàng đã được tạo với phương thức COD.");
          navigate("/profile");
        }
      } else {
        // COD / Bank transfer
        alert(`✅ Đặt hàng thành công! ${giftItem ? "Bạn đã nhận được quà tặng." : ""}`);
        navigate("/");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("❌ Lỗi thanh toán: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="page-wrapper fade-in-page">
      <style>{cssStyles}</style>
      <Header />

      <div className="container">
        <header className="page-header">
          <h1 className="page-title">Thanh Toán</h1>
          <div className="breadcrumb">
            <Link to="/">Trang chủ</Link> / <Link to="/cart">Giỏ hàng</Link> / <span>Xác nhận đơn hàng</span>
          </div>
        </header>

        <div className="checkout-layout">
          {/* CỘT TRÁI: THÔNG TIN GIAO HÀNG */}
          <div className="col-left">
            <div className="card-box">
              <h2 className="section-title">Thông tin giao hàng</h2>

              <div className="form-group">
                <label className="form-label">Họ và tên người nhận</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="example@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Số điện thoại</label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="09xx xxx xxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ marginTop: '10px' }}>
                <label className="form-label">Địa chỉ chi tiết</label>
                <AddressSelector
                  onAddressChange={(fullAddress, parts, isValid) => {
                    setAddress(fullAddress);
                    setIsAddressSupported(isValid);
                  }}
                  onSupportStatusChange={(isSupported) => {
                    if (!isSupported) {
                      setAddress("");
                      setIsAddressSupported(false);
                    }
                  }}
                />
              </div>

              <div className="form-group" style={{ marginTop: '20px' }}>
                <label className="form-label">Ghi chú cho shipper</label>
                <textarea
                  className="form-control"
                  placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: ĐƠN HÀNG */}
          <div className="col-right">
            <div className="card-box" style={{ position: 'sticky', top: '20px' }}>
              <h2 className="section-title" style={{ border: 'none', padding: 0, marginBottom: 20 }}>Đơn hàng của bạn</h2>

              <div className="order-list">
                {cart.items.map((item) => {
                  const price = item.price - (item.discount || 0);
                  return (
                    <div className="order-item" key={item.productId}>
                      <img
                        src={getImg(item.photo)}
                        alt={item.title}
                        className="order-img"
                        onError={handleImgError}
                      />
                      <div className="order-info">
                        <div className="order-name">{item.title}</div>
                        <div className="order-meta">Số lượng: {item.quantity}</div>
                        <div className="order-price">{(price * item.quantity).toLocaleString()} đ</div>
                      </div>
                    </div>
                  );
                })}

                {giftItem && (
                  <div className="order-item gift-item">
                    <img
                      src={getImg(giftItem.photo)}
                      alt={giftItem.title}
                      className="order-img"
                      onError={handleImgError}
                      style={{ borderRadius: '50%' }}
                    />
                    <div className="order-info">
                      <div className="order-name" style={{ color: '#d32f2f' }}>
                        <span className="gift-tag">Quà tặng</span> {giftItem.title}
                      </div>
                      <div className="order-meta">Số lượng: {giftItem.quantity}</div>
                      <div className="order-price">0 đ</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="prices-box">
                <div className="summary-row">
                  <span>Tạm tính</span>
                  <span>{cart.totalPrice.toLocaleString()} đ</span>
                </div>
                {selectedVoucher && (
                  <div className="summary-row discount">
                    <span>Giảm giá (Voucher)</span>
                    <span>- {discountAmount.toLocaleString()} đ</span>
                  </div>
                )}
                <div className="summary-row">
                  <span>Phí vận chuyển</span>
                  <span style={{ color: '#2ecc71', fontWeight: 700 }}>Miễn phí</span>
                </div>
                <div className="order-total">
                  <span>Tổng tiền</span>
                  <span>{finalTotal.toLocaleString()} đ</span>
                </div>
              </div>

              <div className="voucher-section">
                <div style={{ fontWeight: 800, fontSize: 13, textTransform: 'uppercase', color: '#888', marginBottom: 10 }}>Ưu đãi dành cho bạn</div>
                <div className="voucher-list" style={{ maxHeight: 200, overflowY: 'auto' }}>
                  {vouchers.map(v => {
                    const isEligible = cart.totalPrice >= v.minOrderAmount;
                    const isSelected = selectedVoucher?.id === v.id;
                    return (
                      <div
                        key={v.id}
                        className={`voucher-item ${isSelected ? 'selected' : ''} ${!isEligible ? 'disabled' : ''}`}
                        onClick={() => isEligible && handleSelectVoucher(v)}
                      >
                        <div style={{ flex: 1 }}>
                          <div className="v-code">{v.code}</div>
                          <div className="v-desc">Giảm {v.discount.toLocaleString()}đ</div>
                          {!isEligible && <div style={{ fontSize: 10, color: '#f5222d' }}>Thiếu {(v.minOrderAmount - cart.totalPrice).toLocaleString()}đ</div>}
                        </div>
                        {isSelected && <span style={{ color: '#d32f2f' }}>✅</span>}
                      </div>
                    )
                  })}
                </div>
              </div>

              <button className="btn-submit" onClick={handleCheckout}>
                Xác nhận đặt hàng
              </button>

              <p style={{ fontSize: 11, textAlign: 'center', color: '#aaa', marginTop: 20, lineHeight: 1.5 }}>
                Nhấn "Đặt hàng" đồng nghĩa với việc bạn đồng ý tuân thủ <Link to="/terms" style={{ color: '#8B4513' }}>Điều khoản HaluCafe</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}