import React, { useState } from "react";
import { forgotPasswordApi } from "../../api/authApi";
import { Link } from "react-router-dom";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");
    const [error, setError] = useState("");

    const onSubmit = async (e) => {
        e.preventDefault();
        setMsg("");
        setError("");
        setLoading(true);
        try {
            await forgotPasswordApi({ email });
            setMsg("✅ Đã gửi email đặt lại mật khẩu. Vui lòng kiểm tra hộp thư!");
        } catch (err) {
            setError("❌ " + (err.response?.data || "Có lỗi xảy ra. Vui lòng kiểm tra lại email."));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Quên mật khẩu? 🔒</h2>
                <p style={styles.subtitle}>Nhập email của bạn để nhận liên kết đặt lại mật khẩu.</p>

                <form onSubmit={onSubmit} style={styles.form}>
                    <label style={styles.label}>Email đăng ký</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                        placeholder="name@example.com"
                        required
                    />

                    <button disabled={loading} style={styles.btn}>
                        {loading ? "Đang gửi..." : "Gửi liên kết"}
                    </button>

                    {msg && <p style={styles.success}>{msg}</p>}
                    {error && <p style={styles.error}>{error}</p>}

                    <div style={styles.footer}>
                        <Link to="/login" style={styles.link}>← Quay lại đăng nhập</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;

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
    footer: { marginTop: "20px", textAlign: "center" },
    link: { color: "#666", textDecoration: "none", fontSize: "14px" },
};
