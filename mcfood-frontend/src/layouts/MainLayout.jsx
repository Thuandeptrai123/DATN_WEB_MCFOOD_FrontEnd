import Header from "../components/Header";
import Footer from "../components/Footer";

export default function MainLayout({ children }) {
  return (
    <>
      <style>
        {`
        html, body, #root {
          height: 100%;
          margin: 0;
        }

        .layout-wrapper {
          display: flex;
          flex-direction: column;
          min-height: 100vh; /* Chiều cao tối thiểu = chiều cao viewport */
        }

        .layout-wrapper main {
          flex: 1; /* Phần main sẽ chiếm hết khoảng trống còn lại, đẩy footer xuống dưới */
        }
        `}
      </style>
      <div className="layout-wrapper">
        <Header />
        <main style={{ padding: "20px" }}>{children}</main>
        <Footer />
      </div>
    </>
  );
}
