import { useState } from "react";
import { Eye, EyeOff, UserCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login_customer } from "../api/LoginApi";
import { loginSuccess } from "../store/authSlice";
import "../Styles/Login.css";

export default function Login() {
  const [form, setForm] = useState({ UserName: "", Password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    let newErrors = {};

    if (!form.UserName.trim()) {
      newErrors.UserName = "Chưa điền tên đăng nhập.";
    }
    if (!form.Password.trim()) {
      newErrors.Password = "Chưa điền mật khẩu.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return; // Không gọi API nếu có lỗi local
    }

    try {
      const res = await login_customer(form);
      const result = res.data;

      if (result.ErrorCode === 0 && result.Data) {
        // Lưu vào Redux & localStorage
        dispatch(
          loginSuccess({
            user: result.Data,
            token: result.Data.Token,
          })
        );
        navigate("/");
      } else {
        setErrorMessage("Tên đăng nhập hoặc mật khẩu không chính xác.");
      }
    } catch (err) {
      console.error("❌ Lỗi:", err);
      setErrorMessage("Lỗi kết nối đến máy chủ!");
    }
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
            <label>Tên đăng nhập</label>
            <div className="input-icon">
              <input
                type="text"
                name="UserName"
                value={form.UserName}
                onChange={(e) => {
                  setForm({ ...form, UserName: e.target.value });
                  setErrors({ ...errors, UserName: "" }); // Xóa lỗi khi user gõ lại
                }}
                placeholder="Nhập tên đăng nhập"
              />
            </div>
            {errors.UserName && <p className="error-text">{errors.UserName}</p>}
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <div className="input-icon">
              <input
                type={showPassword ? "text" : "password"}
                name="Password"
                value={form.Password}
                onChange={(e) => {
                  setForm({ ...form, Password: e.target.value });
                  setErrors({ ...errors, Password: "" });
                }}
                placeholder="Nhập mật khẩu"
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.Password && <p className="error-text">{errors.Password}</p>}
          </div>

          <button type="submit" className="btn-primary">
            Đăng nhập
          </button>

          {/* Thông báo lỗi tổng */}
          {errorMessage && <p className="error-text">{errorMessage}</p>}

          <div className="or-divider">
            <span>Hoặc</span>
          </div>

          <button type="button" className="btn-google">
            Đăng nhập với Google
          </button>

          <div className="forgot-password-link">
            <button type="button" onClick={() => navigate("/forgot-password")}>
              Quên mật khẩu?
            </button>
          </div>

          <div className="login-link">
            <p>
              Chưa có tài khoản?{" "}
              <button type="button" onClick={() => navigate("/register")}>
                Đăng kí ngay
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
