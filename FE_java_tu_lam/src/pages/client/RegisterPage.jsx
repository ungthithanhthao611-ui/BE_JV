import React, { useState } from "react";
import { registerApi } from "../../api/authApi";
import { Link, useNavigate } from "react-router-dom";

const RegisterPage = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        mobileNumber: "",
        gender: "Nam",
        address: ""
    });
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setMsg("");

        // 1. Validate Names
        if (!form.firstName.trim()) {
            setMsg("⚠️ Vui lòng nhập Họ của bạn.");
            return;
        }
        if (!form.lastName.trim()) {
            setMsg("⚠️ Vui lòng nhập Tên của bạn.");
            return;
        }

        // 2. Validate Email Format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            setMsg("⚠️ Email không hợp lệ. Vui lòng nhập đúng định dạng (ví dụ: name@example.com).");
            return;
        }

        // 3. Validate Phone Number (must be exactly 10 digits)
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(form.mobileNumber)) {
            setMsg("⚠️ Số điện thoại phải bao gồm đúng 10 chữ số.");
            return;
        }

        setLoading(true);
        try {
            const res = await registerApi(form);
            const data = res.data;
            if (data.token) {
                sessionStorage.setItem("token", data.token);
                sessionStorage.setItem("userId", data.userId);
                sessionStorage.setItem("userName", data.name);
                sessionStorage.setItem("userRole", data.role);
                sessionStorage.setItem("userEmail", data.email);
                window.dispatchEvent(new Event("auth_changed"));
            }
            setMsg("✅ Đăng ký thành công!");
            setTimeout(() => navigate("/"), 1500); // Wait a bit so user can see the success message
        } catch (err) {
            // Check for specific error messages if possible, or just show a friendly one
            const errorMsg = err.response?.data?.message || err.message;
            if (errorMsg.includes("exist")) {
                setMsg("❌ Email hoặc số điện thoại đã tồn tại trong hệ thống.");
            } else {
                setMsg("❌ Đăng ký thất bại. Vui lòng thử lại sau.");
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
                    <h1 style={styles.brandTitle}>Tham gia cùng HaluCafe</h1>
                    <p style={styles.brandSubtitle}>Trở thành thành viên để nhận ngàn ưu đãi</p>
                </div>
            </div>

            {/* RIGHT SIDE - FORM */}
            <div style={styles.formSide}>
                <div style={styles.formWrapper}>
                    <div style={styles.header}>
                        <h2 style={styles.title}>Tạo tài khoản mới 🚀</h2>
                        <p style={styles.subtitle}>Điền thông tin bên dưới để đăng ký</p>
                    </div>

                    <form onSubmit={onSubmit} style={styles.form}>
                        <div style={styles.row}>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <label style={styles.label}>Họ</label>
                                <input
                                    name="firstName"
                                    value={form.firstName}
                                    onChange={onChange}
                                    style={styles.input}
                                    placeholder="Nguyễn"
                                    required
                                />
                            </div>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <label style={styles.label}>Tên</label>
                                <input
                                    name="lastName"
                                    value={form.lastName}
                                    onChange={onChange}
                                    style={styles.input}
                                    placeholder="Văn A"
                                    required
                                />
                            </div>
                        </div>

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

                        <div style={styles.row}>
                            <div style={{ flex: 1.5, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <label style={styles.label}>Số điện thoại</label>
                                <input
                                    name="mobileNumber"
                                    value={form.mobileNumber}
                                    onChange={onChange}
                                    style={styles.input}
                                    placeholder="0912..."
                                    required
                                />
                            </div>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <label style={styles.label}>Giới tính</label>
                                <select
                                    name="gender"
                                    value={form.gender}
                                    onChange={onChange}
                                    style={styles.input}
                                >
                                    <option value="Nam">Nam</option>
                                    <option value="Nữ">Nữ</option>
                                    <option value="Khác">Khác</option>
                                </select>
                            </div>
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Địa chỉ</label>
                            <input
                                name="address"
                                value={form.address}
                                onChange={onChange}
                                style={styles.input}
                                placeholder="Số nhà, đường, quận/huyện..."
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

                        <button disabled={loading} style={styles.btn}>
                            {loading ? "Đang xử lý..." : "Đăng ký ngay"}
                        </button>

                        {msg && <p style={styles.msg}>{msg}</p>}

                        <p style={styles.footer}>
                            Đã có tài khoản? <Link to="/login" style={styles.linkHighlight}>Đăng nhập</Link>
                        </p>

                        <div style={styles.homeLink}>
                            <Link to="/" style={styles.linkMuted}>← Quay lại trang chủ</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;

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
        flex: "1",
        backgroundImage: "url('https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=1000')",
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
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        textAlign: "center",
        padding: "20px",
    },
    brandTitle: {
        fontSize: "3rem",
        fontWeight: "bold",
        marginBottom: "15px",
        textShadow: "0 2px 10px rgba(0,0,0,0.3)",
    },
    brandSubtitle: {
        fontSize: "1.1rem",
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
        maxWidth: "500px",
        paddingTop: "20px",
        paddingBottom: "20px",
    },
    header: {
        marginBottom: "30px",
        textAlign: "center",
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
        gap: "18px",
    },
    row: {
        display: "flex",
        gap: "15px",
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
        marginTop: "20px",
    },
};
