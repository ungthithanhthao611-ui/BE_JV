import React from "react";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <h5>Kết nối với chúng tôi</h5>
            <p style={{ fontSize: "13px", lineHeight: "1.6" }}>
              Chúng tôi mong muốn tạo nên hương vị cuộc sống tuyệt vời nhất.
            </p>
            <div className="socials">
              <span>Facebook</span> <span>Insta</span> <span>Twitter</span>
            </div>
          </div>

          <div>
            <h5>Hệ thống cửa hàng</h5>
            <ul>
              <li>Coffee Thai Giao</li>
              <li>237 Hai Bà Trưng, Q.3</li>
              <li>Hotline: 0912.345.678</li>
            </ul>
          </div>

          <div>
            <h5>Chính sách</h5>
            <ul>
              <li>Thẻ thành viên</li>
              <li>Tuyển dụng</li>
              <li>Bảo mật</li>
            </ul>
          </div>

          <div>
            <h5>Liên hệ</h5>
            <ul>
              <li>Thứ 2 - Thứ 6: 8am - 9pm</li>
              <li>Thứ 7 - CN: 8am - 10pm</li>
              <li>123 Đường Cà Phê, TP.HCM</li>
            </ul>
          </div>
        </div>

        <div className="copyright">
          © 2025 Coffee Brand. Designed by HaluCafe.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
