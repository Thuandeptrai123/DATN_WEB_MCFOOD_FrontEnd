import axios from "axios";

const API_URL = "https://localhost:7233/api/Auth";

export const login_customer = (data) =>
  axios.post(`${API_URL}/login-customer`, data, {
    headers: {
      "Content-Type": "application/json"
    }
  });
