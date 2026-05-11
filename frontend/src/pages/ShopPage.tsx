import { useEffect, useState } from "react";
import type { Product, Category } from "../data/products";
import type { NavigateFn } from "../types/navigation";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "../styles/shop.css";

type Props = {
  onNavigate: NavigateFn;
  initialCategory?: string;
  search: string;
  onSearch: (value: string) => void;
};

export default function ShopPage({ onNavigate, initialCategory, search, onSearch }: Props) {
  const { addItem } = useCart();
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState(initialCategory || "all");
  const [view, setView] = useState("grid");
  const [added, setAdded] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialCategory) {
      setActiveCategory(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/categories"),
        ]);

        if (!productsRes.ok) {
          throw new Error("ไม่สามารถโหลดรายการสินค้าได้");
        }
        if (!categoriesRes.ok) {
          throw new Error("ไม่สามารถโหลดหมวดหมู่สินค้าได้");
        }

        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();

        if (!cancelled) {
          setProducts(productsData);
          setCategories(categoriesData);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการโหลดข้อมูล");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  const normalizedSearch = search.trim().toLowerCase();
  const filtered = products.filter((p) => {
    const matchCat = activeCategory === "all" || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(normalizedSearch) || p.id.toLowerCase().includes(normalizedSearch);
    return matchCat && (normalizedSearch === "" || matchSearch);
  });

  const handleAdd = (product: any) => {
    if (!user) {
      onNavigate("login");
      return;
    }
    addItem(product);
    setAdded(product.id);
    window.setTimeout(() => setAdded(null), 900);
  };

  const activeLabel = activeCategory === "all"
    ? "สินค้าทั้งหมด"
    : categories.find((c) => c.id === activeCategory)?.label ?? "สินค้าทั้งหมด";

  if (loading) {
    return (
      <div className="shop-page" style={{ textAlign: "center", padding: 64 }}>
        <div className="section-title">กำลังโหลดสินค้า...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="shop-page" style={{ textAlign: "center", padding: 64, color: "var(--danger)" }}>
        <div className="section-title">เกิดข้อผิดพลาด</div>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="shop-page">
      <aside className="shop-sidebar">
        <div className="sidebar-title">หมวดหมู่</div>
        <ul className="sidebar-list">
          <li
            className={`sidebar-item ${activeCategory === "all" ? "active" : ""}`}
            onClick={() => setActiveCategory("all")}
          >
            🛍️ ทั้งหมด
            <span className="sidebar-count">{products.length}</span>
          </li>
          {categories.map((cat) => (
            <li
              key={cat.id}
              className={`sidebar-item ${activeCategory === cat.id ? "active" : ""}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.emoji} {cat.label}
              <span className="sidebar-count">{products.filter((p) => p.category === cat.id).length}</span>
            </li>
          ))}
        </ul>
      </aside>

      <main className="shop-main">
        <div className="shop-toolbar">
          <div>
            <h2 className="section-title" style={{ marginBottom: 0 }}>{activeLabel}</h2>
            <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>
              พบ {filtered.length} รายการ
            </p>
          </div>
          <div className="toolbar-right">
            <input
              className="form-input"
              style={{ width: 220 }}
              placeholder="🔍 ค้นหาชื่อหรือรหัสสินค้า"
              value={search}
              onChange={(e) => onSearch(e.target.value)}
            />
            <div className="view-toggle">
              <button
                className={`vtbtn ${view === "grid" ? "on" : ""}`}
                onClick={() => setView("grid")}
                title="Grid view"
              >⊞</button>
              <button
                className={`vtbtn ${view === "table" ? "on" : ""}`}
                onClick={() => setView("table")}
                title="Table view"
              >☰</button>
            </div>
          </div>
        </div>

        {view === "grid" && (
          <div className="product-grid">
            {filtered.map((p) => (
              <div key={p.id} className="product-card">
                <div className="product-emoji">{p.emoji}</div>
                <div className="product-info">
                  <div className="product-name">{p.name}</div>
                  <div className="product-cat">{categories.find((c) => c.id === p.category)?.label}</div>
                  <div className="product-price">
                    ฿{p.price.toLocaleString()}
                    <span className="product-unit">/{p.unit}</span>
                  </div>
                </div>
                <button
                  className={`btn btn-primary btn-sm add-btn ${added === p.id ? "added" : ""}`}
                  onClick={() => handleAdd(p)}
                >
                  {added === p.id ? "✓ เพิ่มแล้ว" : "+ ใส่ตะกร้า"}
                </button>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="empty-state">ไม่พบสินค้าที่ค้นหา</div>
            )}
          </div>
        )}

        {view === "table" && (
          <div className="product-table-wrap">
            <table className="product-table">
              <thead>
                <tr>
                  <th>สินค้า</th>
                  <th>ราคา / หน่วย</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="td-product">
                        <span className="td-emoji">{p.emoji}</span>
                        <span>{p.name}</span>
                      </div>
                    </td>
                    <td className="td-price">฿{p.price.toLocaleString()} / {p.unit}</td>
                    <td>
                      <button
                        className={`btn btn-primary btn-sm ${added === p.id ? "added" : ""}`}
                        onClick={() => handleAdd(p)}
                      >
                        {added === p.id ? "✓" : "+ ตะกร้า"}
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: 32, color: "var(--muted)" }}>
                      ไม่พบสินค้า
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
