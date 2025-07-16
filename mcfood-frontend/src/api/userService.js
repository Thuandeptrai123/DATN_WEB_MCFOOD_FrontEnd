import axios from "axios";

const API_URL = "https://localhost:7233/api/User"; // Đúng port BE

export const getProfileMe = async (token) => {
  const res = await axios.get(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};


const updateProfile = (formData, token) => {
  return axios.put(`${API_URL}/update-profile`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};


const changePassword = (data, token) => {
  return axios.put(`${API_URL}/change-password`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export default {
  getProfileMe,
  updateProfile,
  changePassword,
};
