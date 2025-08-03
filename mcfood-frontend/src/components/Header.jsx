import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
import "./Header.css";
import CartDropdown from "./CartDropdown";
import { useCart } from "../Context/CartContext"; // ✅ Dùng context
// import 'bootstrap/dist/css/bootstrap.min.css';


export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const { cart } = useCart(); // ✅ Lấy dữ liệu giỏ hàng

  // ✅ Tính tổng số lượng từ cart
  // const totalItems = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const totalItems = cart?.Items?.reduce((sum, item) => sum + item.TotalQuantity, 0) || 0;


  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const closeDropdown = () => setIsDropdownOpen(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    closeDropdown();
    window.location.reload();
  };
  const handleClickHistory = () => {
    navigate("/order-history");
  }

  return (
    <header className="header">
      <div className="header-logo-container" onClick={() => navigate("/")}>
        <div className="header-logo">🍽️</div>
        <div className="header-brand">MCFOOD</div>
      </div>

      <div
        className={`mobile-menu-toggle ${isMobileMenuOpen ? "active" : ""}`}
        onClick={toggleMobileMenu}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      <nav className={`header-nav ${isMobileMenuOpen ? "active" : ""}`}>
        <Link to="/menu" className="header-link" onClick={closeMobileMenu}>
          Thực đơn
        </Link>

        {/* ❤️ Yêu thích (chưa dùng context, nếu có thì tương tự) */}
        <Link to="/favorites" className="header-link" onClick={closeMobileMenu}>
          Yêu thích
        </Link>

        {/* 🛒 Giỏ hàng có dropdown + badge */}
        <div className="header-link cart-container">
          <CartDropdown />
          {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
        </div>

        {!user ? (
          <>
            <Link to="/login" className="header-login-btn" onClick={closeMobileMenu}>
              Đăng nhập
            </Link>
            <Link to="/register" className="header-login-btn" onClick={closeMobileMenu}>
              Đăng ký
            </Link>
          </>
        ) : (
          <div className="header-user-dropdown" onClick={toggleDropdown}>
            <div className="header-link">
              👋 Xin chào, <strong>{user?.username}</strong>
            </div>
            {isDropdownOpen && (
              <div className="header-dropdown-menu">
                <Link
                  to="/profile"
                  className="dropdown-item"
                  onClick={() => {
                    closeMobileMenu();
                    closeDropdown();
                  }}
                >
                  🧑 Tài khoản
                </Link>
                <button className="dropdown-item logout-btn" onClick={handleLogout}>
                  🔓 Đăng xuất
                </button>
                <button className="dropdown-item logout-btn" onClick={handleClickHistory}>📦 Lịch sử</button>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
