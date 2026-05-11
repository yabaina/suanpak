import { useCallback, useEffect, useState } from "react";
import type { NavigateFn } from "../types/navigation";
import type { Product, Category } from "../data/products";
import { useAuth } from "../context/AuthContext";
import "../styles/admin.css";

type Props = {
  onNavigate: NavigateFn;
};

interface Feedback {
  id: string;
  type: string;
  userEmail: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

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

export default function AdminPage({ onNavigate }: Props) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [farmerProducts, setFarmerProducts] = useState<FarmerProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Product form state
  const [productForm, setProductForm] = useState({
    name: "",
    category: "veg",
    price: "",
    emoji: "",
    unit: "",
  });

  // Feedback form state
  const [feedbackForm, setFeedbackForm] = useState({
    type: "product",
    subject: "",
    message: "",
  });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes, feedbackRes, farmerRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/categories"),
        fetch("/api/admin/feedback", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-user-email": user?.email ?? "",
          },
        }),
        fetch("/api/admin/farmer-products", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-user-email": user?.email ?? "",
          },
        }),
      ]);

      if (!productsRes.ok || !categoriesRes.ok || !feedbackRes.ok || !farmerRes.ok) {
        throw new Error("Failed to load admin data");
      }

      const productsData = await productsRes.json();
      const categoriesData = await categoriesRes.json();
      const feedbackData = await feedbackRes.json();
      const farmerData = await farmerRes.json();

      setProducts(productsData);
      setCategories(categoriesData);
      setFeedback(feedbackData);
      setFarmerProducts(farmerData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    if (user?.role !== "admin") {
      onNavigate("home");
      return;
    }
    loadData();
  }, [loadData, onNavigate, user?.role]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...productForm,
          price: parseFloat(productForm.price),
          email: user?.email,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add product");
      }

      const newProduct = await response.json();
      setProducts([...products, newProduct]);
      setProductForm({ name: "", category: "veg", price: "", emoji: "", unit: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add product");
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user?.email }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      setProducts(products.filter(p => p.id !== productId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete product");
    }
  };

  const handleUpdateFeedbackStatus = async (feedbackId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/feedback/${feedbackId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, email: user?.email }),
      });

      if (!response.ok) {
        throw new Error("Failed to update feedback");
      }

      setFeedback(feedback.map(f => f.id === feedbackId ? { ...f, status } : f));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update feedback");
    }
  };

  const handleUpdateFarmerProductStatus = async (productId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/farmer-products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, email: user?.email }),
      });

      if (!response.ok) {
        throw new Error("Failed to update farmer product");
      }

      setFarmerProducts(farmerProducts.map(p => p.id === productId ? { ...p, status } : p));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update farmer product");
    }
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...feedbackForm,
          userEmail: user?.email,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit feedback");
      }

      const newFeedback = await response.json();
      setFeedback([...feedback, newFeedback]);
      setFeedbackForm({ type: "product", subject: "", message: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit feedback");
    }
  };

  if (loading) {
    return <div className="admin-page"><div className="loading">Loading admin panel...</div></div>;
  }

  if (error) {
    return <div className="admin-page"><div className="error">{error}</div></div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <button onClick={() => onNavigate("home")} className="back-btn">กลับหน้าหลัก</button>
      </div>

      <div className="admin-tabs">
        <button
          className={activeTab === "products" ? "active" : ""}
          onClick={() => setActiveTab("products")}
        >
          จัดการสินค้า
        </button>
        <button
          className={activeTab === "feedback" ? "active" : ""}
          onClick={() => setActiveTab("feedback")}
        >
          ดู Feedback
        </button>
        <button
          className={activeTab === "farmers" ? "active" : ""}
          onClick={() => setActiveTab("farmers")}
        >
          จัดการชาวสวน
        </button>
      </div>

      <div className="admin-content">
        {activeTab === "products" && (
          <div className="products-tab">
            <h2>จัดการสินค้า ({products.length} รายการ)</h2>

            <form onSubmit={handleAddProduct} className="product-form">
              <h3>เพิ่มสินค้าใหม่</h3>
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
                  placeholder="ราคา"
                  value={productForm.price}
                  onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                  required
                />
                <input
                  type="text"
                  placeholder="อีโมจิ"
                  value={productForm.emoji}
                  onChange={(e) => setProductForm({...productForm, emoji: e.target.value})}
                  required
                />
                <input
                  type="text"
                  placeholder="หน่วย"
                  value={productForm.unit}
                  onChange={(e) => setProductForm({...productForm, unit: e.target.value})}
                  required
                />
              </div>
              <button type="submit" className="add-btn">เพิ่มสินค้า</button>
            </form>

            <div className="products-list">
              {products.map(product => (
                <div key={product.id} className="product-item">
                  <div className="product-info">
                    <span className="emoji">{product.emoji}</span>
                    <span className="name">{product.name}</span>
                    <span className="price">฿{product.price}</span>
                    <span className="unit">{product.unit}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="delete-btn"
                  >
                    ลบ
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "feedback" && (
          <div className="feedback-tab">
            <h2>Feedback & Complaints ({feedback.length} รายการ)</h2>

            <form onSubmit={handleSubmitFeedback} className="feedback-form">
              <h3>ส่ง Feedback</h3>
              <div className="form-row">
                <select
                  value={feedbackForm.type}
                  onChange={(e) => setFeedbackForm({...feedbackForm, type: e.target.value})}
                >
                  <option value="product">เกี่ยวกับสินค้า</option>
                  <option value="store">เกี่ยวกับร้านค้า</option>
                  <option value="other">อื่นๆ</option>
                </select>
                <input
                  type="text"
                  placeholder="หัวข้อ"
                  value={feedbackForm.subject}
                  onChange={(e) => setFeedbackForm({...feedbackForm, subject: e.target.value})}
                  required
                />
              </div>
              <textarea
                placeholder="ข้อความ"
                value={feedbackForm.message}
                onChange={(e) => setFeedbackForm({...feedbackForm, message: e.target.value})}
                required
              />
              <button type="submit" className="submit-btn">ส่ง Feedback</button>
            </form>

            <div className="feedback-list">
              {feedback.map(item => (
                <div key={item.id} className="feedback-item">
                  <div className="feedback-header">
                    <span className="type">{item.type}</span>
                    <span className="subject">{item.subject}</span>
                    <span className={`status ${item.status}`}>{item.status}</span>
                  </div>
                  <p className="message">{item.message}</p>
                  <div className="feedback-footer">
                    <span className="user">{item.userEmail}</span>
                    <span className="date">{new Date(item.createdAt).toLocaleDateString()}</span>
                    {item.status === "pending" && (
                      <div className="status-actions">
                        <button
                          onClick={() => handleUpdateFeedbackStatus(item.id, "resolved")}
                          className="resolve-btn"
                        >
                          แก้แล้ว
                        </button>
                        <button
                          onClick={() => handleUpdateFeedbackStatus(item.id, "ignored")}
                          className="ignore-btn"
                        >
                          ไม่สนใจ
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "farmers" && (
          <div className="farmers-tab">
            <h2>สินค้าจากชาวสวน ({farmerProducts.length} รายการ)</h2>

            <div className="farmer-products-list">
              {farmerProducts.map(product => (
                <div key={product.id} className="farmer-product-item">
                  <div className="product-info">
                    <h4>{product.name}</h4>
                    <p>{product.description}</p>
                    <div className="product-details">
                      <span>ราคา: ฿{product.price}</span>
                      <span>หน่วย: {product.unit}</span>
                      <span>สต็อก: {product.stock}</span>
                      <span>ชาวสวน: {product.farmerEmail}</span>
                    </div>
                  </div>
                  <div className="product-status">
                    <span className={`status ${product.status}`}>{product.status}</span>
                    {product.status === "pending" && (
                      <div className="status-actions">
                        <button
                          onClick={() => handleUpdateFarmerProductStatus(product.id, "approved")}
                          className="approve-btn"
                        >
                          อนุมัติ
                        </button>
                        <button
                          onClick={() => handleUpdateFarmerProductStatus(product.id, "rejected")}
                          className="reject-btn"
                        >
                          ปฏิเสธ
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
