import axios from "axios";

const API_URL = "https://localhost:7233/api/User";

export const register_customer = (data) =>
  axios.post(`${API_URL}/register_customer`, data); // ✅ Không truyền headers
