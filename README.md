# Suanpak Project

เว็บแอปพลิเคชัน e-commerce สำหรับเกษตรกรขายสินค้าสดใหม่ (ผัก ผลไม้ เป็นต้น) ออนไลน์

## โครงสร้างโปรเจกต์

- `frontend/` - เฟรนเทนด์ (React + TypeScript + Vite)
- `backend/` - แบ็กเทนด์ (Node.js + Express)

## การติดตั้งและรัน

### 1. ติดตั้ง Dependencies

Backend:
```bash
cd backend
npm install
```

Frontend:
```bash
cd ../frontend
npm install
```

### 2. รัน Application

รัน Backend (terminal ที่ 1):
```bash
cd backend
npm start
```
Backend จะทำงานที่ http://localhost:4000

รัน Frontend (terminal ที่ 2):
```bash
cd frontend
npm run dev
```
Frontend จะทำงานที่ http://localhost:5173

## ฟีเจอร์หลัก

- 🛍️ Shop - ดูและซื้อสินค้าจากเกษตรกร
- 👨‍🌾 Farmer - เกษตรกรเพิ่มและจัดการสินค้า
- 🛒 Cart & Checkout - สินค้าและการจ่ายเงิน
- 👤 User Profile - จัดการบัญชีผู้ใช้
- ⚙️ Admin Panel - จัดการสินค้า, ผู้ใช้, และฟีดแบ็ก
- 📧 Authentication - ลงทะเบียน, เข้าสู่ระบบ, เปลี่ยนรหัสผ่าน

## API Endpoints

- `GET /api/products` - ดึงรายการสินค้าทั้งหมด
- `GET /api/categories` - ดึงหมวดหมู่สินค้า
- `GET /api/products/:id` - ดึงสินค้าตามรหัส
- `POST /api/auth/register` - ลงทะเบียนผู้ใช้ใหม่
- `POST /api/auth/login` - เข้าสู่ระบบ
- `POST /api/farmer/products` - เกษตรกรเพิ่มสินค้า
- `POST /api/admin/products` - Admin เพิ่มสินค้า
- และอื่น ๆ อีกมากมาย

## หมายเหตุ

Frontend ใช้ proxy ที่ชี้ไปยัง `/api` = `http://localhost:4000` ในโหมด development
