import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllFoodTypes, deleteFoodType } from "../../api/FoodTypesApi";

export default function FoodTypeList() {
  const [foodTypes, setFoodTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // ← dùng để chuyển trang

  useEffect(() => {
    (async () => {
      try {
        const res = await getAllFoodTypes();
        setFoodTypes(res.data.Data || []);
        setError("");
      } catch (err) {
        console.error("Error fetching food types:", err);
        setError("Không thể tải danh sách loại món ăn.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa?")) return;
    try {
      await deleteFoodType(id);
      setFoodTypes((prev) => prev.filter((ft) => ft.FoodTypeId !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Xóa thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>📋 Danh sách loại món ăn</h2>
        <button
          className="btn btn-success"
          onClick={() => navigate("/createfoodtype")}
        >
          ➕ Thêm loại món ăn
        </button>
      </div>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-2">Đang tải dữ liệu...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger text-center">{error}</div>
      ) : foodTypes.length === 0 ? (
        <div className="alert alert-warning text-center">
          Không có loại món ăn nào.
        </div>
      ) : (
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Tên loại</th>
              <th>Mô tả</th>
              <th>Ngày tạo</th>
              <th>Tác vụ</th>
            </tr>
          </thead>
          <tbody>
            {foodTypes.map((ft, index) => (
              <tr key={ft.FoodTypeId}>
                <td>{index + 1}</td>
                <td>{ft.FoodTypeName}</td>
                <td>{ft.Description}</td>
                <td>
                  {new Date(ft.CreatedDate).toLocaleDateString("vi-VN")}
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => navigate(`/editfoodtype/${ft.FoodTypeId}`)}
                  >
                    ✏️ Sửa
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(ft.FoodTypeId)}
                  >
                    🗑️ Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
