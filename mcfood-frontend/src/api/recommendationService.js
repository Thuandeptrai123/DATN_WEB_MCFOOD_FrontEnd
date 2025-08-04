import axios from "axios";

const API_URL = "https://localhost:7233/api/Invoice/recommendation";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const RecommendationService = {
  getPopular: () => axios.get(`${API_URL}/popular`),
  getLatest: () => axios.get(`${API_URL}/latest`, { headers: getAuthHeaders() }),
  getFavorite: () => axios.get(`${API_URL}/favorite`, { headers: getAuthHeaders() }),
};


export default RecommendationService;
