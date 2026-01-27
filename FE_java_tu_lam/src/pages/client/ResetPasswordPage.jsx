import React, { useState } from "react";
import { resetPasswordApi } from "../../api/authApi";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");
    const [error, setError] = useState("");

    const onSubmit = async (e) => {
        e.preventDefault();
        setMsg("");
        setError("");

        if (password !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp!");
            return;
        }

        setLoading(true);
        try {
            await resetPasswordApi({ token, newPassword: password });
            setMsg("✅ Đặt lại mật khẩu thành công!");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setError("❌ " + (err.response?.data || "Token không hợp lệ hoặc đã hết hạn."));
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div style={styles.container}>
                <div style={styles.card}>
                    <h2 style={{ color: 'red' }}>Lỗi Token</h2>
                    <p>Đường dẫn không hợp lệ.</p>
                    <Link to="/login">Về trang đăng nhập</Link>
                </div>
            </div>
        )
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Đặt lại mật khẩu mới 🔑</h2>
                <p style={styles.subtitle}>Vui lòng nhập mật khẩu mới của bạn.</p>

                <form onSubmit={onSubmit} style={styles.form}>
                    <label style={styles.label}>Mật khẩu mới</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                        placeholder="••••••••"
                        required
                    />

                    <label style={styles.label}>Xác nhận mật khẩu</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        style={styles.input}
                        placeholder="••••••••"
                        required
                    />

                    <button disabled={loading} style={styles.btn}>
                        {loading ? "Đang xử lý..." : "Xác nhận"}
                    </button>

                    {msg && <p style={styles.success}>{msg}</p>}
                    {error && <p style={styles.error}>{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;

const styles = {
    container: {
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f4f4f4",
        fontFamily: "'Segoe UI', sans-serif",
    },
    card: {
        width: "400px",
        padding: "30px",
        borderRadius: "12px",
        backgroundColor: "white",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        textAlign: "center",
    },
    title: { color: "#333", marginBottom: "10px" },
    subtitle: { color: "#666", fontSize: "14px", marginBottom: "25px" },
    form: { display: "flex", flexDirection: "column", textAlign: "left" },
    label: { fontWeight: "600", marginBottom: "8px", color: "#444" },
    input: {
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid #ddd",
        fontSize: "16px",
        marginBottom: "20px",
    },
    btn: {
        padding: "12px",
        background: "#d32f2f",
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontSize: "16px",
        fontWeight: "bold",
        cursor: "pointer",
        transition: "0.3s",
    },
    success: { color: "green", marginTop: "15px", fontWeight: "bold" },
    error: { color: "red", marginTop: "15px", fontWeight: "bold" },
};
