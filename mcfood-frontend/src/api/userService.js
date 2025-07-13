import axios from "axios";

const API_URL = "http://localhost:5000/api/User"; // thay url của bạn

// const getProfile = async (token) => {
//   return axios.get(`${API_URL}/${getUserId()}`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
// };
// Gọi user info (ví dụ từ API /api/User/{id}), hoặc tự viết thêm /me
const getProfile = (id, token) => {
  return axios.get(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const updateProfile = (formData, token) => {
  return axios.put(API_URL, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};


const changePassword = async (data, token) => {
  return axios.put(`${API_URL}/change-password`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const getUserId = () => {
  // giả sử lưu ID trong localStorage khi login
  return localStorage.getItem("userId");
};

export default {
  getProfile,
  updateProfile,
  changePassword,
};
