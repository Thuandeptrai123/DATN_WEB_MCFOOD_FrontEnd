import { useEffect, useState } from "react";
import { getAllFoods } from "../api/foodService";
import { getAllAvailableFoods } from "../api/foodService";
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
import RecentPurchaseSection from "../components/ui/RecentPurchaseSection"; // ✅ Thêm phần mua gần đây


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
  
  // Pagination states
  const [currentFoodPage, setCurrentFoodPage] = useState(1);
  const [currentComboPage, setCurrentComboPage] = useState(1);
  const ITEMS_PER_PAGE = 8; // 2 hàng × 4 món = 8 món mỗi trang
  
  const ImageAPIUrl = "https://localhost:7233";
  const navigate = useNavigate();
  const customer = useSelector((state) => state.auth.customer);
  const { addItem } = useCart();
  const [foodQuantities, setFoodQuantities] = useState({});


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
    // const fetchFoods = async () => {
    //   try {
    //     const res = await getAllAvailableFoods();
    //     setFoods(Array.isArray(res.data.Data) ? res.data.Data : []);
    //   } catch (err) {
    //     console.error("Lỗi khi lấy danh sách món ăn:", err);
    //     toast.error("Không thể tải danh sách sản phẩm");
    //   } finally {
    //     setLoadingFoods(false);
    //   }
    // };
    const fetchFoods = async () => {
    try {
      const res = await getAllAvailableFoods();
      const foodList = Array.isArray(res.data.Data) ? res.data.Data : [];
      setFoods(foodList);

      setFoodQuantities(
        foodList.reduce((acc, food) => {
          acc[food.Id] = food.CookedQuantity ?? 0;
          return acc;
        }, {})
      );
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

  // Reset pagination khi filter thay đổi
  useEffect(() => {
    setCurrentFoodPage(1);
    setCurrentComboPage(1);
  }, [searchTerm, priceFilter, sortBy]);

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

  // Pagination logic
  const getFoodsPaginated = () => {
    const startIndex = (currentFoodPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredFoods.slice(startIndex, endIndex);
  };

  const getCombosPaginated = () => {
    const startIndex = (currentComboPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredCombos.slice(startIndex, endIndex);
  };

  const totalFoodPages = Math.ceil(filteredFoods.length / ITEMS_PER_PAGE);
  const totalComboPages = Math.ceil(filteredCombos.length / ITEMS_PER_PAGE);

  // Pagination component
  const Pagination = ({ currentPage, totalPages, onPageChange, type }) => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="pagination-wrapper">
        <nav aria-label="Pagination">
          <ul className="pagination justify-content-center">
            {/* Previous button */}
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <span aria-hidden="true">&laquo; Trước</span>
              </button>
            </li>

            {/* First page */}
            {startPage > 1 && (
              <>
                <li className="page-item">
                  <button className="page-link" onClick={() => onPageChange(1)}>
                    1
                  </button>
                </li>
                {startPage > 2 && (
                  <li className="page-item disabled">
                    <span className="page-link">...</span>
                  </li>
                )}
              </>
            )}

            {/* Page numbers */}
            {pageNumbers.map(number => (
              <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => onPageChange(number)}
                >
                  {number}
                </button>
              </li>
            ))}

            {/* Last page */}
            {endPage < totalPages && (
              <>
                {endPage < totalPages - 1 && (
                  <li className="page-item disabled">
                    <span className="page-link">...</span>
                  </li>
                )}
                <li className="page-item">
                  <button className="page-link" onClick={() => onPageChange(totalPages)}>
                    {totalPages}
                  </button>
                </li>
              </>
            )}

            {/* Next button */}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <span aria-hidden="true">Sau &raquo;</span>
              </button>
            </li>
          </ul>
        </nav>
        
        <div className="pagination-info text-center mt-2">
          <small className="text-muted">
            Trang {currentPage} / {totalPages} 
            ({type === 'food' ? filteredFoods.length : filteredCombos.length} sản phẩm)
          </small>
        </div>
      </div>
    );
  };

  // const handleAddToCart = async (item, type = "food") => {
  //   try {
  //     const data =
  //       type === "food"
  //         ? { FoodID: item.Id, Quantity: 1 }
  //         : { ComboID: item.Id, Quantity: 1 };

  //     await addItem(data); // dùng context thay vì gọi API riêng
  //     toast.success("✅ Đã thêm vào giỏ hàng!");
  //   } catch (error) {
  //     console.error("❌ Lỗi khi thêm giỏ hàng:", error);
  //     toast.error("❌ Không thể thêm vào giỏ hàng");
  //   }
  // };
  const handleAddToCart = async (item, type = "food") => {
    try {
      const data =
        type === "food"
          ? { FoodID: item.Id, Quantity: 1 }
          : { ComboID: item.Id, Quantity: 1 };

      await addItem(data); // gọi context để sync giỏ hàng
      toast.success("✅ Đã thêm vào giỏ hàng!");

      // Giảm số lượng món ăn cookable
      if (type === "food") {
        setFoodQuantities((prev) => ({
          ...prev,
          [item.Id]: Math.max(0, (prev[item.Id] || 0) - 1),
        }));
      }

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
    setCurrentFoodPage(1);
    setCurrentComboPage(1);
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
        {/* Hiển thị "Mua gần đây" nếu người dùng đã từng mua */}
        <RecentPurchaseSection />
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
              <>
                <div className="row g-4">
                  {getFoodsPaginated().map((food) => (
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
                          <p className="text-muted small">
                            Còn lại: {foodQuantities[food.Id] ?? food.CookedQuantity} suất
                          </p>
                          {/* <button
                            className="btn-add"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(food, "food");
                            }}
                          >
                            Thêm vào giỏ
                          </button> */}
                          <button
                            className="btn-add"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(food, "food");
                            }}
                            disabled={(foodQuantities[food.Id] ?? food.CookedQuantity) <= 0}
                          >
                            {(foodQuantities[food.Id] ?? food.CookedQuantity) <= 0
                              ? "Hết hàng"
                              : "Thêm vào giỏ"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Food Pagination */}
                <Pagination
                  currentPage={currentFoodPage}
                  totalPages={totalFoodPages}
                  onPageChange={setCurrentFoodPage}
                  type="food"
                />
              </>
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
              <>
                <div className="row g-4">
                  {getCombosPaginated().map((combo) => (
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
                              handleAddToCart(combo, "combo");
                            }}
                          >
                            Thêm combo
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Combo Pagination */}
                <Pagination
                  currentPage={currentComboPage}
                  totalPages={totalComboPages}
                  onPageChange={setCurrentComboPage}
                  type="combo"
                />
              </>
            )}
          </section>
        )}
      </div>
    </div>
  );
}