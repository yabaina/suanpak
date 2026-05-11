Suanpak Project

<<<<<<< HEAD
เว็บแอปพลิเคชัน e-commerce สำหรับเกษตรกรขายสินค้าสดใหม่ (ผัก ผลไม้ เป็นต้น) ออนไลน์

## โครงสร้างโปรเจกต์

- `frontend/` - เฟรนเทนด์ (React + TypeScript + Vite)
- `backend/` - แบ็กเทนด์ (Node.js + Express)

## การติดตั้งและรัน

### 1. ติดตั้ง Dependencies

Backend:
```bash
=======
โปรเจกต์นี้แบ่งออกเป็น 2 ส่วน เพื่อให้จัดการและพัฒนาได้ง่ายขึ้น

frontend/ สำหรับส่วนติดต่อผู้ใช้ พัฒนาด้วย React + Vite

backend/ สำหรับระบบหลังบ้าน พัฒนาด้วย Node.js + Express

วิธีรัน Frontend และ Backend พร้อมกัน

ติดตั้ง dependencies ของ Backend

cd backend

npm install

<<<<<<< HEAD
Frontend:
```bash
=======
ติดตั้ง dependencies ของ Frontend

cd ../frontend

npm install

<<<<<<< HEAD
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
=======
เปิด Backend

cd ../backend

npm start

เปิด Frontend ในอีกเทอร์มินัลหนึ่ง

cd ../frontend

npm run dev

API ที่มีอยู่ตอนนี้


GET /api/health
GET /api/categories
GET /api/products
GET /api/products/:id

หมายเหตุ
Frontend ถูกตั้งค่าให้ส่งคำขอที่ขึ้นต้นด้วย /api ไปยัง http://localhost:4000 อัตโนมัติ
