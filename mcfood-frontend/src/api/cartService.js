// src/api/cartService.js
import axios from "axios";

const API_URL = "https://localhost:7233/api/cart";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const CartService = {
  getUserCart: async () => {
    const res = await axios.get(`${API_URL}/user-cart`, getAuthHeader());
    return res.data;
  },
  addItemToCart: async (data) => {
    const res = await axios.post(`${API_URL}/add-item`, data, getAuthHeader());
    return res.data;
  },
  updateCartItem: async (cartItemId, quantity) => {
    const res = await axios.put(
      `${API_URL}/update/${cartItemId}`,
      { quantity },
      getAuthHeader()
    );
    return res.data;
  },
  removeCartItem: async (cartItemId) => {
    const res = await axios.delete(`${API_URL}/remove/${cartItemId}`, getAuthHeader());
    return res.data;
  },
  clearCart: async () => {
    const res = await axios.delete(`${API_URL}/clear`, getAuthHeader());
    return res.data;
  },
};

export default CartService;
