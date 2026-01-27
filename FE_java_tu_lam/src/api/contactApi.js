import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/contact`;

export const submitContactForm = async (data) => {
    return await axios.post(API_URL, data);
};
