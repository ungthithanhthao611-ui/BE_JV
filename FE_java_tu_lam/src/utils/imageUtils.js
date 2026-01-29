export const CLOUD_NAME = "dpetnxe5v";
export const FOLDER = "coffee";
// Sử dụng URL tuyệt đối không có version để Cloudinary tự nhận diện
export const FALLBACK = "https://res.cloudinary.com/dpetnxe5v/image/upload/coffee/no-image.png";

export const getImg = (photo) => {
    if (!photo || photo === "no-image.png") return FALLBACK;
    if (photo.startsWith("http")) return photo;

    // ĐẢM BẢO ENCODE: Những tên file có dấu, khoảng trắng, hoặc kí tự đặc biệt (như (3)) 
    // phải được encode thì link Cloudinary mới chạy được.
    const encodedPhoto = encodeURIComponent(photo);

    // Kiểm tra xem photo có chứa folder chưa
    if (photo.includes("/")) {
        return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${photo}`;
    }

    return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${FOLDER}/${encodedPhoto}`;
};

// Hàm xử lý lỗi ảnh dùng chung để chống loop tuyệt đối
export const handleImgError = (e) => {
    if (e.currentTarget.src !== FALLBACK) {
        e.currentTarget.onerror = null;
        e.currentTarget.src = FALLBACK;
    }
};
