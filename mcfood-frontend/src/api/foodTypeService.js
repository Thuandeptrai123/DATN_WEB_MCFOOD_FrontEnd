import axios from "axios";

const API_URL = "https://localhost:7233/api/foodtype";

export const getAllFoodTypes = async () => {
  try {
    const res = await axios.get(API_URL);
    return res.data.data || [];
  } catch (error) {
    console.error("Lỗi lấy loại món ăn:", error);
    return [];
  }
};
