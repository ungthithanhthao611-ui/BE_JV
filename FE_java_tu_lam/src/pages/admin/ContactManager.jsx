import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";

const ContactManager = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/contact");
            setContacts(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching contacts:", err);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa liên hệ này?")) return;
        try {
            await axios.delete(`http://localhost:8080/api/contact/${id}`);
            alert("Đã xóa liên hệ!");
            setContacts(contacts.filter((c) => c.id !== id));
        } catch (err) {
            console.error(err);
            alert("Lỗi khi xóa!");
        }
    };

    const handleToggleStatus = async (contact) => {
        const newStatus = contact.status === 1 ? 2 : 1; // 1: Mới, 2: Đã xử lý
        try {
            await axios.put(`http://localhost:8080/api/contact/${contact.id}/status?status=${newStatus}`);
            // Update local state
            setContacts(contacts.map(c => c.id === contact.id ? { ...c, status: newStatus } : c));
        } catch (err) {
            alert("Lỗi cập nhật trạng thái");
        }
    };

    return (
        <AdminLayout>
            <div style={{ background: "#fff", padding: 20, borderRadius: 8, boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                    <h2 style={{ color: "#333", margin: 0 }}>✉️ Quản lý Liên hệ & Phản hồi</h2>
                </div>

                {loading ? (
                    <div>Đang tải dữ liệu...</div>
                ) : (
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ background: "#f9fafb", textAlign: "left" }}>
                                    <th style={thStyle}>ID</th>
                                    <th style={thStyle}>Người gửi</th>
                                    <th style={thStyle}>Email / SĐT</th>
                                    <th style={thStyle}>Tiêu đề</th>
                                    <th style={thStyle}>Nội dung</th>
                                    <th style={thStyle}>Ngày gửi</th>
                                    <th style={thStyle}>Trạng thái</th>
                                    <th style={thStyle}>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contacts.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" style={{ textAlign: "center", padding: 20 }}>Chưa có liên hệ nào.</td>
                                    </tr>
                                ) : (
                                    contacts.map((c) => (
                                        <tr key={c.id} style={{ borderBottom: "1px solid #eee" }}>
                                            <td style={tdStyle}>#{c.id}</td>
                                            <td style={tdStyle}>
                                                <strong>{c.name}</strong>
                                                {c.userId && <div style={{ fontSize: 11, color: "#888" }}>(User ID: {c.userId})</div>}
                                            </td>
                                            <td style={tdStyle}>
                                                <div>{c.email}</div>
                                                <div style={{ fontSize: 12, color: "#666" }}>{c.phone}</div>
                                            </td>
                                            <td style={tdStyle}>{c.title}</td>
                                            <td style={tdStyle}>
                                                <div style={{ maxHeight: 100, overflowY: "auto", fontSize: 13 }}>{c.content}</div>
                                            </td>
                                            <td style={tdStyle}>
                                                {c.createdAt ? new Date(c.createdAt).toLocaleString("vi-VN") : "-"}
                                            </td>
                                            <td style={tdStyle}>
                                                <button
                                                    onClick={() => handleToggleStatus(c)}
                                                    style={{
                                                        border: "none",
                                                        padding: "4px 8px",
                                                        borderRadius: 4,
                                                        cursor: "pointer",
                                                        background: c.status === 2 ? "#d4edda" : "#fff3cd",
                                                        color: c.status === 2 ? "#155724" : "#856404",
                                                        fontWeight: 600,
                                                        fontSize: 12
                                                    }}
                                                >
                                                    {c.status === 2 ? "✅ Đã xử lý" : "⏳ Chờ xử lý"}
                                                </button>
                                            </td>
                                            <td style={tdStyle}>
                                                <button
                                                    onClick={() => handleDelete(c.id)}
                                                    style={{
                                                        background: "#ff4d4f", color: "#fff", border: "none",
                                                        padding: "6px 10px", borderRadius: 4, cursor: "pointer"
                                                    }}
                                                >
                                                    Xóa
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
            {/* Style override cho hover row */}
            <style>{`
                table tr:hover { background: #fafafa; }
            `}</style>
        </AdminLayout>
    );
};

const thStyle = { padding: "12px", borderBottom: "2px solid #ddd", fontSize: 14 };
const tdStyle = { padding: "12px", borderBottom: "1px solid #eee", fontSize: 14, verticalAlign: "top" };

export default ContactManager;
