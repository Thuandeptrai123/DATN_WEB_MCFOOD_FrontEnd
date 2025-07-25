import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import invoiceService from "../api/invoiceService";
import { toast } from "react-toastify";
import { useCart } from "../Context/CartContext"; // Nếu bạn dùng context để lưu cart
import { useSelector } from "react-redux"; // Hoặc redux nếu có

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems } = useCart(); // hoặc dùng useSelector(state => state.cart)
  const user = JSON.parse(localStorage.getItem("user")); // hoặc lấy từ redux
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  
  const handleCheckout = async () => {
    const rawUser = localStorage.getItem("userInfo");
    const user = rawUser ? JSON.parse(rawUser) : null;

    if (!user?.Id) {
      toast.error("Vui lòng đăng nhập.");
      return;
    }

    setLoading(true);
    try {
      // 1. Gửi yêu cầu tạo hóa đơn
      const res = await invoiceService.createInvoice(user.Id); // ✅ dùng đúng key
      const invoice = res.data.data;

      toast.success("Tạo hóa đơn thành công.");

      // 2. Gửi yêu cầu xử lý thanh toán
      const paymentRes = await invoiceService.processPayment(invoice.id, paymentMethod);
      const { message, data } = paymentRes.data;

      if (paymentMethod === "COD") {
        toast.success(message);
        navigate("/order-history");
      } else {
        window.location.href = data.paymentRedirectUrl;
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Thanh toán thất bại");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="checkout-container">
      <h2>Thanh toán</h2>
      <div className="cart-summary">
        <ul>
          {(cartItems || []).length > 0 ? (
            cartItems.map((item, index) => (
              <li key={index}>
                {item.foodName || item.comboName} - SL: {item.quantity}
              </li>
            ))
          ) : (
            <li>Không có sản phẩm nào trong giỏ hàng.</li>
          )}
        </ul>
      </div>


      <div className="payment-method">
        <label>Chọn phương thức thanh toán:</label>
        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
          <option value="COD">Thanh toán khi nhận hàng (COD)</option>
          <option value="MoMo">Ví MoMo</option>
          {/* <option value="VNPay">VNPay</option> */}
        </select>
      </div>

      <button disabled={loading} onClick={handleCheckout}>
        {loading ? "Đang xử lý..." : "Xác nhận thanh toán"}
      </button>
    </div>
  );
};

export default CheckoutPage;
