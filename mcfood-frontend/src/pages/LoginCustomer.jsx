import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, UserCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login_customer } from "../api/LoginApi";
import { loginSuccess } from "../store/authSlice";
import "../Styles/Login.css";
import { toast } from "react-toastify";

export default function Login() {
  const [form, setForm] = useState({ UserName: "", Password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(""); // Thông báo từ BE
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateForm = () => {
    const newErrors = {};

    if (!form.UserName.trim()) newErrors.UserName = "Tên đăng nhập là bắt buộc";
    if (!form.Password.trim()) {
      newErrors.Password = "Mật khẩu là bắt buộc";
    } else if (form.Password.length < 6) {
      newErrors.Password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(""); // reset lỗi server

    if (!validateForm()) return;

    try {
      const res = await login_customer(form);
      const result = res.data;

      if (result.ErrorCode === 0 && result.Data) {
        // alert("✅ Đăng nhập thành công!");
        toast.success("Đăng nhập thành công!");

        // dispatch(
        //   loginSuccess({
        //     user: result.Data,
        //     token: result.Data.Token,
        //   })
        // );
        dispatch(
          loginSuccess({
            user: {
              ...result.Data,
              username: result.Data.UserName, // ✅ Thêm dòng này để đồng bộ với Header.jsx
            },
            token: result.Data.Token,
          })
        );


        navigate("/");
        window.location.reload();
      } else {
        setServerError(result.Message || "Đăng nhập thất bại!");
      }
    } catch (err) {
      console.error("❌ Lỗi:", err);

      if (err.response && err.response.data) {
  const { Message, ErrorCode, Data } = err.response.data;

  if (ErrorCode === 403 && Message.includes("Email chưa được xác nhận")) {
    setServerError("❌ Email của bạn chưa được xác nhận. Vui lòng kiểm tra hộp thư và xác nhận trước khi đăng nhập.");
  } else {
    setServerError(`${Message}\n${Data?.[0]?.description || "Vui lòng thử lại."}`);
  }
} else {
  setServerError("Lỗi kết nối đến máy chủ!");
}

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
          {serverError && <p className="error">{serverError}</p>}

          <div className="form-group">
            <label>Tên đăng nhập</label>
            <div className="input-icon">
              <input
                type="text"
                name="UserName"
                value={form.UserName}
                onChange={(e) => {
                  setForm({ ...form, UserName: e.target.value });
                  setErrors((prev) => ({ ...prev, UserName: "" }));
                }}
                placeholder="Nhập tên đăng nhập"
              />
            </div>
            {errors.UserName && <p className="error">{errors.UserName}</p>}
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
                  setErrors((prev) => ({ ...prev, Password: "" }));
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
            {errors.Password && <p className="error">{errors.Password}</p>}
          </div>

          <button type="submit" className="btn-primary">
            Đăng nhập
          </button>

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
              <br />
              <button
                className="btn1"
                style={{
                  background: "none",
                  color: "#000000ff",
                  border: "none",
                  fontWeight: 500,
                  cursor: "pointer",
                  textDecoration: "none"
                }}
                onClick={() => navigate("/")}
              >
                Về trang chủ
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
