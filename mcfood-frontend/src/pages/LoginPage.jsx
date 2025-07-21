import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, UserCheck } from "lucide-react";
import "../Styles/Login.css";
import { useNavigate } from "react-router-dom";
import { login_customer } from "../api/authService"; // 👈 Thêm dòng này
import { toast } from "react-toastify"; 

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(""); // 👈 Để hiển thị lỗi nếu có
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      console.log("Data gửi lên:", formData);
      const res = await login_customer(formData);
      console.log("✅ Đăng nhập thành công:", res.data);

      if (res.data && res.data.data && res.data.data.customerId) {
        localStorage.setItem("customerId", res.data.data.customerId); // ✅ Lưu customerId
        navigate("/"); // ✅ Chuyển hướng sau khi login, bạn có thể dùng: navigate("/cart") nếu muốn
      } else {
        setError("Đăng nhập thất bại. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("❌ Lỗi đăng nhập:", err);
      setError("Sai email hoặc mật khẩu.");
    }
  };

  const handleRegisterRedirect = () => {
    navigate("/register");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">
            <UserCheck size={32} color="#fff" />
          </div>
          <h1>Đăng nhập</h1>
          <p>Chào mừng bạn trở lại</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <div className="input-icon">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Nhập email"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <div className="input-icon">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu"
                required
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="error-message" style={{ color: "red", marginBottom: "10px" }}>
              {error}
            </div>
          )}

          <button type="submit" className="btn-primary">Đăng nhập</button>

          <div className="or-divider">
            <span>Hoặc</span>
          </div>

          <button type="button" className="btn-google">Đăng nhập với Google</button>

          <div className="forgot-password-link">
            <button type="button" onClick={() => navigate("/forgot-password")}>
              Quên mật khẩu?
            </button>
          </div>

          <div className="login-link">
            <p>
              Chưa có tài khoản?{" "}
              <button type="button" onClick={handleRegisterRedirect}>
                Đăng kí ngay
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
