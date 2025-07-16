import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
import "./Header.css";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Lấy user từ store
  const user = useSelector((state) => state.auth.user);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/"); // Chuyển hướng về trang chủ hoặc login
  };

  return (
    <header className="header">
      {/* Logo/Brand */}
      <div className="header-logo-container">
        <div className="header-logo">🍽️</div>
        <div className="header-brand">MCFOOD</div>
      </div>

      {/* Mobile Menu Toggle Button */}
      <div 
        className={`mobile-menu-toggle ${isMobileMenuOpen ? "active" : ""}`}
        onClick={toggleMobileMenu}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Navigation */}
      <nav className={`header-nav ${isMobileMenuOpen ? "active" : ""}`}>
        <Link 
          to="/" 
          className="header-link"
          onClick={closeMobileMenu}
        >
          Thực đơn
        </Link>
        <Link 
          to="/cart" 
          className="header-link"
          onClick={closeMobileMenu}
        >
          Giỏ hàng
        </Link>

        {!user ? (
          <>
            <Link 
              to="/login" 
              className="header-login-btn"
              onClick={closeMobileMenu}
            >
              Đăng nhập
            </Link>
            <Link 
              to="/register" 
              className="header-login-btn"
              onClick={closeMobileMenu}
            >
              Đăng ký
            </Link>
          </>
        ) : (
          <>
            <Link 
              to="/profile" 
              className="header-link"
              onClick={closeMobileMenu}
            >
              Tài khoản
            </Link>
            <button
              className="header-logout-btn"
              onClick={() => {
                closeMobileMenu();
                handleLogout();
              }}
            >
              Đăng xuất
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
