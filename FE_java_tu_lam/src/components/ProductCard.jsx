import React from "react";
import { useFavorites } from "../hooks/useFavorites"; // Import hook

const FALLBACK = "https://res.cloudinary.com/dpetnxe5v/image/upload/v1/coffee/no-image.png";
const CLOUD_NAME = "dpetnxe5v";
const FOLDER = "coffee"; // folder bạn upload trên Cloudinary

const getImg = (photo) => {
  if (!photo) return FALLBACK; // đã có fallback cloud
  if (photo.startsWith("http")) return photo; // đã là URL thì dùng luôn
  // photo chỉ là tên file -> ghép thành URL Cloudinary
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${FOLDER}/${encodeURIComponent(photo)}`;
};

const ProductCard = ({ product, onClick }) => {
  // Sử dụng hook
  const { checkIsFavorite, toggleFavorite } = useFavorites();

  // ✅ CHẶN LỖI: chưa có product thì không render
  if (!product) return null;

  // Chuẩn hóa giá
  const price = product.price ?? 0;
  const priceRoot = product.price_root ?? 0;

  // Logic hiển thị giá sale
  const hasSale = priceRoot > 0 && priceRoot < price;

  // Check trạng thái favorite từ hook
  const isFavorite = checkIsFavorite(product.id);

  return (
    <div className="product-card" onClick={() => onClick?.(product.id)}>
      <div className="image-container">
        <img
          src={getImg(product.photo)}
          alt={product.title}
          onError={(e) => { e.currentTarget.src = FALLBACK; }}
        />

        {/* Nút Yêu thích (Tym) - Tự động xử lý toggle */}
        <button
          className={`favorite-btn ${isFavorite ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation(); // Chặn click vào card
            toggleFavorite(product.id);
            // Opsional: vẫn gọi onClick prop nếu cha muốn biết
            if (onClick) onClick(product.id, "favorite_click_only");
          }}
          title={isFavorite ? "Bỏ yêu thích" : "Yêu thích"}
        >
          {isFavorite ? "❤️" : "🤍"}
        </button>

        {/* Nhãn giảm giá */}
        {hasSale && (
          <span className="sale-tag">
            Giảm {Math.round(((price - priceRoot) / price) * 100)}%
          </span>
        )}
      </div>

      <div className="product-info">
        <h4 className="product-title">{product.title}</h4>

        <div className="price-box">
          {hasSale ? (
            <>
              {/* Giá Sale */}
              <span className="current-price">
                {priceRoot.toLocaleString()} đ
              </span>
              {/* Giá gốc */}
              <span className="old-price">
                {price.toLocaleString()} đ
              </span>
            </>
          ) : (
            <span className="current-price">
              {price.toLocaleString()} đ
            </span>
          )}
        </div>

        <button
          className="add-cart-btn"
          onClick={(e) => {
            e.stopPropagation();
            if (onClick) onClick(product.id, "cart");
          }}
        >
          Chọn mua
        </button>
      </div>

      <style>{`
        .product-card {
          background: #fff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transition: 0.3s;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .product-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .image-container {
          position: relative;
          width: 100%;
          padding-top: 100%;
          overflow: hidden; /* Important for zoom effect */
        }
        .image-container img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease; /* Smooth zoom transition */
        }
        .product-card:hover .image-container img {
          transform: scale(1.1); /* Zoom effect on hover */
        }

        .favorite-btn {
          position: absolute;
          top: 10px;
          left: 10px;
          background: rgba(255, 255, 255, 0.9);
          border: none;
          border-radius: 50%;
          width: 35px;
          height: 35px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 20px;
          transition: all 0.2s;
          z-index: 2;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }

        .favorite-btn:hover {
          transform: scale(1.1);
          background: #fff;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        .favorite-btn.active {
          background: #fff;
        }

        .sale-tag {
          position: absolute;
          top: 10px;
          right: 10px;
          background: #d32f2f;
          color: #fff;
          padding: 3px 8px;
          font-size: 12px;
          font-weight: bold;
          border-radius: 4px;
        }

        .product-info {
          padding: 12px;
          text-align: center;
        }

        .product-title {
          font-size: 16px;
          margin: 0 0 8px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .price-box {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-bottom: 10px;
        }

        .current-price {
          color: #d32f2f;
          font-weight: bold;
          font-size: 16px;
        }

        .old-price {
          color: #888;
          text-decoration: line-through;
          font-size: 13px;
        }

        .add-cart-btn {
          background: #fff;
          color: #d32f2f;
          border: 1px solid #d32f2f;
          padding: 6px 12px;
          border-radius: 4px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s;
        }

        .add-cart-btn:hover {
          background: #d32f2f;
          color: #fff;
        }
      `}</style>
    </div>
  );
};

export default ProductCard;
