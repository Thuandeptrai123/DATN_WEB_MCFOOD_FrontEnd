import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CartProvider } from "./Context/CartContext";


function App() {
  return (
    <>
    <CartProvider>
      <AppRoutes />
      <ToastContainer position="bottom-right" autoClose={3000} />
    </CartProvider>
      
    </>
  );
}

export default App;
