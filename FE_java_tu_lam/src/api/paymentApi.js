import axios from "axios";

const API_BASE = "http://localhost:8080/api/payment";

export const createMomoPayment = (data) => axios.post(`${API_BASE}/create-momo`, data);
