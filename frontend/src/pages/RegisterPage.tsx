import { useState, type FormEvent } from "react";
import type { NavigateFn } from "../types/navigation";
import { useAuth } from "../context/AuthContext";
import logoImg from "../assets/suanpak.png";
import bgImg from "../assets/sign.png";
import "../styles/auth.css";

type Props = {
  onNavigate: NavigateFn;
};

export default function RegisterPage({ onNavigate }: Props) {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }

    const ok = await register(name, email, password, phone);
    if (ok) onNavigate("home");
    else setError("ไม่สามารถสมัครสมาชิกได้ กรุณาลองใหม่");
  };

  return (
    <div className="auth-page">
      <div className="auth-left" style={{ backgroundImage: `url(${bgImg})` }}>
        <div className="auth-brand">
          <img src={logoImg} alt="SUANPAK" className="auth-logo" />
          <div className="auth-tagline">YOUR BACKYARD FARM</div>
          <p className="auth-desc">"สมัครสมาชิกวันนี้<br />รับสิทธิ์พิเศษมากมาย"</p>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h2 className="auth-title">Register</h2>
          <p className="auth-sub">สร้างบัญชีใหม่เพื่อเริ่มช้อปปิ้ง</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">ชื่อ-นามสกุล</label>
              <input
                className="form-input"
                type="text"
                placeholder="กรุณาใส่ชื่อ-นามสกุล"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
              <label className="form-label">เบอร์โทร</label>
              <input
                className="form-input"
                type="tel"
                placeholder="08X-XXX-XXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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
            <div className="form-group">
              <label className="form-label">ยืนยันรหัสผ่าน</label>
              <input
                className="form-input"
                type="password"
                placeholder="ยืนยันรหัสผ่าน"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>
            {error && <p className="auth-error">{error}</p>}
            <button className="btn btn-primary btn-block btn-lg" type="submit">
              ลงทะเบียน
            </button>
          </form>

          <p className="auth-footer">
            มีแอคเคาท์แล้ว? <a className="auth-link" onClick={() => onNavigate("login")}>เข้าสู่ระบบ ที่นี่</a>
          </p>
        </div>
      </div>
    </div>
  );
}
