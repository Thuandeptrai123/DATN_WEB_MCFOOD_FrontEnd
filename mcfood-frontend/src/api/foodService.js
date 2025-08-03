import axios from "axios";

const API_URL = "https://localhost:7233/api/foods";

export const getAllFoods = (params) => axios.get(API_URL, { params });
export const getAllAvailableFoods = () => axios.get(`${API_URL}/available`);


export const getFoodById = (id) => axios.get(`${API_URL}/${id}`);

export const createFood = (data) => axios.post(API_URL, data);

export const updateFood = (id, data) => axios.put(`${API_URL}/${id}`, data);

export const deleteFood = (id) => axios.delete(`${API_URL}/${id}`);

// 👇 THÊM export này
export const foodService = {
  getAll: async () => {
    const res = await axios.get(API_URL);
    return res.data?.data ?? [];
  },

  getByFoodType: async (typeId) => {
    const res = await axios.get(`${API_URL}/bytype/${typeId}`);
    return res.data?.data ?? [];
  },
};

export default foodService;
