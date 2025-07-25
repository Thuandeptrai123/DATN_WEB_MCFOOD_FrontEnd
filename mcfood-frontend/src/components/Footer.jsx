export default function Footer() {
  return (
    <footer
      style={{
        background: "#000",
        color: "#fff",
        padding: "40px 20px",
        fontSize: "14px",
        fontWeight: "300",
        borderTop: "1px solid #333",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
        <div style={{ flex: "1 1 250px", marginBottom: "20px" }}>
          <h3 style={{ color: "#fff" }}>Về chúng tôi</h3>
          <p>MCFOOD là hệ thống đặt món trực tuyến nhanh chóng và tiện lợi, được phát triển bởi KaiZen Team với mục tiêu nâng cao trải nghiệm người dùng trong lĩnh vực ẩm thực.</p>
        </div>

        <div style={{ flex: "1 1 200px", marginBottom: "20px" }}>
          <h3 style={{ color: "#fff" }}>Chính sách</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li><a href="/policy/privacy" style={{ color: "#aaa", textDecoration: "none" }}>Chính sách bảo mật</a></li>
            <li><a href="/policy/terms" style={{ color: "#aaa", textDecoration: "none" }}>Điều khoản sử dụng</a></li>
            <li><a href="/policy/refund" style={{ color: "#aaa", textDecoration: "none" }}>Chính sách hoàn tiền</a></li>
          </ul>
        </div>

        <div style={{ flex: "1 1 200px", marginBottom: "20px" }}>
          <h3 style={{ color: "#fff" }}>Liên hệ</h3>
          <p>Email: support@mcfood.vn</p>
          <p>Hotline: 0123 456 789</p>
          <p>Địa chỉ: 123 Đường Ẩm Thực, TP. Hồ Chí Minh</p>
        </div>

        <div style={{ flex: "1 1 250px", marginBottom: "20px" }}>
          <h3 style={{ color: "#fff" }}>Thành viên dự án</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li>Trần Toàn - Backend, Frontend Developer</li>
            <li>Khắc Thuần - Backend, Frontend Developer</li>
            <li>Chí Linh - Backend Developer, Document writer</li>
            <li>Thịnh - Mockup, UI/UX Designer</li>
          </ul>
        </div>
      </div>

      <hr style={{ borderColor: "#333", margin: "20px 0" }} />
      <p style={{ textAlign: "center" }}>
        &copy; 2025 KaiZen Team - MCFOOD. All rights reserved.
      </p>
    </footer>
  );
}
