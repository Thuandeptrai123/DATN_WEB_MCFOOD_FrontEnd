import Header from "../components/Header";
import Footer from "../components/Footer";

export default function MainLayout({ children }) {
  return (
    <>
      <Header />
      <main style={{ padding: "20px" }}>{children}</main>
      <Footer />
    </>
  );
}
