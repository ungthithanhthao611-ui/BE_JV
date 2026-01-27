import { useState, useEffect } from "react";
import { getFavorites, addFavorite, removeFavorite } from "../api/favoriteApi";

// Hook quản lý danh sách yêu thích toàn cục (hoặc local)
// Để đơn giản và tránh phức tạp với Context API, hook này sẽ tự quản lý state danh sách ID
// và sync với sessionStorage hoặc gọi API mỗi khi mount.
// Một cách tốt hơn là dùng Context, nhưng ở đây ta dùng "Custom Event" để các component sync với nhau
// khi người dùng thao tác ở nơi khác.

export const useFavorites = () => {
    const [favoriteIds, setFavoriteIds] = useState([]);
    // SỬA: Đọc userId từ sessionStorage (nơi lưu session hiện tại)
    const userId = sessionStorage.getItem("userId");

    // Load favorites init
    useEffect(() => {
        if (userId) {
            loadFavoriteIds();
        } else {
            // Nếu không có user (đã logout), xóa danh sách yêu thích trên UI
            setFavoriteIds([]);
        }
    }, [userId]);

    // Lắng nghe sự kiện custom để update realtime giữa các components
    useEffect(() => {
        const handleStorageChange = () => {
            // Lấy lại userId mới nhất từ sessionStorage
            const currentUserId = sessionStorage.getItem("userId");
            if (currentUserId) {
                // Load lại nếu có user
                getFavorites(currentUserId)
                    .then(res => setFavoriteIds(res.data.map(p => p.id)))
                    .catch(e => console.error(e));
            } else {
                setFavoriteIds([]);
            }
        };

        // Custom event "favoritesUpdated" VÀ "auth_changed" (được bắn ra khi login/logout ở Header)
        // Lưu ý: storage event chỉ bắt changes localStorage giữa các tab, session storage không support event này giữa các tab.
        // Nhưng Header.jsx có bắn "auth_changed"
        window.addEventListener("favoritesUpdated", handleStorageChange);
        window.addEventListener("auth_changed", handleStorageChange);

        return () => {
            window.removeEventListener("favoritesUpdated", handleStorageChange);
            window.removeEventListener("auth_changed", handleStorageChange);
        };
    }, []); // Run once event listener binding

    const loadFavoriteIds = async () => {
        try {
            const res = await getFavorites(userId);
            const ids = res.data.map(p => p.id);
            setFavoriteIds(ids);
        } catch (e) {
            console.error("Lỗi load favorites:", e);
        }
    };

    const checkIsFavorite = (productId) => {
        return favoriteIds.includes(productId);
    };

    const toggleFavorite = async (productId) => {
        if (!userId) {
            alert("Vui lòng đăng nhập để sử dụng tính năng yêu thích!");
            // window.location.href = "/login"; // Hoặc navigate
            return;
        }

        const isFav = checkIsFavorite(productId);

        // 1. Optimistic Update (Cập nhật UI ngay lập tức)
        if (isFav) {
            setFavoriteIds(prev => prev.filter(id => id !== productId));
        } else {
            setFavoriteIds(prev => [...prev, productId]);
        }

        // 2. Call API (Background)
        try {
            if (isFav) {
                await removeFavorite(userId, productId);
            } else {
                await addFavorite(userId, productId);
            }
            // Phát event để các component khác cũng cập nhật (ví dụ header count, hay product card ở chỗ khác)
            window.dispatchEvent(new Event("favoritesUpdated"));
        } catch (error) {
            // Revert nếu lỗi
            console.error("Lỗi toggle favorite:", error);
            alert("Có lỗi xảy ra, vui lòng thử lại!");
            if (isFav) {
                setFavoriteIds(prev => [...prev, productId]);
            } else {
                setFavoriteIds(prev => prev.filter(id => id !== productId));
            }
        }
    };

    return { favoriteIds, checkIsFavorite, toggleFavorite };
};
