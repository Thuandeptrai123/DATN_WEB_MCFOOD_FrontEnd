import axios from "axios";

const API_URL = "https://localhost:7233/api/Combos";

export const getAllCombos = () => axios.get(API_URL);

export const getComboById = (id) => axios.get(`${API_URL}/${id}`);
