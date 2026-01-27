import React, { useState } from "react";
import { loginApi } from "../../api/authApi";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setMsg("");

        // Validate Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            setMsg("⚠️ Vui lòng nhập đúng địa chỉ email (ví dụ: name@example.com).");
            return;
        }

        setLoading(true);
        try {
            const res = await loginApi(form);
            const data = res.data;
            if (data.token) {
                // ... same storage logic ...
                sessionStorage.setItem("token", data.token);
                sessionStorage.setItem("userId", data.userId);
                sessionStorage.setItem("userName", data.name);
                sessionStorage.setItem("userRole", data.role);
                sessionStorage.setItem("userEmail", data.email);
                window.dispatchEvent(new Event("auth_changed"));
            }
            setMsg("✅ Đăng nhập thành công!");
            setTimeout(() => navigate("/"), 1000);
        } catch (err) {
            // Friendly error message
            if (err.response?.status === 401 || err.response?.status === 404) {
                setMsg("❌ Email hoặc mật khẩu không chính xác.");
            } else {
                setMsg("❌ Đăng nhập thất bại. Vui lòng thử lại sau.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            {/* LEFT SIDE - IMAGE */}
            <div style={styles.imageSide}>
                <div style={styles.overlay}>
                    <h1 style={styles.brandTitle}>HaluCafe</h1>
                    <p style={styles.brandSubtitle}>Thưởng thức hương vị cafe đích thực</p>
                </div>
            </div>

            {/* RIGHT SIDE - FORM */}
            <div style={styles.formSide}>
                <div style={styles.formWrapper}>
                    <div style={styles.header}>
                        <h2 style={styles.title}>Chào mừng trở lại! 👋</h2>
                        <p style={styles.subtitle}>Vui lòng đăng nhập để tiếp tục</p>
                    </div>

                    <form onSubmit={onSubmit} style={styles.form}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Email</label>
                            <input
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={onChange}
                                style={styles.input}
                                placeholder="name@example.com"
                                required
                            />
                        </div>

                        <div style={styles.inputGroup}>
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

                        <div style={styles.forgotPass}>
                            <Link to="/forgot-password" style={styles.linkMuted}>Quên mật khẩu?</Link>
                        </div>

                        <button disabled={loading} style={styles.btn}>
                            {loading ? "Đang xử lý..." : "Đăng nhập"}
                        </button>

                        {msg && <p style={styles.msg}>{msg}</p>}

                        <p style={styles.footer}>
                            Chưa có tài khoản? <Link to="/register" style={styles.linkHighlight}>Đăng ký ngay</Link>
                        </p>

                        <div style={styles.homeLink}>
                            <Link to="/" style={styles.linkMuted}>← Quay lại trang chủ</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        backgroundColor: "#fff",
        fontFamily: "'Segoe UI', sans-serif",
    },
    imageSide: {
        flex: "1.2",
        backgroundImage: "url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1000')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    overlay: {
        position: "absolute",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        textAlign: "center",
    },
    brandTitle: {
        fontSize: "3.5rem",
        fontWeight: "bold",
        marginBottom: "10px",
        textShadow: "0 2px 10px rgba(0,0,0,0.3)",
        letterSpacing: "2px",
    },
    brandSubtitle: {
        fontSize: "1.2rem",
        fontWeight: "300",
        opacity: 0.9,
    },
    formSide: {
        flex: "1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
        backgroundColor: "white",
        overflowY: "auto",
    },
    formWrapper: {
        width: "100%",
        maxWidth: "420px",
    },
    header: {
        marginBottom: "30px",
    },
    title: {
        fontSize: "2rem",
        fontWeight: "700",
        color: "#333",
        marginBottom: "10px",
    },
    subtitle: {
        color: "#666",
        fontSize: "1rem",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "20px",
    },
    inputGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    },
    label: {
        fontSize: "0.9rem",
        fontWeight: "600",
        color: "#444",
    },
    input: {
        padding: "12px 16px",
        borderRadius: "8px",
        border: "1px solid #ddd",
        fontSize: "1rem",
        transition: "border-color 0.2s",
        outline: "none",
        backgroundColor: "#f9f9f9",
    },
    forgotPass: {
        textAlign: "right",
    },
    btn: {
        padding: "14px",
        backgroundColor: "#d32f2f",
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontSize: "1rem",
        fontWeight: "bold",
        cursor: "pointer",
        transition: "background 0.3s, transform 0.2s",
        marginTop: "10px",
    },
    btnHover: { // Note: Inline styles don't support pseudo-classes easily, but user requested 'beautiful'
        backgroundColor: "#b71c1c",
    },
    msg: {
        textAlign: "center",
        padding: "10px",
        borderRadius: "6px",
        backgroundColor: "#e8f5e9",
        color: "#2e7d32",
        fontSize: "0.9rem",
    },
    footer: {
        textAlign: "center",
        marginTop: "20px",
        color: "#666",
    },
    linkHighlight: {
        color: "#d32f2f",
        fontWeight: "bold",
        textDecoration: "none",
        marginLeft: "5px",
    },
    linkMuted: {
        color: "#888",
        textDecoration: "none",
        fontSize: "0.9rem",
    },
    homeLink: {
        textAlign: "center",
        marginTop: "30px",
    },
};
