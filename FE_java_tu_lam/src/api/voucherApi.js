import axios from "axios";
const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/vouchers`;

export const getAllVouchers = () => axios.get(API_URL);
export const createVoucher = (data) => axios.post(API_URL, data);
export const deleteVoucher = (id) => axios.delete(`${API_URL}/${id}`);
// Hàm cho user check
export const checkVoucher = (code, total) => axios.get(`${API_URL}/check?code=${code}&total=${total}`);
// Thêm hàm này:
export const getPublicVouchers = () => axios.get(`${API_URL}/public`);