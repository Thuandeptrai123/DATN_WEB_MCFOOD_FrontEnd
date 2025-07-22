import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../Contexts/CartContext"; // ✅
import "./CartDropdown.css";

const CartDropdown = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { cart } = useCart(); // ✅ Dùng context
  const navigate = useNavigate();

  const handleMouseEnter = () => setShowDropdown(true);
  const handleMouseLeave = () => setShowDropdown(false);
  const handleClick = () => navigate("/cart");

  return (
    <div
      className="cart-dropdown-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <div className="header-link cart-link">
        Giỏ hàng
        {/* Nếu muốn thêm badge ở đây */}
        {/* {cart?.Items?.length > 0 && (
          <span className="cart-badge">{cart.Items.length}</span>
        )} */}
      </div>

      {showDropdown && (
        <div className="cart-dropdown">
          {cart?.Items?.length > 0 ? (
            <>
              {cart.Items.slice(0, 5).map((item) => {
                const details = item.FoodDetails || item.ComboDetails;
                const imageUrl = details?.ImageUrl;
                return (
                  <div key={item.CartItemId} className="cart-dropdown-item">
                    <img
                      src={`https://localhost:7233${imageUrl}`}
                      alt={item.ProductName}
                    />
                    <div className="cart-dropdown-info">
                      <div className="name">{item.ProductName}</div>
                      <div className="quantity">SL: {item.TotalQuantity}</div>
                      <div className="price">
                        {item.TotalPrice.toLocaleString()} VND
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="cart-dropdown-footer">
                <strong>
                  Tổng: {cart.TotalAmount?.toLocaleString() || 0} VND
                </strong>
                <span className="view-cart">Xem chi tiết →</span>
              </div>
            </>
          ) : (
            <div className="cart-dropdown-empty">
              🛒 Chưa có sản phẩm trong giỏ hàng
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CartDropdown;
