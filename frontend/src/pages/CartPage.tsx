import { useCart } from "../context/CartContext";
import type { NavigateFn } from "../types/navigation";
import "../styles/cart.css";

type Props = {
  onNavigate: NavigateFn;
};

export default function CartPage({ onNavigate }: Props) {
  const { cartList, totalPrice, changeQty, removeItem } = useCart();

  if (cartList.length === 0) {
    return (
      <div className="cart-empty">
        <div className="empty-icon">🛒</div>
        <h3>ตะกร้าว่างเปล่า</h3>
        <p>ยังไม่มีสินค้าในตะกร้า</p>
        <button className="btn btn-primary" onClick={() => onNavigate("shop")}>เลือกซื้อสินค้า</button>
      </div>
    );
  }

  const shipping = 30;
  const grandTotal = totalPrice + shipping;

  return (
    <div className="cart-page">
      <div className="cart-main">
        <h2 className="section-title">ตะกร้าของฉัน</h2>

        <div className="cart-table-wrap">
          <table className="cart-table">
            <thead>
              <tr>
                <th>สินค้า</th>
                <th>รหัสสินค้า</th>
                <th>ราคา/หน่วย</th>
                <th>จำนวน</th>
                <th>รวม</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cartList.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="cart-product">
                      <span className="cart-emoji">{item.emoji}</span>
                      <div>
                        <div className="cart-name">{item.name}</div>
                        <div className="cart-unit">หน่วย: {item.unit}</div>
                      </div>
                    </div>
                  </td>
                  <td className="td-mono">{item.id}</td>
                  <td className="td-price">฿{item.price.toLocaleString()}</td>
                  <td>
                    <div className="qty-ctrl">
                      <button className="qty-btn" onClick={() => changeQty(item.id, -1)}>−</button>
                      <span className="qty-num">{item.qty}</span>
                      <button className="qty-btn" onClick={() => changeQty(item.id, +1)}>+</button>
                    </div>
                  </td>
                  <td className="td-total">฿{(item.price * item.qty).toLocaleString()}</td>
                  <td>
                    <button className="del-btn" onClick={() => removeItem(item.id)} title="ลบ">🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button className="btn btn-outline" onClick={() => onNavigate("shop")} style={{ marginTop: 16 }}>
          ← เลือกสินค้าเพิ่ม
        </button>
      </div>

      <aside className="cart-summary card">
        <div className="card-header">สรุปคำสั่งซื้อ</div>
        <div className="card-body">
          <div className="summary-row">
            <span>สินค้า ({cartList.reduce((a, b) => a + b.qty, 0)} รายการ)</span>
            <span>฿{totalPrice.toLocaleString()}</span>
          </div>
          <div className="summary-row">
            <span>ค่าจัดส่ง</span>
            <span>฿{shipping}</span>
          </div>
          <div className="summary-divider" />
          <div className="summary-total">
            <span>ยอดรวม</span>
            <span>฿{grandTotal.toLocaleString()}</span>
          </div>
          <button className="btn btn-secondary btn-block btn-lg" style={{ marginTop: 20 }} onClick={() => onNavigate("checkout")}>
            สั่งซื้อเลย →
          </button>
        </div>
      </aside>
    </div>
  );
}
