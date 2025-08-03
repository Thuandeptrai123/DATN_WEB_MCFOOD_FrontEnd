// components/RecentPurchaseSection.jsx
import React, { useEffect, useState } from "react";
import invoiceService from "../../api/invoiceService"; // ✅ Import service

const RecentPurchaseSection = () => {
  const [recentFoods, setRecentFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await invoiceService.getLastInvoiceRecommendations();
        setRecentFoods(res?.data || []);
      } catch (err) {
        console.error("Lỗi khi tải món ăn gần đây:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecent();
  }, []);

  if (loading || !recentFoods.length) return null;

  return (
    <section className="recent-purchase-section mt-5">
      <div className="section-header mb-3">
        <h2>🕒 Món bạn vừa mua gần đây</h2>
        <p>Xem lại và đặt lại món bạn đã từng dùng</p>
      </div>

      <div className="row g-4">
        {recentFoods.map((food) => (
          <div className="col-lg-3 col-md-4 col-sm-6" key={food.foodId}>
            <div className="product-card">
              <div className="product-image-wrapper">
                <img
                  src={food.image || "/default-food.jpg"}
                  alt={food.foodName}
                  className="product-image"
                />
              </div>
              <div className="product-content">
                <h5>{food.foodName}</h5>
                <p className="text-muted">Đã mua: {food.quantity || 1} lần</p>
                <button className="btn-add">Thêm lại</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecentPurchaseSection;
