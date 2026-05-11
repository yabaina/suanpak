import { useState, type ChangeEvent } from "react";
import type { NavigateFn } from "../types/navigation";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "../styles/checkout.css";

type Props = {
  onNavigate: NavigateFn;
};

type CheckoutForm = {
  address: string;
  detail: string;
  receiver: string;
  phone: string;
  note: string;
};

export default function CheckoutPage({ onNavigate }: Props) {
  const { cartList, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [payMethod, setPayMethod] = useState("cod");
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState<CheckoutForm>({
    address: "",
    detail: "",
    receiver: user?.name || "",
    phone: "",
    note: "",
  });

  const setField = (key: keyof CheckoutForm) => (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const shipping = 30;
  const grandTotal = totalPrice + shipping;

  const handleOrder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearCart();
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="checkout-success">
        <div className="success-circle">✓</div>
        <h2 className="success-title">สั่งซื้อแล้ว!</h2>
        <p className="success-sub">ขอบคุณที่ใช้บริการ SUANPAK<br />เราจะจัดส่งสินค้าให้เร็วที่สุด</p>
        <div className="success-status">
          <div className="status-labels">
            <span>รับคำสั่งซื้อ</span>
            <span>กำลังจัดเตรียม</span>
            <span>พร้อมส่ง</span>
          </div>
          <div className="status-bar">
            <div className="status-fill" style={{ width: "35%" }} />
          </div>
        </div>
        <button className="btn btn-primary btn-lg" onClick={() => onNavigate("home")}>
          กลับหน้าหลัก
        </button>
      </div>
    );
  }

  return (
    <form className="checkout-page" onSubmit={handleOrder}>
      <div className="checkout-left">
        <h2 className="section-title">สั่งซื้อสินค้า</h2>

        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-header">📍 ที่อยู่จัดส่ง</div>
          <div className="card-body co-grid">
            <div className="form-group" style={{ gridColumn: "span 2" }}>
              <label className="form-label">ที่อยู่จัดส่ง</label>
              <input className="form-input" placeholder="บ้านเลขที่ ถนน ซอย" value={form.address} onChange={setField("address")} required />
            </div>
            <div className="form-group" style={{ gridColumn: "span 2" }}>
              <label className="form-label">รายละเอียดที่อยู่จัดส่ง</label>
              <input className="form-input" placeholder="แขวง เขต จังหวัด รหัสไปรษณีย์" value={form.detail} onChange={setField("detail")} required />
            </div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-header">👤 ข้อมูลลูกค้า</div>
          <div className="card-body co-grid">
            <div className="form-group">
              <label className="form-label">ชื่อผู้รับสินค้า</label>
              <input className="form-input" placeholder="ชื่อ-นามสกุล" value={form.receiver} onChange={setField("receiver")} required />
            </div>
            <div className="form-group">
              <label className="form-label">เบอร์โทรผู้รับสินค้า</label>
              <input className="form-input" placeholder="08X-XXX-XXXX" value={form.phone} onChange={setField("phone")} required />
            </div>
            <div className="form-group" style={{ gridColumn: "span 2" }}>
              <label className="form-label">ข้อความส่งถึงพนักงาน</label>
              <input className="form-input" placeholder="หมายเหตุ (ถ้ามี)" value={form.note} onChange={setField("note")} />
            </div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-header">🛍️ รายการสินค้า</div>
          <div className="card-body">
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  <th style={{ padding: "8px 0", textAlign: "left", fontSize: 12, color: "var(--muted)", fontWeight: 700 }}>สินค้า</th>
                  <th style={{ padding: "8px 0", textAlign: "left", fontSize: 12, color: "var(--muted)", fontWeight: 700 }}>รหัส</th>
                  <th style={{ padding: "8px 0", textAlign: "right", fontSize: 12, color: "var(--muted)", fontWeight: 700 }}>จำนวน</th>
                  <th style={{ padding: "8px 0", textAlign: "right", fontSize: 12, color: "var(--muted)", fontWeight: 700 }}>รวม</th>
                </tr>
              </thead>
              <tbody>
                {cartList.map((item) => (
                  <tr key={item.id} style={{ borderBottom: "1px solid #f5f5f5" }}>
                    <td style={{ padding: "10px 0", display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 20 }}>{item.emoji}</span>
                      <span style={{ fontWeight: 500 }}>{item.name}</span>
                    </td>
                    <td style={{ padding: "10px 0", fontFamily: "monospace", fontSize: 12, color: "var(--muted)" }}>{item.id}</td>
                    <td style={{ padding: "10px 0", textAlign: "right" }}>x{item.qty}</td>
                    <td style={{ padding: "10px 0", textAlign: "right", fontWeight: 700, color: "var(--green)" }}>
                      ฿{(item.price * item.qty).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-header">💳 เลือกวิธีชำระเงิน</div>
          <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {[
              { value: "cod", label: "ชำระปลายทาง (Cash on Delivery)" },
              { value: "qr", label: "QR Payment" },
            ].map((opt) => (
              <label key={opt.value} className={`pay-option ${payMethod === opt.value ? "selected" : ""}`}>
                <div className={`radio-circle ${payMethod === opt.value ? "on" : ""}`} />
                <span>{opt.label}</span>
                <input type="radio" name="pay" value={opt.value} hidden checked={payMethod === opt.value} onChange={() => setPayMethod(opt.value)} />
              </label>
            ))}
          </div>
        </div>
      </div>

      <aside className="checkout-summary">
        <div className="card">
          <div className="card-header">สรุปยอด</div>
          <div className="card-body">
            <div className="summary-row"><span>ค่าสินค้า</span><span>฿{totalPrice.toLocaleString()}</span></div>
            <div className="summary-row"><span>ค่าจัดส่ง</span><span>฿{shipping}</span></div>
            <div className="summary-divider" />
            <div className="summary-total"><span>ยอดรวม</span><span>฿{grandTotal.toLocaleString()}</span></div>
            <button className="btn btn-secondary btn-block btn-lg" style={{ marginTop: 20 }} type="submit">
              สั่งซื้อเลย →
            </button>
            <button className="btn btn-outline btn-block" style={{ marginTop: 8 }} type="button" onClick={() => onNavigate("cart")}>← กลับตะกร้า</button>
          </div>
        </div>
      </aside>
    </form>
  );
}
