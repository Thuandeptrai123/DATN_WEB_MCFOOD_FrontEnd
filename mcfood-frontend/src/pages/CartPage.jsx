import { useEffect, useState } from "react";
import { getCartByCustomer, removeItemFromCart, updateCartItemQuantity } from "../api/cartService";

export default function CartPage() {
  const customerId = "YOUR_CUSTOMER_ID"; // 👈 chỉnh lại ID thật (lấy từ localStorage hoặc context)
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const ImageAPIUrl = "https://localhost:7233";

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await getCartByCustomer(customerId);
      setCart(res.data.Data);
    } catch (err) {
      console.error("Lỗi khi lấy giỏ hàng:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (itemId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá sản phẩm này?")) return;
    try {
      await removeItemFromCart(itemId);
      fetchCart();
    } catch (err) {
      console.error("Lỗi khi xoá:", err);
    }
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateCartItemQuantity(itemId, newQuantity);
      fetchCart();
    } catch (err) {
      console.error("Lỗi khi cập nhật số lượng:", err);
    }
  };

  // 👉 Hàm tính tổng tiền
  const calculateTotal = () => {
    if (!cart || !cart.items) return 0;

    return cart.items.reduce((total, item) => {
      const price = item.food?.price || item.combo?.price || 0;
      return total + price * item.quantity;
    }, 0);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">🛒 Giỏ hàng của bạn</h2>
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" />
          <p className="mt-2">Đang tải giỏ hàng...</p>
        </div>
      ) : !cart || !cart.items || cart.items.length === 0 ? (
        <div className="alert alert-info text-center">Giỏ hàng của bạn đang trống.</div>
      ) : (
        <>
          <div className="row">
            {cart.items.map((item) => {
              const product = item.food || item.combo;
              const price = product?.price || 0;
              return (
                <div className="col-md-6 mb-4" key={item.cartItemId}>
                  <div className="card shadow-sm border-dark">
                    <img
                      src={`${ImageAPIUrl}${product?.imageUrl}`}
                      className="card-img-top"
                      alt={product?.name}
                      style={{ height: "200px", objectFit: "cover" }}
                      onError={(e) => (e.target.src = "/default-image.jpg")}
                    />
                    <div className="card-body text-center">
                      <h5 className="card-title">{product?.name}</h5>
                      <p className="fw-bold mb-2">{price?.toLocaleString()} ₫</p>
                      <div className="d-flex justify-content-center align-items-center gap-2 mb-3">
                        <button
                          className="btn btn-outline-dark"
                          onClick={() => handleQuantityChange(item.cartItemId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          className="btn btn-outline-dark"
                          onClick={() => handleQuantityChange(item.cartItemId, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="btn btn-danger w-100"
                        onClick={() => handleRemove(item.cartItemId)}
                      >
                        Xoá
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tổng tiền */}
          <div className="text-center mt-4">
            <h4 className="fw-bold">Tổng tiền: {calculateTotal().toLocaleString()} ₫</h4>
            <button className="btn btn-dark mt-3 px-5 py-2">Thanh toán</button>
          </div>
        </>
      )}
    </div>
  );
}
