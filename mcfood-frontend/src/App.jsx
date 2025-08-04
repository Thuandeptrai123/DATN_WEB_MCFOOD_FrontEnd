import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CartProvider } from "./Context/CartContext";
import { AuthProvider } from "./Context/AuthContext";
import RecommendationPage from "./pages/RecommendationPage";

function App() {
  return (
    <>
    
    <AuthProvider>
      <CartProvider>
        <AppRoutes />
        <ToastContainer position="bottom-right" autoClose={3000} />
      </CartProvider>
    </AuthProvider>
    </>
  );
}

export default App;
