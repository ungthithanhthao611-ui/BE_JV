import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
    const role = sessionStorage.getItem("userRole");

    if (role !== "ADMIN") {
        // Nếu không phải admin, đá về trang đăng nhập ADMIN
        return <Navigate to="/admin/login" replace />;
    }

    // Nếu là admin, cho phép truy cập các route con (Outlet)
    return <Outlet />;
};

export default AdminRoute;
