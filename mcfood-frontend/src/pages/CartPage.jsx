import React, { useEffect, useState } from "react";
import CartService from "../api/cartService";
import "../Styles/CartPage.css";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "../Contexts/CartContext";

const CartPage = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, fetchCart, updateItem, removeItem, clearCart } = useCart();

  // GỌI fetchCart nếu chưa có cart (khi vừa mở trang Cart)
  useEffect(() => {
    if (!cart) {
        setLoading(true);
        fetchCart().finally(() => setLoading(false));
      }
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/401");
      return;
    }

    // Nếu chưa có cart thì gọi fetchCart
    if (!cart) {
      setLoading(true);
      fetchCart().finally(() => setLoading(false));
    }

  }, [cart, fetchCart, navigate]);

    const handleQuantityChange = async (cartItemId, quantity) => {
      if (quantity < 1) return;
      try {
        await updateItem(cartItemId, quantity); // context tự gọi fetchCart
        toast.success("Cập nhật số lượng thành công!");
      } catch (error) {
        console.error("Lỗi khi cập nhật số lượng:", error);
      }
    };

    const handleRemoveItem = async (cartItemId) => {
      try {
        await removeItem(cartItemId); // context tự cập nhật
        toast.success("Đã xóa món khỏi giỏ hàng!");
      } catch (error) {
        console.error("Lỗi khi xóa món:", error);
      }
    };

    const handleClearCart = async () => {
      try {
        await clearCart(); // context tự cập nhật
        toast.success("Đã xóa toàn bộ giỏ hàng!");
      } catch (error) {
        console.error("Lỗi khi xóa toàn bộ giỏ hàng:", error);
      }
    };
    

    const renderCartItem = (item) => {
    const isFood = item.FoodDetails !== null;
    const details = isFood ? item.FoodDetails : item.ComboDetails;
    const imageUrl = details?.ImageUrl;

    return (
      <div key={item.CartItemId} className="card mb-3 border-0 shadow-sm">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-3 col-4">
              <div className="position-relative">
                {imageUrl ? (
                  <img
                    src={`https://localhost:7233${imageUrl}`}
                    alt={details.Name || item.ProductName}
                    className="img-fluid rounded"
                    style={{
                      width: '100%',
                      height: '120px',
                      objectFit: 'cover',
                      border: '1px solid #e9ecef'
                    }}
                  />
                ) : (
                  <div
                    className="d-flex align-items-center justify-content-center bg-light rounded text-muted"
                    style={{ width: '100%', height: '120px', border: '1px solid #e9ecef' }}
                  >
                    <i className="fas fa-image fa-2x"></i>
                  </div>
                )}
              </div>
            </div>

            <div className="col-md-5 col-8">
              <h5 className="card-title mb-2 fw-bold">{item.ProductName}</h5>
              <p className="text-muted mb-1">
                <small>Đơn giá: {(item.TotalPrice / item.TotalQuantity).toLocaleString()} VND</small>
              </p>
              <p className="fw-semibold mb-0">
                Thành tiền: <span className="text-dark">{item.TotalPrice.toLocaleString()} VND</span>
              </p>
            </div>

            <div className="col-md-2 col-6 mt-2 mt-md-0">
              <div className="input-group input-group-sm">
                <button
                  className="btn btn-outline-dark"
                  onClick={() => handleQuantityChange(item.CartItemId, item.TotalQuantity - 1)}
                  disabled={item.TotalQuantity <= 1}
                >
                  <i className="fas fa-minus">-</i>
                </button>
                <input
                  type="text"
                  className="form-control text-center fw-semibold"
                  value={item.TotalQuantity}
                  readOnly
                  style={{ maxWidth: '60px' }}
                />
                <button
                  className="btn btn-outline-dark"
                  onClick={() => handleQuantityChange(item.CartItemId, item.TotalQuantity + 1)}
                >
                  <i className="fas fa-plus">+</i>
                </button>
              </div>
            </div>

            <div className="col-md-2 col-6 mt-2 mt-md-0">
              <button
                className="btn btn-outline-danger btn-sm w-100"
                onClick={() => handleRemoveItem(item.CartItemId)}
              >
                <i className="fas fa-trash me-1"></i> Xóa
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading || !cart) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <div className="spinner-border text-dark" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Đang tải giỏ hàng...</p>
          </div>
        </div>
      </div>
    );
  }

  const foodItems = cart.Items?.filter((item) => item.FoodDetails !== null) || [];
  const comboItems = cart.Items?.filter((item) => item.ComboDetails !== null) || [];

  return (
    <>
      <div className="cart-header">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h1 className="display-5 fw-bold mb-0">
                <i className="fas fa-shopping-cart me-3"></i>
                Giỏ hàng của bạn
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container pb-5">
        {(foodItems.length > 0 || comboItems.length > 0) ? (
          <>
            {foodItems.length > 0 && (
              <div className="mb-5">
                <h3 className="section-title fw-bold mb-4">
                  <i className="fas fa-utensils me-2"></i>
                  Món ăn ({foodItems.length} món)
                </h3>
                {foodItems.map(renderCartItem)}
              </div>
            )}

            {comboItems.length > 0 && (
              <div className="mb-5">
                <h3 className="section-title fw-bold mb-4">
                  <i className="fas fa-box me-2"></i>
                  Combo ({comboItems.length} combo)
                </h3>
                {comboItems.map(renderCartItem)}
              </div>
            )}

            <div className="row justify-content-end">
              <div className="col-md-6 col-lg-4">
                <div className="total-section">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="h5 mb-0">Tổng số món:</span>
                    <span className="h5 mb-0 fw-bold">{cart.Items?.length || 0}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <span className="h4 mb-0">Tổng tiền:</span>
                    <span className="h4 mb-0 fw-bold text-success">
                      {cart.TotalAmount.toLocaleString()} VND
                    </span>
                  </div>
                  <div className="d-grid gap-2">
                    <button className="btn btn-success btn-lg fw-semibold">
                      <i className="fas fa-credit-card me-2"></i>
                      Thanh toán
                    </button>
                    <button
                      className="btn btn-custom-clear"
                      onClick={handleClearCart}
                    >
                      <i className="fas fa-trash me-2"></i>
                      Xóa toàn bộ giỏ hàng
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="empty-cart">
            <div className="text-center">
              <i className="fas fa-shopping-cart fa-5x text-muted mb-4"></i>
              <h3 className="text-muted mb-3">Giỏ hàng của bạn đang trống</h3>
              <p className="text-muted mb-4">Hãy thêm một số món ăn yêu thích vào giỏ hàng!</p>
              <button className="btn btn-dark btn-lg" onClick={() => navigate('/')}>
                <i className="fas fa-utensils me-2"></i>
                Khám phá menu
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartPage;
