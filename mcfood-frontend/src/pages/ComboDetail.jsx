import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getComboById } from "../api/CombosService";
import CartService from "../api/cartService"; // ✅ Import service thêm vào giỏ hàng
import { toast } from "react-toastify";       // ✅ Import toast
import "../Styles/ComboDetail.css";

export default function ComboDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [combo, setCombo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const ImageAPIUrl = "https://localhost:7233";

  useEffect(() => {
    fetchCombo();
  }, []);

  const fetchCombo = async () => {
    try {
      const res = await getComboById(id);
      setCombo(res.data.Data);
    } catch (err) {
      console.error("Lỗi khi lấy chi tiết combo:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (type) => {
    if (type === "increase") {
      setQuantity((prev) => prev + 1);
    } else if (type === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddComboToCart = async () => {
    try {
      const data = {
        comboId: combo.Id,
        quantity: quantity,
      };
      const response = await CartService.addItemToCart(data); // ✅ Gọi API
      console.log("✅ Combo đã thêm:", response);
      toast.success("Đã thêm combo vào giỏ hàng!");
      // window.location.reload(); 
    } catch (error) {
      console.error("❌ Lỗi khi thêm combo vào giỏ:", error);
      toast.error("Thêm combo thất bại!");
    }
  };

  if (loading) {
    return (
      <div className="cd-loading-bg">
        <div className="cd-loading-center">
          <div className="spinner-border text-dark" style={{ width: "3rem", height: "3rem" }} />
          <p className="cd-loading-text">Đang tải chi tiết combo...</p>
        </div>
      </div>
    );
  }

  if (!combo) {
    return (
      <div className="cd-loading-bg">
        <div className="cd-notfound-box">
          <h4>Không tìm thấy combo.</h4>
          <button onClick={() => navigate('/productlist')} className="cd-btn-back">Quay lại danh sách</button>
        </div>
      </div>
    );
  }

  return (
    <div className="cd-page-bg">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="cd-breadcrumb">
          <div className="cd-breadcrumb-list">
            <span onClick={() => navigate('/')} className="cd-link">Trang chủ</span>
            <span className="cd-separator">›</span>
            <span onClick={() => navigate('/productlist')} className="cd-link">Thực đơn</span>
            <span className="cd-separator">›</span>
            <span className="cd-current">{combo.Name}</span>
          </div>
        </nav>

        <div className="row cd-row-gap">
          {/* Ảnh combo */}
          <div className="col-lg-6 cd-img-col">
            <div className="cd-img-wrapper">
              <img
                src={`${ImageAPIUrl}${combo.ImageUrl}`}
                alt={combo.Name}
                className="cd-img"
                onError={(e) => (e.target.src = "/default-combo.jpg")}
              />
              <div className="cd-badge-combo">COMBO</div>
            </div>
          </div>

          {/* Thông tin combo */}
          <div className="col-lg-5">
            <div className="cd-info-box">
              <h1 className="cd-title">{combo.Name}</h1>
              <p className="cd-description">{combo.Description}</p>

              <div className="cd-items-box">
                <h5>Danh sách món:</h5>
                <ul>
                  {combo.Items?.map((item, idx) => (
                    <li key={idx}>{item.FoodName} x {item.Quantity}</li>
                  ))}
                </ul>
              </div>

              <div className="cd-price-wrapper">
                <span className="cd-price">{combo.Price?.toLocaleString()} ₫</span>
              </div>

              <div className="cd-quantity-wrapper">
                <label className="cd-quantity-label">Số lượng:</label>
                <div className="cd-quantity-controls">
                  <button onClick={() => handleQuantityChange("decrease")} className="cd-btn-circle">-</button>
                  <span className="cd-quantity-number">{quantity}</span>
                  <button onClick={() => handleQuantityChange("increase")} className="cd-btn-circle">+</button>
                </div>
              </div>

              <div className="cd-total-wrapper">
                <div className="cd-total-inner">
                  <span className="cd-total-text">Tổng tiền:</span>
                  <span className="cd-total-amount">{(combo.Price * quantity)?.toLocaleString()} ₫</span>
                </div>
              </div>

              <div className="cd-action-buttons">
                <button className="cd-btn-add" onClick={handleAddComboToCart}>🛒 Thêm combo</button>
                <button onClick={() => navigate('/')} className="cd-btn-back-outline">← Quay lại</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
