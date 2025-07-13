import { useState } from "react";
import "../Styles/ProfilePage.css";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    userName: "user1@gmail.com",
    email: "user1@gmail.com",
    firstName: "Nguyen",
    lastName: "A",
    address: "Hà Nội",
    phoneNumbers: "0123456789",
    avatar: "https://i.pravatar.cc/150?img=3"
  });

  const [showEdit, setShowEdit] = useState(false);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({ ...profile, avatar: URL.createObjectURL(file) });
    }
  };

  const handleSave = () => {
    // Logic lưu profile
    setShowEdit(false);
  };

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
              <label>Tên đăng nhập</label>
              <input
                type="text"
                name="userName"
                value={profile.userName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
              />
            </div>
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
