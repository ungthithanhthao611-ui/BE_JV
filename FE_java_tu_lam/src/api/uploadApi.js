import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/upload`;

export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return axios.post(API_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
