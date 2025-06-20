import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFoodTypeById, updateFoodType } from "../../api/FoodTypesApi";

export default function EditFoodType() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ foodTypeName: "", description: "" });

  useEffect(() => {
    getFoodTypeById(id)
      .then((res) => {
        const data = res.data.Data;
        setForm({
          foodTypeName: data.FoodTypeName || "",
          description: data.Description || "",
        });
      })
      .catch((err) => {
        console.error("Lỗi lấy dữ liệu:", err);
        alert("Không thể tải thông tin loại món ăn.");
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateFoodType(id, {
        foodTypeName: form.foodTypeName,
        description: form.description,
      });
      alert("✅ Cập nhật thành công!");
      navigate("/foodtype");
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
      alert("❌ Cập nhật thất bại!");
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">✏️ Cập nhật loại món ăn</h3>
      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        <div className="mb-3">
          <label className="form-label">Tên loại món ăn</label>
          <input
            type="text"
            className="form-control"
            value={form.foodTypeName}
            onChange={(e) => setForm({ ...form, foodTypeName: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Mô tả</label>
          <textarea
            className="form-control"
            rows="4"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">
          💾 Lưu thay đổi
        </button>
        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => navigate("/foodtype")}
        >
          ⬅️ Quay lại
        </button>
      </form>
    </div>
  );
}
