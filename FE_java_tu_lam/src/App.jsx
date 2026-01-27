import { BrowserRouter, Routes, Route } from "react-router-dom";
//Khách Hàng
import HomePage from "./pages/client/HomePage";
import ProductsPage from "./pages/client/ProductsPage";
import NewsPage from "./pages/client/NewsPage";
import ProductDetailPage from "./pages/client/ProductDetailPage";
import CartPage from "./pages/client/CartPage";
import LoginPage from "./pages/client/LoginPage";
import RegisterPage from "./pages/client/RegisterPage";
import CheckoutPage from "./pages/client/CheckoutPage";
import Profile from "./pages/client/ProfilePage";
import Search from "./pages/client/SearchPage";
import ContactPage from "./pages/client/ContactPage";
import ComboPage from "./pages/product/ComboPage";
import OrderDetailPage from "./pages/client/OrderDetailPage";
import OrderHistoryPage from "./pages/client/OrderHistoryPage";
import FavoritesPage from "./pages/client/FavoritesPage";
//Admin
import AdminRoute from "./components/admin/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProductList from "./pages/admin/product/ProductList";
import ProductAdd from "./pages/admin/product/ProductAdd";
import ProductEdit from "./pages/admin/product/ProductEdit";
import ProductDelete from "./pages/admin/product/ProductDelete";
import CategoryList from "./pages/admin/category/CategoryList";
import CategoryAdd from "./pages/admin/category/CategoryAdd";
import CategoryEdit from "./pages/admin/category/CategoryEdit";
import AdminOrderPage from "./pages/admin/order/AdminOrderPage";
import AdminVoucherPage from "./pages/admin/voucher/AdminVoucherPage";
import ContactManager from "./pages/admin/ContactManager";
import UserManager from "./pages/admin/UserManager";
import AdminLoginPage from "./pages/admin/AdminLoginPage"; // Import Admin Login

import ForgotPasswordPage from "./pages/client/ForgotPasswordPage";
import ResetPasswordPage from "./pages/client/ResetPasswordPage";
import PaymentResultPage from "./pages/client/PaymentResultPage";


import ToastContainer from "./components/ToastContainer";
import ChatAI from "./components/ChatAI";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <ChatAI />
      <Routes>
        {/* CLIENT */}
        <Route path="/" element={<HomePage />} />
        <Route path="/san-pham" element={<ProductsPage />} />
        <Route path="/tin-tuc" element={<NewsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-orders" element={<OrderHistoryPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/search" element={<Search />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/payment-result" element={<PaymentResultPage />} />
        <Route path="/orders/:id" element={<OrderDetailPage />} />
        <Route path="/combo/:type" element={<ComboPage />} />

        {/* ADMIN ROUTES (Protected) */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<ProductList />} />
          <Route path="/admin/products/add" element={<ProductAdd />} />
          <Route path="/admin/products/edit/:id" element={<ProductEdit />} />
          <Route path="/admin/orders" element={<AdminOrderPage />} />
          <Route path="/admin/categories" element={<CategoryList />} />
          <Route path="/admin/categories/add" element={<CategoryAdd />} />
          <Route path="/admin/categories/edit/:id" element={<CategoryEdit />} />
          <Route path="/admin/vouchers" element={<AdminVoucherPage />} />
          <Route path="/admin/contacts" element={<ContactManager />} />
          <Route path="/admin/users" element={<UserManager />} />

          {/* TRASH & DELETE */}
          <Route path="/admin/products/delete" element={<ProductDelete />} />
          <Route path="/admin/products/delete/:id" element={<ProductDelete />} />
        </Route>

        {/* AUTH */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} /> {/* Admin Login */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
