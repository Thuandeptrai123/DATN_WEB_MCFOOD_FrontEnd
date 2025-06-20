import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createFoodType } from "../../api/FoodTypesApi";

export default function CreateFoodType() {
  const [form, setForm] = useState({ foodTypeName: "", description: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createFoodType({
        foodTypeName: form.foodTypeName,
        description: form.description,
      });
      alert("✅ Tạo loại món ăn thành công!");
      navigate("/admin/food-type");
    } catch (err) {
      console.error("❌ Lỗi khi tạo loại món ăn:", err);
      alert("Tạo thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">➕ Tạo loại món ăn mới</h3>
      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        <div className="mb-3">
          <label className="form-label">Tên loại món ăn</label>
          <input
            type="text"
            className="form-control"
            placeholder="Nhập tên loại món ăn"
            value={form.foodTypeName}
            onChange={(e) =>
              setForm({ ...form, foodTypeName: e.target.value })
            }
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Mô tả</label>
          <textarea
            className="form-control"
            rows="4"
            placeholder="Nhập mô tả"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          ></textarea>
        </div>
        <button type="submit" className="btn btn-success">
          ✅ Tạo mới
        </button>
        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => navigate("/admin/food-type")}
        >
          ⬅️ Quay lại
        </button>
      </form>
    </div>
  );
}
