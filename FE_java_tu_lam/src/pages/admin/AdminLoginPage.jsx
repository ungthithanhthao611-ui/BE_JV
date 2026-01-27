import React, { useState } from "react";
import { loginApi } from "../../api/authApi";
import { useNavigate } from "react-router-dom";

export default function AdminLoginPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setMsg("");
        setLoading(true);
        try {
            const res = await loginApi(form);
            const data = res.data;

            // ✅ CHECK ROLE NGHIÊM NGẶT
            if (data.role !== "ADMIN") {
                setMsg("⛔ Tài khoản này không có quyền truy cập Quản trị!");
                setLoading(false);
                return;
            }

            // Lưu session
            sessionStorage.setItem("token", data.token);
            sessionStorage.setItem("userId", data.userId);
            sessionStorage.setItem("userName", data.name);
            sessionStorage.setItem("userRole", data.role);
            sessionStorage.setItem("userEmail", data.email);

            // Dispatch event để cập nhật UI nếu cần
            window.dispatchEvent(new Event("auth_changed"));

            setMsg("✅ Đăng nhập Admin thành công!");
            // Chuyển hướng vào Dashboard
            navigate("/admin");

        } catch (err) {
            setMsg("❌ Đăng nhập thất bại: " + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <h2 style={styles.title}>Admin Portal 🛡️</h2>
                    <p style={styles.subtitle}>Đăng nhập hệ thống quản trị</p>
                </div>

                <form onSubmit={onSubmit} style={styles.form}>
                    <div style={styles.group}>
                        <label style={styles.label}>Email quản trị</label>
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={onChange}
                            style={styles.input}
                            placeholder="admin@example.com"
                            required
                        />
                    </div>

                    <div style={styles.group}>
                        <label style={styles.label}>Mật khẩu</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={onChange}
                            style={styles.input}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {msg && <div style={{
                        padding: 10, borderRadius: 4, fontSize: 13, textAlign: 'center',
                        background: msg.includes("✅") ? "#e8f5e9" : "#ffebee",
                        color: msg.includes("✅") ? "green" : "red"
                    }}>{msg}</div>}

                    <button disabled={loading} style={styles.btn}>
                        {loading ? "Đang xác thực..." : "Truy cập Dashboard"}
                    </button>

                    <div style={{ marginTop: 15, textAlign: 'center', fontSize: 13 }}>
                        <a href="/" style={{ color: '#666', textDecoration: 'none' }}>← Về trang khách hàng</a>
                    </div>
                </form>
            </div>
        </div>
    );
}

const styles = {
    container: {
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)", // Nền xanh đậm Admin
        fontFamily: "'Segoe UI', sans-serif"
    },
    card: {
        background: "#fff",
        padding: "40px",
        borderRadius: "12px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
        width: "100%",
        maxWidth: "400px"
    },
    header: { textAlign: "center", marginBottom: 30 },
    title: { margin: "0 0 10px", color: "#333", fontSize: "24px" },
    subtitle: { margin: 0, color: "#666", fontSize: "14px" },
    form: { display: "flex", flexDirection: "column", gap: "20px" },
    group: { display: "flex", flexDirection: "column", gap: "8px" },
    label: { fontSize: "13px", fontWeight: "600", color: "#444" },
    input: {
        padding: "12px",
        borderRadius: "6px",
        border: "1px solid #ddd",
        fontSize: "14px",
        outline: "none"
    },
    btn: {
        padding: "12px",
        background: "#1e3c72",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        fontSize: "15px",
        fontWeight: "600",
        cursor: "pointer",
        marginTop: "10px",
        transition: "opacity 0.2s"
    }
};
