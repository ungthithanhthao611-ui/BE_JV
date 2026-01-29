import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getProductById, getAllProducts } from "../../api/productApi";
import { addToCart } from "../../api/cartApi";
import { getPublicVouchers } from "../../api/voucherApi";
import ProductCard from "../../components/ProductCard";
import Skeleton from "../../components/Skeleton";
import { useFavorites } from "../../hooks/useFavorites";
import { toast } from "../../components/ToastContainer";

/* ================= CSS STYLES ================= */
const cssStyles = `
  .page-wrapper { font-family: 'Segoe UI', sans-serif; color: #333; background-color: #fdfdfd; }
  .container { max-width: 1200px; margin: 0 auto; padding: 0 15px; }
  a { text-decoration: none; color: inherit; transition: 0.3s; }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .fade-in-page { animation: fadeIn 0.7s ease-in-out; }
  
  .skeleton-group { padding: 30px; display: flex; gap: 50px; background: #fff; border-radius: 12px; }

  /* Breadcrumb */
  .breadcrumb-sec { background: #fff; padding: 15px 0; margin-bottom: 30px; border-bottom: 1px solid #eee; }
  .breadcrumb { font-size: 14px; color: #666; }
  .breadcrumb a:hover { color: #d32f2f; }
  .breadcrumb .current { font-weight: bold; color: #333; margin-left: 5px; }

  /* Layout chính */
  .product-detail-wrap { padding-bottom: 60px; }
  .product-main-grid {
    display: flex;
    gap: 50px;
    margin-bottom: 30px;
    background: #fff;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
    align-items: flex-start;
  }
  
  /* Cột ảnh */
  /* Cột ảnh */
  .product-gallery { width: 45%; overflow: hidden; border-radius: 10px; border: 1px solid #f0f0f0; }
  .product-gallery img { width: 100%; height: 100%; object-fit: cover; aspect-ratio: 1/1; transition: transform 0.6s ease; cursor: zoom-in; }
  .product-gallery:hover img { transform: scale(1.15); }

  /* Cột thông tin */
  .product-info {
    width: 55%;
    display: flex;
    flex-direction: column; /* ✅ FIX: CSS đúng */
  }
  .product-title { font-size: 32px; font-weight: 800; margin-bottom: 10px; color: #2c3e50; line-height: 1.2; }
  .product-meta { font-size: 14px; color: #777; margin-bottom: 18px; padding-bottom: 18px; border-bottom: 1px solid #eee; }
  .product-meta span { color: #20c997; font-weight: 700; }

  /* Giá */
  .product-price-box { margin-bottom: 18px; display: flex; align-items: baseline; gap: 14px; flex-wrap: wrap; }
  .price-new { font-size: 34px; color: #d32f2f; font-weight: 900; }
  .price-old { font-size: 18px; color: #999; text-decoration: line-through; }

  .product-desc-short { font-size: 16px; line-height: 1.6; color: #555; margin-bottom: 22px; }

  /* Actions (Quantity + Button) */
  .action-area { display: flex; align-items: center; gap: 18px; margin-bottom: 18px; flex-wrap: wrap; }
  .quantity-box { display: flex; align-items: center; border: 1px solid #ddd; border-radius: 10px; overflow: hidden; height: 50px; }
  .qty-btn { width: 45px; height: 100%; border: none; background: #f8f9fa; cursor: pointer; font-size: 20px; color: #555; transition: 0.2s; }
  .qty-btn:hover { background: #e9ecef; }
  .qty-input { width: 60px; height: 100%; border: none; text-align: center; font-weight: 800; font-size: 18px; color: #333; }

  .add-to-cart-btn {
    flex: 1;
    min-width: 220px;
    background: #d32f2f; color: #fff; border: none;
    height: 50px; border-radius: 10px;
    font-size: 16px; font-weight: 900; cursor: pointer;
    transition: 0.25s; display: flex; align-items: center; justify-content: center; gap: 10px;
    box-shadow: 0 4px 12px rgba(211, 47, 47, 0.3);
  }
  .add-to-cart-btn:hover { background: #b71c1c; transform: translateY(-2px); }
  .add-to-cart-btn:disabled { background: #ccc; cursor: not-allowed; transform: none; box-shadow: none; }

  /* --- TABS --- */
  .product-tabs {
    margin-top: 28px;
    background: #fff;
    padding: 34px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  }

  .tab-headers {
    display: flex;
    gap: 28px;
    border-bottom: 2px solid #f0f0f0;
    margin-bottom: 22px;
    flex-wrap: wrap;
  }

  .tab-btn {
    padding: 10px 0;
    background: transparent;
    border: none;
    font-size: 18px;
    font-weight: 800;
    color: #999;
    cursor: pointer;
    position: relative;
    transition: 0.25s;
    outline: none;
  }
  .tab-btn:hover { color: #d32f2f; }
  .tab-btn.active { color: #d32f2f; }
  .tab-btn.active::after {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 3px;
    background: #d32f2f;
    border-radius: 2px;
  }

  .tab-content { color: #444; line-height: 1.8; font-size: 16px; }
  .detail-list { padding-left: 20px; list-style: disc; margin-bottom: 20px; }
  .detail-list li { margin-bottom: 8px; }

  .policy-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; text-align: center; margin-top: 10px; }
  .policy-item { padding: 24px; background: #f9f9f9; border-radius: 10px; transition: 0.25s; border: 1px solid #f0f0f0; }
  .policy-item:hover { background: #fff0f5; transform: translateY(-4px); }
  .policy-icon { font-size: 32px; margin-bottom: 10px; display: block; }
  .policy-item h4 { font-weight: 900; margin-bottom: 6px; color: #333; }
  
  /* ======= DISCOUNT TAB (VOUCHER) ======= */
  .discount-wrap { margin-top: 8px; }
  .discount-title {
    display: flex; align-items: center; gap: 10px;
    font-weight: 900; color: #333; font-size: 18px;
    margin-bottom: 14px;
  }
  .discount-sub {
    color: #666; font-size: 14px; margin-bottom: 14px;
  }

  .voucher-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 14px;
  }

  .voucher-card {
    background: #fff;
    border: 1px solid #eaeaea;
    border-radius: 10px;
    display: flex;
    align-items: stretch;
    overflow: hidden;
    position: relative;
    box-shadow: 0 2px 10px rgba(0,0,0,0.04);
    transition: 0.2s;
  }
  .voucher-card:hover { transform: translateY(-2px); border-color: #ffd2d2; }

  .voucher-card::before {
    content: "";
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 6px;
    background: #d32f2f;
  }
  .voucher-card::after {
    content: "";
    position: absolute;
    left: 4px; top: 0; bottom: 0;
    width: 4px;
    background-image: radial-gradient(circle at 0 4px, transparent 0, transparent 2px, #fff 3px);
    background-size: 4px 8px;
    background-repeat: repeat-y;
  }

  .voucher-content { flex: 1; padding: 14px 12px 14px 20px; min-width: 0; }
  .voucher-code { font-weight: 1000; color: #d32f2f; font-size: 16px; margin-bottom: 6px; letter-spacing: 0.5px; }
  .voucher-desc { font-size: 13px; color: #555; line-height: 1.35; }

  .btn-copy {
    margin: 12px;
    align-self: center;
    background: #fff;
    color: #d32f2f;
    border: 1px solid #d32f2f;
    border-radius: 10px;
    padding: 10px 14px;
    font-size: 13px;
    font-weight: 900;
    cursor: pointer;
    transition: 0.2s;
    min-width: 84px;
    height: fit-content;
  }
  .btn-copy:hover { background: #fff5f5; }

  .btn-copy.saved {
    background: #20c997;
    color: #fff;
    border-color: #20c997;
    cursor: default;
    opacity: 0.9;
  }

  /* Responsive */
  @media (max-width: 980px) {
    .product-main-grid { flex-direction: column; gap: 18px; }
    .product-gallery, .product-info { width: 100%; }
    .policy-grid { grid-template-columns: 1fr; }
    .product-tabs { padding: 22px; }
  }

  /* ======= RELATED PRODUCTS SECTION ======= */
  .related-products-section {
    margin-top: 40px;
    padding: 40px;
    background: linear-gradient(135deg, #fff 0%, #fafafa 100%);
    border-radius: 16px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.06);
  }

  .related-section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 28px;
    flex-wrap: wrap;
    gap: 12px;
  }

  .related-section-title {
    font-size: 26px;
    font-weight: 900;
    color: #2c3e50;
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 0;
  }

  .related-section-title::before {
    content: "";
    width: 5px;
    height: 32px;
    background: linear-gradient(180deg, #d32f2f 0%, #ff6b6b 100%);
    border-radius: 3px;
  }

  .view-all-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: transparent;
    color: #d32f2f;
    border: 2px solid #d32f2f;
    padding: 10px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: 0.3s;
    text-decoration: none;
  }

  .view-all-btn:hover {
    background: #d32f2f;
    color: #fff;
    transform: translateX(4px);
  }

  .related-products-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
  }

  .related-product-card {
    background: #fff;
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 3px 12px rgba(0,0,0,0.08);
    transition: 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    position: relative;
    border: 1px solid #f0f0f0;
  }

  .related-product-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 32px rgba(211, 47, 47, 0.18);
    border-color: #ffcdd2;
  }

  .related-product-image {
    position: relative;
    width: 100%;
    padding-top: 100%;
    overflow: hidden;
  }

  .related-product-image img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: 0.4s;
  }

  .related-product-card:hover .related-product-image img {
    transform: scale(1.08);
  }

  .related-sale-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    background: linear-gradient(135deg, #d32f2f 0%, #ff5252 100%);
    color: #fff;
    padding: 5px 10px;
    font-size: 12px;
    font-weight: 800;
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(211, 47, 47, 0.3);
    z-index: 2;
  }

  .related-product-content {
    padding: 16px;
    text-align: center;
  }

  .related-product-name {
    font-size: 15px;
    font-weight: 700;
    color: #333;
    margin: 0 0 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: 0.2s;
  }

  .related-product-card:hover .related-product-name {
    color: #d32f2f;
  }

  .related-price-box {
    display: flex;
    justify-content: center;
    align-items: baseline;
    gap: 10px;
    flex-wrap: wrap;
  }

  .related-new-price {
    font-size: 17px;
    font-weight: 900;
    color: #d32f2f;
  }

  .related-old-price {
    font-size: 13px;
    color: #aaa;
    text-decoration: line-through;
  }

  .quick-add-btn {
    margin-top: 12px;
    width: 100%;
    background: linear-gradient(135deg, #fff 0%, #fff5f5 100%);
    color: #d32f2f;
    border: 2px solid #d32f2f;
    padding: 10px 0;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 800;
    cursor: pointer;
    transition: 0.25s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  .quick-add-btn:hover {
    background: linear-gradient(135deg, #d32f2f 0%, #e53935 100%);
    color: #fff;
  }

  .no-related-products {
    text-align: center;
    padding: 40px 20px;
    color: #888;
    font-size: 16px;
    background: #f9f9f9;
    border-radius: 12px;
    border: 1px dashed #ddd;
  }

  @media (max-width: 1024px) {
    .related-products-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media (max-width: 768px) {
    .related-products-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }
    .related-products-section {
      padding: 24px;
    }
    .related-section-title {
      font-size: 22px;
    }
  }

  @media (max-width: 480px) {
    .related-products-grid {
      grid-template-columns: 1fr;
    }
  }
`;

import { getImg, FALLBACK, handleImgError } from "../../utils/imageUtils";

/* ================= COMPONENT ================= */
const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("userId");
  const { checkIsFavorite, toggleFavorite } = useFavorites();

  const [product, setProduct] = useState(null);
  const [vouchers, setVouchers] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form states
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");
  const [note, setNote] = useState("");

  const SIZES = [
    { id: "S", label: "Nhỏ (S)", extra: 0 },
    { id: "M", label: "Vừa (M)", extra: 6000 },
    { id: "L", label: "Lớn (L)", extra: 10000 },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setError(null);

    Promise.all([getProductById(id), getPublicVouchers(), getAllProducts()])
      .then(([productRes, voucherRes, allProductsRes]) => {
        setProduct(productRes.data);
        setVouchers(voucherRes.data || []);

        // Mock related products
        const all = allProductsRes.data || [];
        setRelatedProducts(all.filter((p) => p.id !== parseInt(id)).slice(0, 4));
      })
      .catch((err) => {
        console.error("Lỗi:", err);
        setError("Không tìm thấy sản phẩm hoặc lỗi kết nối.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="page-wrapper">
        <Header />
        <div className="container" style={{ padding: "100px 0" }}>
          <Skeleton height={400} />
          <div style={{ marginTop: 20 }}>
            <Skeleton count={3} />
          </div>
        </div>
        <Footer />
      </div>
    );

  if (error)
    return (
      <div className="page-wrapper">
        <Header />
        <div className="container" style={{ textAlign: "center", padding: "100px 0" }}>
          <h2 style={{ fontSize: 40 }}>🚫</h2>
          <h3>{error}</h3>
          <Link to="/" style={{ color: "#d32f2f", fontWeight: "bold" }}>
            ← Quay lại trang chủ
          </Link>
        </div>
        <Footer />
      </div>
    );

  const discountedPrice = product.price_root || product.price;
  const sizeExtra = SIZES.find((s) => s.id === selectedSize)?.extra || 0;
  const totalPrice = (product.price + sizeExtra) * quantity;

  const handleAddToCart = async () => {
    if (!userId) {
      alert("Bạn cần đăng nhập để mua hàng.");
      navigate("/login");
      return;
    }

    try {
      await addToCart({
        userId,
        productId: product.id,
        quantity,
        size: selectedSize,
        note,
      });
      window.dispatchEvent(new Event("cart_updated"));

      // ✅ NEW TOAST ANIMATION
      toast.success("Thêm vào giỏ thành công!", `Bạn đã thêm ${quantity} x ${product.title} vào giỏ hàng.`);

    } catch (err) {
      toast.error("Thất bại", "Không thể thêm vào giỏ hàng. Vui lòng thử lại!");
    }
  };

  // ✅ HÀM LƯU MÃ (Cập nhật state để đổi nút)
  const handleSaveVoucher = (voucherId, code) => {
    navigator.clipboard.writeText(code);
    setSavedVouchers((prev) => ({ ...prev, [voucherId]: true }));
  };

  if (loading) return (
    <div className="page-wrapper fade-in-page">
      <style>{cssStyles}</style>
      <Header />
      <div className="container" style={{ marginTop: '50px' }}>
        <div className="skeleton-group">
          <div style={{ width: '45%' }}>
            <Skeleton height="450px" borderRadius="10px" />
          </div>
          <div style={{ width: '55%' }}>
            <Skeleton width="80%" height="40px" style={{ marginBottom: '20px' }} />
            <Skeleton width="40%" height="20px" style={{ marginBottom: '30px' }} />
            <Skeleton width="50%" height="50px" style={{ marginBottom: '20px' }} />
            <Skeleton height="100px" style={{ marginBottom: '30px' }} />
            <div style={{ display: 'flex', gap: '20px' }}>
              <Skeleton width="150px" height="50px" borderRadius="10px" />
              <Skeleton width="250px" height="50px" borderRadius="10px" />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
  if (!product) return <div style={{ padding: 100, textAlign: "center" }}>❌ Không tìm thấy sản phẩm</div>;

  const hasSale = product.price_root > 0 && product.price_root < product.price;

  // Check Tim cho sản phẩm chính
  const isMainProductFavorite = product ? checkIsFavorite(product.id) : false;

  return (
    <div className="page-wrapper fade-in-page">
      <style>{cssStyles}</style>
      <Header />

      {/* Breadcrumb */}
      <div className="breadcrumb-sec">
        <div className="container breadcrumb">
          <Link to="/">Trang chủ</Link> / <Link to="/san-pham">Sản phẩm</Link> /{" "}
          <span className="current">{product.title}</span>
        </div>
      </div>

      <div className="container product-detail-wrap">
        <div className="product-main-grid">
          {/* 1. ẢNH */}
          <div className="product-gallery">
            <img
              src={getImg(product.photo)}
              alt={product.title}
              onError={handleImgError}
            />
          </div>

          {/* 2. THÔNG TIN */}
          <div className="product-info">
            <h1 className="product-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {product.title}
              <button
                onClick={() => toggleFavorite(product.id)}
                style={{
                  border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '28px',
                  transition: 'transform 0.2s', padding: 0
                }}
                title={isMainProductFavorite ? "Bỏ yêu thích" : "Yêu thích"}
                onMouseEnter={e => e.target.style.transform = 'scale(1.1)'}
                onMouseLeave={e => e.target.style.transform = 'scale(1)'}
              >
                {isMainProductFavorite ? "❤️" : "🤍"}
              </button>
            </h1>

            <div className="product-meta">
              Thương hiệu: <span>TeaShop</span> &nbsp;|&nbsp; Tình trạng:{" "}
              <span>{product.qty > 0 ? "Còn hàng" : "Hết hàng"}</span>
            </div>

            <div className="product-price-box">
              {hasSale ? (
                <>
                  <span className="price-new">{product.price_root.toLocaleString()} đ</span>
                  <span className="price-old">{product.price.toLocaleString()} đ</span>
                </>
              ) : (
                <span className="price-new">{product.price.toLocaleString()} đ</span>
              )}
            </div>

            <p className="product-desc-short">{product.description}</p>

            {/* ACTION AREA (SỐ LƯỢNG + MUA) */}
            <div className="action-area">
              <div className="quantity-box">
                <button className="qty-btn" onClick={handleDecrease}>-</button>
                <input className="qty-input" value={quantity} readOnly />
                <button className="qty-btn" onClick={handleIncrease}>+</button>
              </div>

              <button className="add-to-cart-btn" onClick={handleAddToCart} disabled={product.qty <= 0}>
                🛒 Thêm vào giỏ hàng
              </button>
            </div>

            {/* ✅ ĐÃ BỎ VOUCHER KHỎI CỘT NÀY (DỜI XUỐNG TAB "GIẢM GIÁ") */}
          </div>
        </div>

        {/* 3. TABS CHI TIẾT */}
        <div className="product-tabs">
          {/* theo pattern role tablist/tab/tabpanel (W3C/MDN) :contentReference[oaicite:1]{index=1} */}
          <div className="tab-headers" role="tablist" aria-label="Chi tiết sản phẩm">
            <button
              id="tab-info"
              role="tab"
              aria-selected={activeTab === "info"}
              className={`tab-btn ${activeTab === "info" ? "active" : ""}`}
              onClick={() => setActiveTab("info")}
              type="button"
            >
              Thông tin chi tiết
            </button>

            <button
              id="tab-policy"
              role="tab"
              aria-selected={activeTab === "policy"}
              className={`tab-btn ${activeTab === "policy" ? "active" : ""}`}
              onClick={() => setActiveTab("policy")}
              type="button"
            >
              Chính sách & Bảo hành
            </button>

            {/* ✅ TAB MỚI: GIẢM GIÁ */}
            <button
              id="tab-discount"
              role="tab"
              aria-selected={activeTab === "discount"}
              className={`tab-btn ${activeTab === "discount" ? "active" : ""}`}
              onClick={() => setActiveTab("discount")}
              type="button"
            >
              Giảm giá
            </button>
          </div>

          <div className="tab-content">
            {activeTab === "info" && (
              <div role="tabpanel" aria-labelledby="tab-info">
                <p><strong>✨ Mô tả sản phẩm:</strong></p>
                <p style={{ marginBottom: 20 }}>{product.description}</p>

                <p><strong>🌿 Thành phần nguyên liệu:</strong></p>
                <ul className="detail-list">
                  <li>Nguyên liệu tự nhiên 100%, được tuyển chọn kỹ càng.</li>
                  <li>Không sử dụng chất bảo quản, đảm bảo an toàn sức khỏe.</li>
                  <li>Hương vị đậm đà, chuẩn công thức độc quyền từ TeaShop.</li>
                </ul>

                <p><strong>❄️ Hướng dẫn sử dụng & Bảo quản:</strong></p>
                <ul className="detail-list">
                  <li>Dùng ngon nhất ngay sau khi mở nắp/bao bì.</li>
                  <li>Nếu dùng kèm đá, hãy cho lượng đá vừa đủ để giữ trọn vị.</li>
                  <li>Bảo quản nơi khô ráo, thoáng mát hoặc trong ngăn mát tủ lạnh (đối với bánh/trà sữa).</li>
                </ul>
              </div>
            )}

            {activeTab === "policy" && (
              <div className="policy-grid" role="tabpanel" aria-labelledby="tab-policy">
                <div className="policy-item">
                  <span className="policy-icon">🚀</span>
                  <h4>Giao hàng siêu tốc</h4>
                  <p style={{ fontSize: 14 }}>Nhận hàng trong 1-2h nội thành.</p>
                </div>
                <div className="policy-item">
                  <span className="policy-icon">🔄</span>
                  <h4>Đổi trả miễn phí</h4>
                  <p style={{ fontSize: 14 }}>Trong vòng 24h nếu sản phẩm bị lỗi.</p>
                </div>
                <div className="policy-item">
                  <span className="policy-icon">🛡️</span>
                  <h4>Cam kết chất lượng</h4>
                  <p style={{ fontSize: 14 }}>Hoàn tiền 100% nếu không hài lòng.</p>
                </div>
              </div>
            )}

            {/* ✅ TAB GIẢM GIÁ: đưa voucher xuống đây */}
            {activeTab === "discount" && (
              <div className="discount-wrap" role="tabpanel" aria-labelledby="tab-discount">
                <div className="discount-title">🎁 Giảm giá / Mã voucher</div>
                <div className="discount-sub">
                  Nhấn <b>Lưu</b> để copy mã. Mã đã lưu sẽ đổi trạng thái.
                </div>

                {vouchers.length === 0 ? (
                  <div style={{ padding: 14, background: "#fff7fb", border: "1px solid #ffe4ec", borderRadius: 12, fontWeight: 700 }}>
                    Hiện chưa có mã giảm giá.
                  </div>
                ) : (
                  <div className="voucher-list">
                    {vouchers.map((v) => {
                      const isSaved = savedVouchers[v.id];
                      return (
                        <div key={v.id} className="voucher-card">
                          <div className="voucher-content">
                            <div className="voucher-code">{v.code}</div>
                            <div className="voucher-desc">
                              Giảm {v.discount / 1000}k cho đơn từ {v.minOrderAmount / 1000}k
                            </div>
                          </div>

                          <button
                            className={`btn-copy ${isSaved ? "saved" : ""}`}
                            onClick={() => handleSaveVoucher(v.id, v.code)}
                            disabled={isSaved}
                          >
                            {isSaved ? "Đã lưu" : "Lưu"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ======= SECTION: SẢN PHẨM LIÊN QUAN ======= */}
        <div className="related-products-section">
          <div className="related-section-header">
            <h2 className="related-section-title">Sản phẩm liên quan</h2>
            <Link to="/san-pham" className="view-all-btn">
              Xem tất cả
              <span>→</span>
            </Link>
          </div>

          {loadingRelated ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#888" }}>
              ⏳ Đang tải sản phẩm liên quan...
            </div>
          ) : relatedProducts.length === 0 ? (
            <div className="no-related-products">
              🔍 Không có sản phẩm liên quan nào trong danh mục này.
            </div>
          ) : (
            <div className="related-products-grid">
              {/* Thay thế custom card bằng ProductCard để có tính năng Tim */}
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onClick={(id, action) => {
                    if (action === "cart") {
                      // chuyển hướng đến trang cart (nhưng vì lack options size, nên navigate detail)
                      navigate(`/products/${id}`);
                    } else if (action === "favorite_click_only") {
                      // ignore
                    } else {
                      navigate(`/products/${id}`);
                    }
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetailPage;
