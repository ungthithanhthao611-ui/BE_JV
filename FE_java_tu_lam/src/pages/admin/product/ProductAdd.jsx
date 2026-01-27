import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../../api/productApi";
import { getAllCategories } from "../../../api/categoryApi";
import AdminLayout from "../../../components/admin/AdminLayout";

export default function ProductAdd() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    price: "",
    price_root: "",
    qty: 0,
    categoryId: "",
  });

  useEffect(() => {
    getAllCategories()
      .then((res) => setCategories(res.data))
      .catch((err) => console.log("Lỗi load danh mục:", err));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("slug", form.slug);
    formData.append("description", form.description);

    // Logic: price là giá bán, price_root là giá gốc
    formData.append("price", form.price);
    formData.append("price_root", form.price_root || 0);

    formData.append("qty", form.qty);
    formData.append("categoryId", form.categoryId);

    if (selectedFile) {
      formData.append("image", selectedFile);
    } else {
      alert("Vui lòng chọn ảnh!");
      return;
    }

    try {
      await createProduct(formData);
      alert("✅ Thêm sản phẩm thành công!");
      navigate("/admin/products");
    } catch (error) {
      console.error(error);
      alert("❌ Lỗi: Không thể thêm sản phẩm");
    }
  };

  return (
    <AdminLayout>
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={{ margin: 0, color: "#333", fontSize: "24px" }}>➕ Thêm sản phẩm mới</h2>
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
                onChange={handleChange}
                style={styles.input}
                placeholder="ten-san-pham"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Mô tả chi tiết</label>
              <textarea
                name="description"
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
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="0"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Giá bán (Thực tế)</label>
                  <input
                    name="price"
                    type="number"
                    onChange={handleChange}
                    style={{ ...styles.input, borderColor: "#4CAF50" }}
                    required
                    placeholder="0"
                  />
                </div>
              </div>

              <div style={styles.row}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Số lượng</label>
                  <input
                    name="qty"
                    type="number"
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="0"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Danh mục</label>
                  <select
                    name="categoryId"
                    onChange={handleChange}
                    required
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
                <label style={styles.label}>Chọn ảnh sản phẩm</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={styles.input}
                />
              </div>
              {/* Preview Image */}
              {preview && (
                <div style={{ marginTop: 10, textAlign: "center", padding: 10, border: "1px dashed #ccc", borderRadius: 8 }}>
                  <img
                    src={preview}
                    alt="Preview"
                    style={{ maxHeight: 150, maxWidth: "100%", objectFit: "contain" }}
                  />
                </div>
              )}
            </div>

            <button type="submit" style={styles.btnSave}>
              ➕ Tạo sản phẩm
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

const styles = {
  container: { maxWidth: 1100, margin: "0 auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  formGrid: { display: "grid", gridTemplateColumns: "2fr 1.2fr", gap: 24 },
  card: { background: "#fff", padding: 24, borderRadius: 12, boxShadow: "0 2px 10px rgba(0,0,0,0.03)" },
  cardTitle: { margin: "0 0 20px 0", fontSize: 16, fontWeight: 600, color: "#555", borderBottom: "1px solid #eee", paddingBottom: 10 },
  formGroup: { marginBottom: 16, width: "100%" },
  label: { display: "block", marginBottom: 8, fontWeight: 500, color: "#444", fontSize: 14 },
  input: {
    width: "100%", padding: "10px 12px", borderRadius: 6, border: "1px solid #ddd", fontSize: 14,
    boxSizing: "border-box" // Quan trọng
  },
  row: { display: "flex", gap: 15 },
  btnBack: { padding: "8px 16px", borderRadius: 6, border: "1px solid #ddd", background: "#fff", cursor: "pointer", color: "#555", fontWeight: 500 },
  btnSave: {
    width: "100%", padding: "14px", background: "linear-gradient(45deg, #4CAF50, #8BC34A)",
    color: "#fff", border: "none", borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: "pointer",
    boxShadow: "0 4px 12px rgba(76, 175, 80, 0.3)", marginTop: 10
  }
};