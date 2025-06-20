import axios from "axios";

const API_URL = "https://localhost:7233/api/FoodType"; // adjust port if needed

export const getAllFoodTypes = () => axios.get(API_URL);
export const getFoodTypeById = (id) => axios.get(`${API_URL}/${id}`);
export const createFoodType = (data) => axios.post(API_URL, data);
export const updateFoodType = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteFoodType = (id) => axios.delete(`${API_URL}/${id}`);