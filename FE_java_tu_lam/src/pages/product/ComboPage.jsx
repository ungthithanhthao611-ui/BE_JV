import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ProductCard from "../../components/ProductCard";
import { getAllProducts } from "../../api/productApi";

// ⚙️ CẤU HÌNH: ĐIỀN ID SẢN PHẨM MUỐN HIỂN THỊ VÀO ĐÂY
const COMBO_INFO = {
  "noel": {
    title: "🎄 Giáng Sinh Ngọt Ngào",
    desc: "Mua combo 1 Bánh + 1 Nước bất kỳ được tặng ngay 01 Túi Canvas Noel xinh xắn!",
    bannerImg: "https://images.unsplash.com/photo-1543253687-c599f9e08f87?q=80&w=1000",
    productIds: [49, 50, 51] 
  },
  "weekend": {
    title: "🔥 Tiệc Trà Cuối Tuần",
    desc: "Đi nhóm 3 người? Mua 3 Ly + 3 Bánh sẽ được tặng thêm 2 Ly nước tùy chọn.",
    bannerImg: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000",
    productIds: [52, 53]
  },
  "weekday": {
    title: "⚡ Năng Lượng Đầu Tuần",
    desc: "Mua 1 Tặng 1 áp dụng cho toàn bộ menu Cà phê. Đánh thức sự tỉnh táo!",
    bannerImg: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=1000",
    productIds: [10, 11, 12]
  }
};

const ComboPage = () => {
  const { type } = useParams(); 
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mặc định về noel nếu link sai
  const info = COMBO_INFO[type] || COMBO_INFO["noel"]; 

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);

    getAllProducts()
      .then((res) => {
        const allData = res.data;
        const filtered = allData.filter(p => info.productIds.includes(p.id));
        setProducts(filtered);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [type, info]);

  return (
    <div style={{ fontFamily: "Segoe UI, sans-serif", background: "#f9f9f9", minHeight: "100vh" }}>
      <Header />
      
      {/* BANNER COMBO */}
      <div style={{
        height: "320px", 
        backgroundImage: `url(${info.bannerImg})`, 
        backgroundSize: "cover", 
        backgroundPosition: "center",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        color: "white"
      }}>
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }}></div>
        <div style={{ position: "relative", zIndex: 1, padding: "20px" }}>
          <h1 style={{ fontSize: "42px", fontWeight: "800", margin: "0 0 15px 0", textTransform: "uppercase", textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
            {info.title}
          </h1>
          <p style={{ fontSize: "18px", maxWidth: "700px", margin: "0 auto", lineHeight: "1.6", background: "rgba(0,0,0,0.6)", padding: "10px 20px", borderRadius: "8px" }}>
            {info.desc}
          </p>
        </div>
      </div>

      {/* DANH SÁCH SẢN PHẨM ÁP DỤNG */}
      <div style={{ maxWidth: "1200px", margin: "40px auto", padding: "0 15px" }}>
        <div style={{textAlign: "center", marginBottom: "40px"}}>
          <h2 style={{ color: "#333", fontSize: "28px", marginBottom: "10px" }}>
            Sản phẩm áp dụng ưu đãi
          </h2>
          <div style={{width: "60px", height: "4px", background: "#d32f2f", margin: "0 auto"}}></div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "50px", fontSize: "18px" }}>⏳ Đang tải danh sách sản phẩm...</div>
        ) : (
          <>
            {products.length > 0 ? (
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", 
                gap: "30px" 
              }}>
                {products.map(p => (
                  <ProductCard 
                    key={p.id} 
                    product={p} 
                    // 👇 ĐÃ SỬA: Dùng /products/ thay vì /san-pham/
                    onClick={(id) => navigate(`/products/${id}`)}
                  />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "40px", background: "white", borderRadius: "8px" }}>
                <p style={{fontSize: "18px", color: "#666"}}>⚠️ Chưa có sản phẩm nào trong danh sách ưu đãi này.</p>
                <p>Bạn hãy vào code ComboPage.jsx để cập nhật đúng ID sản phẩm nhé!</p>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ComboPage;