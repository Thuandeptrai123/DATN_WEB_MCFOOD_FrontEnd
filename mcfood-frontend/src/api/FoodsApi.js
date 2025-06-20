import axios from "axios";

const API_URL = "https://localhost:7233/api/Foods"; // điều chỉnh cổng nếu khác

export const getAllFoods = () => axios.get(API_URL);

export const getFoodById = (id) => axios.get(`${API_URL}/${id}`);

export const createFood = (data) => axios.post(API_URL, data);

export const updateFood = (id, data) => axios.put(`${API_URL}/${id}`, data);

export const deleteFood = (id) => axios.delete(`${API_URL}/${id}`);
