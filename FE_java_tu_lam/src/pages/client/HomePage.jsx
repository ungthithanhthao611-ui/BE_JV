import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ProductCard from "../../components/ProductCard";
import Skeleton from "../../components/Skeleton";
import { getAllProducts } from "../../api/productApi";

// --- CSS STYLE ---
const cssStyles = `
  /* Reset & Base */
  * { box-sizing: border-box; }
  body { margin: 0; font-family: 'Segoe UI', sans-serif; color: #333; background-color: #f9f9f9; }
  a { text-decoration: none; color: inherit; transition: 0.3s; }

  /* --- ANIMATIONS --- */
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .fade-in-page { animation: fadeIn 0.8s ease-out; }
  
  .stagger-item {
    opacity: 0;
    animation: fadeInUp 0.6s ease-out forwards;
  }

  /* --- INTERACTIVE BẢN WEB (HAPTIC-LIKE) --- */
  .btn-white, .btn-outline, .menu-item, .featured-grid > div {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .btn-white:active, .btn-outline:active {
    transform: scale(0.95);
  }

  .menu-item:hover {
    transform: translateX(10px);
    cursor: pointer;
  }
  
  /* Utils */
  .container { max-width: 1200px; margin: 0 auto; padding: 0 15px; }
  
  /* --- HERO SECTION --- */
  .hero { height: 60vh; background-size: cover; background-position: center; position: relative; display: flex; align-items: flex-end; padding-bottom: 50px; color: white; }
  .overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.4); }
  .hero-content { position: relative; z-index: 1; }
  .hero-sub { letter-spacing: 3px; font-size: 18px; text-transform: uppercase; margin-bottom: 10px; }
  .hero-title { font-size: 48px; font-weight: 800; margin: 0; text-transform: uppercase; }

  /* --- BANNER GRID (ƯU ĐÃI) --- */
  .banner-sec { padding: 40px 0; }
  .banner-wrap { display: flex; gap: 20px; }
  .banner-left { flex: 1.2; height: 420px; background-size: cover; border-radius: 12px; position: relative; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
  .banner-right { flex: 0.8; display: flex; flex-direction: column; gap: 20px; height: 420px; }
  .banner-item { flex: 1; background-size: cover; border-radius: 12px; position: relative; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
  
  /* Gradient text nền đen mờ để dễ đọc */
  .banner-text { 
    position: absolute; bottom: 0; left: 0; width: 100%; padding: 25px; 
    background: linear-gradient(transparent, rgba(0,0,0,0.85)); color: white; 
  }
  .banner-tag { 
    background: #d32f2f; color: white; padding: 4px 10px; font-size: 11px; 
    border-radius: 4px; font-weight: bold; text-transform: uppercase; display: inline-block; margin-bottom: 8px;
  }
  .banner-title { font-size: 24px; font-weight: 800; margin: 0 0 5px 0; text-transform: uppercase; }
  .banner-desc { font-size: 14px; opacity: 0.9; margin-bottom: 10px; line-height: 1.4; }
  .btn-white { 
    background: white; color: #333; border: none; padding: 8px 18px; border-radius: 30px; 
    font-size: 13px; font-weight: bold; cursor: pointer; transition: 0.3s; 
  }
  .btn-white:hover { background: #d32f2f; color: white; transform: translateY(-2px); }

  /* --- MENU LIST --- */
  .menu-sec { background: #222; color: white; padding: 60px 0; text-align: center; }
  .section-head h2 { font-size: 36px; margin: 0 0 10px; }
  .section-head p { color: #aaa; margin-bottom: 40px; font-size: 14px; }
  .menu-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; text-align: left; max-width: 1000px; margin: 0 auto; }
  .menu-item { display: flex; gap: 15px; }
  .menu-img { width: 70px; height: 70px; border-radius: 50%; object-fit: cover; border: 2px solid #555; }
  .menu-info h4 { margin: 0; color: #d32f2f; font-size: 16px; }
  .menu-price { font-weight: bold; margin: 4px 0; font-size: 14px; }
  .menu-desc { font-size: 12px; color: #888; }
  .btn-outline { border: 1px solid white; background: transparent; color: white; padding: 10px 30px; border-radius: 25px; margin-top: 40px; cursor: pointer; font-weight: bold; transition: 0.3s; }
  .btn-outline:hover { background: white; color: #333; }

  /* --- SLIDER --- */
  .slider-sec { padding: 60px 0; text-align: center; }
  .slider-row { display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; margin-top: 30px; }

  /* --- PROCESS --- */
  .process-sec { background: #4e4e4e; color: white; padding: 60px 0; position: relative; }
  .process-box { background: #333; padding: 40px; border-radius: 8px; width: 45%; position: relative; z-index: 2; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
  .process-img { position: absolute; top: 0; right: 0; width: 50%; height: 100%; background-size: cover; background-position: center; z-index: 1; }

  /* Mobile */
  @media (max-width: 768px) {
    .banner-wrap { flex-direction: column; height: auto; }
    .banner-left, .banner-right { width: 100%; height: auto; }
    .banner-left { height: 300px; }
    .banner-item { height: 200px; }
    .menu-grid { grid-template-columns: 1fr; }
    .process-box { width: 100%; }
    .process-img { display: none; }
  }
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

const HomePage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllProducts()
      .then((res) => {
        setProducts(res.data);
        setTimeout(() => setLoading(false), 800); // Giả lập load cho mượt
      })
      .catch((err) => {
        console.error("Lỗi load sản phẩm:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="page-wrapper fade-in-page">
      <style>{cssStyles}</style>
      <Header />

      <main>
        {/* HERO */}
        <section className="hero" style={{ backgroundImage: "url('/images/slider_1.webp')" }}>
          <div className="overlay"></div>
          <div className="container hero-content">
            <p className="hero-sub">Hương vị đích thực</p>
            <h1 className="hero-title">Coffee & Tea House</h1>
            <p className="hero-sub" style={{ fontSize: "14px", marginTop: "10px" }}>Since 1980</p>
          </div>
        </section>

        {/* --- KHU VỰC ƯU ĐÃI (BANNER GRID) --- */}
        {/* --- KHU VỰC ƯU ĐÃI (BANNER GRID) --- */}
        <section className="container banner-sec">
          <div className="banner-wrap">

            {/* 1. NOEL */}
            <div className="banner-left" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1512568400610-62da28bc8a13?q=80&w=1000&auto=format&fit=crop')", backgroundPosition: "center" }}>
              <div className="banner-text">
                <span className="banner-tag">🎄 Noel Special</span>
                <h3 className="banner-title">Giáng Sinh Ngọt Ngào</h3>
                <p className="banner-desc">Mua combo 1 Bánh + 1 Nước tặng ngay Túi Canvas Giáng Sinh.</p>
                {/* 👇 SỬA LINK 👇 */}
                <button className="btn-white" onClick={() => navigate('/combo/noel')}>Săn quà ngay</button>
              </div>
            </div>

            <div className="banner-right">
              {/* 2. CUỐI TUẦN */}
              <div className="banner-item" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000')" }}>
                <div className="banner-text">
                  <span className="banner-tag">🔥 Cuối Tuần</span>
                  <h3 className="banner-title">Tiệc Trà Chill</h3>
                  <p className="banner-desc">Mua 3 Ly + 3 Bánh tặng thêm 2 Ly nước.</p>
                  {/* 👇 SỬA LINK 👇 */}
                  <button className="btn-white" onClick={() => navigate('/combo/weekend')}>Đặt Ngay</button>
                </div>
              </div>

              {/* 3. ĐẦU TUẦN */}
              <div className="banner-item" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=1000')" }}>
                <div className="banner-text">
                  <span className="banner-tag">⚡ Đầu Tuần</span>
                  <h3 className="banner-title">Mua 1 Tặng 1</h3>
                  <p className="banner-desc">Áp dụng cho toàn bộ menu Cafe sáng.</p>
                  {/* 👇 SỬA LINK 👇 */}
                  <button className="btn-white" onClick={() => navigate('/combo/weekday')}>Xem Menu</button>
                </div>
              </div>
            </div>

          </div>
        </section>
        {/* MENU LIST */}
        <section className="menu-sec">
          <div className="container">
            <div className="section-head">
              <h2>Khám phá Menu</h2>
              <p>Hương vị mới lạ & độc đáo đang chờ bạn</p>
            </div>

            <div className="menu-grid">
              {loading ? (
                /* SKELETON CHO MENU */
                [1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="menu-item">
                    <Skeleton width="70px" height="70px" borderRadius="50%" />
                    <div className="menu-info" style={{ flex: 1 }}>
                      <Skeleton width="60%" height="20px" style={{ marginBottom: '8px' }} />
                      <Skeleton width="30%" height="15px" style={{ marginBottom: '8px' }} />
                      <Skeleton width="100%" height="12px" />
                    </div>
                  </div>
                ))
              ) : (
                products.slice(0, 6).map((item, index) => (
                  <div key={item.id} className="menu-item stagger-item" style={{ animationDelay: `${index * 0.1}s` }}>
                    <img
                      className="menu-img"
                      src={getImg(item.photo)}
                      alt={item.title}
                      onError={(e) => { e.currentTarget.src = FALLBACK; }}
                    />
                    <div className="menu-info">
                      <h4 title={item.title}>{item.title}</h4>
                      <div className="menu-price">
                        {item.price_root > 0 && item.price_root < item.price
                          ? item.price_root.toLocaleString()
                          : item.price.toLocaleString()} đ
                      </div>
                      <div className="menu-desc">
                        {item.description ? item.description.substring(0, 50) + "..." : "Thơm ngon..."}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <Link to="/san-pham">
              <button className="btn-outline">Xem tất cả Menu</button>
            </Link>
          </div>
        </section>

        {/* SLIDER / FEATURED PRODUCTS */}
        <section className="slider-sec">
          <div className="container">
            <div className="section-head" style={{ color: "#333" }}>
              <h2>Sản phẩm nổi bật</h2>
              <p>Được yêu thích nhất tuần qua</p>
            </div>

            <div className="featured-grid">
              {loading ? (
                /* SKELETON CHO FEATURED */
                [1, 2, 3, 4].map(i => (
                  <div key={i} style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '15px' }}>
                    <Skeleton height="200px" borderRadius="10px" style={{ marginBottom: '15px' }} />
                    <Skeleton width="80%" height="20px" style={{ marginBottom: '10px' }} />
                    <Skeleton width="40%" height="18px" />
                  </div>
                ))
              ) : (
                products.slice(0, 4).map((p, index) => (
                  <div key={p.id} className="stagger-item" style={{ animationDelay: `${(index + 6) * 0.1}s` }}>
                    <ProductCard
                      product={p}
                      onClick={(id) => navigate(`/products/${id}`)}
                    />
                  </div>
                ))
              )}
            </div>

            <style>{`
              .featured-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
                gap: 25px;
                margin-top: 30px;
                justify-content: center;
              }
              @media (max-width: 768px) {
                .featured-grid {
                  grid-template-columns: repeat(2, 1fr);
                  gap: 15px;
                }
              }
            `}</style>
          </div>
        </section>

        {/* PROCESS */}
        <section className="process-sec">
          <div className="process-img" style={{ backgroundImage: "url('/images/sec_quy_trinh_images1.webp')" }}></div>
          <div className="container">
            <div className="process-box">
              <h2 style={{ color: "#d32f2f", margin: "0 0 15px" }}>QUY TRÌNH CHUẨN VỊ</h2>
              <p style={{ lineHeight: "1.6", marginBottom: "25px" }}>
                Từ hạt cà phê thượng hạng đến ly nước thơm lừng trên tay bạn là cả một quy trình kiểm soát nghiêm ngặt.
                Chúng tôi đặt tâm huyết vào từng công đoạn rang xay và pha chế.
              </p>
              <button className="btn-white" style={{ color: "#333" }}>Tìm hiểu thêm</button>
            </div>
          </div>
        </section>

        {/* WHY CHOOSE US */}
        <section className="slider-sec" style={{ background: "white" }}>
          <div className="container">
            <div className="section-head" style={{ color: "#333" }}>
              <h2>Tại sao chọn HaluCafe?</h2>
            </div>
            <div className="menu-grid" style={{ textAlign: "center", display: "flex", justifyContent: "center", gap: 50 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "40px", marginBottom: "10px" }}>🌱</div>
                <h4 style={{ fontWeight: "bold" }}>NGUYÊN CHẤT</h4>
                <p style={{ fontSize: "13px", color: "#666" }}>100% hạt Arabica & Robusta thượng hạng.</p>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "40px", marginBottom: "10px" }}>🥤</div>
                <h4 style={{ fontWeight: "bold" }}>CÔNG THỨC ĐỘC QUYỀN</h4>
                <p style={{ fontSize: "13px", color: "#666" }}>Hương vị đậm đà, khó quên.</p>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "40px", marginBottom: "10px" }}>🍰</div>
                <h4 style={{ fontWeight: "bold" }}>BÁNH TƯƠI MỖI NGÀY</h4>
                <p style={{ fontSize: "13px", color: "#666" }}>Làm mới mỗi sáng, không chất bảo quản.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;