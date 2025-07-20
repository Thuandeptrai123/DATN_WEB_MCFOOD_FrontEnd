import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
import "./Header.css";
import CartService from "../api/cartService"; // Đường dẫn đúng

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [totalItems, setTotalItems] = useState(0); // Dùng useState thay vì Redux
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cart = await CartService.getUserCart(); // Gọi API
        setTotalItems(cart?.totalItems || 0); // Cập nhật state
      } catch (err) {
        console.error("Lỗi khi lấy giỏ hàng:", err);
      }
    };

    if (user) {
      fetchCart(); // Chỉ fetch nếu đã đăng nhập
    }
  }, [user]); // Nếu user thay đổi, refetch cart

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const closeDropdown = () => setIsDropdownOpen(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    closeDropdown();
  };

  return (
    <header className="header">
      <div className="header-logo-container" onClick={() => navigate("/")}>
        <div className="header-logo" >🍽️</div>
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
        <Link to="/" className="header-link" onClick={closeMobileMenu}>
          Thực đơn
        </Link>
        <Link to="/cart" className="header-link cart-link" onClick={closeMobileMenu}>
          Yêu thích
          {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
        </Link>
        <Link to="/cart" className="header-link cart-link" onClick={closeMobileMenu}>
          Giỏ hàng
          {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
        </Link>

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
                <button className="dropdown-item logout-btn">
                  Lịch sử
                </button>
                {/* <Link to="/history">aa<Link/> */}
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}