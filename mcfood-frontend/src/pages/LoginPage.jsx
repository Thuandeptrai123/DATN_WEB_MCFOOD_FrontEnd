import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, UserCheck } from "lucide-react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Data gửi lên:", formData);
    // Gọi API login ở đây
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
              <Mail className="input-icon__icon" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Nhập email"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <div className="input-icon">
              <Lock className="input-icon__icon" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu"
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

          <button type="submit" className="btn-primary">Đăng nhập</button>

          <div className="or-divider">
            <span>Hoặc</span>
          </div>

          <button type="button" className="btn-google">Đăng nhập với Google</button>

          <div className="login-link">
            <p>
              Chưa có tài khoản?{" "}
              <button type="button" onClick={handleRegisterRedirect} >Đăng kí ngay</button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
