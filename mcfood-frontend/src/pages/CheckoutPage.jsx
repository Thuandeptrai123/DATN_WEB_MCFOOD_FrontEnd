import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import invoiceService from "../api/invoiceService";
import CartService from "../api/cartService";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useCart } from "../Context/CartContext";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const token = localStorage.getItem("token");
  // const { addItem } = useCart();
  const { clearCart } = useCart();


  useEffect(() => {
    if (!token) {
      toast.error("Vui lòng đăng nhập để thanh toán");
      navigate("/login");
      return;
    }

    const fetchCart = async () => {
      try {
        const result = await invoiceService.getMyCart();
        if (result && result.Cart?.Items) {
          setCartItems(result.Cart.Items);
          setUserInfo(result.User);
          const total = result.Cart.Items.reduce(
            (sum, item) => sum + item.Price * item.Quantity,
            0
          );
          setTotalPrice(total);
          
        } else {
          toast.error("Không thể tải giỏ hàng.");
        }
      } catch (error) {
        console.error(error);
        toast.error(error.message || "Đã xảy ra lỗi khi tải giỏ hàng.");
      }
    };

    fetchCart();
  }, [token, navigate]);

  // const handleCreateInvoice = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await invoiceService.createInvoice(userInfo?.Id);
  //     console.log("Invoice response:", response);

  //     if (response?.ErrorCode === 0) {
  //       toast.success("Đặt hàng thành công!");
  //       navigate("/order-history");
  //       window.location.reload(); 
  //     } else {
  //       toast.error(response?.Message || "Tạo hóa đơn thất bại.");
  //       console.error("Lỗi tạo hóa đơn:", response);
  //     }
  //   } catch (error) {
  //     console.error("Lỗi tạo hóa đơn:", error);
  //     toast.error(error.message || "Đã xảy ra lỗi khi tạo hóa đơn.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // const handleCreateInvoice = async () => {
  //   try {
  //     setLoading(true);
  //     console.log("Gửi customerId:", userInfo?.Id); // 👉 log để kiểm tra

  //     const response = await invoiceService.createInvoice(userInfo?.Id);

  //     console.log("Invoice response:", response);

  //     if (response?.errorCode === 0) {
  //       toast.success("Đặt hàng thành công!");
  //       navigate("/order-history");
  //       window.location.reload();
  //     } else {
  //       toast.error(response?.message || "Tạo hóa đơn thất bại.");
  //       console.error("Lỗi tạo hóa đơn:", response);
  //     }
  //   } catch (error) {
  //     console.error("❌ Lỗi tạo hóa đơn:", error);
  //     toast.error(
  //       error?.response?.data?.message ||
  //       error?.message ||
  //       "Đã xảy ra lỗi khi tạo hóa đơn."
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleCreateInvoice = async () => {
    try {
      setLoading(true);
      console.log("🧾 Gửi customerId:", userInfo?.Id);

      const response = await invoiceService.createInvoice(userInfo?.Id);

      console.log("📦 Invoice response:", response);

      if (response?.ErrorCode === 0) {
        toast.success(response?.Message || "Đặt hàng thành công!");
        clearCart();
        navigate("/order-history");
        window.location.reload();
      } else {
        toast.error(response?.Message || "Tạo hóa đơn thất bại.");
        console.error("❌ Lỗi tạo hóa đơn:", response);
      }
    } catch (error) {
      console.error("❌ Exception:", error);
      toast.error(
        error?.response?.data?.Message ||
        error?.message ||
        "Đã xảy ra lỗi khi tạo hóa đơn."
      );
    } finally {
      setLoading(false);
    }
  };



  const handleCancleOrder = () => {
    navigate("/cart");
  }

  const customStyles = {
    container: {
      backgroundColor: '#ffffff',
      minHeight: '100vh',
      paddingTop: '2rem',
      paddingBottom: '2rem'
    },
    card: {
      backgroundColor: '#ffffff',
      border: '1px solid #e9ecef',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      overflow: 'hidden'
    },
    cardHeader: {
      backgroundColor: '#f8f9fa',
      borderBottom: '1px solid #e9ecef',
      padding: '1.5rem'
    },
    title: {
      color: '#212529',
      fontWeight: '600',
      fontSize: '1.75rem',
      margin: 0
    },
    infoCard: {
      backgroundColor: '#f8f9fa',
      border: '1px solid #e9ecef',
      borderRadius: '8px',
      padding: '1.5rem',
      marginBottom: '2rem'
    },
    infoLabel: {
      color: '#495057',
      fontWeight: '600',
      fontSize: '0.875rem',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: '0.25rem'
    },
    infoValue: {
      color: '#212529',
      fontSize: '1rem',
      marginBottom: '1rem'
    },
    table: {
      backgroundColor: '#ffffff',
      border: '1px solid #e9ecef',
      borderRadius: '8px',
      overflow: 'hidden'
    },
    tableHeader: {
      backgroundColor: '#212529',
      color: '#ffffff',
      fontWeight: '600',
      fontSize: '0.875rem',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    tableRow: {
      borderBottom: '1px solid #e9ecef'
    },
    tableCell: {
      color: '#495057',
      fontSize: '0.95rem',
      padding: '1rem 0.75rem'
    },
    totalSection: {
      backgroundColor: '#f8f9fa',
      border: '1px solid #e9ecef',
      borderRadius: '8px',
      padding: '1.5rem',
      marginTop: '2rem'
    },
    totalText: {
      color: '#212529',
      fontSize: '1.5rem',
      fontWeight: '600',
      margin: 0
    },
    confirmBtn: {
      backgroundColor: '#212529',
      borderColor: '#212529',
      color: '#ffffff',
      padding: '12px 30px',
      fontSize: '1rem',
      fontWeight: '600',
      borderRadius: '8px',
      transition: 'all 0.3s ease',
      border: 'none',
      cursor: 'pointer'
    },
    confirmBtnHover: {
      backgroundColor: '#343a40',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
    },
    emptyCart: {
      color: '#6c757d',
      fontSize: '1.1rem',
      textAlign: 'center',
      padding: '3rem'
    }
  };

  return (
    <div style={customStyles.container}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-8">
            <div style={customStyles.card}>
              {/* Header */}
              <div style={customStyles.cardHeader}>
                <h2 style={customStyles.title}>
                  <i className="fas fa-shopping-cart me-3"></i>
                  Thông tin đơn hàng
                </h2>
              </div>

              <div className="p-4">
                {/* Customer Information */}
                <div style={customStyles.infoCard}>
                  <h5 className="mb-4" style={{ color: '#212529', fontWeight: '600' }}>
                    <i className="fas fa-user me-2"></i>
                    Thông tin khách hàng
                  </h5>
                  
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <div style={customStyles.infoLabel}>Tên khách hàng</div>
                        <div style={customStyles.infoValue}>
                          {userInfo?.UserName || userInfo?.Email || "Không xác định"}
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div style={customStyles.infoLabel}>Email</div>
                        <div style={customStyles.infoValue}>
                          {userInfo?.Email || "Không rõ"}
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="mb-3">
                        <div style={customStyles.infoLabel}>Địa chỉ</div>
                        <div style={customStyles.infoValue}>
                          {userInfo?.Address || "Chưa cập nhật"}
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div style={customStyles.infoLabel}>Số điện thoại</div>
                        <div style={customStyles.infoValue}>
                          {userInfo?.PhoneNumbers || "Chưa có"}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-top">
                    <div style={customStyles.infoLabel}>Phương thức thanh toán</div>
                    <div style={customStyles.infoValue}>
                      <i className="fas fa-money-bill-wave me-2"></i>
                      Thanh toán khi nhận hàng (COD)
                    </div>
                  </div>
                </div>

                {/* Cart Items Table */}
                <div className="mb-4">
                  <h5 className="mb-3" style={{ color: '#212529', fontWeight: '600' }}>
                    <i className="fas fa-list me-2"></i>
                    Chi tiết đơn hàng
                  </h5>
                  
                  <div className="table-responsive" style={customStyles.table}>
                    <table className="table table-hover mb-0">
                      <thead>
                        <tr style={customStyles.tableHeader}>
                          <th className="border-0 py-3 px-3">Sản phẩm</th>
                          <th className="border-0 py-3 px-3 text-center">Số lượng</th>
                          <th className="border-0 py-3 px-3 text-end">Giá</th>
                          <th className="border-0 py-3 px-3 text-end">Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cartItems.length > 0 ? (
                          cartItems.map((item, index) => (
                            <tr key={item.CartItemId || item.ProductName + item.Price} style={customStyles.tableRow}>
                              <td style={customStyles.tableCell}>
                                <div className="d-flex align-items-center">
                                  <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-3" 
                                       style={{ width: '40px', height: '40px' }}>
                                    <i className="fas fa-box" style={{ color: '#6c757d' }}></i>
                                  </div>
                                  <div>
                                    <div style={{ fontWeight: '500' }}>
                                      {item.ProductName || "Không rõ"}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td style={{ ...customStyles.tableCell, textAlign: 'center' }}>
                                <span className="badge bg-light text-dark px-3 py-2">
                                  {item.Quantity ?? 0}
                                </span>
                              </td>
                              <td style={{ ...customStyles.tableCell, textAlign: 'right' }}>
                                {item.Price ? item.Price.toLocaleString() + "₫" : "Không rõ"}
                              </td>
                              <td style={{ ...customStyles.tableCell, textAlign: 'right', fontWeight: '600' }}>
                                {item.Total ? item.Total.toLocaleString() + "₫" : "Không rõ"}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" style={customStyles.emptyCart}>
                              <i className="fas fa-shopping-cart fa-2x mb-3 d-block" style={{ opacity: 0.3 }}></i>
                              Giỏ hàng trống
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Total Section */}
                <div style={customStyles.totalSection}>
                  <div className="d-flex justify-content-between align-items-center">
                    <h4 style={customStyles.totalText}>
                      Tổng thanh toán:
                    </h4>
                    <h4 style={{ ...customStyles.totalText, color: '#212529' }}>
                      {totalPrice.toLocaleString()}₫
                    </h4>
                  </div>
                </div>

                {/* Confirm Button */}
                <div className="text-center mt-4">
                  <button
                    onClick={handleCreateInvoice}
                    disabled={loading || cartItems.length === 0}
                    style={customStyles.confirmBtn}
                    onMouseEnter={(e) => {
                      if (!loading && cartItems.length > 0) {
                        Object.assign(e.target.style, customStyles.confirmBtnHover);
                      }
                    }}
                    onMouseLeave={(e) => {
                      Object.assign(e.target.style, customStyles.confirmBtn);
                    }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-check-circle me-2"></i>
                        Xác nhận đặt hàng
                      </>
                    )}
                  </button>
                  <i>          </i>
                  <button
                  onClick={handleCancleOrder}
                  style={customStyles.confirmBtn}
                  >
                    <i className="fas fa-check-circle me-2">Hủy</i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;



2/2

