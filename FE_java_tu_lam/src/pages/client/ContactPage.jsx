import React, { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";
import { submitContactForm } from "../../api/contactApi";

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });

    const [status, setStatus] = useState(null); // success | error | loading

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("loading");

        try {
            const userId = sessionStorage.getItem("userId");
            const payload = {
                userId: userId ? parseInt(userId) : null,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                title: formData.subject,
                content: formData.message
            };

            await submitContactForm(payload);

            setStatus("success");
            setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
        } catch (error) {
            console.error("Contact submit error:", error);
            setStatus("error");
        }
    };

    return (
        <div className="page-wrapper">
            <Header />

            {/* --- HERO BANNER --- */}
            <div className="contact-hero">
                <div className="container">
                    <h1 className="hero-title">Liên Hệ Với Chúng Tôi</h1>
                    <div className="breadcrumb">
                        <Link to="/">Trang chủ</Link> / <span className="current">Liên hệ</span>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="contact-layout">

                    {/* --- INFO COLUMN --- */}
                    <div className="contact-info fade-in-up">
                        <div className="info-header">
                            <h2 className="section-title">Thông Tin Liên Lạc</h2>
                            <p className="section-desc">
                                Chúng tôi luôn lắng nghe ý kiến của bạn. Hãy liên hệ với chúng tôi qua các kênh dưới đây hoặc để lại tin nhắn.
                            </p>
                        </div>

                        <div className="info-cards">
                            <div className="info-item">
                                <div className="icon-box">📍</div>
                                <div className="info-content">
                                    <h3>Địa chỉ cửa hàng</h3>
                                    <p>123 Đường Cà Phê, Quận Ninh Kiều<br />TP. Cần Thơ, Việt Nam</p>
                                </div>
                            </div>

                            <div className="info-item">
                                <div className="icon-box">📞</div>
                                <div className="info-content">
                                    <h3>Hotline hỗ trợ</h3>
                                    <p className="highlight">0912.345.678</p>
                                    <p className="sub-text">(Thứ 2 - CN: 7:00 - 22:00)</p>
                                </div>
                            </div>

                            <div className="info-item">
                                <div className="icon-box">✉️</div>
                                <div className="info-content">
                                    <h3>Email</h3>
                                    <p>support@halucafe.com</p>
                                    <p>cskh@halucafe.com</p>
                                </div>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="social-connect">
                            <h3>Kết nối mạng xã hội</h3>
                            <div className="social-icons">
                                <a href="#" className="sc-icon fb">F</a>
                                <a href="#" className="sc-icon ins">I</a>
                                <a href="#" className="sc-icon tw">T</a>
                                <a href="#" className="sc-icon yt">Y</a>
                            </div>
                        </div>
                    </div>

                    {/* --- FORM COLUMN --- */}
                    <div className="contact-form-wrapper fade-in-up delay-200">
                        <h2 className="form-title">Gửi Tin Nhắn</h2>
                        <form onSubmit={handleSubmit} className="contact-form">
                            <div className="form-grid">
                                <div className="form-group">
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Họ và tên"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <input
                                    type="text"
                                    name="phone"
                                    placeholder="Số điện thoại của bạn"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <input
                                    type="text"
                                    name="subject"
                                    placeholder="Tiêu đề tin nhắn"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <textarea
                                    name="message"
                                    rows="5"
                                    placeholder="Nội dung cần hỗ trợ..."
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </div>

                            <button type="submit" className={`btn-submit ${status === 'loading' ? 'loading' : ''}`}>
                                {status === 'loading' ? 'Đang gửi...' : 'Gửi Tin Nhắn 🚀'}
                            </button>

                            {status === 'success' && (
                                <div className="alert-success">
                                    ✅ Đã gửi thành công! Chúng tôi sẽ liên hệ lại sớm.
                                </div>
                            )}
                            {status === 'error' && (
                                <div className="alert-error" style={{ marginTop: 20, color: 'red', textAlign: 'center' }}>
                                    ❌ Có lỗi xảy ra. Vui lòng thử lại sau.
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>

            {/* --- MAP SECTION --- */}
            <div className="map-section fade-in">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.841518465064!2d105.77061531533256!3d10.029933692831032!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a0895a51d60719%3A0x9d76b0035f6d53d0!2zxJDhuqFpIGhvYyBD4bqnbiBUaMah!5e0!3m2!1svi!2s!4v1677685642436!5m2!1svi!2s"
                    width="100%"
                    height="450"
                    style={{ border: 0, filter: 'grayscale(0.2)' }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>

            <Footer />

            {/* --- STYLES --- */}
            <style>{`
        /* Global & Layout */
        .page-wrapper { background: #fff; color: #333; font-family: 'Segoe UI', sans-serif; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 15px; }

        /* Hero */
        .contact-hero {
          background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%);
          padding: 60px 0 40px;
          margin-bottom: 60px;
          text-align: center;
          border-bottom: 1px solid #eee;
        }
        .hero-title {
          font-size: 36px; font-weight: 800; color: #333;
          margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px;
        }
        .breadcrumb { font-size: 14px; color: #666; }
        .breadcrumb a { color: #d32f2f; font-weight: 600; text-decoration: none; }
        .breadcrumb .current { color: #999; margin-left: 5px; }

        /* Layout Grid */
        .contact-layout {
          display: flex; gap: 60px; margin-bottom: 80px; align-items: flex-start;
        }
        @media (max-width: 900px) {
          .contact-layout { flex-direction: column; gap: 40px; }
        }

        /* Info Column */
        .contact-info { flex: 1; }
        .section-title {
          font-size: 28px; font-weight: 700; color: #333;
          margin-bottom: 15px; position: relative;
          display: inline-block;
        }
        .section-title::after {
          content: ''; display: block; width: 50px; height: 3px;
          background: #d32f2f; margin-top: 8px; border-radius: 2px;
        }
        .section-desc { color: #555; line-height: 1.6; margin-bottom: 30px; }

        .info-cards { display: flex; flex-direction: column; gap: 25px; }
        .info-item {
          display: flex; gap: 20px;
          padding: 20px;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 5px 20px rgba(0,0,0,0.03);
          border: 1px solid #f0f0f0;
          transition: 0.3s;
        }
        .info-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(211, 47, 47, 0.1);
          border-color: #ffdce0;
        }

        .icon-box {
          width: 50px; height: 50px;
          background: #ffebee; color: #d32f2f;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 24px;
        }

        .info-content h3 { font-size: 16px; font-weight: 700; margin: 0 0 5px; color: #333; }
        .info-content p { margin: 0; color: #666; font-size: 14px; line-height: 1.5; }
        .info-content .highlight { color: #d32f2f; font-weight: 700; font-size: 16px; }
        .info-content .sub-text { font-size: 12px; color: #999; margin-top: 3px; }

        .social-connect { margin-top: 40px; }
        .social-connect h3 { font-size: 16px; margin-bottom: 15px; }
        .social-icons { display: flex; gap: 10px; }
        .sc-icon {
          width: 40px; height: 40px;
          background: #333; color: white;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          text-decoration: none; font-weight: bold; transition: 0.3s;
        }
        .sc-icon.fb:hover { background: #3b5998; }
        .sc-icon.ins:hover { background: #e1306c; }
        .sc-icon.tw:hover { background: #1da1f2; }
        .sc-icon.yt:hover { background: #ff0000; }

        /* Form Column */
        .contact-form-wrapper {
          flex: 1.2;
          background: white;
          padding: 40px;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.05);
          border: 1px solid #eee;
        }
        .form-title { font-size: 24px; font-weight: 700; margin-bottom: 25px; text-align: center; }
        
        .contact-form .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .contact-form .form-group { margin-bottom: 20px; }
        
        .contact-form input, 
        .contact-form textarea {
          width: 100%;
          padding: 14px 18px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-family: inherit;
          font-size: 15px;
          transition: 0.3s;
          background: #fdfdfd;
        }
        .contact-form input:focus, 
        .contact-form textarea:focus {
          border-color: #d32f2f;
          background: white;
          outline: none;
          box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.1);
        }

        .btn-submit {
          width: 100%;
          padding: 16px;
          background: #d32f2f;
          color: white;
          font-size: 16px; font-weight: 700; text-transform: uppercase;
          border: none; border-radius: 8px;
          cursor: pointer; transition: 0.3s;
          margin-top: 10px;
        }
        .btn-submit:hover { background: #b71c1c; transform: translateY(-2px); box-shadow: 0 5px 15px rgba(211, 47, 47, 0.4); }
        .btn-submit.loading { opacity: 0.7; pointer-events: none; }

        .alert-success {
          margin-top: 20px;
          padding: 15px;
          background: #e6fffa; color: #20c997;
          border: 1px solid #b2f5ea;
          border-radius: 8px; font-weight: 600; text-align: center;
        }

        /* Map */
        .map-section { margin-top: 0; line-height: 0; }

        /* Animations */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
        .delay-200 { animation-delay: 0.2s; }

        @media (max-width: 600px) {
          .contact-form .form-grid { grid-template-columns: 1fr; }
          .contact-form-wrapper { padding: 25px; }
        }
      `}</style>
        </div>
    );
};

export default ContactPage;
