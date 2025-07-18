import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { Link } from 'react-router-dom';

export default function ConfirmEmail() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Đang xác nhận email...");

  useEffect(() => {
    const userId = searchParams.get("userId");
    const token = searchParams.get("token");

    if (!userId || !token) {
      setMessage("❌ Thiếu thông tin xác nhận email.");
      return;
    }

    axios
      .get(
        `https://localhost:7233/api/Auth/confirm-email?userId=${userId}&token=${encodeURIComponent(token)}`
      )
      .then((res) => {
setMessage(
    <span>
        ✅ Email của bạn đã được xác nhận thành công. Bạn có thể <Link to="/login">đăng nhập</Link>.
    </span>
);      })
      .catch((err) => {
        console.error(err);
        setMessage("❌ Xác nhận email thất bại hoặc đã được xác nhận trước đó.");
      });
  }, []);

  return (
    <div className="confirm-container">
      <h2>{message}</h2>
    </div>
  );
}
