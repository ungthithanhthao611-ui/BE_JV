import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProducts } from "../../../api/productApi";
import AdminLayout from "../../../components/admin/AdminLayout";

const CLOUD_NAME = "dpetnxe5v";
const FOLDER = "coffee"; // folder bạn upload trên Cloudinary

const getImg = (photo) => {
  if (!photo) return ""; // để bạn show No Image
  if (photo.startsWith("http")) return photo; // đã là URL thì dùng luôn
  // photo chỉ là tên file -> ghép thành URL Cloudinary
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${FOLDER}/${encodeURIComponent(photo)}`;
};

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAllProducts().then((res) => setProducts(res.data));
  }, []);

  return (
    <AdminLayout>
      <div style={styles.container}>
        {/* HEADER */}
        <div style={styles.header}>
          <h2 style={{ margin: 0, color: "#333", fontSize: 24 }}>📦 Quản lý sản phẩm</h2>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              style={styles.btnTrash}
              onClick={() => navigate("/admin/products/delete")}
            >
              🗑️ Thùng rác
            </button>
            <button
              style={styles.btnAdd}
              onClick={() => navigate("/admin/products/add")}
            >
              ➕ Thêm mới
            </button>
          </div>
        </div>

        {/* TABLE WRAPPER (Scrollable) */}
        <div style={{ overflowX: "auto", borderRadius: 8, border: "1px solid #eee" }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={{ width: 60, textAlign: "center" }}>ID</th>
                <th style={{ width: 80, textAlign: "center" }}>Ảnh</th>
                <th style={{ textAlign: "left" }}>Tên sản phẩm</th>
                <th style={{ width: 120, textAlign: "right" }}>Giá bán (VNĐ)</th>
                <th style={{ width: 120, textAlign: "right" }}>Giá gốc (VNĐ)</th>
                <th style={{ width: 80, textAlign: "center" }}>Kho</th>
                <th style={{ width: 120, textAlign: "center" }}>Hành động</th>
              </tr>
            </thead>

            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: 30, color: "#888" }}>
                    Chưa có sản phẩm nào. Hãy thêm mới!
                  </td>
                </tr>
              ) : (
                products.map((p) => {
                  // Logic: price là giá bán thực tế, price_root là giá gốc
                  // Nếu price < price_root => Đang sale
                  const price = p.price || 0;
                  const priceRoot = p.price_root || 0;
                  const isSale = priceRoot > price;
                  const discountPercent = isSale ? Math.round(((priceRoot - price) / priceRoot) * 100) : 0;

                  return (
                    <tr key={p.id}>
                      <td style={{ textAlign: "center", color: "#666" }}>#{p.id}</td>

                      <td style={{ textAlign: "center" }}>
                        <img
                          src={getImg(p.photo)}
                          alt={p.title}
                          style={styles.image}
                          onError={(e) => { e.currentTarget.src = "/no-image.png"; }}
                        />
                      </td>

                      <td>
                        <div style={{ fontWeight: 600, color: "#333" }}>{p.title}</div>
                        <div style={{ fontSize: 12, color: "#999" }}>Slug: {p.slug}</div>
                      </td>

                      {/* Giá bán (Giá thực tế) */}
                      <td style={{ textAlign: "right" }}>
                        <div style={{ fontWeight: "bold", color: isSale ? "#d32f2f" : "#333" }}>
                          {price.toLocaleString()} đ
                        </div>
                        {isSale && (
                          <span style={{ fontSize: 11, background: "#ffebee", color: "#d32f2f", padding: "2px 6px", borderRadius: 4, marginLeft: 5 }}>
                            -{discountPercent}%
                          </span>
                        )}
                      </td>

                      {/* Giá gốc (Giá niêm yết) */}
                      <td style={{ textAlign: "right", color: "#888" }}>
                        {priceRoot > 0 ? (
                          <span style={{ textDecoration: isSale ? "line-through" : "none" }}>
                            {priceRoot.toLocaleString()} đ
                          </span>
                        ) : (
                          <span>-</span>
                        )}
                      </td>


                      <td style={{ textAlign: "center" }}>
                        <span style={{
                          padding: "4px 10px",
                          borderRadius: 12,
                          background: p.qty > 0 ? "#e8f5e9" : "#ffebee",
                          color: p.qty > 0 ? "#2e7d32" : "#c62828",
                          fontSize: 12, fontWeight: 600
                        }}>
                          {p.qty}
                        </span>
                      </td>

                      <td style={{ textAlign: "center" }}>
                        <div style={styles.actions}>
                          <button
                            style={styles.btnEdit}
                            onClick={() => navigate(`/admin/products/edit/${p.id}`)}
                            title="Chỉnh sửa"
                          >
                            ✏️
                          </button>

                          <button
                            style={styles.btnDelete}
                            onClick={() => navigate(`/admin/products/delete/${p.id}`)}
                            title="Xóa tạm"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CSS TABLE HOVER & CUSTOM */}
      <style>{`
        table { width: 100%; border-collapse: collapse; }
        th { padding: 14px 12px; background: #f8f9fa; border-bottom: 2px solid #e9ecef; font-weight: 600; color: #495057; font-size: 14px; }
        td { padding: 12px; border-bottom: 1px solid #eee; vertical-align: middle; font-size: 14px; }
        tr:hover { background-color: #fafafa; }
      `}</style>
    </AdminLayout>
  );
}

const styles = {
  container: {
    background: "#fff",
    padding: 24,
    borderRadius: 12,
    boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  image: {
    width: 48,
    height: 48,
    objectFit: "cover",
    borderRadius: 6,
    border: "1px solid #efefef",
    display: "block",
    margin: "0 auto",
  },

  actions: {
    display: "flex",
    justifyContent: "center",
    gap: 8,
  },

  btnAdd: {
    background: "linear-gradient(45deg, #2196F3, #21CBF3)",
    color: "#fff",
    padding: "10px 16px",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
    boxShadow: "0 2px 6px rgba(33, 150, 243, 0.3)",
    transition: "transform 0.1s",
  },

  btnTrash: {
    background: "#555",
    color: "#fff",
    padding: "10px 16px",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
    marginRight: 8,
  },

  btnEdit: {
    background: "#e3f2fd",
    color: "#1976d2",
    padding: "6px 10px",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    transition: "background 0.2s",
  },

  btnDelete: {
    background: "#ffebee",
    color: "#c62828",
    padding: "6px 10px",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    transition: "background 0.2s",
  },
};