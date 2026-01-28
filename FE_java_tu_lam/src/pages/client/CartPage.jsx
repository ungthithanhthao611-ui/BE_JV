
// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { getCartByUser } from "../../api/cartApi";
// import Header from "../../components/Header";
// import Footer from "../../components/Footer";

// /* ================= CSS ================= */
// const cssStyles = `
// .page-wrapper { background:#f8f9fa; min-height:100vh; font-family:'Segoe UI',sans-serif; }
// .container { max-width:1200px; margin:0 auto; padding:0 15px; }
// .cart-container { padding:30px 0 50px; }
// .page-title { font-size:24px; font-weight:600; border-bottom:2px solid #ddd; padding-bottom:10px; }

// .cart-content { background:#fff; border-radius:8px; box-shadow:0 2px 10px rgba(0,0,0,.05); }
// .cart-table { width:100%; border-collapse:collapse; min-width:700px; }
// .cart-table th { background:#f1f1f1; padding:15px; border-bottom:2px solid #ddd; text-align:left; }
// .cart-table td { padding:15px; border-bottom:1px solid #eee; vertical-align:middle; }

// .product-col { display:flex; align-items:center; gap:15px; }
// .product-col img { width:70px; height:70px; object-fit:cover; border-radius:6px; border:1px solid #eee; }
// .p-name { font-weight:500; color:#333; }

// .total-col { color:#d32f2f; font-weight:bold; }

// /* Nút tăng giảm số lượng */
// .qty-control { display:flex; align-items:center; border:1px solid #ddd; border-radius:4px; width:fit-content; }
// .qty-control button { width:30px; height:30px; background:#f9f9f9; border:none; cursor:pointer; font-weight:bold; transition:0.2s; }
// .qty-control button:hover { background:#e0e0e0; }
// .qty-control input { width:40px; height:30px; border:none; border-left:1px solid #ddd; border-right:1px solid #ddd; text-align:center; outline:none; font-weight:600; }

// .btn-remove { border:1px solid #ff4d4f; color:#ff4d4f; background:#fff; padding:5px 12px; border-radius:4px; cursor:pointer; transition:0.2s; }
// .btn-remove:hover { background:#ff4d4f; color:#fff; }

// /* GIFT */
// .gift-row { background:#fffbfb; border-left:4px solid #d32f2f; }
// .gift-tag { border:1px solid #d32f2f; color:#d32f2f; font-size:11px; padding:2px 6px; margin-right:6px; font-weight:bold; }
// .gift-note { font-size:12px; color:#888; font-style:italic; margin-top:4px; }

// .cart-footer { margin-top:30px; display:flex; justify-content:space-between; gap:20px; flex-wrap:wrap; }
// .right-summary { background:#fff; padding:25px; border-radius:8px; box-shadow:0 2px 10px rgba(0,0,0,.05); max-width:350px; width:100%; }
// .summary-row { display:flex; justify-content:space-between; margin-bottom:12px; }
// .summary-row.total { border-top:1px solid #eee; padding-top:12px; font-weight:bold; }
// .final-price { color:#d32f2f; font-size:22px; }

// .btn-checkout { width:100%; background:#d32f2f; color:#fff; border:none; padding:15px; border-radius:6px; font-weight:bold; cursor:pointer; text-transform:uppercase; transition:0.3s; }
// .btn-checkout:hover { background:#b71c1c; transform:translateY(-2px); }
// `;

// export default function CartPage() {
//   const navigate = useNavigate();
//   const [cart, setCart] = useState({ items: [], totalPrice: 0 });
//   const [giftItem, setGiftItem] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const userId = 1; // Demo user

//   /* ===== LOAD CART ===== */
//   useEffect(() => {
//     getCartByUser(userId)
//       .then(res => {
//         setCart(res.data);
//         checkGiftCondition(res.data.items);
//         setLoading(false);
//       })
//       .catch(() => setLoading(false));
//   }, []);

//   /* ===== XỬ LÝ LOGIC QUÀ TẶNG (SỐ LƯỢNG) ===== */
//   const checkGiftCondition = (items) => {
//     if (!items || items.length === 0) {
//       setGiftItem(null);
//       return;
//     }

//     // 1. Đếm tổng số lượng các sản phẩm là "Combo Noel"
//     // Ví dụ: Mua 2 "Combo Noel 3" + 1 "Combo Noel 1" => Tổng combo = 3
//     const comboQty = items.reduce((sum, item) => {
//       if (item.title.toLowerCase().includes("combo noel")) {
//         return sum + item.quantity;
//       }
//       return sum;
//     }, 0);

//     // 2. Kiểm tra điều kiện mua lẻ (Bánh + Nước) -> Tặng thêm 1 túi
//     const hasCake = items.some(i => 
//       i.title.toLowerCase().includes("bánh") || i.title.toLowerCase().includes("cake")
//     );
//     const hasDrink = items.some(i => 
//       i.title.toLowerCase().includes("trà") || i.title.toLowerCase().includes("nước") || i.title.toLowerCase().includes("tea")
//     );
//     const looseGift = (hasCake && hasDrink) ? 1 : 0;

//     // Tổng số lượng quà tặng
//     const totalGifts = comboQty + looseGift;

//     if (totalGifts > 0) {
//       setGiftItem({
//         productId: 55,
//         title: "Túi Tote Canvas HaluCafe",
//         // Tên file ảnh từ server của bạn
//         photo: "1ff0365d-f781-4229-8d84-5f160345271f_sg-11134201-7rccv-m6km0sqb9dvt59.jpg", 
//         quantity: totalGifts, // 🔥 Số lượng quà tự động cập nhật
//         price: 0
//       });
//     } else {
//       setGiftItem(null);
//     }
//   };

//   /* ===== TĂNG/GIẢM SỐ LƯỢNG ===== */
//   const handleQuantityChange = (productId, newQty) => {
//     if (newQty < 1) return; // Không cho giảm dưới 1

//     // Cập nhật lại mảng items
//     const updatedItems = cart.items.map(item => 
//       item.productId === productId ? { ...item, quantity: newQty } : item
//     );

//     // Tính lại tổng tiền
//     const newTotal = updatedItems.reduce((acc, item) => {
//       const price = item.price - (item.discount || 0);
//       return acc + (price * item.quantity);
//     }, 0);

//     // Cập nhật State
//     setCart({ ...cart, items: updatedItems, totalPrice: newTotal });

//     // Kiểm tra lại quà tặng ngay lập tức
//     checkGiftCondition(updatedItems);
//   };

//   /* ===== XÓA SẢN PHẨM ===== */
//   const handleRemoveItem = (productId) => {
//     if(!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

//     const updatedItems = cart.items.filter(item => item.productId !== productId);

//     const newTotal = updatedItems.reduce((acc, item) => {
//       const price = item.price - (item.discount || 0);
//       return acc + (price * item.quantity);
//     }, 0);

//     setCart({ ...cart, items: updatedItems, totalPrice: newTotal });
//     checkGiftCondition(updatedItems);
//   };

//   if (loading) return <div style={{ padding: 50, textAlign: "center" }}>⏳ Đang tải...</div>;

//   if (!cart.items || cart.items.length === 0) {
//     return (
//       <div className="page-wrapper">
//         <Header />
//         <div className="container" style={{ padding: 100, textAlign: "center" }}>
//           <h3>🛒 Giỏ hàng trống</h3>
//           <Link to="/san-pham" style={{color:'#d32f2f', fontWeight:'bold'}}>⬅ Tiếp tục mua sắm</Link>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   return (
//     <div className="page-wrapper">
//       <style>{cssStyles}</style>
//       <Header />

//       <div className="container cart-container">
//         <h2 className="page-title">🛒 Giỏ Hàng Của Bạn</h2>

//         <div className="cart-content">
//           <table className="cart-table">
//             <thead>
//               <tr>
//                 <th>Sản phẩm</th>
//                 <th>Giá</th>
//                 <th>Số lượng</th>
//                 <th>Thành tiền</th>
//                 <th></th>
//               </tr>
//             </thead>
//             <tbody>
//               {/* DANH SÁCH SẢN PHẨM */}
//               {cart.items.map(item => {
//                 const price = item.price - (item.discount || 0);
//                 return (
//                   <tr key={item.productId}>
//                     <td>
//                       <div className="product-col">
//                         <img
//                           src={`${import.meta.env.VITE_API_BASE_URL}/images/${item.photo}`}
//                           onError={(e) => e.target.src = "https://placehold.co/70"}
//                           alt={item.title}
//                         />
//                         <div className="p-name">{item.title}</div>
//                       </div>
//                     </td>
//                     <td>{price.toLocaleString()} đ</td>
//                     <td>
//                       {/* 🔥 NÚT ĐIỀU CHỈNH SỐ LƯỢNG */}
//                       <div className="qty-control">
//                         <button onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}>-</button>
//                         <input readOnly value={item.quantity} />
//                         <button onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}>+</button>
//                       </div>
//                     </td>
//                     <td className="total-col">{(price * item.quantity).toLocaleString()} đ</td>
//                     <td>
//                       <button className="btn-remove" onClick={() => handleRemoveItem(item.productId)}>Xóa</button>
//                     </td>
//                   </tr>
//                 );
//               })}

//               {/* ===== HIỂN THỊ QUÀ TẶNG (NẾU CÓ) ===== */}
//               {giftItem && (
//                 <tr className="gift-row">
//                   <td>
//                     <div className="product-col">
//                       <img
//                         src={`${import.meta.env.VITE_API_BASE_URL}/images/${giftItem.photo}`}
//                         onError={(e) => e.target.src = "https://placehold.co/70"}
//                         alt={giftItem.title}
//                       />
//                       <div>
//                         <span className="gift-tag">MUA KÈM 0đ</span>
//                         <b>{giftItem.title}</b>
//                         <div className="gift-note">
//                           [Quà tặng Noel - Số lượng theo combo: {giftItem.quantity}]
//                         </div>
//                       </div>
//                     </div>
//                   </td>
//                   <td><s style={{color:'#999'}}>50.000 đ</s> 0 đ</td>
//                   <td>{giftItem.quantity}</td>
//                   <td className="total-col">0 đ</td>
//                   <td></td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         <div className="cart-footer">
//           <Link to="/san-pham" style={{color:'#555', textDecoration:'none'}}>← Tiếp tục mua sắm</Link>

//           <div className="right-summary">
//             <div className="summary-row">
//               <span>Tạm tính:</span>
//               <span>{cart.totalPrice.toLocaleString()} đ</span>
//             </div>
//             <div className="summary-row total">
//               <span>Tổng cộng:</span>
//               <span className="final-price">{cart.totalPrice.toLocaleString()} đ</span>
//             </div>
//             <button className="btn-checkout" onClick={() => navigate("/checkout")}>
//               TIẾN HÀNH THANH TOÁN
//             </button>
//           </div>
//         </div>
//       </div>

//       <Footer />
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// 👇 Import hàm removeCartItem từ API
import { getCartByUser, removeCartItem } from "../../api/cartApi";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Skeleton from "../../components/Skeleton";

/* ================= CSS ================= */
const cssStyles = `
.page-wrapper { background:#f8f9fa; min-height:100vh; font-family:'Segoe UI',sans-serif; }
.container { max-width:1200px; margin:0 auto; padding:0 15px; }
.cart-container { padding:30px 0 50px; }
.page-title { font-size:24px; font-weight:600; border-bottom:2px solid #ddd; padding-bottom:10px; }

.cart-content { background:#fff; border-radius:8px; box-shadow:0 2px 10px rgba(0,0,0,.05); }
.cart-table { width:100%; border-collapse:collapse; min-width:700px; }
.cart-table th { background:#f1f1f1; padding:15px; border-bottom:2px solid #ddd; text-align:left; }
.cart-table td { padding:15px; border-bottom:1px solid #eee; vertical-align:middle; }

.product-col { display:flex; align-items:center; gap:15px; }
.product-col img { width:70px; height:70px; object-fit:cover; border-radius:6px; border:1px solid #eee; }
.p-name { font-weight:500; color:#333; }

.total-col { color:#d32f2f; font-weight:bold; }

/* Nút tăng giảm số lượng */
.qty-control { display:flex; align-items:center; border:1px solid #ddd; border-radius:4px; width:fit-content; }
.qty-control button { width:30px; height:30px; background:#f9f9f9; border:none; cursor:pointer; font-weight:bold; transition:0.2s; }
.qty-control button:hover { background:#e0e0e0; }
.qty-control input { width:40px; height:30px; border:none; border-left:1px solid #ddd; border-right:1px solid #ddd; text-align:center; outline:none; font-weight:600; }

.btn-remove { border:1px solid #ff4d4f; color:#ff4d4f; background:#fff; padding:5px 12px; border-radius:4px; cursor:pointer; transition:0.2s; }
.btn-remove:hover { background:#ff4d4f; color:#fff; }

/* GIFT */
.gift-row { background:#fffbfb; border-left:4px solid #d32f2f; }
.gift-tag { border:1px solid #d32f2f; color:#d32f2f; font-size:11px; padding:2px 6px; margin-right:6px; font-weight:bold; }
.gift-note { font-size:12px; color:#888; font-style:italic; margin-top:4px; }

.cart-footer { margin-top:30px; display:flex; justify-content:space-between; gap:20px; flex-wrap:wrap; }
.right-summary { background:#fff; padding:25px; border-radius:8px; box-shadow:0 2px 10px rgba(0,0,0,.05); max-width:350px; width:100%; }
.summary-row { display:flex; justify-content:space-between; margin-bottom:12px; }
.summary-row.total { border-top:1px solid #eee; padding-top:12px; font-weight:bold; }
.final-price { color:#d32f2f; font-size:22px; }

.btn-checkout { width:100%; background:#d32f2f; color:#fff; border:none; padding:15px; border-radius:6px; font-weight:bold; cursor:pointer; text-transform:uppercase; transition:0.3s; }
.btn-checkout:hover { background:#b71c1c; transform:translateY(-2px); box-shadow: 0 5px 15px rgba(211, 47, 47, 0.4); }
.btn-checkout:active { transform: scale(0.98); }

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fade-in-page { animation: fadeIn 0.6s ease-out; }
.stagger-row { animation: fadeInUp 0.5s ease-out forwards; opacity: 0; }
`;

export default function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [giftItem, setGiftItem] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ===== LOAD CART ===== */
  // Load dữ liệu khi vào trang
  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    if (!userId) {
      // Nếu chưa login thì ko có giỏ hàng (hoặc redirect)
      setLoading(false);
      return;
    }
    loadCartData(userId);
  }, []);

  const loadCartData = (userId) => {
    setLoading(true);
    getCartByUser(userId)
      .then(res => {
        setCart(res.data);
        checkGiftCondition(res.data.items);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  /* ===== XỬ LÝ LOGIC QUÀ TẶNG (SỐ LƯỢNG) ===== */
  const checkGiftCondition = (items) => {
    if (!items || items.length === 0) {
      setGiftItem(null);
      return;
    }

    // 1. Logic Combo Noel: Mua bao nhiêu combo thì tặng bấy nhiêu túi
    // (Duyệt qua từng món, nếu tên có chữ "Combo Noel" thì cộng dồn số lượng)
    const comboQty = items.reduce((sum, item) => {
      if (item.title.toLowerCase().includes("combo noel")) {
        return sum + item.quantity;
      }
      return sum;
    }, 0);

    // 2. Logic Mua Lẻ: Có Bánh + Có Nước => Tặng thêm 1 túi
    const hasCake = items.some(i =>
      i.title.toLowerCase().includes("bánh") || i.title.toLowerCase().includes("cake")
    );
    const hasDrink = items.some(i =>
      i.title.toLowerCase().includes("trà") || i.title.toLowerCase().includes("nước") || i.title.toLowerCase().includes("tea")
    );
    const looseGift = (hasCake && hasDrink) ? 1 : 0;

    // Tổng số lượng quà tặng = (Quà từ Combo) + (Quà từ mua lẻ)
    const totalGifts = comboQty + looseGift;

    if (totalGifts > 0) {
      setGiftItem({
        productId: 55,
        title: "Túi Tote Canvas HaluCafe",
        // Link ảnh online để đảm bảo hiển thị
        photo: "1ff0365d-f781-4229-8d84-5f160345271f_sg-11134201-7rccv-m6km0sqb9dvt59.jpg",
        quantity: totalGifts, // 🔥 Số lượng túi tự động cập nhật
        price: 0
      });
    } else {
      setGiftItem(null);
    }
  };

  /* ===== TĂNG/GIẢM SỐ LƯỢNG ===== */
  const handleQuantityChange = (productId, newQty) => {
    if (newQty < 1) return; // Không cho giảm dưới 1

    // Cập nhật lại mảng items
    const updatedItems = cart.items.map(item =>
      item.productId === productId ? { ...item, quantity: newQty } : item
    );

    // Tính lại tổng tiền
    const newTotal = updatedItems.reduce((acc, item) => {
      const price = item.price - (item.discount || 0);
      return acc + (price * item.quantity);
    }, 0);

    // Cập nhật State
    setCart({ ...cart, items: updatedItems, totalPrice: newTotal });

    // Kiểm tra lại quà tặng ngay lập tức
    checkGiftCondition(updatedItems);
    window.dispatchEvent(new Event("cart_updated"));
  };

  /* ===== XÓA SẢN PHẨM (GỌI API XÓA THẬT) ===== */
  const handleRemoveItem = async (productId) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

    try {
      // 1. Gọi API xóa trong Database (Quan trọng để F5 không bị lại)
      const currentUserId = sessionStorage.getItem("userId");
      await removeCartItem(currentUserId, productId);

      // 2. Nếu xóa thành công, cập nhật giao diện
      const updatedItems = cart.items.filter(item => item.productId !== productId);

      const newTotal = updatedItems.reduce((acc, item) => {
        const price = item.price - (item.discount || 0);
        return acc + (price * item.quantity);
      }, 0);

      setCart({ ...cart, items: updatedItems, totalPrice: newTotal });
      checkGiftCondition(updatedItems);
      window.dispatchEvent(new Event("cart_updated"));

    } catch (error) {
      console.error("Lỗi xóa sản phẩm:", error);
      alert("Có lỗi xảy ra khi xóa sản phẩm.");
      // Nếu lỗi thì load lại giỏ hàng cũ cho đồng bộ
      const currentUserId = sessionStorage.getItem("userId");
      loadCartData(currentUserId);
    }
  };

  if (loading) return (
    <div className="page-wrapper fade-in-page">
      <style>{cssStyles}</style>
      <Header />
      <div className="container cart-container">
        <Skeleton width="300px" height="32px" style={{ marginBottom: '30px' }} />
        <div className="cart-content" style={{ padding: '20px' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
              <Skeleton width="70px" height="70px" borderRadius="8px" />
              <div style={{ flex: 1 }}>
                <Skeleton width="40%" height="20px" style={{ marginBottom: '10px' }} />
                <Skeleton width="20%" height="15px" />
              </div>
              <Skeleton width="100px" height="30px" />
              <Skeleton width="120px" height="30px" />
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="page-wrapper">
        <Header />
        <div className="container" style={{ padding: 100, textAlign: "center" }}>
          <h3>🛒 Giỏ hàng trống</h3>
          <Link to="/san-pham" style={{ color: '#d32f2f', fontWeight: 'bold' }}>⬅ Tiếp tục mua sắm</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page-wrapper fade-in-page">
      <style>{cssStyles}</style>
      <Header />

      <div className="container cart-container">
        <h2 className="page-title">🛒 Giỏ Hàng Của Bạn</h2>

        <div className="cart-content">
          <table className="cart-table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Thành tiền</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {/* DANH SÁCH SẢN PHẨM */}
              {cart.items.map((item, index) => {
                const price = item.price - (item.discount || 0);
                return (
                  <tr key={item.productId} className="stagger-row" style={{ animationDelay: `${index * 0.1}s` }}>
                    <td>
                      <div className="product-col">
                        <img
                          src={item.photo?.startsWith("http") ? item.photo : `${import.meta.env.VITE_API_BASE_URL}/images/${item.photo}`}
                          onError={(e) => e.target.src = "https://placehold.co/70"}
                          alt={item.title}
                        />
                        <div className="p-name">{item.title}</div>
                      </div>
                    </td>
                    <td>{price.toLocaleString()} đ</td>
                    <td>
                      {/* 🔥 NÚT ĐIỀU CHỈNH SỐ LƯỢNG */}
                      <div className="qty-control">
                        <button onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}>-</button>
                        <input readOnly value={item.quantity} />
                        <button onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}>+</button>
                      </div>
                    </td>
                    <td className="total-col">{(price * item.quantity).toLocaleString()} đ</td>
                    <td>
                      {/* Nút Xóa gọi API */}
                      <button className="btn-remove" onClick={() => handleRemoveItem(item.productId)}>Xóa</button>
                    </td>
                  </tr>
                );
              })}

              {/* ===== HIỂN THỊ QUÀ TẶNG (NẾU CÓ) ===== */}
              {giftItem && (
                <tr className="gift-row">
                  <td>
                    <div className="product-col">
                      <img
                        src={giftItem.photo?.startsWith("http") ? giftItem.photo : `${import.meta.env.VITE_API_BASE_URL}/images/${giftItem.photo}`}
                        onError={(e) => e.target.src = "https://placehold.co/70"}
                        alt={giftItem.title}
                      />
                      <div>
                        <span className="gift-tag">MUA KÈM 0đ</span>
                        <b>{giftItem.title}</b>
                        <div className="gift-note">
                          [Quà tặng Noel - Số lượng: {giftItem.quantity}]
                        </div>
                      </div>
                    </div>
                  </td>
                  <td><s style={{ color: '#999' }}>50.000 đ</s> 0 đ</td>
                  <td>{giftItem.quantity}</td>
                  <td className="total-col">0 đ</td>
                  <td></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="cart-footer">
          <Link to="/san-pham" style={{ color: '#555', textDecoration: 'none' }}>← Tiếp tục mua sắm</Link>

          <div className="right-summary">
            <div className="summary-row">
              <span>Tạm tính:</span>
              <span>{cart.totalPrice.toLocaleString()} đ</span>
            </div>
            <div className="summary-row total">
              <span>Tổng cộng:</span>
              <span className="final-price">{cart.totalPrice.toLocaleString()} đ</span>
            </div>
            <button className="btn-checkout" onClick={() => navigate("/checkout")}>
              TIẾN HÀNH THANH TOÁN
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}