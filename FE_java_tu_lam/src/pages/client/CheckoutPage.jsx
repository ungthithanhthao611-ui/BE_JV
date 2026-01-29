
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
  .page-wrapper { font-family: 'Segoe UI', sans-serif; color: #333; background: #fff; }
  .container { max-width: 1200px; margin: 0 auto; padding: 0 15px; }
  .page-header { display: flex; justify-content: space-between; align-items: center; margin: 20px 0 40px; }
  .page-title { font-size: 32px; font-weight: 300; color: #333; margin: 0; }
  .breadcrumb { font-size: 14px; color: #999; }
  .breadcrumb a { color: #333; text-decoration: none; }

  .checkout-layout { display: flex; gap: 40px; margin-bottom: 60px; }
  .col-left { width: 60%; }
  .col-right { width: 40%; }

  .section-title { font-size: 24px; font-weight: 400; margin-bottom: 25px; color: #333; }
  .form-group { display: flex; align-items: center; margin-bottom: 20px; }
  .form-label { width: 120px; font-weight: 500; font-size: 14px; color: #555; }
  .form-input-wrap { flex: 1; }
  .form-control { width: 100%; padding: 10px 15px; border: 1px solid #ddd; border-radius: 4px; outline: none; }
  textarea.form-control { min-height: 100px; resize: vertical; }

  /* Order Box */
  .order-box { border: 2px solid #f0f0f0; padding: 25px; border-radius: 8px; background: #fafafa; }
  .order-header { font-size: 18px; margin-bottom: 20px; color: #333; font-weight: 700; border-bottom: 1px solid #eee; padding-bottom: 10px; }
  .order-list { max-height: 400px; overflow-y: auto; margin-bottom: 20px; padding-right: 5px; }
  .order-item { display: flex; gap: 15px; border-bottom: 1px dashed #eee; padding-bottom: 15px; margin-bottom: 15px; }
  .order-img { width: 60px; height: 60px; object-fit: cover; border-radius: 4px; border: 1px solid #eee; }
  .order-info { flex: 1; }
  .order-name { font-size: 14px; font-weight: 600; margin-bottom: 5px; }
  .order-meta { font-size: 13px; color: #777; }
  .order-price { font-weight: bold; fontSize: 14px; }

  /* GIFT ITEM STYLE */
  .gift-item { background: #fff5f5; border: 1px solid #ffcccc; padding: 10px; border-radius: 6px; }
  .gift-tag { display: inline-block; border: 1px solid #d32f2f; color: #d32f2f; font-size: 10px; padding: 1px 4px; margin-right: 5px; border-radius: 2px; }
  .gift-badge { font-size: 11px; color: #d32f2f; font-style: italic; }

  /* Voucher */
  .voucher-section { margin: 20px 0; border: 1px solid #eee; background: #fff; border-radius: 6px; padding: 15px; }
  .voucher-head { font-weight: bold; margin-bottom: 10px; display: flex; justify-content: space-between; font-size: 14px; }
  .voucher-list { max-height: 200px; overflow-y: auto; display: flex; flexDirection: column; gap: 10px; }
  .voucher-item { display: flex; align-items: center; gap: 10px; padding: 10px; border: 1px solid #ddd; border-radius: 6px; cursor: pointer; transition: 0.2s; }
  .voucher-item.selected { border-color: #20c997; background: #e6fffa; }
  .voucher-item.disabled { opacity: 0.6; cursor: not-allowed; background: #f9f9f9; }
  .v-code { font-weight: bold; color: #d32f2f; font-size: 13px; }
  .v-desc { font-size: 12px; color: #555; }

  /* Total */
  .summary-row { display: flex; justify-content: space-between; font-size: 15px; margin-bottom: 10px; color: #555; }
  .summary-row.discount { color: #20c997; font-weight: 600; }
  .order-total { display: flex; justify-content: space-between; font-size: 20px; font-weight: 800; margin-top: 20px; color: #d32f2f; border-top: 2px solid #ddd; padding-top: 15px; }

  .payment-section { margin-top: 30px; }
  .payment-option { margin-bottom: 15px; border: 1px solid #eee; padding: 15px; border-radius: 8px; cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: space-between; }
  .payment-option:hover { border-color: #d32f2f; background: #fffdfd; }
  .payment-option.selected { border-color: #d32f2f; background: #fff5f5; }
  
  .payment-left { display: flex; align-items: center; gap: 10px; font-weight: 500; font-size: 15px; }
  .payment-logo { height: 32px; object-fit: contain; }

  .btn-submit { width: 100%; padding: 14px; background: #355e7e; color: white; font-weight: bold; text-transform: uppercase; border: none; border-radius: 6px; cursor: pointer; margin-top: 20px; font-size: 15px; }
  .btn-submit:hover { background: #2c4d68; }
`;

const FALLBACK = "https://res.cloudinary.com/dpetnxe5v/image/upload/v1/coffee/no-image.png";
const CLOUD_NAME = "dpetnxe5v";
const FOLDER = "coffee"; // folder bạn upload trên Cloudinary

const getImg = (photo) => {
  if (!photo) return FALLBACK;
  if (photo.startsWith("http")) return photo; // đã là URL thì dùng luôn
  // photo chỉ là tên file -> ghép thành URL Cloudinary
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${FOLDER}/${encodeURIComponent(photo)}`;
};

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
    <div className="page-wrapper">
      <style>{cssStyles}</style>
      <Header />

      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Thanh Toán</h1>
          <div className="breadcrumb"><Link to="/">Trang chủ</Link> / <span>Thanh toán</span></div>
        </div>

        <div className="checkout-layout">
          {/* CỘT TRÁI: FORM */}
          <div className="col-left">
            <h2 className="section-title">Thông tin giao hàng</h2>
            <div className="form-group">
              <label className="form-label">Họ tên*</label>
              <div className="form-input-wrap"><input className="form-control" value={name} onChange={e => setName(e.target.value)} /></div>
            </div>
            <div className="form-group">
              <label className="form-label">Email*</label>
              <div className="form-input-wrap"><input className="form-control" value={email} onChange={e => setEmail(e.target.value)} /></div>
            </div>
            <div className="form-group">
              <label className="form-label">Điện thoại*</label>
              <div className="form-input-wrap"><input className="form-control" value={phone} onChange={e => setPhone(e.target.value)} /></div>
            </div>

            {/* ✅ PHẦN ĐỊA CHỈ MỚI - CHỌN TỈNH/QUẬN/XÃ */}
            <h3 style={{ fontSize: 18, fontWeight: 600, marginTop: 30, marginBottom: 15, color: '#333' }}>
              📍 Địa chỉ giao hàng
            </h3>
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

            <div className="form-group">
              <label className="form-label">Ghi chú</label>
              <div className="form-input-wrap"><textarea className="form-control" value={note} onChange={e => setNote(e.target.value)} placeholder="Ghi chú cho đơn hàng (VD: Giao giờ hành chính, gọi trước khi giao...)" /></div>
            </div>
          </div>

          {/* CỘT PHẢI: ĐƠN HÀNG */}
          <div className="col-right">
            <div className="order-box">
              <h3 className="order-header">Đơn hàng ({cart.items.length + (giftItem ? 1 : 0)})</h3>

              <div className="order-list">
                {/* 1. Danh sách sản phẩm trong giỏ */}
                {cart.items.map((item) => {
                  const price = item.price - (item.discount || 0);
                  return (
                    <div className="order-item" key={item.productId}>
                      <img
                        src={getImg(item.photo)}
                        alt={item.title}
                        className="order-img"
                        onError={(e) => (e.target.src = FALLBACK)}
                      />
                      <div className="order-info">
                        <div className="order-name">{item.title}</div>
                        <div className="order-meta">x{item.quantity}</div>
                      </div>
                      <div className="order-price">{price.toLocaleString()}đ</div>
                    </div>
                  );
                })}

                {/* 2. Quà tặng (Nếu có) */}
                {giftItem && (
                  <div className="order-item gift-item">
                    {/* Hiển thị ảnh quà tặng từ link online */}
                    <img
                      src={getImg(giftItem.photo)}
                      alt={giftItem.title}
                      className="order-img"
                      onError={(e) => (e.target.src = FALLBACK)}
                      style={{ borderColor: "#d32f2f" }}
                    />

                    <div className="order-info">
                      <div className="order-name" style={{ color: '#d32f2f' }}>
                        <span className="gift-tag">MUA KÈM 0đ</span> {giftItem.title}
                      </div>
                      <div className="gift-badge">[Quà tặng Noel - Không bán]</div>
                      <div className="order-meta">x{giftItem.quantity}</div>
                    </div>
                    <div className="order-price" style={{ color: '#d32f2f' }}>0đ</div>
                  </div>
                )}
              </div>

              {/* Voucher Selector */}
              <div className="voucher-section">
                <div className="voucher-head">
                  <span>🎟️ Mã giảm giá</span>
                  <span style={{ fontSize: 12, color: '#666' }}>{vouchers.length} mã có sẵn</span>
                </div>
                <div className="voucher-list">
                  {vouchers.map(v => {
                    const isEligible = cart.totalPrice >= v.minOrderAmount;
                    const isSelected = selectedVoucher?.id === v.id;
                    return (
                      <div key={v.id} className={`voucher-item ${isSelected ? 'selected' : ''} ${!isEligible ? 'disabled' : ''}`} onClick={() => handleSelectVoucher(v)}>
                        <div className="voucher-left">
                          <div className="v-code">{v.code}</div>
                          <div className="v-desc">Giảm {v.discount.toLocaleString()}đ</div>
                          {!isEligible && <div className="v-reason">Đơn tối thiểu {v.minOrderAmount.toLocaleString()}đ</div>}
                        </div>
                        {isSelected && <span style={{ color: '#20c997', fontWeight: 'bold' }}>✔</span>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tổng tiền */}
              <div className="summary-row"><span>Tạm tính:</span><span>{cart.totalPrice.toLocaleString()} đ</span></div>
              {selectedVoucher && (
                <div className="summary-row discount">
                  <span>Voucher ({selectedVoucher.code}):</span>
                  <span>-{discountAmount.toLocaleString()} đ</span>
                </div>
              )}
              <div className="order-total"><span>Tổng cộng:</span><span>{finalTotal.toLocaleString()} đ</span></div>

              {/* Thanh toán */}
              <div className="payment-section">
                <h4 className="payment-title">Phương thức thanh toán</h4>

                {/* 1. COD */}
                <div
                  className={`payment-option ${paymentMethod === "COD" ? "selected" : ""}`}
                  onClick={() => setPaymentMethod("COD")}
                >
                  <div className="payment-left">
                    <input type="radio" checked={paymentMethod === "COD"} readOnly />
                    <span>Thanh toán khi nhận hàng (COD)</span>
                  </div>
                  <img src="https://cdns.iconmonstr.com/wp-content/releases/preview/2018/240/iconmonstr-delivery-8.png" className="payment-logo" alt="COD" />
                </div>

                {/* 2. BANK */}
                <div
                  className={`payment-option ${paymentMethod === "BANK" ? "selected" : ""}`}
                  onClick={() => setPaymentMethod("BANK")}
                >
                  <div className="payment-left">
                    <input type="radio" checked={paymentMethod === "BANK"} readOnly />
                    <span>Chuyển khoản Ngân hàng</span>
                  </div>
                  <img src="https://img.icons8.com/color/48/bank-transfer.png" className="payment-logo" alt="BANK" />
                </div>

                {/* 3. MOMO - NEW INTEGRATION */}
                <div
                  className={`payment-option ${paymentMethod === "MOMO" ? "selected" : ""}`}
                  onClick={() => setPaymentMethod("MOMO")}
                  style={{ borderColor: paymentMethod === 'MOMO' ? '#a50064' : '#eee', background: paymentMethod === 'MOMO' ? '#fff0f6' : '' }}
                >
                  <div className="payment-left">
                    <input type="radio" checked={paymentMethod === "MOMO"} readOnly />
                    <span style={{ color: '#a50064', fontWeight: 'bold' }}>Thanh toán bằng Ví MoMo</span>
                  </div>
                  <img src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" className="payment-logo" alt="MOMO" />
                </div>

              </div>

              <button
                className="btn-submit"
                onClick={handleCheckout}
              >
                {paymentMethod === "MOMO" ? "THANH TOÁN MOMO" : "HOÀN TẤT ĐƠN HÀNG"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}