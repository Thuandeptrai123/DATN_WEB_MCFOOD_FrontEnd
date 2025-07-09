import { useEffect, useState } from "react";
import userService from "../api/userService";

export default function ProfilePage() {
  const [profile, setProfile] = useState({});
  const [file, setFile] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    userService.getProfile(token).then((res) => {
      setProfile(res.data.data);
    });
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("FirstName", profile.firstName);
    formData.append("LastName", profile.lastName);
    formData.append("Address", profile.address);
    formData.append("PhoneNumbers", profile.phoneNumbers);
    if (file) {
      formData.append("ProfileImage", file);
    }

    try {
      await userService.updateProfile(formData, token);
      alert("Cập nhật thành công!");
    } catch (error) {
      alert("Có lỗi xảy ra");
      console.log(error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Thông tin cá nhân</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label>Họ</label>
          <input
            className="form-control"
            name="firstName"
            value={profile.firstName || ""}
            onChange={handleChange}
          />
        </div>
        <div className="mb-2">
          <label>Tên</label>
          <input
            className="form-control"
            name="lastName"
            value={profile.lastName || ""}
            onChange={handleChange}
          />
        </div>
        <div className="mb-2">
          <label>Địa chỉ</label>
          <input
            className="form-control"
            name="address"
            value={profile.address || ""}
            onChange={handleChange}
          />
        </div>
        <div className="mb-2">
          <label>Số điện thoại</label>
          <input
            className="form-control"
            name="phoneNumbers"
            value={profile.phoneNumbers || ""}
            onChange={handleChange}
          />
        </div>
        <div className="mb-2">
          <label>Ảnh đại diện</label>
          <input type="file" onChange={handleFileChange} className="form-control" />
        </div>
        <button type="submit" className="btn btn-primary">Cập nhật</button>
      </form>
    </div>
  );
}
