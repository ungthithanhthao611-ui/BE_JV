import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: ""
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...user });

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    const userEmail = localStorage.getItem("userEmail");

    if (!userId) {
      navigate("/login");
      return;
    }

    // Load user info from localStorage or API
    const storedName = localStorage.getItem("userName") || "Khách hàng";
    const storedPhone = localStorage.getItem("userPhone") || "";
    const storedAddress = localStorage.getItem("userAddress") || "";

    setUser({
      fullName: storedName,
      email: userEmail || "",
      phone: storedPhone,
      address: storedAddress
    });
    setEditData({
      fullName: storedName,
      email: userEmail || "",
      phone: storedPhone,
      address: storedAddress
    });
  }, [navigate]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem("userName", editData.fullName);
    localStorage.setItem("userPhone", editData.phone);
    localStorage.setItem("userAddress", editData.address);

    setUser({ ...editData });
    setIsEditing(false);
    alert("Cập nhật thông tin thành công!");
  };

  const handleCancel = () => {
    setEditData({ ...user });
    setIsEditing(false);
  };

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc muốn đăng xuất?")) {
      localStorage.clear();
      navigate("/login");
    }
  };

  return (
    <div className="page-wrapper">
      <Header />

      <main className="profile-page">
        <div className="profile-container">
          <div className="profile-sidebar">
            <div className="profile-avatar">
              <div className="avatar-circle">
                {user.fullName.charAt(0).toUpperCase()}
              </div>
              <h3 className="user-name">{user.fullName}</h3>
              <p className="user-email">{user.email}</p>
            </div>

            <nav className="profile-nav">
              <Link to="/profile" className="nav-link active">
                <span className="nav-icon">👤</span>
                <span className="nav-text">Thông tin cá nhân</span>
              </Link>
              <Link to="/my-orders" className="nav-link">
                <span className="nav-icon">📦</span>
                <span className="nav-text">Đơn hàng của tôi</span>
              </Link>
              <button className="nav-link logout-btn" onClick={handleLogout}>
                <span className="nav-icon">🚪</span>
                <span className="nav-text">Đăng xuất</span>
              </button>
            </nav>
          </div>

          <div className="profile-content">
            <div className="info-card-box">
              <div className="content-header">
                <h2 className="content-title">Hồ sơ cá nhân</h2>
                {!isEditing && (
                  <button className="btn-edit" onClick={handleEdit}>
                    Chỉnh sửa
                  </button>
                )}
              </div>

              <div className="info-grid">
                <div className="info-row">
                  <label className="info-label">Họ và tên</label>
                  {isEditing ? (
                    <input
                      type="text"
                      className="info-input"
                      value={editData.fullName}
                      onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                    />
                  ) : (
                    <span className="info-value">{user.fullName || "Chưa thiết lập"}</span>
                  )}
                </div>

                <div className="info-row">
                  <label className="info-label">Địa chỉ email</label>
                  <span className="info-value">{user.email || "Chưa thiết lập"}</span>
                </div>

                <div className="info-row">
                  <label className="info-label">Số điện thoại</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      className="info-input"
                      value={editData.phone}
                      onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                      placeholder="Số điện thoại của bạn"
                    />
                  ) : (
                    <span className="info-value">{user.phone || "Chưa cập nhật"}</span>
                  )}
                </div>

                <div className="info-row">
                  <label className="info-label">Địa chỉ văn phòng / Nhà riêng</label>
                  {isEditing ? (
                    <textarea
                      className="info-textarea"
                      value={editData.address}
                      onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                      placeholder="Nhập địa chỉ nhận hàng..."
                      rows={3}
                    />
                  ) : (
                    <span className="info-value">{user.address || "Chưa cập nhật"}</span>
                  )}
                </div>

                {isEditing && (
                  <div className="edit-actions">
                    <button className="btn-cancel" onClick={handleCancel}>
                      Hủy bỏ
                    </button>
                    <button className="btn-save" onClick={handleSave}>
                      Lưu thay đổi
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="quick-actions-sec">
              <h3 className="section-title">Tiện ích nhanh</h3>
              <div className="action-grid">
                <Link to="/my-orders" className="action-card">
                  <div className="action-icon">📦</div>
                  <div className="action-text">Đơn hàng</div>
                </Link>
                <Link to="/favorites" className="action-card">
                  <div className="action-icon">❤️</div>
                  <div className="action-text">Yêu thích</div>
                </Link>
                <Link to="/contact" className="action-card">
                  <div className="action-icon">💬</div>
                  <div className="action-text">Hỗ trợ</div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* CSS STYLES */}
      <style>{`
        .page-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          font-family: 'Segoe UI', sans-serif;
          background: #f9f9f9;
        }

        .profile-page {
          flex: 1;
          padding: 60px 20px;
        }

        .profile-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 40px;
        }

        /* SIDEBAR */
        .profile-sidebar {
          background: white;
          border-radius: 20px;
          padding: 40px 30px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
          height: fit-content;
        }

        .profile-avatar {
          text-align: center;
          margin-bottom: 40px;
          padding-bottom: 30px;
          border-bottom: 1px solid #eee;
        }

        .avatar-circle {
          width: 110px;
          height: 110px;
          border-radius: 50%;
          background: #333;
          color: white;
          font-size: 48px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }

        .user-name {
          font-size: 22px;
          font-weight: 800;
          color: #333;
          margin: 0 0 8px;
        }

        .user-email {
          font-size: 14px;
          color: #999;
          margin: 0;
        }

        .profile-nav {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 16px 20px;
          border-radius: 12px;
          text-decoration: none;
          color: #555;
          font-size: 15px;
          font-weight: 700;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: none;
          background: #f8f8f8;
          cursor: pointer;
          width: 100%;
          text-align: left;
        }

        .nav-link:hover {
          background: #f0f0f0;
          color: #333;
          transform: translateX(10px);
        }

        .nav-link.active {
          background: #333;
          color: white;
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }

        .nav-icon {
          font-size: 20px;
        }

        .logout-btn:hover {
          background: #fff1f0;
          color: #ff4d4f;
        }

        /* CONTENT */
        .profile-content {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .info-card-box {
          background: white;
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
        }

        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .content-title {
          font-size: 28px;
          font-weight: 800;
          color: #333;
          margin: 0;
          position: relative;
        }
        
        .content-title:after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 0;
          width: 50px;
          height: 4px;
          background: #d32f2f;
          border-radius: 2px;
        }

        .btn-edit {
          padding: 12px 25px;
          background: #333;
          color: white;
          border: none;
          border-radius: 30px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 700;
          transition: all 0.3s;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .btn-edit:hover {
          background: #d32f2f;
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(211, 47, 47, 0.3);
        }

        /* INFO CARD */
        .info-grid {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }

        .info-row {
          display: grid;
          grid-template-columns: 200px 1fr;
          align-items: center;
          gap: 20px;
        }

        .info-label {
          font-size: 14px;
          font-weight: 800;
          color: #999;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .info-value {
          font-size: 16px;
          color: #333;
          font-weight: 600;
        }

        .info-input,
        .info-textarea {
          width: 100%;
          padding: 15px 20px;
          border: 2px solid #f0f0f0;
          border-radius: 12px;
          font-size: 15px;
          font-family: inherit;
          transition: all 0.3s;
          outline: none;
        }

        .info-input:focus,
        .info-textarea:focus {
          border-color: #d32f2f;
          background: white;
        }

        .edit-actions {
          display: flex;
          gap: 15px;
          justify-content: flex-end;
          margin-top: 30px;
          padding-top: 30px;
          border-top: 1px solid #f0f0f0;
        }

        .btn-cancel,
        .btn-save {
          padding: 14px 30px;
          border-radius: 30px;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          transition: 0.3s;
          border: none;
          text-transform: uppercase;
        }

        .btn-cancel {
          background: #f0f0f0;
          color: #666;
        }

        .btn-save {
          background: #d32f2f;
          color: white;
        }

        .btn-save:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(211, 47, 47, 0.3);
        }

        /* QUICK ACTIONS */
        .quick-actions-sec {
          margin-top: 20px;
        }

        .section-title {
          font-size: 20px;
          font-weight: 800;
          color: #333;
          margin-bottom: 25px;
        }

        .action-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .action-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
          padding: 30px 20px;
          background: white;
          border-radius: 20px;
          text-decoration: none;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 5px 15px rgba(0,0,0,0.03);
          border: 1px solid transparent;
        }

        .action-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.1);
          border-color: #d32f2f;
        }

        .action-icon {
          font-size: 36px;
        }

        .action-text {
          font-size: 15px;
          font-weight: 800;
          color: #333;
        }

        /* RESPONSIVE */
        @media (max-width: 1024px) {
          .profile-container {
            grid-template-columns: 280px 1fr;
          }
        }

        @media (max-width: 768px) {
          .profile-container {
            grid-template-columns: 1fr;
          }
          
          .profile-sidebar {
            order: 2;
          }
          
          .profile-content {
            order: 1;
          }

          .info-row {
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .action-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .content-title {
            font-size: 22px;
          }
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;
