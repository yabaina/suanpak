# Suanpak Project

โปรเจกต์นี้แบ่งออกเป็น Frontend และ Backend เพื่อการจัดการที่ง่ายขึ้น

## โครงสร้างโปรเจกต์

- `frontend/` - แอปพลิเคชัน Frontend (React + Vite)
- `backend/` - แอปพลิเคชัน Backend (Node.js + Express)

## การรัน Frontend และ Backend พร้อมกัน

1. ติดตั้ง dependencies ของ Backend:

```bash
cd backend
npm install
```

2. ติดตั้ง dependencies ของ Frontend:

```bash
cd ../frontend
npm install
```

3. เปิด Backend:

```bash
cd ../backend
npm start
```

4. เปิด Frontend ในอีกเทอร์มินัลหนึ่ง:

```bash
cd ../frontend
npm run dev
```

## API ที่มีให้แล้ว

- `GET /api/health`
- `GET /api/categories`
- `GET /api/products`
- `GET /api/products/:id`

> Frontend ถูกตั้งค่าให้ proxy คำขอ `/api` ไปยัง `http://localhost:4000` โดยอัตโนมัติ
