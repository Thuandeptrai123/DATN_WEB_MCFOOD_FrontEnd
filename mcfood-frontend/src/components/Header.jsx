import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header
      style={{
        background: "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)",
        padding: "20px 40px",
        color: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        backdropFilter: "blur(10px)",
      }}
    >
      {/* Logo/Brand */}
      <div style={{ 
        display: "flex",
        alignItems: "center",
        gap: "12px"
      }}>
        {/* Logo Container */}
        <div style={{
          width: "40px",
          height: "40px",
          background: "linear-gradient(45deg, #fff, #e0e0e0)",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "20px",
          fontWeight: "bold",
          color: "#000",
          boxShadow: "0 2px 8px rgba(255, 255, 255, 0.2)"
        }}>
          🍽️
        </div>
        
        {/* Brand Text */}
        <div style={{ 
          fontSize: "24px", 
          fontWeight: "bold",
          letterSpacing: "1px",
          background: "linear-gradient(45deg, #fff, #e0e0e0)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text"
        }}>
          MCFOOD
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ 
        display: "flex", 
        gap: "30px",
        alignItems: "center"
      }}>
        <Link 
          to="/" 
          style={{ 
            color: "#fff", 
            textDecoration: "none",
            fontSize: "16px",
            fontWeight: "500",
            padding: "10px 20px",
            borderRadius: "25px",
            transition: "all 0.3s ease",
            position: "relative",
            overflow: "hidden"
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "rgba(255, 255, 255, 0.1)";
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 5px 15px rgba(255, 255, 255, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "transparent";
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "none";
          }}
        >
          Trang chủ
        </Link>
        
        <Link 
          to="/productlist" 
          style={{ 
            color: "#fff", 
            textDecoration: "none",
            fontSize: "16px",
            fontWeight: "500",
            padding: "10px 20px",
            borderRadius: "25px",
            transition: "all 0.3s ease",
            position: "relative",
            overflow: "hidden"
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "rgba(255, 255, 255, 0.1)";
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 5px 15px rgba(255, 255, 255, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "transparent";
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "none";
          }}
        >
          Thực đơn
        </Link>
        
        <Link 
          to="/cart" 
          style={{ 
            color: "#fff", 
            textDecoration: "none",
            fontSize: "16px",
            fontWeight: "500",
            padding: "10px 20px",
            borderRadius: "25px",
            transition: "all 0.3s ease",
            position: "relative",
            overflow: "hidden"
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "rgba(255, 255, 255, 0.1)";
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 5px 15px rgba(255, 255, 255, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "transparent";
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "none";
          }}
        >
          Giỏ hàng
        </Link>
        
        <Link 
          to="/login" 
          style={{ 
            color: "#000", 
            textDecoration: "none",
            fontSize: "16px",
            fontWeight: "600",
            padding: "12px 24px",
            borderRadius: "25px",
            background: "linear-gradient(45deg, #fff, #e0e0e0)",
            transition: "all 0.3s ease",
            border: "2px solid transparent"
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "transparent";
            e.target.style.color = "#fff";
            e.target.style.border = "2px solid #fff";
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 5px 15px rgba(255, 255, 255, 0.2)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "linear-gradient(45deg, #fff, #e0e0e0)";
            e.target.style.color = "#000";
            e.target.style.border = "2px solid transparent";
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "none";
          }}
        >
          Đăng nhập
        </Link>
      </nav>
    </header>
  );
}