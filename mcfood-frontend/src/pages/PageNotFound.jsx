import React from "react";
import { Link } from "react-router-dom";
import "../Styles/PageNotFound.css"; // nếu có css riêng

export default function PageNotFound() {
  return (
    <div className="not-found-container">
      <h1>404 - Trang không tồn tại</h1>
      <p>Rất tiếc, trang bạn tìm không tồn tại.</p>
      <Link to="/">Về trang chủ</Link>
    </div>
  );
}
