export const CLOUD_NAME = "dpetnxe5v";
export const FOLDER = "coffee";
// Sử dụng một proxy hoặc dịch vụ placeholder tin cậy hơn nếu Cloudinary vẫn lỗi
export const FALLBACK = "https://res.cloudinary.com/dpetnxe5v/image/upload/coffee/no-image.png";
const ALT_FALLBACK = "https://via.placeholder.com/400x400?text=No+Image";

export const getImg = (photo) => {
    if (!photo || photo === "no-image.png") return FALLBACK;
    if (photo.startsWith("http")) return photo;

    // Encode tên file để tránh lỗi kí tự đặc biệt (khoảng trắng, dấu ngoặc, ...)
    const encodedPhoto = encodeURIComponent(photo);

    // Nếu photo đã chứa dấu / thì coi như đã có folder hoặc là path đầy đủ
    if (photo.includes("/")) {
        return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${photo}`;
    }

    return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${FOLDER}/${encodedPhoto}`;
};

// Hàm xử lý lỗi ảnh dùng chung để chống loop tuyệt đối
export const handleImgError = (e) => {
    const target = e.currentTarget;
    const currentSrc = target.src;

    // Nếu ảnh gốc lỗi -> thử FALLBACK của Cloudinary
    if (currentSrc !== FALLBACK && !currentSrc.includes("placeholder")) {
        console.warn("Image load failed, switching to fallback:", currentSrc);
        target.onerror = null; // Tạm thời null để gán src mới
        target.src = FALLBACK;

        // Thiết lập một trình xử lý lỗi mới cho FALLBACK nếu nó cũng lỗi
        target.onerror = () => {
            console.error("Cloudinary fallback also failed, using placeholder");
            target.onerror = null;
            target.src = ALT_FALLBACK;
        };
    } else if (currentSrc === FALLBACK) {
        // Nếu chính FALLBACK lỗi ngay từ đầu
        target.onerror = null;
        target.src = ALT_FALLBACK;
    }
};
