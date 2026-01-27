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
            <div className="content-header">
              <h2 className="content-title">Thông tin cá nhân</h2>
              {!isEditing && (
                <button className="btn-edit" onClick={handleEdit}>
                  ✏️ Chỉnh sửa
                </button>
              )}
            </div>

            <div className="info-card">
              <div className="info-row">
                <label className="info-label">Họ và tên:</label>
                {isEditing ? (
                  <input
                    type="text"
                    className="info-input"
                    value={editData.fullName}
                    onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                  />
                ) : (
                  <span className="info-value">{user.fullName}</span>
                )}
              </div>

              <div className="info-row">
                <label className="info-label">Email:</label>
                <span className="info-value">{user.email}</span>
              </div>

              <div className="info-row">
                <label className="info-label">Số điện thoại:</label>
                {isEditing ? (
                  <input
                    type="tel"
                    className="info-input"
                    value={editData.phone}
                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    placeholder="Nhập số điện thoại"
                  />
                ) : (
                  <span className="info-value">{user.phone || "Chưa cập nhật"}</span>
                )}
              </div>

              <div className="info-row">
                <label className="info-label">Địa chỉ:</label>
                {isEditing ? (
                  <textarea
                    className="info-textarea"
                    value={editData.address}
                    onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                    placeholder="Nhập địa chỉ"
                    rows={3}
                  />
                ) : (
                  <span className="info-value">{user.address || "Chưa cập nhật"}</span>
                )}
              </div>

              {isEditing && (
                <div className="edit-actions">
                  <button className="btn-cancel" onClick={handleCancel}>
                    Hủy
                  </button>
                  <button className="btn-save" onClick={handleSave}>
                    Lưu thay đổi
                  </button>
                </div>
              )}
            </div>

            {/* QUICK ACTIONS */}
            <div className="quick-actions">
              <h3 className="section-title">Tiện ích</h3>
              <div className="action-grid">
                <Link to="/my-orders" className="action-card">
                  <div className="action-icon">📦</div>
                  <div className="action-text">Đơn hàng của tôi</div>
                </Link>
                <Link to="/favorites" className="action-card">
                  <div className="action-icon">❤️</div>
                  <div className="action-text">Sản phẩm yêu thích</div>
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
        }

        .profile-page {
          flex: 1;
          background: linear-gradient(135deg, #fef5e7 0%, #fdebd0 100%);
          padding: 40px 20px;
        }

        .profile-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 30px;
        }

        /* SIDEBAR */
        .profile-sidebar {
          background: white;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
          height: fit-content;
        }

        .profile-avatar {
          text-align: center;
          margin-bottom: 30px;
        }

        .avatar-circle {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8B4513, #A0522D);
          color: white;
          font-size: 42px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 15px;
          box-shadow: 0 4px 12px rgba(139, 69, 19, 0.3);
        }

        .user-name {
          font-size: 20px;
          font-weight: 700;
          color: #333;
          margin: 0 0 5px;
        }

        .user-email {
          font-size: 14px;
          color: #666;
          margin: 0;
        }

        .profile-nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          border-radius: 8px;
          text-decoration: none;
          color: #666;
          font-size: 15px;
          font-weight: 500;
          transition: all 0.3s;
          border: none;
          background: none;
          cursor: pointer;
          width: 100%;
          text-align: left;
        }

        .nav-link:hover {
          background: #fef5e7;
          color: #8B4513;
        }

        .nav-link.active {
          background: linear-gradient(135deg, #8B4513, #A0522D);
          color: white;
          box-shadow: 0 2px 8px rgba(139, 69, 19, 0.3);
        }

        .nav-icon {
          font-size: 20px;
        }

        .logout-btn:hover {
          background: #ffebee;
          color: #d32f2f;
        }

        /* CONTENT */
        .profile-content {
          background: white;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        }

        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
          padding-bottom: 15px;
          border-bottom: 2px solid #f0f0f0;
        }

        .content-title {
          font-size: 24px;
          font-weight: 700;
          color: #333;
          margin: 0;
        }

        .btn-edit {
          padding: 10px 20px;
          background: linear-gradient(135deg, #8B4513, #A0522D);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.3s;
        }

        .btn-edit:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(139, 69, 19, 0.3);
        }

        /* INFO CARD */
        .info-card {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .info-row {
          display: grid;
          grid-template-columns: 180px 1fr;
          align-items: start;
          gap: 20px;
        }

        .info-label {
          font-size: 15px;
          font-weight: 600;
          color: #666;
          padding-top: 8px;
        }

        .info-value {
          font-size: 15px;
          color: #333;
          padding: 8px 0;
        }

        .info-input,
        .info-textarea {
          width: 100%;
          padding: 10px 14px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 15px;
          font-family: inherit;
          transition: all 0.3s;
        }

        .info-input:focus,
        .info-textarea:focus {
          outline: none;
          border-color: #8B4513;
          box-shadow: 0 0 0 3px rgba(139, 69, 19, 0.1);
        }

        .info-textarea {
          resize: vertical;
        }

        .edit-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 10px;
          padding-top: 20px;
          border-top: 1px solid #f0f0f0;
        }

        .btn-cancel,
        .btn-save {
          padding: 10px 24px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          border: none;
        }

        .btn-cancel {
          background: #f5f5f5;
          color: #666;
        }

        .btn-cancel:hover {
          background: #e0e0e0;
        }

        .btn-save {
          background: linear-gradient(135deg, #8B4513, #A0522D);
          color: white;
        }

        .btn-save:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(139, 69, 19, 0.3);
        }

        /* QUICK ACTIONS */
        .quick-actions {
          margin-top: 40px;
          padding-top: 30px;
          border-top: 2px solid #f0f0f0;
        }

        .section-title {
          font-size: 18px;
          font-weight: 700;
          color: #333;
          margin: 0 0 20px;
        }

        .action-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
        }

        .action-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding: 24px 16px;
          background: linear-gradient(135deg, #fef5e7, #fdebd0);
          border-radius: 12px;
          text-decoration: none;
          transition: all 0.3s;
          border: 2px solid transparent;
        }

        .action-card:hover {
          border-color: #8B4513;
          transform: translateY(-4px);
          box-shadow: 0 6px 16px rgba(139, 69, 19, 0.2);
        }

        .action-icon {
          font-size: 32px;
        }

        .action-text {
          font-size: 14px;
          font-weight: 600;
          color: #333;
          text-align: center;
        }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .profile-container {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .info-row {
            grid-template-columns: 1fr;
            gap: 8px;
          }

          .info-label {
            padding-top: 0;
          }

          .action-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .edit-actions {
            flex-direction: column;
          }

          .btn-cancel,
          .btn-save {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;
