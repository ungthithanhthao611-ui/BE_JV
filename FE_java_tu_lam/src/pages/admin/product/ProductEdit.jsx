import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProductById, updateProduct } from "../../../api/productApi";
import AdminLayout from "../../../components/admin/AdminLayout";
import axios from "axios";

export default function ProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [categories, setCategories] = useState([]);

  // Fetch product & categories
  useEffect(() => {
    getProductById(id).then((res) => setForm(res.data));

    // Load categories để select (nếu cần sau này, hiện tại để input text hoặc select tạm)
    // Tạm thời chưa có API getCategories ở đây nên mình cứ để giả định hoặc bỏ qua
    // Nhưng tốt nhất nên load categories thực
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/categories`).then(res => setCategories(res.data)).catch(err => console.log(err));

  }, [id]);

  if (!form) return <div style={{ padding: 20 }}>Đang tải dữ liệu...</div>;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProduct(id, {
        ...form,
        price: Number(form.price),
        price_root: Number(form.price_root || 0),
        qty: Number(form.qty),
        category_id: Number(form.category_id)
      });
      alert("✅ Cập nhật thành công!");
      navigate("/admin/products");
    } catch (error) {
      console.error(error);
      alert("❌ Cập nhật thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <AdminLayout>
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={{ margin: 0, color: "#333", fontSize: "24px" }}>✏️ Chỉnh sửa sản phẩm</h2>
          <button onClick={() => navigate("/admin/products")} style={styles.btnBack}>
            ← Quay lại
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.formGrid}>
          {/* Cột Trái: Thông tin chung */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Thông tin cơ bản</h3>

            <div style={styles.formGroup}>
              <label style={styles.label}>Tên sản phẩm</label>
              <input
                name="title"
                value={form.title || ""}
                onChange={handleChange}
                style={styles.input}
                placeholder="Nhập tên sản phẩm..."
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Slug (URL)</label>
              <input
                name="slug"
                value={form.slug || ""}
                onChange={handleChange}
                style={styles.input}
                placeholder="ten-san-pham"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Mô tả chi tiết</label>
              <textarea
                name="description"
                value={form.description || ""}
                onChange={handleChange}
                style={{ ...styles.input, height: 120, resize: "vertical" }}
                placeholder="Mô tả về sản phẩm..."
              />
            </div>
          </div>

          {/* Cột Phải: Giá & Kho & Ảnh */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Giá & Kho hàng</h3>

              <div style={styles.row}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Giá gốc (Niêm yết)</label>
                  <input
                    name="price_root"
                    type="number"
                    value={form.price_root || ""}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Giá bán (Thực tế)</label>
                  <input
                    name="price"
                    type="number"
                    value={form.price || ""}
                    onChange={handleChange}
                    style={{ ...styles.input, borderColor: "#2196F3" }} // Highlight giá bán
                    required
                  />
                </div>
              </div>

              <div style={styles.row}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Số lượng tồn kho</label>
                  <input
                    name="qty"
                    type="number"
                    value={form.qty || ""}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Danh mục (ID)</label>
                  <select
                    name="category_id"
                    value={form.category_id || ""}
                    onChange={handleChange}
                    style={styles.input}
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Hình ảnh</h3>
              <div style={styles.formGroup}>
                <label style={styles.label}>Chọn ảnh mới</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    const formData = new FormData();
                    formData.append("file", file);

                    try {
                      // Gọi API upload
                      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/products/upload`, formData, {
                        headers: {
                          "Content-Type": "multipart/form-data",
                        },
                      });
                      // Server trả về tên file
                      setForm({ ...form, photo: res.data });
                    } catch (err) {
                      alert("Lỗi upload ảnh");
                      console.error(err);
                    }
                  }}
                  style={styles.input}
                />
                {/* Input ẩn lưu tên file để submit */}
                <input type="hidden" name="photo" value={form.photo || ""} />
              </div>

              {/* Preview Image */}
              {form.photo && (
                <div style={{ marginTop: 10, textAlign: "center", padding: 10, border: "1px dashed #ccc", borderRadius: 8 }}>
                  <img
                    src={`${import.meta.env.VITE_API_BASE_URL}/images/${form.photo}`}
                    alt="Preview"
                    style={{ maxHeight: 150, maxWidth: "100%", objectFit: "contain" }}
                    onError={(e) => e.target.style.display = 'none'}
                  />
                  <div style={{ fontSize: 12, color: "#888", marginTop: 5 }}>{form.photo}</div>
                </div>
              )}
            </div>

            <button type="submit" style={styles.btnSave}>
              💾 Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

const styles = {
  container: {
    maxWidth: 1100,
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "2fr 1.2fr", // Chia cột 2/1
    gap: 24,
  },
  card: {
    background: "#fff",
    padding: 24,
    borderRadius: 12,
    boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
  },
  cardTitle: {
    margin: "0 0 20px 0",
    fontSize: 16,
    fontWeight: 600,
    color: "#555",
    borderBottom: "1px solid #eee",
    paddingBottom: 10,
  },
  formGroup: {
    marginBottom: 16,
    width: "100%",
  },
  label: {
    display: "block",
    marginBottom: 8,
    fontWeight: 500,
    color: "#444",
    fontSize: 14,
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 6,
    border: "1px solid #ddd",
    fontSize: 14,
    transition: "border-color 0.2s",
    boxSizing: "border-box", // Important for padding
  },
  row: {
    display: "flex",
    gap: 15,
  },
  btnBack: {
    padding: "8px 16px",
    borderRadius: 6,
    border: "1px solid #ddd",
    background: "#fff",
    cursor: "pointer",
    color: "#555",
    fontWeight: 500
  },
  btnSave: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(45deg, #2196F3, #21CBF3)",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(33, 150, 243, 0.3)",
    marginTop: 10,
  }
};