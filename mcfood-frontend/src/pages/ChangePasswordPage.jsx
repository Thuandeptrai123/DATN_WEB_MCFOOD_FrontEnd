import { useState } from "react";
import userService from "../api/userService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { Eye, EyeOff } from "lucide-react";

export default function ChangePasswordPage() {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Thêm state để toggle hiển thị mật khẩu
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmNewPassword) {
      toast.error("❌ Mật khẩu nhập lại không khớp");
      return;
    }

    if (!validatePassword(form.newPassword)) {
      toast.error(
        "❌ Mật khẩu phải có ít nhất 8 ký tự, chữ hoa, thường, số và ký tự đặc biệt"
      );
      return;
    }

    setIsLoading(true);
    try {
      await userService.changePassword(form, token);
      toast.success("✅ Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");

      setTimeout(() => {
        dispatch(logout());
        localStorage.removeItem("token");
        navigate("/login");
        window.location.reload();
      }, 1500);
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error("❌ " + error.response.data.message);
      } else {
        toast.error("❌ Đổi mật khẩu thất bại!");
      }
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style jsx>{`
        .change-password-container {
          background-color: #ffffff;
          min-height: 100vh;
          padding: 2rem 0;
        }
        
        .form-card {
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          padding: 2.5rem;
          border: 1px solid #e9ecef;
        }
        
        .form-title {
          color: #212529;
          font-weight: 600;
          margin-bottom: 2rem;
          text-align: center;
        }
        
        .form-label {
          color: #495057;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }
        
        .form-control {
          border: 2px solid #e9ecef;
          border-radius: 8px;
          padding: 0.75rem 1rem;
          font-size: 1rem;
          transition: all 0.3s ease;
        }
        
        .form-control:focus {
          border-color: #000000;
          box-shadow: 0 0 0 0.2rem rgba(0, 0, 0, 0.1);
        }
        
        .btn-dark-custom {
          background-color: #000000;
          border: 2px solid #000000;
          color: #ffffff;
          font-weight: 500;
          padding: 0.75rem 2rem;
          border-radius: 8px;
          transition: all 0.3s ease;
          width: 100%;
          position: relative;
        }
        
        .btn-dark-custom:hover:not(:disabled) {
          background-color: #333333;
          border-color: #333333;
          transform: translateY(-1px);
        }
        
        .btn-dark-custom:disabled {
          background-color: #6c757d;
          border-color: #6c757d;
          cursor: not-allowed;
        }
        
        .spinner-border-sm {
          width: 1rem;
          height: 1rem;
          border-width: 0.15em;
        }
        
        .password-requirements {
          font-size: 0.875rem;
          color: #6c757d;
          margin-top: 0.5rem;
        }
        .input-group {
          display: flex;
          align-items: center;
        }
        .eye-btn {
          background: none;
          border: none;
          margin-left: -35px;
          cursor: pointer;
          color: #6c757d;
        }
      `}</style>

      <div className="change-password-container">
        <div className="container" style={{ maxWidth: "500px" }}>
          <div className="form-card">
            <h2 className="form-title">Đổi mật khẩu</h2>
            <form onSubmit={handleSubmit}>
              {/* Mật khẩu cũ */}
              <div className="mb-3">
                <label className="form-label">Mật khẩu cũ</label>
                <div className="input-group">
                  <input
                    type={showPassword.old ? "text" : "password"}
                    className="form-control"
                    name="oldPassword"
                    value={form.oldPassword}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="eye-btn"
                    onClick={() =>
                      setShowPassword((prev) => ({ ...prev, old: !prev.old }))
                    }
                  >
                    {showPassword.old ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Mật khẩu mới */}
              <div className="mb-3">
                <label className="form-label">Mật khẩu mới</label>
                <div className="input-group">
                  <input
                    type={showPassword.new ? "text" : "password"}
                    className="form-control"
                    name="newPassword"
                    value={form.newPassword}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="eye-btn"
                    onClick={() =>
                      setShowPassword((prev) => ({ ...prev, new: !prev.new }))
                    }
                  >
                    {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="password-requirements">
                  Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt
                </div>
              </div>

              {/* Xác nhận mật khẩu */}
              <div className="mb-4">
                <label className="form-label">Nhập lại mật khẩu mới</label>
                <div className="input-group">
                  <input
                    type={showPassword.confirm ? "text" : "password"}
                    className="form-control"
                    name="confirmNewPassword"
                    value={form.confirmNewPassword}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="eye-btn"
                    onClick={() =>
                      setShowPassword((prev) => ({ ...prev, confirm: !prev.confirm }))
                    }
                  >
                    {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-dark-custom"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Đang xử lý...
                  </>
                ) : (
                  "Đổi mật khẩu"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
