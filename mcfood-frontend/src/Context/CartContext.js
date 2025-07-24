import React, { createContext, useContext, useState, useEffect } from "react";
import CartService from "../api/cartService";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);

  const fetchCart = async () => {
    try {
      const data = await CartService.getUserCart();
      setCart(data);
    } catch (error) {
      // console.error("Lỗi khi lấy giỏ hàng:", error);
    }
  };

  const addItem = async (item) => {
    await CartService.addItemToCart(item); // ví dụ: { FoodID, Quantity }
    await fetchCart(); // cập nhật lại cart sau khi thêm
  };

  const updateItem = async (id, quantity) => {
    await CartService.updateCartItem(id, quantity);
    await fetchCart();
  };

  const removeItem = async (id) => {
    await CartService.removeCartItem(id);
    await fetchCart();
  };

  const clearCart = async () => {
    await CartService.clearCart();
    await fetchCart();
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{ cart, fetchCart, addItem, updateItem, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
