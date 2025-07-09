import { useState } from "react";
import userService from "../api/userService";

export default function ChangePasswordPage() {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await userService.changePassword(form, token);
      alert("Đổi mật khẩu thành công!");
    } catch (error) {
      alert("Có lỗi xảy ra");
      console.log(error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Đổi mật khẩu</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label>Mật khẩu cũ</label>
          <input
            type="password"
            className="form-control"
            name="oldPassword"
            value={form.oldPassword}
            onChange={handleChange}
          />
        </div>
        <div className="mb-2">
          <label>Mật khẩu mới</label>
          <input
            type="password"
            className="form-control"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">Đổi mật khẩu</button>
      </form>
    </div>
  );
}
