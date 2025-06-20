import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllFoods, deleteFood } from "../../api/FoodsApi";

export default function FoodList() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const ImageAPIUrl = "https://localhost:7233"
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getAllFoods();
      setFoods(res.data.Data || []);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách món ăn:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa món ăn này?")) return;
    try {
      await deleteFood(id);
      fetchData();
    } catch (err) {
      console.error("Xóa thất bại:", err);
      alert("Không thể xóa món ăn.");
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>🍽️ Danh sách món ăn</h3>
        <button
          className="btn btn-success"
          onClick={() => navigate("/admin/food/create")}
        >
          ➕ Thêm món ăn
        </button>
      </div>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" />
          <p className="mt-2">Đang tải dữ liệu...</p>
        </div>
      ) : foods.length === 0 ? (
        <div className="alert alert-warning text-center">
          Không có món ăn nào.
        </div>
      ) : (
        <div className="row">
          {foods.map((food) => (
            <div className="col-md-4 mb-4" key={food.Id}>
              <div className="card h-100 shadow-sm">
                <img
                  src={`${ImageAPIUrl}${food.ImageUrl}`} // <== Đây là điểm quan trọng
                  className="card-img-top"
                  alt={food.Name}
                  style={{ height: "200px", objectFit: "cover" }}
                  onError={(e) => (e.target.src = "/default-food.jpg")}
                />
                <div className="card-body">
                  <h5 className="card-title">{food.Name}</h5>
                  <p className="card-text text-muted">{food.Description}</p>
                  <p>
                    <strong>💰 Giá:</strong>{" "}
                    {food.Price?.toLocaleString()} VNĐ
                  </p>
                  <p>
                    <strong>📂 Loại:</strong> {food.FoodTypeName}
                  </p>
                  <div className="d-flex justify-content-between">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => navigate(`/admin/food/edit/${food.Id}`)}
                    >
                      ✏️ Sửa
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(food.Id)}
                    >
                      🗑️ Xóa
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
