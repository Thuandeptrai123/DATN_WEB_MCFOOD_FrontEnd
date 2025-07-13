import axios from "axios";

const API_URL = "https://localhost:7233/api/Cart";

export const getCartByCustomer = (customerId) =>
  axios.get(`${API_URL}/${customerId}`);

export const removeItemFromCart = (itemId) =>
  axios.delete(`${API_URL}/item/${itemId}`);

export const updateCartItemQuantity = (itemId, quantity) =>
  axios.put(`${API_URL}/item/${itemId}`, quantity);
