import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/categories`;

export const getAllCategories = () => axios.get(API_URL);
export const getCategoryById = (id) => axios.get(`${API_URL}/${id}`);
export const createCategory = (data) => axios.post(API_URL, data);
export const updateCategory = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteCategory = (id) => axios.delete(`${API_URL}/${id}`);