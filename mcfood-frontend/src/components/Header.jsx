import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header
      style={{
        background: "#000",
        padding: "15px 20px",
        color: "#fff",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <nav style={{ display: "flex", gap: "20px" }}>
        <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
          Trang chủ
        </Link>
        <Link to="/cart" style={{ color: "#fff", textDecoration: "none" }}>
          Giỏ hàng
        </Link>
        <Link to="/login" style={{ color: "#fff", textDecoration: "none" }}>
          Đăng nhập
        </Link>
      </nav>
    </header>
  );
}
