import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCategoryById, updateCategory } from "../../../api/categoryApi";
import AdminLayout from "../../../components/admin/AdminLayout";

export default function CategoryEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);

  useEffect(() => {
    getCategoryById(id).then((res) => setForm(res.data));
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateCategory(id, form);
      alert("✅ Cập nhật thành công!");
      navigate("/admin/categories");
    } catch (error) {
      alert("❌ Lỗi cập nhật!");
    }
  };

  if (!form) return <AdminLayout><div>Đang tải...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div style={styles.container}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.header}>
            <h2 style={{ margin: 0, color: "#333", fontSize: "22px" }}>✏️ Sửa Danh mục</h2>
            <button type="button" onClick={() => navigate("/admin/categories")} style={styles.btnBack}>
              Quay lại
            </button>
          </div>

          <div style={styles.group}>
            <label style={styles.label}>Tên danh mục</label>
            <input
              name="name"
              value={form.name || ""}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.group}>
            <label style={styles.label}>Slug (URL)</label>
            <input
              name="slug"
              value={form.slug || ""}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.button}>
            Cập nhật thay đổi
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
    background: "linear-gradient(45deg, #2196F3, #21CBF3)", color: "#fff", padding: "12px",
    border: "none", borderRadius: 8, cursor: "pointer", width: "100%", fontSize: 16, fontWeight: 600,
    marginTop: 10, boxShadow: "0 4px 12px rgba(33, 150, 243, 0.3)"
  },
  btnBack: {
    background: "transparent", border: "none", color: "#888", cursor: "pointer", fontSize: 14, textDecoration: "underline"
  }
};