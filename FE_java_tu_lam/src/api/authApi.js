import axios from "axios";

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api`;

export const registerApi = (data) => axios.post(`${API_BASE}/auth/register`, data);
export const loginApi = (data) => axios.post(`${API_BASE}/auth/login`, data);
export const forgotPasswordApi = (data) => axios.post(`${API_BASE}/auth/forgot-password`, data);
export const resetPasswordApi = (data) => axios.post(`${API_BASE}/auth/reset-password`, data);
