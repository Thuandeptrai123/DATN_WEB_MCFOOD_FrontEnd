import { Link } from "react-router-dom";
import { useState } from "react";
import "./Header.css";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
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
        className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={toggleMobileMenu}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Navigation */}
      <nav className={`header-nav ${isMobileMenuOpen ? 'active' : ''}`}>
        {/* <Link 
          to="/" 
          className="header-link"
          onClick={closeMobileMenu}
        >
          Trang chủ
        </Link> */}
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
      </nav>
    </header>
  );
}