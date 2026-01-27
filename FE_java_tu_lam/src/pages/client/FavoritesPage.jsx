import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ProductCard from "../../components/ProductCard";
import { getFavorites, removeFavorite } from "../../api/favoriteApi";
import { addToCart } from "../../api/cartApi";

const FavoritesPage = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy userId từ sessionStorage
  const userId = sessionStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    const loadFavorites = async () => {
      try {
        const res = await getFavorites(userId);
        // Map thêm isFavorite = true để hiển thị tim đỏ
        const products = res.data.map(p => ({ ...p, isFavorite: true }));
        setFavorites(products);
      } catch (error) {
        console.error("Lỗi tải danh sách yêu thích:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [userId, navigate]);

  // Xử lý click trên ProductCard
  const handleProductClick = async (productId, action) => {
    if (action === "cart") {
      // Thêm vào giỏ hàng
      try {
        await addToCart({
          userId: userId,
          productId: productId,
          quantity: 1,
          // Mặc định size M hoặc size đầu tiên nếu có, ở đây tạm để trống nếu BE tự handle hoặc fix cứng
          size: "M"
        });
        alert("Đã thêm vào giỏ hàng!");
      } catch (e) {
        console.error(e);
        alert("Lỗi thêm vào giỏ hàng: " + (e.response?.data || e.message));
      }
    } else if (action === "favorite") {
      // Bỏ yêu thích
      try {
        await removeFavorite(userId, productId);
        setFavorites(prev => prev.filter(p => p.id !== productId));
        // Có thể hiện thông báo nhỏ (toast) nếu muốn
      } catch (error) {
        console.error("Lỗi xóa yêu thích:", error);
      }
    } else {
      // Mặc định: click vào card -> xem chi tiết
      navigate(`/products/${productId}`);
    }
  };

  return (
    <div className="page-wrapper">
      <Header />

      <main className="favorites-page">
        <div className="container">
          <div className="page-header">
            <Link to="/profile" className="back-link">
              ← Quay lại trang cá nhân
            </Link>
            <h1 className="page-title">Sản phẩm yêu thích ❤️</h1>
          </div>

          {loading ? (
            <div className="loading">Đang tải...</div>
          ) : favorites.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💔</div>
              <h3>Danh sách yêu thích trống</h3>
              <p>Bạn chưa thả tim cho sản phẩm nào.</p>
              <Link to="/san-pham" className="btn-explore">
                Khám phá ngay
              </Link>
            </div>
          ) : (
            <div className="product-grid">
              {favorites.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={handleProductClick}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />

      <style>{`
        .page-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .favorites-page {
          flex: 1;
          background: #f9f9f9;
          padding: 40px 0;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .page-header {
          margin-bottom: 30px;
        }

        .page-title {
          font-size: 28px;
          color: #333;
          margin-top: 10px;
        }

        .back-link {
          color: #666;
          text-decoration: none;
          font-weight: 500;
        }

        .back-link:hover {
          color: #d32f2f;
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 20px;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .empty-icon {
          font-size: 60px;
          margin-bottom: 20px;
        }

        .empty-state h3 {
          font-size: 20px;
          color: #333;
          margin: 0 0 10px;
        }

        .empty-state p {
          color: #666;
          margin-bottom: 20px;
        }

        .btn-explore {
          display: inline-block;
          padding: 10px 24px;
          background: #d32f2f;
          color: white;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 600;
          transition: 0.2s;
        }

        .btn-explore:hover {
          background: #b71c1c;
        }

        .loading {
          text-align: center;
          padding: 40px;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default FavoritesPage;
