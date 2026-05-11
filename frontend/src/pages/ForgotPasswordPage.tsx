import { useState, type FormEvent } from "react";
import type { NavigateFn } from "../types/navigation";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

type Props = {
  onNavigate: NavigateFn;
};

export default function ForgotPasswordPage({ onNavigate }: Props) {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (newPassword !== confirm) {
      setError("รหัสผ่านใหม่ไม่ตรงกัน");
      return;
    }

    const ok = await forgotPassword(email, newPassword);
    if (ok) {
      setMessage("ตั้งค่ารหัสผ่านใหม่เรียบร้อยแล้ว กรุณาเข้าสู่ระบบ");
      setEmail("");
      setNewPassword("");
      setConfirm("");
    } else {
      setError("ไม่สามารถเปลี่ยนรหัสผ่านได้ กรุณาลองใหม่");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left" style={{ background: "linear-gradient(135deg, #3B6D11, #8AC34A)" }}>
        <div className="auth-brand">
          <div className="auth-tagline">Reset your password</div>
          <p className="auth-desc">กรอกอีเมลและรหัสผ่านใหม่เพื่อรีเซ็ตรหัสผ่านของคุณ</p>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h2 className="auth-title">ลืมรหัสผ่าน</h2>
          <p className="auth-sub">กรุณากรอกอีเมลและรหัสผ่านใหม่ของคุณ</p>

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
              <label className="form-label">รหัสผ่านใหม่</label>
              <input
                className="form-input"
                type="password"
                placeholder="รหัสผ่านใหม่"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">ยืนยันรหัสผ่านใหม่</label>
              <input
                className="form-input"
                type="password"
                placeholder="ยืนยันรหัสผ่านใหม่"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>
            {error && <p className="auth-error">{error}</p>}
            {message && <p className="auth-success">{message}</p>}
            <button className="btn btn-primary btn-block btn-lg" type="submit">
              รีเซ็ตรหัสผ่าน
            </button>
          </form>

          <p className="auth-footer">
            กลับไปหน้า <a className="auth-link" onClick={() => onNavigate("login")}>เข้าสู่ระบบ</a>
          </p>
        </div>
      </div>
    </div>
  );
}
