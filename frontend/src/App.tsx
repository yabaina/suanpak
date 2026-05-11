import { useState } from "react";
import type { NavigateFn, Page, ShopCategory } from "./types/navigation";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ShopPage from "./pages/ShopPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import ProfilePage from "./pages/ProfilePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import AdminPage from "./pages/AdminPage";
import FarmerPage from "./pages/FarmerPage";
import "./styles/global.css";

function App() {
  const [page, setPage] = useState<Page>("home");
  const [shopCategory, setShopCat] = useState<ShopCategory>("all");
  const [shopSearch, setShopSearch] = useState("");

  const navigate: NavigateFn = (target, category) => {
    setPage(target);
    if (category) setShopCat(category);
    window.scrollTo(0, 0);
  };

  const handleSearch = (value: string) => {
    setShopSearch(value);
    if (page !== "shop") {
      setPage("shop");
    }
  };

  const renderPage = () => {
    switch (page) {
      case "login":
        return <LoginPage onNavigate={navigate} />;
      case "register":
        return <RegisterPage onNavigate={navigate} />;
      case "forgot":
        return <ForgotPasswordPage onNavigate={navigate} />;
      case "shop":
        return <ShopPage onNavigate={navigate} initialCategory={shopCategory} search={shopSearch} onSearch={handleSearch} />;
      case "cart":
        return <CartPage onNavigate={navigate} />;
      case "checkout":
        return <CheckoutPage onNavigate={navigate} />;
      case "profile":
        return <ProfilePage onNavigate={navigate} />;
      case "admin":
        return <AdminPage onNavigate={navigate} />;
      case "farmer":
        return <FarmerPage onNavigate={navigate} />;
      default:
        return <HomePage onNavigate={navigate} />;
    }
  };

  const noNavPages = ["login", "register", "forgot"];

  return (
    <div className="page-wrapper">
      {!noNavPages.includes(page) && (
        <Navbar
          currentPage={page}
          currentCategory={shopCategory}
          onNavigate={navigate}
          search={shopSearch}
          onSearch={handleSearch}
        />
      )}
      {renderPage()}
      {!noNavPages.includes(page) && (
        <footer className="footer">
          © 2025 SUANPAK — Your Backyard Farm · สินค้าสดใหม่จากเกษตรกรถึงมือคุณ
        </footer>
      )}
    </div>
  );
}

export default function Root() {
  return (
    <AuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  );
}
