import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Link } from 'react-router-dom';

// --- CSS STYLE (VIẾT THẲNG Ở ĐÂY) ---
const cssStyles = `
  /* Reset & Base */
  .page-wrapper { font-family: 'Segoe UI', sans-serif; color: #333; background-color: #fff; }
  .container { max-width: 1200px; margin: 0 auto; padding: 0 15px; }
  a { text-decoration: none; color: inherit; transition: 0.3s; }
  ul { list-style: none; padding: 0; margin: 0; }

  /* BREADCRUMB */
  .breadcrumb-sec { background: #f5f5f5; padding: 15px 0; margin-bottom: 40px; }
  .breadcrumb { font-size: 14px; color: #666; }
  .breadcrumb a:hover { color: #d32f2f; }
  .breadcrumb .current { font-weight: bold; color: #333; margin-left: 5px; }

  /* LAYOUT 2 CỘT */
  .news-layout { display: flex; gap: 40px; align-items: flex-start; padding-bottom: 60px; }
  .sidebar { width: 25%; flex-shrink: 0; }
  .main-content { width: 75%; }

  /* --- SIDEBAR --- */
  .sidebar-box { margin-bottom: 30px; }
  .sidebar-header { 
    font-size: 16px; font-weight: bold; text-transform: uppercase; 
    border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-bottom: 15px; 
    position: relative; color: #333;
  }
  .sidebar-header::after {
    content: ''; position: absolute; bottom: -1px; left: 0; width: 50px; height: 2px; background: #d32f2f;
  }
  
  .cat-list li { border-bottom: 1px dashed #eee; }
  .cat-list a { display: block; padding: 10px 0; font-size: 14px; color: #555; }
  .cat-list a:hover { color: #d32f2f; padding-left: 5px; }

  /* Ảnh quảng cáo sidebar */
  .sidebar-banner img { width: 100%; border-radius: 5px; margin-top: 20px; }

  /* --- DANH SÁCH TIN TỨC --- */
  .page-title { font-size: 24px; font-weight: bold; text-transform: uppercase; margin-bottom: 30px; color: #333; }

  .news-item { display: flex; gap: 20px; margin-bottom: 30px; border-bottom: 1px dashed #eee; padding-bottom: 30px; }
  .news-thumb { width: 280px; flex-shrink: 0; overflow: hidden; border-radius: 4px; }
  .news-thumb img { width: 100%; height: 180px; object-fit: cover; transition: 0.5s; }
  .news-item:hover .news-thumb img { transform: scale(1.1); }

  .news-info { flex: 1; }
  .news-title { font-size: 18px; font-weight: bold; margin: 0 0 10px; text-transform: uppercase; line-height: 1.4; }
  .news-title a { color: #333; }
  .news-title a:hover { color: #d32f2f; }

  .news-meta { font-size: 13px; color: #999; margin-bottom: 15px; display: flex; align-items: center; gap: 10px; }
  .news-meta i { margin-right: 5px; }

  .news-desc { font-size: 14px; color: #666; line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }

  /* RESPONSIVE */
  @media (max-width: 768px) {
    .news-layout { flex-direction: column; }
    .sidebar { width: 100%; order: 2; }
    .main-content { width: 100%; order: 1; }
    .news-item { flex-direction: column; }
    .news-thumb { width: 100%; }
    .news-thumb img { height: auto; aspect-ratio: 16/9; }
  }
`;

// DATA GIẢ LẬP (Dùng ảnh có sẵn trong folder images của bạn)
const newsData = [
  {
    id: 1,
    title: 'Chế biến cà phê',
    author: 'Nguyễn Hữu Mạnh',
    date: '04/04/2019',
    comments: 0,
    desc: 'Cà phê sạch hiểu đơn giản là 100% cà phê, không pha trộn thêm bất cứ thứ gì khác. Quy trình sản xuất chế biến và phát sạch như thế nào...',
    img: '/images/blog2.webp'
  },
  {
    id: 2,
    title: 'Tình yêu và cà phê',
    author: 'Nguyễn Hữu Mạnh',
    date: '04/04/2019',
    comments: 5,
    desc: 'TÌNH YÊU VÀ CÀ PHÊ. Yêu một người cũng giống như yêu một hương vị cà phê. Có thể mất rất ít thời gian để thích, để khám phá. Nhưng cả tình yêu...',
    img: '/images/blog3.webp'
  },
  {
    id: 3,
    title: 'Lắng nghe cà phê kể chuyện',
    author: 'Nguyễn Hữu Mạnh',
    date: '04/04/2019',
    comments: 2,
    desc: 'Cuộc đời cafe, cũng như cuộc đời của con người, cũng phải 9 tháng 10 ngày thai nghén mới được thu hoạch. Cưới cùng cả quãng thời gian 1...',
    img: '/images/sec_quy_trinh_images1.webp'
  },
  {
    id: 4,
    title: 'Cách pha chế Cold Brew tại nhà',
    author: 'Admin',
    date: '12/12/2024',
    comments: 10,
    desc: 'Cold Brew đang là xu hướng thưởng thức cà phê mới của giới trẻ. Vị thanh mát, ít chua và để được lâu trong tủ lạnh. Hãy cùng xem cách làm nhé...',
    img: '/images/module_banner2.webp'
  }
];

const NewsPage = () => {
  return (
    <div className="page-wrapper">
      <style>{cssStyles}</style>
      
      {/* Nếu App.jsx đã có Header/Footer thì bỏ dòng này, nếu chưa thì giữ lại */}
      <Header />

      {/* Breadcrumb */}
      <div className="breadcrumb-sec">
        <div className="container breadcrumb">
          <Link to="/">Trang chủ</Link> / <span className="current">Tin tức</span>
        </div>
      </div>

      <div className="container news-layout">
        {/* --- SIDEBAR --- */}
        <aside className="sidebar">
          {/* Danh mục bài viết */}
          <div className="sidebar-box">
            <h3 className="sidebar-header">DANH MỤC BÀI VIẾT</h3>
            <ul className="cat-list">
              <li><Link to="/">Trang chủ</Link></li>
              <li><Link to="/gioi-thieu">Giới thiệu</Link></li>
              <li><Link to="/san-pham">Sản phẩm</Link></li>
              <li><Link to="/tin-tuc" style={{color: '#d32f2f', fontWeight: 'bold'}}>Tin tức</Link></li>
              <li><Link to="/lien-he">Liên hệ</Link></li>
            </ul>
          </div>

          {/* Banner quảng cáo nhỏ (Ảnh con chồn cà phê như hình mẫu) */}
          <div className="sidebar-banner">
             <img src="/images/module_banner3.webp" alt="Coffee Banner" />
          </div>
        </aside>

        {/* --- MAIN CONTENT --- */}
        <main className="main-content">
          <h1 className="page-title">TIN TỨC</h1>

          <div className="news-list">
            {newsData.map(item => (
              <article key={item.id} className="news-item">
                <div className="news-thumb">
                  <Link to="#">
                    <img src={item.img} alt={item.title} />
                  </Link>
                </div>
                <div className="news-info">
                  <h3 className="news-title">
                    <Link to="#">{item.title}</Link>
                  </h3>
                  <div className="news-meta">
                    <span>👤 {item.author}</span>
                    <span>📅 {item.date}</span>
                    <span>💬 {item.comments} bình luận</span>
                  </div>
                  <p className="news-desc">{item.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default NewsPage;