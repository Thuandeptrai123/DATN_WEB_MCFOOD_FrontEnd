import { useEffect, useState } from "react";
import { getAllFoods } from "../api/foodService";
import { getAllCombos } from "../api/CombosService";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../Styles/ProductList.css";
import cartService from "../api/cartService"; // ✅ sửa lại đúng import
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import CartService from "../api/cartService";
import { useCart } from "../Context/CartContext"; 

export default function ProductList() {
  const [foods, setFoods] = useState([]);
  const [combos, setCombos] = useState([]);
  const [loadingFoods, setLoadingFoods] = useState(true);
  const [loadingCombos, setLoadingCombos] = useState(true);
  
  // Thêm state cho search và filter
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [showFoods, setShowFoods] = useState(true);
  const [showCombos, setShowCombos] = useState(true);
  
  const ImageAPIUrl = "https://localhost:7233";
  const navigate = useNavigate();
  const customer = useSelector((state) => state.auth.customer);
  const { addItem } = useCart();

  const bannerImages = [
    "/pic/banner1.jpg",
    "/pic/banner2.png",
    "/pic/banner3.jpg",
  ];

  function NextArrow(props) {
    const { onClick } = props;
    return (
      <div className="arrow next" onClick={onClick}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
          <path d="M8.5 19l7-7-7-7" />
        </svg>
      </div>
    );
  }

  function PrevArrow(props) {
    const { onClick } = props;
    return (
      <div className="arrow prev" onClick={onClick}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
          <path d="M15.5 19l-7-7 7-7" />
        </svg>
      </div>
    );
  }

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    dotsClass: "slick-dots custom-dots",
  };

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await getAllFoods();
        setFoods(Array.isArray(res.data.Data) ? res.data.Data : []);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách món ăn:", err);
        toast.error("Không thể tải danh sách sản phẩm");
      } finally {
        setLoadingFoods(false);
      }
    };

    const fetchCombos = async () => {
      try {
        const res = await getAllCombos();
        setCombos(Array.isArray(res.data.Data) ? res.data.Data : []);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách combo:", err);
      } finally {
        setLoadingCombos(false);
      }
    };

    fetchFoods();
    fetchCombos();
  }, []);

  // Hàm filter và search
  const filterAndSortItems = (items) => {
    let filtered = items;

    // Filter theo search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.Description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter theo price
    if (priceFilter !== "all") {
      filtered = filtered.filter(item => {
        const price = item.Price || 0;
        switch (priceFilter) {
          case "under50k":
            return price < 50000;
          case "50k-100k":
            return price >= 50000 && price <= 100000;
          case "100k-200k":
            return price >= 100000 && price <= 200000;
          case "over200k":
            return price > 200000;
          default:
            return true;
        }
      });
    }

    // Sort
    if (sortBy !== "default") {
      filtered = [...filtered].sort((a, b) => {
        switch (sortBy) {
          case "price-asc":
            return (a.Price || 0) - (b.Price || 0);
          case "price-desc":
            return (b.Price || 0) - (a.Price || 0);
          case "name-asc":
            return a.Name.localeCompare(b.Name);
          case "name-desc":
            return b.Name.localeCompare(a.Name);
          default:
            return 0;
        }
      });
    }
    return filtered;
  };

  const filteredFoods = filterAndSortItems(foods);
  const filteredCombos = filterAndSortItems(combos);

  const handleAddToCart = async (item, type = "food") => {
    try {
      const data =
        type === "food"
          ? { FoodID: item.Id, Quantity: 1 }
          : { ComboID: item.Id, Quantity: 1 };

      await addItem(data); // dùng context thay vì gọi API riêng
      toast.success("✅ Đã thêm vào giỏ hàng!");
    } catch (error) {
      console.error("❌ Lỗi khi thêm giỏ hàng:", error);
      toast.error("❌ Không thể thêm vào giỏ hàng");
    }
  };

  // Hàm clear tất cả filters
  const clearFilters = () => {
    setSearchTerm("");
    setPriceFilter("all");
    setSortBy("default");
    setShowFoods(true);
    setShowCombos(true);
  };

  return (
    <div className="product-list-bg">
      <div className="container py-5">
        {/* Banner */}
        <div className="banner-wrapper">
          <Slider {...sliderSettings}>
            {bannerImages.map((src, index) => (
              <div key={index}>
                <div className="banner-image-wrapper">
                  <img src={src} alt={`Banner ${index}`} className="banner-image" />
                  <div className="banner-overlay">
                    <div className="banner-text">
                      <h1>Chào mừng đến với MCFOOD</h1>
                      <p>Trải nghiệm ẩm thực tuyệt vời</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>

        {/* Search và Filter Section */}
        <section className="search-filter-section mb-5">
          <div className="row g-3 align-items-center">
            {/* Search Box */}
            <div className="col-lg-4 col-md-6">
              <div className="search-wrapper">
                <input
                  type="text"
                  className="form-control search-input"
                  placeholder="🔍 Tìm kiếm món ăn, combo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Price Filter */}
            <div className="col-lg-2 col-md-6">
              <select
                className="form-select filter-select"
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
              >
                <option value="all">💰 Tất cả giá</option>
                <option value="under50k">Dưới 50k</option>
                <option value="50k-100k">50k - 100k</option>
                <option value="100k-200k">100k - 200k</option>
                <option value="over200k">Trên 200k</option>
              </select>
            </div>

            {/* Sort */}
            <div className="col-lg-2 col-md-6">
              <select
                className="form-select filter-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">📊 Sắp xếp</option>
                <option value="price-asc">Giá tăng dần</option>
                <option value="price-desc">Giá giảm dần</option>
                <option value="name-asc">Tên A-Z</option>
                <option value="name-desc">Tên Z-A</option>
              </select>
            </div>

            {/* Category Toggle */}
            <div className="col-lg-3 col-md-6">
              <div className="category-toggles">
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="showFoods"
                    checked={showFoods}
                    onChange={(e) => setShowFoods(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="showFoods">
                    🍔 Món ăn
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="showCombos"
                    checked={showCombos}
                    onChange={(e) => setShowCombos(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="showCombos">
                    ✨ Combo
                  </label>
                </div>
              </div>
            </div>

            {/* Clear Filters */}
            <div className="col-lg-1 col-md-6 text-end">
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={clearFilters}
                title="Xóa tất cả bộ lọc"
              >
                🗑️ Xóa
              </button>
            </div>
          </div>

          {/* Results Info */}
          <div className="results-info mt-3">
            <small className="text-muted">
              {showFoods && (
                <span>Món ăn: {filteredFoods.length}/{foods.length} </span>
              )}
              {showCombos && (
                <span>Combo: {filteredCombos.length}/{combos.length}</span>
              )}
              {searchTerm && (
                <span className="ms-2">
                  <strong>Từ khóa:</strong> "{searchTerm}"
                </span>
              )}
            </small>
          </div>
        </section>

        {/* Món ăn */}
        {showFoods && (
          <section className="section-spacing">
            <div className="section-header">
              <h2>🍔 Menu món ăn nổi bật</h2>
              <p>Khám phá những món ăn đặc sắc được chế biến từ nguyên liệu tươi ngon</p>
            </div>

            {loadingFoods ? (
              <div className="loading-wrapper">
                <div className="spinner-border text-dark" style={{ width: "3rem", height: "3rem" }} />
                <p>Đang tải món ăn...</p>
              </div>
            ) : !Array.isArray(foods) || foods.length === 0 ? (
              <div className="empty-alert food-alert">
                <h4>Không có món ăn nào.</h4>
              </div>
            ) : filteredFoods.length === 0 ? (
              <div className="empty-alert food-alert">
                <h4>Không tìm thấy món ăn phù hợp với bộ lọc.</h4>
                <button className="btn btn-primary mt-2" onClick={clearFilters}>
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <div className="row g-4">
                {filteredFoods.map((food) => (
                  <div className="col-lg-3 col-md-4 col-sm-6" key={food.Id}>
                    <div className="product-card" onClick={() => navigate(`/foods/${food.Id}`)}>
                      <div className="product-image-wrapper">
                        <img
                          src={`${ImageAPIUrl}${food.ImageUrl}`}
                          alt={food.Name}
                          className="product-image"
                          onError={(e) => (e.target.src = "/default-food.jpg")}
                        />
                        <div className="product-badge">HOT</div>
                      </div>
                      <div className="product-content">
                        <h5>{food.Name}</h5>
                        <p>{food.Description}</p>
                        <div className="product-price">
                          <span>{food.Price?.toLocaleString()} ₫</span>
                        </div>
                        <button
                          className="btn-add"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(food, "food"); // 👈 thêm type rõ ràng
                          }}
                        >
                          Thêm vào giỏ
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Combo */}
        {showCombos && (
          <section>
            <div className="section-header">
              <h2>✨ Combo siêu tiết kiệm ✨</h2>
              <p>Tiết kiệm hơn với các combo đặc biệt được thiết kế riêng cho bạn</p>
            </div>

            {loadingCombos ? (
              <div className="loading-wrapper">
                <div className="spinner-border text-dark" style={{ width: "3rem", height: "3rem" }} />
                <p>Đang tải combo...</p>
              </div>
            ) : !Array.isArray(combos) || combos.length === 0 ? (
              <div className="empty-alert combo-alert">
                <h4>Hiện chưa có combo.</h4>
              </div>
            ) : filteredCombos.length === 0 ? (
              <div className="empty-alert combo-alert">
                <h4>Không tìm thấy combo phù hợp với bộ lọc.</h4>
                <button className="btn btn-primary mt-2" onClick={clearFilters}>
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <div className="row g-4">
                {filteredCombos.map((combo) => (
                  <div className="col-lg-4 col-md-6" key={combo.Id}>
                    <div className="product-card combo-card" onClick={() => navigate(`/combos/${combo.Id}`)}>
                      <div className="product-image-wrapper">
                        <img
                          src={`${ImageAPIUrl}${combo.ImageUrl}`}
                          alt={combo.Name}
                          className="product-image"
                          onError={(e) => (e.target.src = "/default-combo.jpg")}
                        />
                        <div className="combo-badge">COMBO</div>
                      </div>
                      <div className="product-content">
                        <h5>{combo.Name}</h5>
                        <p>{combo.Description}</p>
                        <div className="product-price">
                          <span>{combo.Price?.toLocaleString()} ₫</span>
                        </div>
                        <button
                          className="btn-combo"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(combo, "combo"); // 👈 combo
                          }}
                        >
                          Thêm combo
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      {/* Thêm CSS cho search và filter */}
      <style jsx>{`
        .search-filter-section {
          background: rgba(255, 255, 255, 0.9);
          border-radius: 15px;
          padding: 20px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
        }

        .search-input {
          border: 2px solid #e9ecef;
          border-radius: 25px;
          padding: 12px 20px;
          font-size: 16px;
          transition: all 0.3s ease;
        }

        .search-input:focus {
          border-color: #007bff;
          box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
          transform: translateY(-2px);
        }

        .filter-select {
          border-radius: 10px;
          border: 2px solid #e9ecef;
          padding: 10px 15px;
          transition: all 0.3s ease;
        }

        .filter-select:focus {
          border-color: #007bff;
          box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
        }

        .category-toggles {
          display: flex;
          gap: 15px;
          align-items: center;
        }

        .form-check-input:checked {
          background-color: #007bff;
          border-color: #007bff;
        }

        .form-check-label {
          font-weight: 500;
          color: #495057;
          cursor: pointer;
        }

        .results-info {
          padding: 10px 0;
          border-top: 1px solid #e9ecef;
        }

        .empty-alert {
          text-align: center;
          padding: 40px;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 15px;
          margin: 20px 0;
        }

        .btn-outline-secondary:hover {
          transform: translateY(-2px);
          transition: all 0.3s ease;
        }

        @media (max-width: 768px) {
          .search-filter-section {
            padding: 15px;
          }
          
          .category-toggles {
            flex-direction: column;
            gap: 10px;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}
