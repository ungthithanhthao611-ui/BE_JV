import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCategory } from "../../../api/categoryApi";
import AdminLayout from "../../../components/admin/AdminLayout";

export default function CategoryAdd() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", slug: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCategory(form);
      alert("✅ Thêm thành công!");
      navigate("/admin/categories");
    } catch (error) {
      alert("❌ Lỗi thêm danh mục!");
    }
  };

  return (
    <AdminLayout>
      <div style={styles.container}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.header}>
            <h2 style={{ margin: 0, color: "#333", fontSize: "22px" }}>➕ Thêm Danh mục</h2>
            <button type="button" onClick={() => navigate("/admin/categories")} style={styles.btnBack}>
              Quay lại
            </button>
          </div>

          <div style={styles.group}>
            <label style={styles.label}>Tên danh mục</label>
            <input
              name="name"
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Ví dụ: Cà phê"
            />
          </div>

          <div style={styles.group}>
            <label style={styles.label}>Slug (URL)</label>
            <input
              name="slug"
              onChange={handleChange}
              style={styles.input}
              placeholder="Ví dụ: ca-phe"
            />
          </div>

          <button type="submit" style={styles.button}>
            Lưu danh mục
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}

const styles = {
  container: { display: "flex", justifyContent: "center", paddingTop: 40 },
  form: {
    background: "#fff", padding: 30, borderRadius: 12, width: "100%", maxWidth: 500,
    boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
  },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, paddingBottom: 15, borderBottom: "1px solid #eee" },
  group: { marginBottom: 20 },
  label: { display: "block", marginBottom: 8, fontWeight: 600, color: "#555", fontSize: 14 },
  input: {
    width: "100%", padding: "12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14,
    boxSizing: "border-box"
  },
  button: {
    background: "linear-gradient(45deg, #4CAF50, #8BC34A)", color: "#fff", padding: "12px",
    border: "none", borderRadius: 8, cursor: "pointer", width: "100%", fontSize: 16, fontWeight: 600,
    marginTop: 10, boxShadow: "0 4px 12px rgba(76, 175, 80, 0.3)"
  },
  btnBack: {
    background: "transparent", border: "none", color: "#888", cursor: "pointer", fontSize: 14, textDecoration: "underline"
  }
};