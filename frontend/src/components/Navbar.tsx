import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import type { NavigateFn, ShopCategory } from "../types/navigation";

type Props = {
  currentPage: string;
  currentCategory: ShopCategory;
  onNavigate: NavigateFn;
  search: string;
  onSearch: (value: string) => void;
};

export default function Navbar({ currentPage, currentCategory, onNavigate, search, onSearch }: Props) {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => onNavigate("home")} style={{ cursor: "pointer" }}>
        SUAN<span>PAK</span>
      </div>

      <a className={`navbar-link ${currentPage === "home" ? "active" : ""}`} onClick={() => onNavigate("home")}>หน้าแรก</a>
      <a className={`navbar-link ${currentPage === "shop" && currentCategory === "veg" ? "active" : ""}`} onClick={() => onNavigate("shop", "veg")}>ผักสด</a>
      <a className={`navbar-link ${currentPage === "shop" && currentCategory === "fruit" ? "active" : ""}`} onClick={() => onNavigate("shop", "fruit")}>ผลไม้</a>
      <a className={`navbar-link ${currentPage === "shop" && currentCategory === "processed" ? "active" : ""}`} onClick={() => onNavigate("shop", "processed")}>สินค้าแปรรูป</a>

      <input
        className="navbar-search"
        placeholder="🔍  ค้นหาสินค้า..."
        value={search}
        onChange={(e) => onSearch(e.target.value)}
      />

      <div className="navbar-right">
        <div className="cart-icon-wrap" onClick={() => onNavigate("cart")}>🛒
          {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
        </div>

        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              onClick={() => onNavigate("profile")}
              style={{ fontSize: 13, fontWeight: 600, color: "var(--green)", cursor: "pointer" }}
            >
              👤 {user.name}
            </span>
            {user.role === "admin" && (
              <span
                onClick={() => onNavigate("admin")}
                style={{ fontSize: 13, fontWeight: 600, color: "#e74c3c", cursor: "pointer" }}
              >
                ⚙️ Admin
              </span>
            )}
            {user.role === "farmer" && (
              <span
                onClick={() => onNavigate("farmer")}
                style={{ fontSize: 13, fontWeight: 600, color: "#27ae60", cursor: "pointer" }}
              >
                🌾 Farmer
              </span>
            )}
            <button className="btn btn-outline btn-sm" onClick={logout}>ออก</button>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-outline btn-sm" onClick={() => onNavigate("login")}>เข้าสู่ระบบ</button>
            <button className="btn btn-primary btn-sm" onClick={() => onNavigate("register")}>ลงทะเบียน</button>
          </div>
        )}
      </div>
    </nav>
  );
}
