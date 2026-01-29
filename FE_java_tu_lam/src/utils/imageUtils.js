export const CLOUD_NAME = "dpetnxe5v";
export const FOLDER = "coffee";
export const FALLBACK = "https://res.cloudinary.com/dpetnxe5v/image/upload/coffee/no-image.png";

export const getImg = (photo) => {
    if (!photo || photo === "no-image.png") return FALLBACK;
    if (photo.startsWith("http")) return photo;
    return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${FOLDER}/${photo}`;
};

// Hàm xử lý lỗi ảnh dùng chung để chống loop tuyệt đối
export const handleImgError = (e) => {
    if (e.currentTarget.src !== FALLBACK) {
        e.currentTarget.onerror = null;
        e.currentTarget.src = FALLBACK;
    }
};
