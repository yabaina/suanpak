import { useState, type FormEvent } from "react";
import type { NavigateFn } from "../types/navigation";
import { useAuth } from "../context/AuthContext";
import logoImg from "../assets/suanpak.png";
import bgImg from "../assets/getstart.png";
import "../styles/auth.css";

type Props = {
  onNavigate: NavigateFn;
};

export default function LoginPage({ onNavigate }: Props) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const ok = await login(email, password);
    if (ok) onNavigate("home");
    else setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
  };

  return (
    <div className="auth-page">
      <div className="auth-left" style={{ backgroundImage: `url(${bgImg})` }}>
        <div className="auth-brand">
          <img src={logoImg} alt="SUANPAK" className="auth-logo" />
          <div className="auth-tagline">YOUR BACKYARD FARM</div>
          <p className="auth-desc">"ด้วยความใส่ใจจากเกษตรกร<br />ถึงมือคุณ สินค้าสดใหม่ทุกวัน"</p>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h2 className="auth-title">Sign in</h2>
          <p className="auth-sub">กรุณาเข้าสู่ระบบเพื่อสั่งซื้อสินค้า</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">อีเมล</label>
              <input
                className="form-input"
                type="email"
                placeholder="กรุณาใส่อีเมล"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">รหัสผ่าน</label>
              <input
                className="form-input"
                type="password"
                placeholder="กรุณาใส่รหัสผ่าน"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div style={{ textAlign: "right", marginBottom: 16 }}>
              <a className="auth-link" onClick={() => onNavigate("forgot")}>ลืมรหัสผ่าน ?</a>
            </div>
            {error && <p className="auth-error">{error}</p>}
            <button className="btn btn-primary btn-block btn-lg" type="submit">
              เข้าสู่ระบบ
            </button>
          </form>

          <p className="auth-footer">
            ยังไม่มีแอคเคาท์? <a className="auth-link" onClick={() => onNavigate("register")}>ลงทะเบียน ที่นี่</a>
          </p>
        </div>
      </div>
    </div>
  );
}
