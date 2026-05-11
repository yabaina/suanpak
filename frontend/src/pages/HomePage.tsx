import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import type { NavigateFn } from "../types/navigation";
import type { Product, Category } from "../data/products";
import "../styles/home.css";

type Props = {
  onNavigate: NavigateFn;
};

const PROMOTIONS = [
  {
    title: "ส่งฟรีทั่วไทย",
    description: "สั่งครบ 500 บาทขึ้นไป รับบริการจัดส่งฟรี ถึงหน้าบ้านคุณ",
    badge: "แจกโค้ดฉลองร้านใหม่",
  },
  {
    title: "ผักสดจากฟาร์ม",
    description: "เลือกสรรผักสดใหม่จากเกษตรกรโดยตรง ทุกวันไม่มีผง",
    badge: "สดใหม่ทุกคำ",
  },
  {
    title: "ลดสูงสุด 20%",
    description: "โปรโมชั่นพิเศษสำหรับสมาชิก รับส่วนลดสินค้าทุกหมวดเมื่อซื้อครั้งแรก",
    badge: "ช้อปคุ้มกว่าใคร",
  },
];

const POPULAR_PRODUCT_IDS = ["VEG-001", "FRT-001", "PRC-002", "VEG-004"];

export default function HomePage({ onNavigate }: Props) {
  const { user } = useAuth();
  const { addItem } = useCart();
  const [activePromo, setActivePromo] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const featuredProducts = useMemo(() => products.slice(0, 4), [products]);
  const popularProducts = useMemo(
    () => products.filter((product) => POPULAR_PRODUCT_IDS.includes(product.id)),
    [products]
  );

  const handleAddToCart = (product: Product) => {
    if (!user) {
      onNavigate("login");
      return;
    }
    addItem(product);
  };

  if (loading) {
    return (
      <div className="home-page" style={{ textAlign: "center", padding: 64 }}>
        <div className="section-title">กำลังโหลดสินค้า...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-page" style={{ textAlign: "center", padding: 64, color: "var(--danger)" }}>
        <div className="section-title">เกิดข้อผิดพลาด</div>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero-content">
          <div className="home-copy">
            <div className="hero-badge">Suanpak picks</div>
            <h1 className="hero-title">ผักสด ผลไม้ และของอร่อย พร้อมส่งตรงจากฟาร์ม</h1>
            <p className="hero-text">
              คัดสรรสินค้าเกษตรคุณภาพดี เพื่อสุขภาพที่ดีกว่า คัดพิเศษจากสวนชั้นนำทั่วไทย เทียบราคาสบายกระเป๋า
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary btn-lg" onClick={() => onNavigate("shop")}>เลือกซื้อสินค้า</button>
            </div>
          </div>
          <div className="promo-slider">
            <div className="promo-track" style={{ transform: `translateY(-${activePromo * 100}%)` }}>
              {PROMOTIONS.map((item) => (
                <div className="promo-card" key={item.title}>
                  <div>
                    <div className="promo-badge">{item.badge}</div>
                    <h2>{item.title}</h2>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="promo-dots promo-dots-vertical">
              {PROMOTIONS.map((_, index) => (
                <button
                  key={index}
                  className={`promo-dot ${index === activePromo ? "active" : ""}`}
                  onClick={() => setActivePromo(index)}
                  aria-label={`Promotion ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="section-header">
          <div>
            <h2>สินค้าแนะนำ</h2>
            <p>คัดมาแล้วเพื่อคุณ สินค้าขายดีจากฟาร์ม</p>
          </div>
          <button className="btn btn-outline" onClick={() => onNavigate("shop")}>ดูสินค้าทั้งหมด</button>
        </div>

        <div className="featured-grid">
          {featuredProducts.map((product) => {
            const category = categories.find((c) => c.id === product.category);
            return (
              <div key={product.id} className="featured-card">
                <div className="featured-top">
                  <div className="featured-emoji">{product.emoji}</div>
                  <span className="featured-category">{category?.label}</span>
                </div>
                <h3>{product.name}</h3>
                <div className="featured-price">฿{product.price.toLocaleString()} / {product.unit}</div>
                <button className="btn btn-primary btn-sm" onClick={() => handleAddToCart(product)}>
                  เพิ่มในตะกร้า
                </button>
              </div>
            );
          })}
        </div>
      </section>

      <section className="home-section">
        <div className="section-header">
          <div>
            <h2>สินค้ายอดนิยม</h2>
            <p>สินค้าที่ลูกค้าชื่นชอบและสั่งซื้อบ่อย</p>
          </div>
          <button className="btn btn-outline" onClick={() => onNavigate("shop")}>ดูสินค้าทั้งหมด</button>
        </div>

        <div className="featured-grid">
          {popularProducts.map((product) => {
            const category = categories.find((c) => c.id === product.category);
            return (
              <div key={product.id} className="featured-card">
                <div className="featured-top">
                  <div className="featured-emoji">{product.emoji}</div>
                  <span className="featured-category">{category?.label}</span>
                </div>
                <h3>{product.name}</h3>
                <div className="featured-price">฿{product.price.toLocaleString()} / {product.unit}</div>
                <button className="btn btn-primary btn-sm" onClick={() => handleAddToCart(product)}>
                  เพิ่มในตะกร้า
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
