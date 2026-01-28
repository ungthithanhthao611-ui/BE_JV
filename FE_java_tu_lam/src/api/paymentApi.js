import axios from "axios";

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api/payment`;

export const createMomoPayment = (data) => axios.post(`${API_BASE}/create-momo`, data);
