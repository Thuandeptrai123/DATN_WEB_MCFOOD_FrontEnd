import React from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/ErrorPage.css"; // 👉 nhớ tạo file CSS đi kèm

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login"); // Điều hướng tới trang đăng nhập
  };
  const handleHome = () => {
    navigate("/"); // Điều hướng về trang chủ
  };
  return (
    <div className="error-container">
      <h1 className="error-code">401</h1>
      <h2 className="error-message">Bạn chưa được xác thực</h2>
      <p className="error-description">
        Vui lòng đăng nhập để truy cập nội dung này.
      </p>
      <button className="error-button" onClick={handleLogin}>
        Đăng nhập ngay
      </button>
      <br />
    <button className="btn" onClick={() => navigate("/")}>Về trang chủ </button>
      
    </div>
  );
};

export default UnauthorizedPage;
