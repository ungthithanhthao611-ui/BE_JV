import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";

const UserManager = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/users");
            setUsers(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching users:", err);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("CẢNH BÁO: Bạn có chắc chắn muốn xóa user này? Hành động này không thể hoàn tác!")) return;
        try {
            await axios.delete(`http://localhost:8080/api/users/${id}`);
            alert("Đã xóa user!");
            setUsers(users.filter((u) => u.id !== id));
        } catch (err) {
            console.error(err);
            alert("Lỗi khi xóa!");
        }
    };

    return (
        <AdminLayout>
            <div style={styles.container}>
                <div style={styles.header}>
                    <h2 style={{ margin: 0, color: "#333", fontSize: 24 }}>👥 Quản lý Người dùng</h2>
                </div>

                {loading ? (
                    <div>Đang tải dữ liệu...</div>
                ) : (
                    <div style={{ overflowX: "auto", borderRadius: 8, border: "1px solid #eee" }}>
                        <table style={styles.table}>
                            <thead>
                                <tr style={{ background: "#f9fafb", textAlign: "left" }}>
                                    <th style={{ width: 60, textAlign: "center" }}>ID</th>
                                    <th>Họ tên</th>
                                    <th>Email / SĐT</th>
                                    <th>Role</th>
                                    <th style={{ width: 100, textAlign: "center" }}>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: "center", padding: 30, color: "#888" }}>
                                            Chưa có user nào.
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((u) => (
                                        <tr key={u.id} style={{ borderBottom: "1px solid #eee" }}>
                                            <td style={{ textAlign: "center", color: "#666" }}>#{u.id}</td>
                                            <td>
                                                <div style={{ fontWeight: 600, color: "#333" }}>{u.firstName} {u.lastName}</div>
                                                <div style={{ fontSize: 12, color: "#888" }}>{u.gender || "N/A"}</div>
                                            </td>
                                            <td>
                                                <div style={{ color: "#007bff" }}>{u.email}</div>
                                                <div style={{ fontSize: 12, color: "#555" }}>{u.mobileNumber}</div>
                                            </td>
                                            <td>
                                                <span style={{
                                                    padding: "4px 8px", borderRadius: 4, fontSize: 11, fontWeight: "bold",
                                                    background: u.role === "ADMIN" ? "#e8f5e9" : "#e3f2fd",
                                                    color: u.role === "ADMIN" ? "#2e7d32" : "#1976d2"
                                                }}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td style={{ textAlign: "center" }}>
                                                {/* Không cho xóa chính mình hoặc Admin khác nếu cần logic đó, tạm thời cho xóa hết */}
                                                <button
                                                    onClick={() => handleDelete(u.id)}
                                                    style={styles.btnDelete}
                                                    title="Xóa User"
                                                >
                                                    🗑️
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <style>{`
                table { width: 100%; border-collapse: collapse; }
                th { padding: 14px 12px; background: #f8f9fa; border-bottom: 2px solid #e9ecef; color: #495057; font-weight: 600; font-size: 14px; }
                td { padding: 12px 12px; border-bottom: 1px solid #eee; vertical-align: middle; font-size: 14px; }
                tr:hover { background-color: #fafafa; }
            `}</style>
        </AdminLayout>
    );
};

const styles = {
    container: { background: "#fff", padding: 24, borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.03)" },
    header: { marginBottom: 24 },
    table: { width: "100%", borderCollapse: "collapse" },
    btnDelete: {
        background: "#ffebee", color: "#c62828", border: "none", padding: "6px 10px",
        borderRadius: 6, cursor: "pointer", transition: "background 0.2s"
    },
};

export default UserManager;
