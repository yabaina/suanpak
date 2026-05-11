import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import type { NavigateFn } from "../types/navigation";
import "../styles/profile.css";

type Props = {
  onNavigate: NavigateFn;
};

type ProfileTab = "info" | "orders" | "address" | "security";

type Address = {
  line1: string;
  city: string;
  province: string;
  postcode: string;
};

export default function ProfilePage({ onNavigate }: Props) {
  const { user, logout, updateUser, changePassword } = useAuth();
  const [activeTab, setActiveTab] = useState<ProfileTab>("info");
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [address, setAddress] = useState<Address>(user?.address ?? {
    line1: "",
    city: "",
    province: "",
    postcode: "",
  });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setName(user?.name ?? "");
    setPhone(user?.phone ?? "");
    setAddress(user?.address ?? {
      line1: "",
      city: "",
      province: "",
      postcode: "",
    });
  }, [user]);

  const handleLogout = () => {
    logout();
    onNavigate("home");
  };

  const handleSaveAccount = async () => {
    if (!user) return;
    setMessage("");
    setError("");
    const ok = await updateUser({ name, phone });
    if (ok) {
      setMessage("บันทึกข้อมูลบัญชีเรียบร้อยแล้ว");
      setIsEditing(false);
    } else {
      setError("ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่");
    }
  };

  const handleCancelEdit = () => {
    setName(user?.name ?? "");
    setPhone(user?.phone ?? "");
    setMessage("");
    setError("");
    setIsEditing(false);
  };

  const handleSaveAddress = async () => {
    if (!user) return;
    setMessage("");
    setError("");
    const ok = await updateUser({ address });
    if (ok) {
      setMessage("บันทึกที่อยู่จัดส่งเรียบร้อยแล้ว");
    } else {
      setError("ไม่สามารถบันทึกที่อยู่ได้ กรุณาลองใหม่");
    }
  };

  const handleChangePassword = async () => {
    setMessage("");
    setError("");
    if (newPassword !== confirmPassword) {
      setError("รหัสผ่านใหม่ไม่ตรงกัน");
      return;
    }
    if (!user) return;
    const ok = await changePassword(currentPassword, newPassword);
    if (ok) {
      setMessage("เปลี่ยนรหัสผ่านเรียบร้อยแล้ว");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setError("รหัสผ่านเดิมไม่ถูกต้อง หรือไม่สามารถเปลี่ยนได้");
    }
  };

  if (!user) {
    return (
      <div className="profile-guest">
        <div className="guest-card card">
          <div className="guest-avatar">👤</div>
          <h2 className="guest-title">ยังไม่ได้เข้าสู่ระบบ</h2>
          <p className="guest-sub">
            กรุณาลงทะเบียนหรือเข้าสู่ระบบ<br />เพื่อใช้งานฟีเจอร์เต็มรูปแบบ
          </p>
          <div className="guest-features">
            <div className="feature-row">✓ ดูประวัติการสั่งซื้อ</div>
            <div className="feature-row">✓ บันทึกที่อยู่จัดส่ง</div>
            <div className="feature-row">✓ ติดตามสถานะพัสดุ</div>
          </div>
          <div className="guest-actions">
            <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={() => onNavigate("login")}>Sign in</button>
            <button className="btn btn-outline btn-lg" style={{ flex: 1 }} onClick={() => onNavigate("register")}>Register</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <aside className="profile-sidebar">
        <div className="profile-avatar-wrap">
          <div className="profile-avatar">👤</div>
          <div className="profile-name">{user.name}</div>
          <div className="profile-email">{user.email}</div>
        </div>
        <ul className="profile-nav">
          <li className="pnav-item active">ข้อมูลส่วนตัว</li>
          <li className="pnav-item">ประวัติการสั่งซื้อ</li>
          <li className="pnav-item">ที่อยู่จัดส่ง</li>
          <li className="pnav-item">เปลี่ยนรหัสผ่าน</li>
        </ul>
        <button className="btn btn-outline btn-block" style={{ marginTop: 16 }} onClick={handleLogout}>ออกจากระบบ</button>
      </aside>

      <main className="profile-main">
        <h2 className="section-title">ข้อมูลส่วนตัว</h2>

        <div className="profile-tabs">
          {[
            { key: "info", label: "ข้อมูลส่วนตัว" },
            { key: "orders", label: "ประวัติการสั่งซื้อ" },
            { key: "address", label: "ที่อยู่จัดส่ง" },
            { key: "security", label: "เปลี่ยนรหัสผ่าน" },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`tab-button ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => {
                setActiveTab(tab.key as ProfileTab);
                setMessage("");
                setError("");
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {message && <div className="profile-alert success">{message}</div>}
        {error && <div className="profile-alert error">{error}</div>}

        {activeTab === "info" && (
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-header">👤 ข้อมูลบัญชี</div>
            <div className="card-body info-grid">
              <div className="info-item">
                <div className="info-label">ชื่อ-นามสกุล</div>
                <div className="info-value">
                  {isEditing ? (
                    <input
                      className="form-input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      type="text"
                    />
                  ) : (
                    user.name
                  )}
                </div>
              </div>
              <div className="info-item">
                <div className="info-label">บัญชีที่เข้าสู่ระบบ</div>
                <div className="info-value">{user.email}</div>
              </div>
              <div className="info-item">
                <div className="info-label">เบอร์โทร</div>
                <div className="info-value">
                  {isEditing ? (
                    <input
                      className="form-input"
                      placeholder="08X-XXX-XXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      type="tel"
                    />
                  ) : (
                    phone || "-"
                  )}
                </div>
              </div>
              <div className="info-item">
                <div className="info-label">สมาชิกตั้งแต่</div>
                <div className="info-value">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("th-TH", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "ไม่ระบุ"}
                </div>
              </div>
            </div>
            <div className="profile-actions">
              {isEditing ? (
                <>
                  <button className="btn btn-outline btn-sm" onClick={handleCancelEdit}>
                    ยกเลิก
                  </button>
                  <button className="btn btn-primary btn-sm" onClick={handleSaveAccount}>
                    บันทึก
                  </button>
                </>
              ) : (
                <button className="btn btn-danger btn-sm" onClick={() => setIsEditing(true)}>
                  แก้ไขข้อมูลบัญชี
                </button>
              )}
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-header">🛒 ประวัติการสั่งซื้อ</div>
            <div className="card-body">
              {user.orders.length ? (
                <div className="order-list">
                  {user.orders.map((order) => (
                    <div key={order.id} className="order-card">
                      <div className="order-top">
                        <div>รหัสคำสั่งซื้อ: {order.id}</div>
                        <div>{new Date(order.date).toLocaleDateString("th-TH")}</div>
                      </div>
                      <div className="order-items">
                        {order.items.map((item, index) => (
                          <div key={index} className="order-item">
                            <span>{item.name}</span>
                            <span>{item.quantity} x ฿{item.price.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                      <div className="order-total">รวม ฿{order.total.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="muted-text">ยังไม่มีประวัติการสั่งซื้อ ดูสินค้าและสั่งซื้อได้เลย</p>
              )}
            </div>
          </div>
        )}

        {activeTab === "address" && (
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-header">📍 ที่อยู่จัดส่ง</div>
            <div className="card-body info-grid">
              <div className="info-item">
                <div className="info-label">ที่อยู่</div>
                <input
                  className="form-input"
                  value={address.line1}
                  onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                  placeholder="บ้านเลขที่ / หมู่บ้าน / ซอย"
                />
              </div>
              <div className="info-item">
                <div className="info-label">ตำบล / แขวง</div>
                <input
                  className="form-input"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  placeholder="ตำบล / แขวง"
                />
              </div>
              <div className="info-item">
                <div className="info-label">จังหวัด</div>
                <input
                  className="form-input"
                  value={address.province}
                  onChange={(e) => setAddress({ ...address, province: e.target.value })}
                  placeholder="จังหวัด"
                />
              </div>
              <div className="info-item">
                <div className="info-label">รหัสไปรษณีย์</div>
                <input
                  className="form-input"
                  value={address.postcode}
                  onChange={(e) => setAddress({ ...address, postcode: e.target.value })}
                  placeholder="รหัสไปรษณีย์"
                />
              </div>
            </div>
            <div className="profile-actions">
              <button className="btn btn-primary btn-sm" onClick={handleSaveAddress}>
                บันทึกที่อยู่
              </button>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-header">🔒 เปลี่ยนรหัสผ่าน</div>
            <div className="card-body info-grid">
              <div className="info-item">
                <div className="info-label">รหัสผ่านปัจจุบัน</div>
                <input
                  className="form-input"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="รหัสผ่านปัจจุบัน"
                />
              </div>
              <div className="info-item">
                <div className="info-label">รหัสผ่านใหม่</div>
                <input
                  className="form-input"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="รหัสผ่านใหม่"
                />
              </div>
              <div className="info-item">
                <div className="info-label">ยืนยันรหัสผ่านใหม่</div>
                <input
                  className="form-input"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="ยืนยันรหัสผ่านใหม่"
                />
              </div>
            </div>
            <div className="profile-actions">
              <button className="btn btn-primary btn-sm" onClick={handleChangePassword}>
                เปลี่ยนรหัสผ่าน
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
