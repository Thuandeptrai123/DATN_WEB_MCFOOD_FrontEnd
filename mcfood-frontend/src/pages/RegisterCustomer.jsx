import { useState } from "react";
import { Eye, EyeOff, UserCheck, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { register_customer } from "../api/RegisterApi";
import "../Styles/Register.css";

export default function Register() {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    phoneNumbers: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

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

    if (!formData.userName.trim()) {
      newErrors.userName = "Tên đăng nhập là bắt buộc";
    } else if (formData.userName.length < 4) {
      newErrors.userName = "Tên đăng nhập phải có ít nhất 4 ký tự";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.firstName.trim()) newErrors.firstName = "Tên là bắt buộc";
    if (!formData.lastName.trim()) newErrors.lastName = "Họ là bắt buộc";

    if (!formData.address.trim()) newErrors.address = "Địa chỉ là bắt buộc";

    if (!formData.phoneNumbers.trim()) {
      newErrors.phoneNumbers = "Số điện thoại là bắt buộc";
    } else if (!/^\d{9,11}$/.test(formData.phoneNumbers)) {
      newErrors.phoneNumbers = "Số điện thoại không hợp lệ (9-11 chữ số)";
    }

    if (!formData.password) {
      newErrors.password = "Mật khẩu là bắt buộc";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    } else if (!/(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Mật khẩu phải có ít nhất 1 chữ hoa và 1 số";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Xác nhận mật khẩu là bắt buộc";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formDataToSend = new FormData();
    formDataToSend.append("FirstName", formData.firstName);
    formDataToSend.append("LastName", formData.lastName);
    formDataToSend.append("UserName", formData.userName);
    formDataToSend.append("Email", formData.email);
    formDataToSend.append("PhoneNumbers", formData.phoneNumbers);
    formDataToSend.append("Password", formData.password);
    formDataToSend.append("ConfirmPassword", formData.confirmPassword);
    formDataToSend.append("Address", formData.address);

    try {
      const res = await register_customer(formDataToSend);
      const result = res.data;
      if (result.ErrorCode === 200 || result.ErrorCode === 0) {
        alert("🎉 Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.");
        navigate("/login");
      }
      else 
      {
        alert(result.Message || "Đăng ký thất bại!");
      }
    } 
    catch (error) {
        console.error("Lỗi khi đăng ký:", error);
        if (error.response && error.response.data) {
          const { ErrorCode, Message, Data } = error.response.data;
          console.log("Chi tiết lỗi từ server:", error.response.data);
          alert(`${Message}\n${Data?.[0]?.description || "Vui lòng kiểm tra lại."}`);
        } else {
          alert("Lỗi kết nối đến máy chủ!");
        }
      }
    };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <div className="register-icon">
            <UserCheck size={32} color="#fff" />
          </div>
          <h1>Đăng ký tài khoản</h1>
          <p>Điền thông tin để bắt đầu</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* TÊN ĐĂNG NHẬP */}
          <div className="form-group">
            <label>Tên đăng nhập</label>
            <input
              type="text"
              name="userName"
              className={errors.userName ? "input-error" : ""}
              value={formData.userName}
              onChange={handleChange}
              placeholder="Nhập tên đăng nhập"
            />
            {errors.userName && (
              <p className="error">
                <AlertCircle size={16} /> {errors.userName}
              </p>
            )}
          </div>

          {/* EMAIL */}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              className={errors.email ? "input-error" : ""}
              value={formData.email}
              onChange={handleChange}
              placeholder="Nhập email"
            />
            {errors.email && (
              <p className="error">
                <AlertCircle size={16} /> {errors.email}
              </p>
            )}
          </div>

          {/* TÊN + HỌ */}
          <div className="form-row">
            <div className="form-group">
              <label>Tên</label>
              <input
                type="text"
                name="firstName"
                className={errors.firstName ? "input-error" : ""}
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Tên"
              />
              {errors.firstName && (
                <p className="error">
                  <AlertCircle size={16} /> {errors.firstName}
                </p>
              )}
            </div>

            <div className="form-group">
              <label>Họ</label>
              <input
                type="text"
                name="lastName"
                className={errors.lastName ? "input-error" : ""}
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Họ"
              />
              {errors.lastName && (
                <p className="error">
                  <AlertCircle size={16} /> {errors.lastName}
                </p>
              )}
            </div>
          </div>

          {/* ĐỊA CHỈ */}
          <div className="form-group">
            <label>Địa chỉ</label>
            <input
              type="text"
              name="address"
              className={errors.address ? "input-error" : ""}
              value={formData.address}
              onChange={handleChange}
              placeholder="Nhập địa chỉ"
            />
            {errors.address && (
              <p className="error">
                <AlertCircle size={16} /> {errors.address}
              </p>
            )}
          </div>

          {/* SỐ ĐIỆN THOẠI */}
          <div className="form-group">
            <label>Số điện thoại</label>
            <input
              type="text"
              name="phoneNumbers"
              className={errors.phoneNumbers ? "input-error" : ""}
              value={formData.phoneNumbers}
              onChange={handleChange}
              placeholder="Nhập số điện thoại"
            />
            {errors.phoneNumbers && (
              <p className="error">
                <AlertCircle size={16} /> {errors.phoneNumbers}
              </p>
            )}
          </div>

          {/* MẬT KHẨU */}
          <div className="form-group">
            <label>Mật khẩu</label>
            <div className="input-icon">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className={errors.password ? "input-error" : ""}
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
            {errors.password && (
              <p className="error">
                <AlertCircle size={16} /> {errors.password}
              </p>
            )}
          </div>

          {/* XÁC NHẬN MẬT KHẨU */}
          <div className="form-group">
            <label>Xác nhận mật khẩu</label>
            <div className="input-icon">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                className={errors.confirmPassword ? "input-error" : ""}
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
            {errors.confirmPassword && (
              <p className="error">
                <AlertCircle size={16} /> {errors.confirmPassword}
              </p>
            )}
          </div>

          <button type="submit" className="btn-primary">Tạo tài khoản</button>

          <div className="or-divider"><span>Hoặc</span></div>

          <button type="button" className="btn-google">Đăng ký với Google</button>

          <div className="login-link">
            <p>
              Đã có tài khoản?{" "}
              <button type="button" onClick={() => navigate("/login")}>
                Đăng nhập ngay
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
