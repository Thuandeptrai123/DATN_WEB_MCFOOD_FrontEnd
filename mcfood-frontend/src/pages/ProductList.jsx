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

//   const handleAddToCart = async (item, type = "food") => {
//   try {
//     const data =
//       type === "food"
//         ? { FoodID: item.Id, Quantity: 1 } // phải viết hoa như backend
//         : { ComboID: item.Id, Quantity: 1 };

//     const response = await CartService.addItemToCart(data);
//     toast.success("✅ Đã thêm vào giỏ hàng!");
//     // window.location.reload(); 
//     console.log("Thêm thành công:", response);
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

      await addItem(data); // dùng context thay vì gọi API riêng
      toast.success("✅ Đã thêm vào giỏ hàng!");
    } catch (error) {
      console.error("❌ Lỗi khi thêm giỏ hàng:", error);
      toast.error("❌ Không thể thêm vào giỏ hàng");
    }
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

        {/* Món ăn */}
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
          ) : (
            <div className="row g-4">
              {foods.map((food) => (
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

        {/* Combo */}
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
          ) : (
            <div className="row g-4">
              {combos.map((combo) => (
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
      </div>
    </div>
  );
}
