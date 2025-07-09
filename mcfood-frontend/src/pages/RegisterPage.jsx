import { useState } from "react";
import { Eye, EyeOff, User, Mail, MapPin, Lock, UserCheck } from "lucide-react";
// import "../Styles/Register.css"; 
import "../Styles/Register.css"; // Đảm bảo đường dẫn đúng với cấu trúc thư mục của bạn
import { useNavigate } from "react-router-dom";


export default function Register() {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.userName.trim()) newErrors.userName = "Tên đăng nhập là bắt buộc";
    if (!formData.email.trim()) newErrors.email = "Email là bắt buộc";
    if (!formData.firstName.trim()) newErrors.firstName = "Tên là bắt buộc";
    if (!formData.lastName.trim()) newErrors.lastName = "Họ là bắt buộc";
    if (!formData.address.trim()) newErrors.address = "Địa chỉ là bắt buộc";
    if (!formData.password) newErrors.password = "Mật khẩu là bắt buộc";
    if (formData.password.length < 6) newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const dataToSend = {
      userName: formData.userName,
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      address: formData.address,
      password: formData.password,
      isEmployee: false,
      emailConfirmed: true,
    };

    console.log("Data gửi lên:", dataToSend);
    // Gọi API ở đây
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };


  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <div className="register-icon">
            <UserCheck size={32} color="#fff" />
          </div>
          <h1>Tạo tài khoản</h1>
          <p>Điền thông tin để bắt đầu</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tên đăng nhập</label>
            <div className="input-icon">
              <User className="input-icon__icon" />
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                placeholder="Nhập tên đăng nhập"
              />
            </div>
            {errors.userName && <p className="error">{errors.userName}</p>}
          </div>

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
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Tên</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Tên"
              />
              {errors.firstName && <p className="error">{errors.firstName}</p>}
            </div>

            <div className="form-group">
              <label>Họ</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Họ"
              />
              {errors.lastName && <p className="error">{errors.lastName}</p>}
            </div>
          </div>

          <div className="form-group">
            <label>Địa chỉ</label>
            <div className="input-icon">
              <MapPin className="input-icon__icon" />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Nhập địa chỉ"
              />
            </div>
            {errors.address && <p className="error">{errors.address}</p>}
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
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          <div className="form-group">
            <label>Xác nhận mật khẩu</label>
            <div className="input-icon">
              <Lock className="input-icon__icon" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Xác nhận mật khẩu"
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
            {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
          </div>

          <button type="submit" className="btn-primary">Tạo tài khoản</button>

          <div className="or-divider">
            <span>Hoặc</span>
          </div>

          <button type="button" className="btn-google">Đăng ký với Google</button>
        </form>

        <div className="login-link">
          <p>
            Đã có tài khoản?{" "}
            <button type="button" onClick={handleLoginRedirect} >Đăng nhập ngay</button>
          </p>
        </div>
      </div>
    </div>
  );
}
