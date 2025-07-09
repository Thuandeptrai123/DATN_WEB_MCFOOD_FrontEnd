import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import ProductDetail from "../pages/ProductDetail";
import CartPage from "../pages/CartPage";
import CheckoutPage from "../pages/CheckoutPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import OrderHistory from "../pages/OrderHistory";
import ProfilePage from "../pages/ProfilePage";
import Dashboard from "../pages/Admin/Dashboard";
import ProductManagement from "../pages/Admin/ProductManagement";
import MainLayout from "../layouts/MainLayout";
import FoodTypeList from "../pages/Admin/FoodType";
import CreateFoodType from "../pages/Admin/CreateFoodType";
import EditFoodType from "../pages/Admin/EditFoodType";
import FoodList from "../pages/Admin/FoodList";
import ProductList from "../pages/ProductList";
import FoodDetail from "../pages/FoodDetail";
import ComboDetail from "../pages/ComboDetail";



export default function AppRoutes() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/orders" element={<OrderHistory />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/products" element={<ProductManagement />} />
          <Route path="/foodtype" element={<FoodTypeList />} />
          <Route path="/createfoodtype" element={<CreateFoodType />} />
          <Route path="/editfoodtype/:id" element={<EditFoodType />} />
          <Route path="/foods" element={<FoodList />} />
          <Route path="/productList" element={<ProductList />} />
          <Route path="/foods/:id" element={<FoodDetail />} />
          <Route path="/combos/:id" element={<ComboDetail />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}
