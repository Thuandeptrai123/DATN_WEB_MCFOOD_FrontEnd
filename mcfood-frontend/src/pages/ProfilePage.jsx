import { useEffect, useState } from "react";
import userApi from "../api/userService";
import "../Styles/ProfilePage.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; 

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

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
      } else {
        navigate("/401"); // 👈 Nếu không có token thì chuyển luôn
      }
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/401"); // 👈 Token sai/hết hạn thì chuyển
      } else {
        console.error("❌ Lỗi lấy profile:", error);
      }
    }
  };

  fetchProfile();
}, [token, navigate]);

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
      toast.success("Cập nhật thành công!");
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
      // alert("❌ Lỗi cập nhật profile");
    }
  };

  if (!profile) {
    return <p>Đang tải thông tin...</p>;
  }

  return (
    <>
      <style jsx>{`
        .profile-container {
          background: #000);
          min-height: 100vh;
          padding: 2rem 0;
        }
        
        .profile-card {
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          overflow: hidden;
          transition: transform 0.3s ease;
        }
        
        .profile-card:hover {
          transform: translateY(-5px);
        }
        
        .profile-header {
          background: #000;
          padding: 3rem 0;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        
        .profile-header::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          animation: float 20s infinite linear;
        }
        
        @keyframes float {
          0% { transform: translateX(-100%) translateY(-100%) rotate(0deg); }
          100% { transform: translateX(0%) translateY(0%) rotate(360deg); }
        }
        
        .avatar-container {
          position: relative;
          display: inline-block;
          z-index: 2;
        }
        
        .profile-avatar {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          border: 6px solid white;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          transition: transform 0.3s ease;
        }
        
        .profile-avatar:hover {
          transform: scale(1.05);
        }
        
        .avatar-upload-btn {
          position: absolute;
          bottom: 10px;
          right: 10px;
          background: #2c3e50;
          color: white;
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(44, 62, 80, 0.4);
        }
        
        .avatar-upload-btn:hover {
          background: #34495e;
          transform: scale(1.1);
        }
        
        .info-section {
          padding: 2rem;
        }
        
        .info-item {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1rem;
          border-left: 4px solid #2c3e50;
          transition: all 0.3s ease;
        }
        
        .info-item:hover {
          background: #e9ecef;
          transform: translateX(5px);
        }
        
        .info-label {
          font-weight: 600;
          color: #555;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .info-value {
          color: #333;
          font-size: 1.1rem;
          font-weight: 500;
        }
        
        .action-buttons {
          padding: 0 2rem 2rem;
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        
        .btn-modern {
          border-radius: 25px;
          padding: 12px 30px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .btn-modern::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: rgba(255,255,255,0.2);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }
        
        .btn-modern:hover::before {
          width: 300px;
          height: 300px;
        }
        
        .btn-primary-modern {
          background: linear-gradient(to right, #171717 0%, #171717 100%);
          
          border: none;
          color: white;
        }
        
        .btn-success-modern {
          background: linear-gradient(to right, #171717 0%, #171717 100%);
          border: none;
          color: white;
        }
        
        .btn-outline-modern {
          background: transparent;
          border: 2px solid #2c3e50;
          color: #2c3e50;
        }
        
        .btn-outline-modern:hover {
          background: #2c3e50;
          color: white;
        }
        
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0,0,0,0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1050;
          backdrop-filter: blur(5px);
        }
        
        .modal-content-custom {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          width: 90%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          animation: modalSlideIn 0.3s ease;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-50px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .form-floating-custom {
          position: relative;
          margin-bottom: 1.5rem;
        }
        
        .form-floating-custom input,
        .form-floating-custom textarea {
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          padding: 1rem;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: #f8f9fa;
        }
        
        .form-floating-custom input:focus,
        .form-floating-custom textarea:focus {
          border-color: #2c3e50;
          box-shadow: 0 0 0 0.2rem rgba(44, 62, 80, 0.25);
          background: white;
        }
        
        .form-floating-custom label {
          position: absolute;
          top: 1rem;
          left: 1rem;
          color: #666;
          transition: all 0.3s ease;
          pointer-events: none;
          background: transparent;
          padding: 0 0.5rem;
        }
        
        .form-floating-custom input:focus + label,
        .form-floating-custom input:not(:placeholder-shown) + label {
          top: -0.5rem;
          left: 0.75rem;
          font-size: 0.8rem;
          color: #2c3e50;
          background: white;
        }
        
        .file-upload-area {
          border: 2px dashed #ddd;
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: #f8f9fa;
        }
        
        .file-upload-area:hover {
          border-color: #2c3e50;
          background: #e9ecef;
        }
        
        .file-upload-area.dragover {
          border-color: #34495e;
          background: #e9ecef;
        }
      `}</style>

      <div className="profile-container">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 col-xl-8">
              <div className="profile-card">
                {/* Header Section */}
                <div className="profile-header">
                  <div className="avatar-container">
                    <img 
                      src={profile.avatar} 
                      alt="Profile Avatar" 
                      className="profile-avatar"
                    />
                    <button 
                      className="avatar-upload-btn"
                      onClick={() => document.getElementById('avatar-input').click()}
                      title="Thay đổi ảnh đại diện"
                    >
                      <i className="fas fa-camera"></i>
                      📷
                    </button>
                    <input
                      type="file"
                      id="avatar-input"
                      style={{ display: 'none' }}
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                  <h2 className="text-white mt-3 mb-1">{profile.firstName} {profile.lastName}</h2>
                  <p className="text-white-50 mb-0">@{profile.userName}</p>
                </div>

                {/* Information Section */}
                <div className="info-section">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="info-item">
                        <div className="info-label">Email</div>
                        <div className="info-value">{profile.email}</div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="info-item">
                        <div className="info-label">Tên người dùng</div>
                        <div className="info-value">{profile.userName}</div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="info-item">
                        <div className="info-label">Họ</div>
                        <div className="info-value">{profile.firstName}</div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="info-item">
                        <div className="info-label">Tên</div>
                        <div className="info-value">{profile.lastName}</div>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="info-item">
                        <div className="info-label">Địa chỉ</div>
                        <div className="info-value">{profile.address}</div>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="info-item">
                        <div className="info-label">Số điện thoại</div>
                        <div className="info-value">{profile.phoneNumbers}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="action-buttons">
                  <button className="btn btn-modern btn-outline-modern flex-fill">
                    🔒 Đổi mật khẩu
                  </button>
                  {/* <button 
                    className="btn btn-modern btn-primary-modern flex-fill"
                    onClick={() => setShowEdit(true)}
                  >
                    ✏️ Chỉnh sửa thông tin
                  </button> */}
                  <button 
                    className="btn btn-modern btn-primary-modern flex-fill"
                    onClick={() => setShowEdit(true)}
                    style={{ color: 'white' }} // Đảm bảo màu chữ là trắng
                  >
                    ✏️ Chỉnh sửa thông tin
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEdit && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowEdit(false)}>
          <div className="modal-content-custom">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="mb-0">✏️ Chỉnh sửa thông tin</h3>
              <button 
                className="btn-close" 
                onClick={() => setShowEdit(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-floating-custom">
                    <input
                      type="text"
                      className="form-control"
                      name="firstName"
                      value={profile.firstName}
                      onChange={handleChange}
                      placeholder=" "
                    />
                    <label>Họ</label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-floating-custom">
                    <input
                      type="text"
                      className="form-control"
                      name="lastName"
                      value={profile.lastName}
                      onChange={handleChange}
                      placeholder=" "
                    />
                    <label>Tên</label>
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-floating-custom">
                    <input
                      type="text"
                      className="form-control"
                      name="address"
                      value={profile.address}
                      onChange={handleChange}
                      placeholder=" "
                    />
                    <label>Địa chỉ</label>
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-floating-custom">
                    <input
                      type="text"
                      className="form-control"
                      name="phoneNumbers"
                      value={profile.phoneNumbers}
                      onChange={handleChange}
                      placeholder=" "
                    />
                    <label>Số điện thoại</label>
                  </div>
                </div>
                <div className="col-12">
                  <div className="file-upload-area" onClick={() => document.getElementById('file-input').click()}>
                    <div className="mb-2">📷</div>
                    <h6>Thay đổi ảnh đại diện</h6>
                    <p className="text-muted mb-0">Click để chọn file hoặc kéo thả vào đây</p>
                    <input
                      type="file"
                      id="file-input"
                      style={{ display: 'none' }}
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              </div>

              <div className="d-flex gap-3 mt-4">
                <button
                  type="button"
                  className="btn btn-modern btn-success-modern flex-fill"
                  onClick={handleSave}
                  style={{ color: 'white' }}
                >
                  💾 Lưu thay đổi
                </button>
                <button
                  type="button"
                  className="btn btn-modern btn-outline-modern flex-fill"
                  onClick={() => setShowEdit(false)}
                >
                  ❌ Hủy bỏ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bootstrap and FontAwesome CDN */}
      <link 
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" 
        rel="stylesheet" 
      />
      <link 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
        rel="stylesheet" 
      />
    </>
  );
}