import axios from "axios";

const API_URL = "http://localhost:8080/api/upload";

export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return axios.post(API_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
