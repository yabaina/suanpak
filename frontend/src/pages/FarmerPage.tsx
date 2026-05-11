import { useEffect, useState } from "react";
import type { NavigateFn } from "../types/navigation";
import type { Category } from "../data/products";
import { useAuth } from "../context/AuthContext";
import "../styles/farmer.css";

type Props = {
  onNavigate: NavigateFn;
};

interface FarmerProduct {
  id: string;
  farmerEmail: string;
  name: string;
  category: string;
  price: number;
  description: string;
  unit: string;
  stock: number;
  status: string;
  createdAt: string;
}

export default function FarmerPage({ onNavigate }: Props) {
  const { user } = useAuth();
  const [products, setProducts] = useState<FarmerProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Product form state
  const [productForm, setProductForm] = useState({
    name: "",
    category: "veg",
    price: "",
    description: "",
    unit: "",
    stock: "",
  });

  useEffect(() => {
    if (user?.role !== "farmer") {
      onNavigate("home");
      return;
    }
    loadData();
  }, [user, onNavigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [categoriesRes, productsRes] = await Promise.all([
        fetch("/api/categories"),
        fetch("/api/farmer/products"),
      ]);

      if (!categoriesRes.ok) {
        throw new Error("Failed to load categories");
      }

      const categoriesData = await categoriesRes.json();
      const productsData = await productsRes.json();

      setCategories(categoriesData);
      // Filter products by current farmer
      setProducts(productsData.filter((p: FarmerProduct) => p.farmerEmail === user?.email));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/farmer/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...productForm,
          price: parseFloat(productForm.price),
          stock: parseInt(productForm.stock),
          farmerEmail: user?.email,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add product");
      }

      const newProduct = await response.json();
      setProducts([...products, newProduct]);
      setProductForm({
        name: "",
        category: "veg",
        price: "",
        description: "",
        unit: "",
        stock: "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add product");
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending": return "รอการอนุมัติ";
      case "approved": return "อนุมัติแล้ว";
      case "rejected": return "ถูกปฏิเสธ";
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "#f39c12";
      case "approved": return "#27ae60";
      case "rejected": return "#e74c3c";
      default: return "#95a5a6";
    }
  };

  if (loading) {
    return <div className="farmer-page"><div className="loading">Loading farmer dashboard...</div></div>;
  }

  if (error) {
    return <div className="farmer-page"><div className="error">{error}</div></div>;
  }

  return (
    <div className="farmer-page">
      <div className="farmer-header">
        <h1>แผงควบคุมชาวสวน</h1>
        <button onClick={() => onNavigate("home")} className="back-btn">กลับหน้าหลัก</button>
      </div>

      <div className="farmer-content">
        <div className="add-product-section">
          <h2>เพิ่มสินค้าใหม่</h2>
          <form onSubmit={handleAddProduct} className="product-form">
            <div className="form-row">
              <input
                type="text"
                placeholder="ชื่อสินค้า"
                value={productForm.name}
                onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                required
              />
              <select
                value={productForm.category}
                onChange={(e) => setProductForm({...productForm, category: e.target.value})}
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <input
                type="number"
                placeholder="ราคา (บาท)"
                value={productForm.price}
                onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                required
                min="0"
                step="0.01"
              />
              <input
                type="text"
                placeholder="หน่วย (เช่น แพค, กิโลกรัม)"
                value={productForm.unit}
                onChange={(e) => setProductForm({...productForm, unit: e.target.value})}
                required
              />
              <input
                type="number"
                placeholder="จำนวนสต็อก"
                value={productForm.stock}
                onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                required
                min="0"
              />
            </div>
            <textarea
              placeholder="คำอธิบายสินค้า"
              value={productForm.description}
              onChange={(e) => setProductForm({...productForm, description: e.target.value})}
              required
              rows={3}
            />
            <button type="submit" className="add-btn">เพิ่มสินค้า</button>
          </form>
        </div>

        <div className="products-section">
          <h2>สินค้าของฉัน ({products.length} รายการ)</h2>
          {products.length === 0 ? (
            <div className="no-products">
              <p>คุณยังไม่มีสินค้า เริ่มเพิ่มสินค้าแรกของคุณเลย!</p>
            </div>
          ) : (
            <div className="products-grid">
              {products.map(product => (
                <div key={product.id} className="product-card">
                  <div className="product-header">
                    <h3>{product.name}</h3>
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(product.status) }}
                    >
                      {getStatusText(product.status)}
                    </span>
                  </div>
                  <p className="description">{product.description}</p>
                  <div className="product-details">
                    <div className="detail-item">
                      <span className="label">ราคา:</span>
                      <span className="value">฿{product.price}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">หน่วย:</span>
                      <span className="value">{product.unit}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">สต็อก:</span>
                      <span className="value">{product.stock}</span>
                    </div>
                  </div>
                  <div className="product-footer">
                    <small>เพิ่มเมื่อ: {new Date(product.createdAt).toLocaleDateString('th-TH')}</small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}