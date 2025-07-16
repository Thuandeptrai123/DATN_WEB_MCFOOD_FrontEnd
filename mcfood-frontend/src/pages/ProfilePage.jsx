import { useEffect, useState } from "react";
import userApi from "../api/userService";
import "../Styles/ProfilePage.css";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Lấy token trực tiếp từ localStorage
  const token = localStorage.getItem("token");

  useEffect(() => {
  const fetchProfile = async () => {
    try {
      if (token) {
        const res = await userApi.getProfileMe(token);
        console.log("👉 API response:", res);

        if (res && res.Data) {
          const data = res.Data;
          setProfile({
            userName: data.UserName,
            email: data.Email,
            firstName: data.FirstName,
            lastName: data.LastName,
            address: data.Address,
            phoneNumbers: data.PhoneNumbers,
            avatar: data.ProfileImage
                ? `https://localhost:7233${data.ProfileImage}`
                : "https://i.pravatar.cc/150",

          });
        } else {
          console.error("❌ API trả về lỗi hoặc thiếu Data:", res);
        }
      }
    } catch (error) {
      console.error("❌ Lỗi lấy profile:", error);
    }
  };

  fetchProfile();
}, [token]);


  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setProfile({ ...profile, avatar: URL.createObjectURL(file) });
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("FirstName", profile.firstName);
      formData.append("LastName", profile.lastName);
      formData.append("Address", profile.address);
      formData.append("PhoneNumbers", profile.phoneNumbers);

      if (selectedFile) {
        formData.append("ProfileImage", selectedFile);
      }

      await userApi.updateProfile(formData, token);

      alert("✅ Cập nhật thành công!");
      setShowEdit(false);

      // Reload profile sau update
      const res = await userApi.getProfileMe(token);
      const data = res.data.Data;
      setProfile({
        userName: data.UserName,
        email: data.Email,
        firstName: data.FirstName,
        lastName: data.LastName,
        address: data.Address,
        phoneNumbers: data.PhoneNumbers,
        avatar: data.ProfileImage
          ? `http://localhost:7233${data.ProfileImage}`
          : "https://i.pravatar.cc/150",
      });
    } catch (error) {
      console.error("❌ Lỗi cập nhật profile:", error);
      alert("❌ Lỗi cập nhật profile");
    }
  };

  if (!profile) {
    return <p>Đang tải thông tin...</p>;
  }

  return (
    <div className="profile-card">
      <h2>Thông tin cá nhân</h2>
      <div className="avatar-section">
        <img src={profile.avatar} alt="Avatar" className="profile-avatar-large" />
        <label htmlFor="file-upload" className="update-btn">Update Picture</label>
        <input
          type="file"
          id="file-upload"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>

      <div className="info-group">
        <p><strong>Tên người dùng:</strong> {profile.userName}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Họ:</strong> {profile.firstName}</p>
        <p><strong>Tên:</strong> {profile.lastName}</p>
        <p><strong>Địa chỉ:</strong> {profile.address}</p>
        <p><strong>Số điện thoại:</strong> {profile.phoneNumbers}</p>
      </div>

      <div className="section-divider"></div>

      <div className="action-buttons">
        <button className="action-btn">Đổi mật khẩu</button>
        <button className="action-btn" onClick={() => setShowEdit(true)}>Chỉnh sửa thông tin</button>
      </div>

      {showEdit && (
        <div className="overlay">
          <div className="overlay-content">
            <h3>Chỉnh sửa</h3>
            <div className="form-group">
              <label>Họ</label>
              <input
                type="text"
                name="firstName"
                value={profile.firstName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Tên</label>
              <input
                type="text"
                name="lastName"
                value={profile.lastName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Địa chỉ</label>
              <input
                type="text"
                name="address"
                value={profile.address}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Số điện thoại</label>
              <input
                type="text"
                name="phoneNumbers"
                value={profile.phoneNumbers}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Ảnh đại diện</label>
              <input
                type="file"
                onChange={handleFileChange}
              />
            </div>
            <div className="edit-buttons">
              <button onClick={handleSave}>Lưu</button>
              <button onClick={() => setShowEdit(false)}>Bỏ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
