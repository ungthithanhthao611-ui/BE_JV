import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  deleteProduct,
  getTrashProducts,
  restoreProduct,
  forceDeleteProduct,
  getProductById,
} from "../../../api/productApi";
import AdminLayout from "../../../components/admin/AdminLayout";

import { getImg, FALLBACK } from "../../../utils/imageUtils";

export default function ProductDelete() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [currentProduct, setCurrentProduct] = useState(null);
  const [trash, setTrash] = useState([]);

  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("");

  // ===== LOAD DATA =====
  useEffect(() => {
    if (id) {
      loadCurrentProduct();
    } else {
      setCurrentProduct(null);
    }
    loadTrash();
  }, [id]);

  const loadCurrentProduct = async () => {
    try {
      const res = await getProductById(id);
      setCurrentProduct(res.data);
    } catch {
      setCurrentProduct(null);
    }
  };

  const loadTrash = async () => {
    const res = await getTrashProducts();
    setTrash(res.data);
  };

  // ===== MESSAGE =====
  const showMessage = (msg, type = "success") => {
    setMessage(msg);
    setMsgType(type);
    setTimeout(() => {
      setMessage("");
      setMsgType("");
    }, 3000);
  };

  // ===== DELETE SOFT =====
  const handleDelete = async () => {
    try {
      await deleteProduct(id);
      setCurrentProduct(null);
      await loadTrash();
      showMessage("🗑️ Xóa sản phẩm thành công");
      navigate("/admin/products/delete");
    } catch {
      showMessage("❌ Xóa sản phẩm thất bại", "error");
    }
  };

  // ===== RESTORE =====
  const handleRestore = async (pid) => {
    try {
      await restoreProduct(pid);
      await loadTrash();
      showMessage("♻️ Khôi phục sản phẩm thành công");
    } catch {
      showMessage("❌ Khôi phục thất bại", "error");
    }
  };

  // ===== FORCE DELETE =====
  const handleForceDelete = async (pid) => {
    if (!window.confirm("Xóa vĩnh viễn sản phẩm này?")) return;

    try {
      await forceDeleteProduct(pid);
      await loadTrash();
      showMessage("❌ Đã xóa vĩnh viễn sản phẩm");
    } catch {
      showMessage("❌ Xóa vĩnh viễn thất bại", "error");
    }
  };

  return (
    <AdminLayout>
      {/* ===== MESSAGE ===== */}
      {message && (
        <div
          style={{
            padding: 10,
            marginBottom: 15,
            borderRadius: 6,
            color: "#fff",
            background: msgType === "success" ? "#4CAF50" : "#F44336",
          }}
        >
          {message}
        </div>
      )}

      {/* ===== BACK BUTTON ===== */}
      <div style={{ marginBottom: 15 }}>
        <button style={btnBack} onClick={() => navigate("/admin/products")}>
          ⬅️ Quay về danh sách sản phẩm
        </button>
      </div>

      {/* ===== CONFIRM DELETE ===== */}
      {currentProduct && (
        <div style={box}>
          <h2>🗑️ Xác nhận xóa sản phẩm</h2>

          <div style={productBox}>
            <img
              src={getImg(currentProduct.photo)}
              alt={currentProduct.title}
              style={image}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = FALLBACK;
              }}
            />

            <div>
              <p><b>ID:</b> {currentProduct.id}</p>
              <p><b>Tên:</b> {currentProduct.title}</p>
              <p><b>Giá:</b> {currentProduct.price?.toLocaleString()} đ</p>

              <div style={{ marginTop: 10 }}>
                <button style={btnDelete} onClick={handleDelete}>
                  🗑️ Xóa
                </button>
                <button
                  style={btnCancel}
                  onClick={() => navigate("/admin/products")}
                >
                  ❌ Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== TRASH ===== */}
      <div style={box}>
        <h3>🗑️ Thùng rác</h3>

        <table width="100%" border="1" cellPadding="8">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Ảnh</th>
              <th>Hành động</th>
            </tr>
          </thead>

          <tbody>
            {trash.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.title}</td>
                <td>
                  <img
                    src={getImg(p.photo)}
                    alt={p.title}
                    width={50}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = FALLBACK;
                    }}
                  />
                </td>
                <td>
                  <button
                    style={btnRestore}
                    onClick={() => handleRestore(p.id)}
                  >
                    ♻️ Khôi phục
                  </button>
                  <button
                    style={btnForce}
                    onClick={() => handleForceDelete(p.id)}
                  >
                    ❌ Xóa vĩnh viễn
                  </button>
                </td>
              </tr>
            ))}

            {trash.length === 0 && (
              <tr>
                <td colSpan="4" align="center">
                  Thùng rác trống
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

/* ===== STYLE ===== */
const box = {
  background: "#fff",
  padding: 20,
  marginBottom: 20,
  borderRadius: 8,
};

const productBox = {
  display: "flex",
  gap: 20,
  alignItems: "center",
};

const image = {
  width: 100,
  height: 100,
  objectFit: "cover",
  borderRadius: 8,
};

const btnBack = {
  background: "#2196F3",
  color: "#fff",
  padding: "8px 14px",
  border: "none",
  borderRadius: 4,
  cursor: "pointer",
};

const btnDelete = {
  background: "#F44336",
  color: "#fff",
  padding: "8px 14px",
  border: "none",
  borderRadius: 4,
};

const btnCancel = {
  marginLeft: 10,
  background: "#ccc",
  padding: "8px 14px",
  border: "none",
  borderRadius: 4,
};

const btnRestore = {
  background: "#4CAF50",
  color: "#fff",
  padding: "6px 10px",
  border: "none",
  borderRadius: 4,
};

const btnForce = {
  marginLeft: 6,
  background: "#000",
  color: "#fff",
  padding: "6px 10px",
  border: "none",
  borderRadius: 4,
};
