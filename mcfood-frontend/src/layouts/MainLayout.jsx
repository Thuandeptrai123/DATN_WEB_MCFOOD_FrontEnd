import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
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
            min-height: 100vh;
          }

          main {
            flex: 1;
          }
        `}
      </style>
      <div className="layout-wrapper">
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
}
