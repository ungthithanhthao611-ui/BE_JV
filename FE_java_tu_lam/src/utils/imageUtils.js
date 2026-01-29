export const CLOUD_NAME = "dpetnxe5v";
export const FOLDER = "coffee";
export const FALLBACK = "https://res.cloudinary.com/dpetnxe5v/image/upload/v1/coffee/no-image.png";

export const getImg = (photo) => {
    if (!photo) return FALLBACK;
    if (photo.startsWith("http")) return photo;
    return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1/${FOLDER}/${photo}`;
};
