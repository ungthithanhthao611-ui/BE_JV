import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCategories, deleteCategory } from "../../../api/categoryApi";
import AdminLayout from "../../../components/admin/AdminLayout";

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    getAllCategories()
      .then((res) => setCategories(res.data))
      .catch((err) => console.error(err));
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn muốn xóa danh mục này?")) {
      await deleteCategory(id);
      loadData();
    }
  };

  return (
    <AdminLayout>
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={{ margin: 0, color: "#333", fontSize: 24 }}>📂 Quản lý Danh mục</h2>
          <button style={styles.btnAdd} onClick={() => navigate("/admin/categories/add")}>
            ➕ Thêm mới
          </button>
        </div>

        <div style={{ overflowX: "auto", borderRadius: 8, border: "1px solid #eee" }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={{ width: 80, textAlign: "center" }}>ID</th>
                <th style={{ textAlign: "left" }}>Tên danh mục</th>
                <th style={{ textAlign: "left" }}>Slug</th>
                <th style={{ width: 120, textAlign: "center" }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: 30, color: "#888" }}>
                    Chưa có danh mục nào.
                  </td>
                </tr>
              ) : (
                categories.map((c) => (
                  <tr key={c.id}>
                    <td style={{ textAlign: "center", color: "#666" }}>#{c.id}</td>
                    <td>
                      <div style={{ fontWeight: 600, color: "#333", fontSize: 15 }}>{c.name}</div>
                    </td>
                    <td style={{ color: "#777" }}>{c.slug || "-"}</td>
                    <td className="center">
                      <div style={styles.actions}>
                        <button style={styles.btnEdit} onClick={() => navigate(`/admin/categories/edit/${c.id}`)}>
                          ✏️
                        </button>
                        <button style={styles.btnDelete} onClick={() => handleDelete(c.id)}>
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CSS */}
      <style>{`
        table { width: 100%; border-collapse: collapse; }
        th { padding: 14px 15px; background: #f8f9fa; border-bottom: 2px solid #e9ecef; color: #495057; font-weight: 600; font-size: 14px; }
        td { padding: 12px 15px; border-bottom: 1px solid #eee; font-size: 14px; vertical-align: middle; }
        tr:hover { background-color: #fafafa; }
      `}</style>
    </AdminLayout>
  );
}

const styles = {
  container: { background: "#fff", padding: 24, borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.03)" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  table: { width: "100%", borderCollapse: "collapse" },
  actions: { display: "flex", justifyContent: "center", gap: 8 },
  btnAdd: {
    background: "linear-gradient(45deg, #2196F3, #21CBF3)", color: "#fff", border: "none",
    padding: "10px 16px", borderRadius: 8, cursor: "pointer", fontWeight: 600,
    boxShadow: "0 2px 6px rgba(33, 150, 243, 0.3)"
  },
  btnEdit: { background: "#e3f2fd", color: "#1976d2", border: "none", padding: "6px 10px", borderRadius: 6, cursor: "pointer" },
  btnDelete: { background: "#ffebee", color: "#c62828", border: "none", padding: "6px 10px", borderRadius: 6, cursor: "pointer" },
};