import axios from "axios";

const API_URL = "http://localhost:8080/api/contact";

export const submitContactForm = async (data) => {
    return await axios.post(API_URL, data);
};
