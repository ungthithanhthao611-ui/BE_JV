import axios from "axios";

const API_BASE = "http://localhost:8080/api";

export const registerApi = (data) => axios.post(`${API_BASE}/auth/register`, data);
export const loginApi = (data) => axios.post(`${API_BASE}/auth/login`, data);
export const forgotPasswordApi = (data) => axios.post(`${API_BASE}/auth/forgot-password`, data);
export const resetPasswordApi = (data) => axios.post(`${API_BASE}/auth/reset-password`, data);
