import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "../Context/CartContext";

const Menu = () => {
  const [foodTypes, setFoodTypes] = useState([]);
  const [selectedTypeId, setSelectedTypeId] = useState(null);
  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("name");
  const [stockFilter, setStockFilter] = useState("all");
  const navigate = useNavigate();
  const { addItem } = useCart();

  // Lấy danh sách loại món ăn
  useEffect(() => {
    const fetchFoodTypes = async () => {
      try {
        const res = await axios.get("https://localhost:7233/api/foodtype");
        setFoodTypes(res.data.Data);
        setSelectedTypeId(null);
      } catch (err) {
        console.error("Lỗi khi lấy loại món ăn:", err);
      }
    };

    fetchFoodTypes();
  }, []);

  // Lấy món ăn theo loại hoặc tất cả
  useEffect(() => {
    const fetchFoods = async () => {
      setLoading(true);
      try {
        const url = selectedTypeId
          ? `https://localhost:7233/api/foods/bytype/${selectedTypeId}`
          : `https://localhost:7233/api/foods`;
        const res = await axios.get(url);
        setFoods(res.data.Data);
        setFilteredFoods(res.data.Data);
      } catch (error) {
        console.error("Lỗi khi fetch món ăn:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, [selectedTypeId]);

  // Filter và tìm kiếm
  useEffect(() => {
    let filtered = [...foods];

    // Tìm kiếm theo tên
    if (searchTerm) {
      filtered = filtered.filter(food =>
        food.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (food.Description && food.Description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Lọc theo giá
    if (priceRange.min) {
      filtered = filtered.filter(food => food.Price >= parseInt(priceRange.min));
    }
    if (priceRange.max) {
      filtered = filtered.filter(food => food.Price <= parseInt(priceRange.max));
    }

    // Lọc theo tình trạng kho
    if (stockFilter === "available") {
      filtered = filtered.filter(food => food.CookedQuantity > 0);
    } else if (stockFilter === "out-of-stock") {
      filtered = filtered.filter(food => food.CookedQuantity === 0);
    }

    // Sắp xếp
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.Name.localeCompare(b.Name);
        case "price-low":
          return a.Price - b.Price;
        case "price-high":
          return b.Price - a.Price;
        case "newest":
          return new Date(b.CreatedAt || 0) - new Date(a.CreatedAt || 0);
        default:
          return 0;
      }
    });

    setFilteredFoods(filtered);
  }, [foods, searchTerm, priceRange, sortBy, stockFilter]);

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setPriceRange({ min: "", max: "" });
    setSortBy("name");
    setStockFilter("all");
    setSelectedTypeId(null);
  };

  // Xử lý thêm vào giỏ hàng
  const handleAddToCart = async (food, e) => {
    e.stopPropagation(); // Ngăn click event bubble up
    
    if (food.CookedQuantity === 0) {
      toast.error("Món ăn đã hết hàng!");
      return;
    }

    try {
      const data = {
        foodId: food.Id,
        quantity: 1,
      };
      await addItem(data);
      toast.success(`Đã thêm "${food.Name}" vào giỏ hàng!`);
    } catch (error) {
      console.error("❌ Lỗi thêm giỏ hàng:", error);
      toast.error("Thêm vào giỏ hàng thất bại!");
    }
  };

  // Xử lý click vào món ăn để xem chi tiết
  const handleFoodClick = (foodId) => {
    navigate(`/foods/${foodId}`);
  };

  return (
    <div style={{ 
      backgroundColor: "#ffffff", 
      minHeight: "100vh",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      {/* Header */}
      <div style={{
        padding: "24px 32px",
        borderBottom: "1px solid #e5e7eb",
        backgroundColor: "#ffffff"
      }}>
        <h1 style={{
          fontSize: "28px",
          fontWeight: "700",
          color: "#111827",
          margin: "0",
          letterSpacing: "-0.025em"
        }}>
          Thực đơn
        </h1>
        <p style={{
          fontSize: "16px",
          color: "#6b7280",
          margin: "8px 0 0 0"
        }}>
          Chọn loại món ăn để xem danh sách
        </p>
      </div>

      {/* Bộ lọc loại món ăn */}
      <div style={{
        padding: "24px 32px",
        backgroundColor: "#f9fafb",
        borderBottom: "1px solid #e5e7eb"
      }}>
        <div style={{
          display: "flex",
          gap: "12px",
          overflowX: "auto",
          paddingBottom: "4px"
        }}>
          <button
            onClick={() => setSelectedTypeId(null)}
            style={{
              padding: "12px 24px",
              border: selectedTypeId === null ? "2px solid #111827" : "1px solid #d1d5db",
              borderRadius: "8px",
              backgroundColor: selectedTypeId === null ? "#111827" : "#ffffff",
              color: selectedTypeId === null ? "#ffffff" : "#374151",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
              whiteSpace: "nowrap",
              transition: "all 0.2s ease-in-out",
              outline: "none",
              minWidth: "fit-content"
            }}
            onMouseEnter={(e) => {
              if (selectedTypeId !== null) {
                e.target.style.backgroundColor = "#f3f4f6";
                e.target.style.borderColor = "#9ca3af";
              }
            }}
            onMouseLeave={(e) => {
              if (selectedTypeId !== null) {
                e.target.style.backgroundColor = "#ffffff";
                e.target.style.borderColor = "#d1d5db";
              }
            }}
          >
            Tất cả
          </button>

          {foodTypes.map((type) => (
            <button
              key={type.FoodTypeId}
              onClick={() => setSelectedTypeId(type.FoodTypeId)}
              style={{
                padding: "12px 24px",
                border: type.FoodTypeId === selectedTypeId ? "2px solid #111827" : "1px solid #d1d5db",
                borderRadius: "8px",
                backgroundColor: type.FoodTypeId === selectedTypeId ? "#111827" : "#ffffff",
                color: type.FoodTypeId === selectedTypeId ? "#ffffff" : "#374151",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
                whiteSpace: "nowrap",
                transition: "all 0.2s ease-in-out",
                outline: "none",
                minWidth: "fit-content"
              }}
              onMouseEnter={(e) => {
                if (type.FoodTypeId !== selectedTypeId) {
                  e.target.style.backgroundColor = "#f3f4f6";
                  e.target.style.borderColor = "#9ca3af";
                }
              }}
              onMouseLeave={(e) => {
                if (type.FoodTypeId !== selectedTypeId) {
                  e.target.style.backgroundColor = "#ffffff";
                  e.target.style.borderColor = "#d1d5db";
                }
              }}
            >
              {type.FoodTypeName}
            </button>
          ))}
        </div>
      </div>

      {/* Bộ lọc và tìm kiếm nâng cao */}
      <div style={{
        padding: "24px 32px",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e5e7eb"
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          alignItems: "end"
        }}>
          {/* Tìm kiếm */}
          <div>
            <label style={{
              display: "block",
              fontSize: "14px",
              fontWeight: "600",
              color: "#374151",
              marginBottom: "8px"
            }}>
              🔍 Tìm kiếm món ăn
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nhập tên món ăn..."
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "14px",
                outline: "none",
                transition: "border-color 0.2s ease-in-out"
              }}
              onFocus={(e) => e.target.style.borderColor = "#111827"}
              onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
            />
          </div>

          {/* Lọc theo giá */}
          <div>
            <label style={{
              display: "block",
              fontSize: "14px",
              fontWeight: "600",
              color: "#374151",
              marginBottom: "8px"
            }}>
              💰 Khoảng giá (VNĐ)
            </label>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="number"
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                placeholder="Từ"
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "14px",
                  outline: "none",
                  transition: "border-color 0.2s ease-in-out"
                }}
                onFocus={(e) => e.target.style.borderColor = "#111827"}
                onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
              />
              <span style={{ alignSelf: "center", color: "#6b7280" }}>-</span>
              <input
                type="number"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                placeholder="Đến"
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "14px",
                  outline: "none",
                  transition: "border-color 0.2s ease-in-out"
                }}
                onFocus={(e) => e.target.style.borderColor = "#111827"}
                onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
              />
            </div>
          </div>

          {/* Sắp xếp */}
          <div>
            <label style={{
              display: "block",
              fontSize: "14px",
              fontWeight: "600",
              color: "#374151",
              marginBottom: "8px"
            }}>
              📊 Sắp xếp theo
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "14px",
                backgroundColor: "#ffffff",
                cursor: "pointer",
                outline: "none"
              }}
            >
              <option value="name">Tên A-Z</option>
              <option value="price-low">Giá thấp đến cao</option>
              <option value="price-high">Giá cao đến thấp</option>
              <option value="newest">Mới nhất</option>
            </select>
          </div>

          {/* Lọc tình trạng */}
          <div>
            <label style={{
              display: "block",
              fontSize: "14px",
              fontWeight: "600",
              color: "#374151",
              marginBottom: "8px"
            }}>
              📦 Tình trạng
            </label>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "14px",
                backgroundColor: "#ffffff",
                cursor: "pointer",
                outline: "none"
              }}
            >
              <option value="all">Tất cả</option>
              <option value="available">Còn hàng</option>
              <option value="out-of-stock">Hết hàng</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "20px",
          paddingTop: "20px",
          borderTop: "1px solid #e5e7eb"
        }}>
          <div style={{
            fontSize: "14px",
            color: "#6b7280"
          }}>
            Hiển thị <strong>{filteredFoods.length}</strong> trong tổng số <strong>{foods.length}</strong> món ăn
          </div>
          <button
            onClick={resetFilters}
            style={{
              padding: "8px 16px",
              backgroundColor: "#f3f4f6",
              color: "#374151",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "all 0.2s ease-in-out"
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#e5e7eb";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#f3f4f6";
            }}
          >
            🔄 Xóa bộ lọc
          </button>
        </div>
      </div>

      {/* Danh sách món ăn */}
      <div style={{ padding: "32px" }}>
        {loading ? (
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "60px 0"
          }}>
            <div style={{
              width: "40px",
              height: "40px",
              border: "3px solid #e5e7eb",
              borderTop: "3px solid #111827",
              borderRadius: "50%",
              animation: "spin 1s linear infinite"
            }}></div>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        ) : foods.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "60px 0"
          }}>
            <div style={{
              fontSize: "48px",
              marginBottom: "16px"
            }}>🍽️</div>
            <h3 style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#111827",
              margin: "0 0 8px 0"
            }}>
              {searchTerm || priceRange.min || priceRange.max || stockFilter !== "all" 
                ? "Không tìm thấy món ăn phù hợp" 
                : "Không có món ăn nào"
              }
            </h3>
            <p style={{
              fontSize: "14px",
              color: "#6b7280",
              margin: "0 0 16px 0"
            }}>
              {searchTerm || priceRange.min || priceRange.max || stockFilter !== "all"
                ? "Thử điều chỉnh bộ lọc hoặc tìm kiếm khác"
                : "Thử chọn loại món ăn khác hoặc quay lại sau"
              }
            </p>
            {(searchTerm || priceRange.min || priceRange.max || stockFilter !== "all") && (
              <button
                onClick={resetFilters}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#111827",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer"
                }}
              >
                🔄 Xóa bộ lọc
              </button>
            )}
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
            gap: "24px"
          }}>
            {filteredFoods.map((food) => (
              <div
                key={food.Id}
                onClick={() => handleFoodClick(food.Id)}
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "16px",
                  overflow: "hidden",
                  transition: "all 0.3s ease-in-out",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.borderColor = "#d1d5db";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "#e5e7eb";
                }}
              >
                {/* Hình ảnh món ăn */}
                <div style={{
                  width: "100%",
                  height: "220px",
                  backgroundColor: "#f3f4f6",
                  position: "relative",
                  overflow: "hidden"
                }}>
                  {food.ImageUrl ? (
                    <img
                      src={`https://localhost:7233${food.ImageUrl}`}
                      alt={food.Name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.3s ease-in-out"
                      }}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = "scale(1.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = "scale(1)";
                      }}
                    />
                  ) : null}
                  
                  {/* Fallback khi không có ảnh */}
                  <div style={{
                    display: food.ImageUrl ? "none" : "flex",
                    width: "100%",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f9fafb",
                    color: "#9ca3af"
                  }}>
                    <div style={{
                      textAlign: "center"
                    }}>
                      <div style={{
                        fontSize: "48px",
                        marginBottom: "8px"
                      }}>🍽️</div>
                      <span style={{
                        fontSize: "14px",
                        fontWeight: "500"
                      }}>
                        Không có hình ảnh
                      </span>
                    </div>
                  </div>

                  {/* Badge loại món ăn */}
                  <div style={{
                    position: "absolute",
                    top: "12px",
                    left: "12px",
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    color: "#ffffff",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: "500",
                    backdropFilter: "blur(4px)"
                  }}>
                    {food.FoodTypeName}
                  </div>

                  {/* Badge giá */}
                  <div style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    backgroundColor: "#111827",
                    color: "#ffffff",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "700"
                  }}>
                    {new Intl.NumberFormat('vi-VN').format(food.Price)} ₫
                  </div>
                </div>

                {/* Nội dung card */}
                <div style={{ padding: "20px" }}>
                  <h3 style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    color: "#111827",
                    margin: "0 0 8px 0",
                    lineHeight: "1.3"
                  }}>
                    {food.Name}
                  </h3>
                  
                  {food.Description && (
                    <p style={{
                      fontSize: "14px",
                      color: "#6b7280",
                      margin: "0 0 16px 0",
                      lineHeight: "1.5"
                    }}>
                      {food.Description}
                    </p>
                  )}

                  {/* Thông tin bổ sung */}
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "16px"
                  }}>
                    {food.CookedQuantity !== undefined && (
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px"
                      }}>
                        <div style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          backgroundColor: food.CookedQuantity > 0 ? "#10b981" : "#ef4444"
                        }}></div>
                        <span style={{
                          fontSize: "12px",
                          color: "#6b7280",
                          fontWeight: "500"
                        }}>
                          {food.CookedQuantity > 0 ? "Còn hàng" : "Hết hàng"}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <button 
                    onClick={(e) => handleAddToCart(food, e)}
                    style={{
                      width: "100%",
                      padding: "12px 20px",
                      backgroundColor: food.CookedQuantity === 0 ? "#9ca3af" : "#111827",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "16px",
                      fontWeight: "600",
                      cursor: food.CookedQuantity === 0 ? "not-allowed" : "pointer",
                      transition: "all 0.2s ease-in-out",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px"
                    }}
                    onMouseEnter={(e) => {
                      if (food.CookedQuantity > 0) {
                        e.target.style.backgroundColor = "#374151";
                        e.target.style.transform = "translateY(-1px)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (food.CookedQuantity > 0) {
                        e.target.style.backgroundColor = "#111827";
                        e.target.style.transform = "translateY(0)";
                      }
                    }}
                    disabled={food.CookedQuantity === 0}
                  >
                    {food.CookedQuantity === 0 ? (
                      <>
                        <span>❌</span>
                        <span>Đã hết hàng</span>
                      </>
                    ) : (
                      <>
                        <span>🛒</span>
                        <span>Thêm vào giỏ</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;