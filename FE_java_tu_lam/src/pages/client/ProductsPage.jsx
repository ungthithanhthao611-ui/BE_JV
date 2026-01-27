import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ProductCard from "../../components/ProductCard";
import { Link, useNavigate } from "react-router-dom";
import { getAllProducts } from "../../api/productApi";
import { getAllCategories } from "../../api/categoryApi";

/* ================= CSS STYLE ================= */
const cssStyles = `
  .page-wrapper { font-family: 'Segoe UI', sans-serif; color: #333; background-color: #f9f9f9; }
  .container { max-width: 1200px; margin: 0 auto; padding: 0 15px; }
  a { text-decoration: none; color: inherit; transition: 0.3s; }
  ul { list-style: none; padding: 0; margin: 0; }

  .breadcrumb { background: #f0f0f0; padding: 15px 0; margin-bottom: 30px; font-size: 14px; color: #666; }
  .breadcrumb a:hover { color: #d32f2f; }
  .breadcrumb .current { color: #d32f2f; font-weight: bold; margin-left: 5px; }

  .products-layout { display: flex; gap: 40px; align-items: flex-start; padding-bottom: 60px; }
  .sidebar { width: 25%; }
  .main-content { width: 75%; }

  .sidebar-title {
    font-size: 16px; font-weight: 800; text-transform: uppercase;
    border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 20px;
    position: relative;
  }
  .sidebar-title::after {
    content: ''; position: absolute; bottom: -2px; left: 0;
    width: 60px; height: 2px; background: #d32f2f;
  }

  .category-list li { border-bottom: 1px dashed #eee; }
  
  .cat-btn {
    display: block; width: 100%; text-align: left;
    padding: 12px 0; color: #555; background: none; border: none;
    font-size: 15px; cursor: pointer; transition: 0.3s;
  }
  .cat-btn:hover, .cat-btn.active { 
    color: #d32f2f; padding-left: 8px; font-weight: 600; 
  }

  .products-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px;
  }
  .no-product {
    grid-column: 1 / -1; text-align: center; padding: 50px; color: #999;
    background: #fff; border-radius: 8px;
  }

  @media (max-width: 992px) { .products-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 768px) { .products-layout { flex-direction: column; } .sidebar, .main-content { width: 100%; } }
`;

const ProductsPage = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // State lưu id danh mục đang chọn (null = Tất cả)
  const [activeCatId, setActiveCatId] = useState(null);

  // Lấy userId
  const userId = sessionStorage.getItem("userId");

  // 1. Load danh sách danh mục (Chạy 1 lần đầu tiên)
  useEffect(() => {
    getAllCategories()
      .then(res => setCategories(res.data))
      .catch(err => console.error("Lỗi categories:", err));
  }, []);

  // 2. Load sản phẩm (Chạy lại mỗi khi activeCatId thay đổi)
  useEffect(() => {
    // Gọi API lấy sản phẩm, truyền thêm activeCatId để lọc
    getAllProducts(activeCatId)
      .then(res => setProducts(res.data))
      .catch(err => console.error("Lỗi products:", err));
  }, [activeCatId]);

  // Xử lý click: Cart hoặc Detail (Favorite tự ProductCard lo)
  const handleProductClick = async (productId, action) => {
    if (action === "cart") {
      if (!userId) {
        alert("Vui lòng đăng nhập để mua hàng!");
        navigate("/login");
        return;
      }
      // Logic thêm vào giỏ
      try {
        navigate(`/products/${productId}`);
      } catch (e) {
        console.error(e);
      }
    } else if (action === "favorite_click_only") {
      // Không làm gì cả, ProductCard đã handle toggle
    } else {
      // Mặc định click vào card navigate detail
      navigate(`/products/${productId}`);
    }
  };

  return (
    <div className="page-wrapper">
      <style>{cssStyles}</style>

      <Header />

      <div className="breadcrumb">
        <div className="container">
          <Link to="/">Trang chủ</Link> / <span className="current">Sản phẩm</span>
        </div>
      </div>

      <div className="container products-layout">
        <aside className="sidebar">
          <div className="sidebar-box">
            <h3 className="sidebar-title">DANH MỤC</h3>
            <ul className="category-list">
              {/* Nút "Tất cả sản phẩm" */}
              <li>
                <button
                  className={`cat-btn ${activeCatId === null ? 'active' : ''}`}
                  onClick={() => setActiveCatId(null)}
                >
                  Tất cả sản phẩm
                </button>
              </li>

              {/* Danh sách danh mục từ API */}
              {categories.map(cat => (
                <li key={cat.id}>
                  <button
                    className={`cat-btn ${activeCatId === cat.id ? 'active' : ''}`}
                    onClick={() => setActiveCatId(cat.id)}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <main className="main-content">
          <div className="products-grid">
            {products.length > 0 ? (
              products.map(p => (
                <ProductCard
                  key={p.id}
                  product={p} // Không cần truyền isFavorite nữa
                  onClick={handleProductClick}
                />
              ))
            ) : (
              <div className="no-product">
                <p>🚫 Không tìm thấy sản phẩm nào.</p>
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default ProductsPage;