import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFoodById } from "../api/foodService";
import CartService from "../api/cartService"; // ✅ thêm dòng này
import { toast } from "react-toastify"; // ✅ thêm dòng này
import "../Styles/FoodDetail.css";

export default function FoodDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const ImageAPIUrl = "https://localhost:7233";

  useEffect(() => {
    fetchFood();
  }, []);

  const fetchFood = async () => {
    try {
      const res = await getFoodById(id);
      setFood(res.data.Data);
    } catch (err) {
      console.error("Lỗi khi lấy món ăn:", err);
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

  const handleAddToCart = async () => {
    try {
      const data = {
        foodId: food.Id,
        quantity: quantity,
      };
      const response = await CartService.addItemToCart(data);
      console.log("✅ Thêm vào giỏ hàng:", response);
      toast.success("Đã thêm vào giỏ hàng!");
    } catch (error) {
      console.error("❌ Lỗi thêm giỏ hàng:", error);
      toast.error("Thêm vào giỏ hàng thất bại!");
    }
  };

  if (loading) {
    return (
      <div className="fd-loading-bg">
        <div className="fd-loading-center">
          <div className="spinner-border text-dark" style={{ width: "3rem", height: "3rem" }} />
          <p className="fd-loading-text">Đang tải chi tiết món ăn...</p>
        </div>
      </div>
    );
  }

  if (!food) {
    return (
      <div className="fd-loading-bg">
        <div className="fd-notfound-box">
          <h4>Không tìm thấy món ăn.</h4>
          <button onClick={() => navigate("/productlist")} className="fd-btn-back">
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fd-page-bg">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="fd-breadcrumb">
          <div className="fd-breadcrumb-list">
            <span onClick={() => navigate("/")} className="fd-link">Trang chủ</span>
            <span className="fd-separator">›</span>
            <span onClick={() => navigate("/productlist")} className="fd-link">Thực đơn</span>
            <span className="fd-separator">›</span>
            <span className="fd-current">{food.Name}</span>
          </div>
        </nav>

        <div className="row fd-row-gap">
          {/* Hình ảnh món ăn */}
          <div className="col-lg-6 fd-img-col">
            <div className="fd-img-wrapper">
              <img
                src={`${ImageAPIUrl}${food.ImageUrl}`}
                alt={food.Name}
                className="fd-img"
                onError={(e) => (e.target.src = "/default-food.jpg")}
              />
              <div className="fd-badge-hot">HOT</div>
            </div>
          </div>

          {/* Thông tin món ăn */}
          <div className="col-lg-5">
            <div className="fd-info-box">
              <h1 className="fd-title">{food.Name}</h1>
              <p className="fd-description">{food.Description}</p>

              <div className="fd-price-wrapper">
                <span className="fd-price">{food.Price?.toLocaleString()} ₫</span>
                <span className="fd-price-tag">Giá tốt</span>
              </div>

              <div className="fd-quantity-wrapper">
                <label className="fd-quantity-label">Số lượng:</label>
                <div className="fd-quantity-controls">
                  <button onClick={() => handleQuantityChange("decrease")} className="fd-btn-circle">-</button>
                  <span className="fd-quantity-number">{quantity}</span>
                  <button onClick={() => handleQuantityChange("increase")} className="fd-btn-circle">+</button>
                </div>
              </div>

              <div className="fd-total-wrapper">
                <div className="fd-total-inner">
                  <span className="fd-total-text">Tổng tiền:</span>
                  <span className="fd-total-amount">{(food.Price * quantity)?.toLocaleString()} ₫</span>
                </div>
              </div>

              <div className="fd-action-buttons">
                <button className="fd-btn-add" onClick={handleAddToCart}>🛒 Thêm vào giỏ hàng</button>
                <button className="fd-btn-like">❤️</button>
              </div>
            </div>
          </div>
        </div>

        {/* Nút quay lại */}
        <div className="fd-back-wrapper">
          <button onClick={() => navigate("/")} className="fd-btn-back-outline">
            ← Quay lại thực đơn
          </button>
        </div>
      </div>
    </div>
  );
}
