// src/pages/RecommendationPage.js
import React, { useEffect, useState } from "react";
import RecommendationService from "../api/recommendationService";
import { useAuth } from "../Context/AuthContext";
import "../Styles/RecommendationPage.css"; // Import your styles

const RecommendationPage = () => {
  const { isLoggedIn } = useAuth();

  const [latest, setLatest] = useState([]);
  const [favorite, setFavorite] = useState([]);
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // always fetch popular
    RecommendationService.getPopular()
      .then((res) => setPopular(res.data.Data))
      .catch(() => setPopular([]));

    // only fetch latest & favorite if logged in
    if (isLoggedIn) {
      RecommendationService.getLatest()
        .then((res) => setLatest(res.data.Data))
        .catch(() => setLatest([]));

      RecommendationService.getFavorite()
        .then((res) => setFavorite(res.data.Data))
        .catch(() => setFavorite([]));
    }

    setLoading(false);
  }, [isLoggedIn]);

  if (loading) {
    return (
      <div className="container-fluid bg-white min-vh-100 py-5">
        <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid bg-white text-dark min-vh-100 py-5">
      <div className="container">
        {/* Header */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="text-center">
              <h1 className="display-4 fw-bold text-primary mb-3">
                <i className="fas fa-utensils me-3"></i>
                Gợi ý món ăn
              </h1>
              <p className="lead text-muted">Khám phá những món ăn phù hợp với bạn</p>
            </div>
          </div>
        </div>

        {/* User-specific recommendations */}
        {isLoggedIn && (
          <div className="row mb-5">
            {/* Latest recommendations */}
            <div className="col-lg-6 mb-4">
              <div className="recommendation-section h-100">
                <div className="section-header">
                  <h2 className="section-title">
                    <i className="fas fa-clock text-success me-2"></i>
                    Dựa trên hóa đơn gần nhất
                  </h2>
                </div>
                <div className="section-content">
                  {Array.isArray(latest) && latest.length > 0 ? (
                    <RecommendationGrid data={latest} type="latest" />
                  ) : (
                    <div className="no-data">
                      <i className="fas fa-info-circle text-muted mb-2"></i>
                      <p className="text-muted">Không có gợi ý nào.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Favorite recommendations */}
            <div className="col-lg-6 mb-4">
              <div className="recommendation-section h-100">
                <div className="section-header">
                  <h2 className="section-title">
                    <i className="fas fa-heart text-danger me-2"></i>
                    Món ăn bạn đặt nhiều nhất
                  </h2>
                </div>
                <div className="section-content">
                  {Array.isArray(favorite) && favorite.length > 0 ? (
                    <RecommendationGrid data={favorite} type="favorite" />
                  ) : (
                    <div className="no-data">
                      <i className="fas fa-info-circle text-muted mb-2"></i>
                      <p className="text-muted">Không có gợi ý nào.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Popular recommendations */}
        <div className="row">
          <div className="col-12">
            <div className="recommendation-section">
              <div className="section-header">
                <h2 className="section-title">
                  <i className="fas fa-fire text-warning me-2"></i>
                  Món ăn phổ biến nhất
                </h2>
                <p className="text-muted mb-0">Những món ăn được yêu thích nhất</p>
              </div>
              <div className="section-content">
                {Array.isArray(popular) && popular.length > 0 ? (
                  <RecommendationGrid data={popular} type="popular" cols={4} />
                ) : (
                  <div className="no-data">
                    <i className="fas fa-exclamation-triangle text-warning mb-2"></i>
                    <p className="text-muted">Không có dữ liệu phổ biến.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RecommendationGrid = ({ data, type, cols = 2 }) => {
  const colClass = `col-lg-${12 / cols} col-md-6 col-sm-12`;
  
  return (
    <div className="row g-3">
      {data.map((item, idx) => (
        <div key={idx} className={colClass}>
          <div className="recommendation-card h-100">
            <div className="card-body">
              <div className="d-flex align-items-start justify-content-between mb-3">
                <h5 className="card-title mb-0 text-dark fw-bold">
                  {item.FoodName || item.ComboName}
                </h5>
                <div className="recommendation-badge">
                  {type === "latest" && <i className="fas fa-clock text-success"></i>}
                  {type === "favorite" && <i className="fas fa-heart text-danger"></i>}
                  {type === "popular" && <i className="fas fa-fire text-warning"></i>}
                </div>
              </div>
              
              <div className="recommendation-stats">
                {item.Quantity && (
                  <div className="stat-item">
                    <i className="fas fa-shopping-cart text-primary me-2"></i>
                    <span className="stat-label">Số lượng:</span>
                    <span className="stat-value">{item.Quantity}</span>
                  </div>
                )}
                {item.TotalOrdered && (
                  <div className="stat-item">
                    <i className="fas fa-chart-line text-success me-2"></i>
                    <span className="stat-label">Đã đặt:</span>
                    <span className="stat-value">{item.TotalOrdered}</span>
                  </div>
                )}
                {item.TotalCustomers && (
                  <div className="stat-item">
                    <i className="fas fa-users text-info me-2"></i>
                    <span className="stat-label">Khách đã đặt:</span>
                    <span className="stat-value">{item.TotalCustomers}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecommendationPage;