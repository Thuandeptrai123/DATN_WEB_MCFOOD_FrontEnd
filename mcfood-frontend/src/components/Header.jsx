import { Link } from "react-router-dom";
import "./Header.css";

export default function Header() {
  return (
    <header className="header">
      {/* Logo/Brand */}
      <div className="header-logo-container">
        <div className="header-logo">🍽️</div>
        <div className="header-brand">MCFOOD</div>
      </div>

      {/* Navigation */}
      <nav className="header-nav">
        <Link to="/" className="header-link">Trang chủ</Link>
        <Link to="/productlist" className="header-link">Thực đơn</Link>
        <Link to="/cart" className="header-link">Giỏ hàng</Link>
        <Link to="/login" className="header-login-btn">Đăng nhập</Link>
        <Link to="/register" className="header-login-btn">Đăng ký</Link>
      </nav>
    </header>
  );
}
