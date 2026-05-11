Suanpak Project

โปรเจกต์นี้แบ่งออกเป็น 2 ส่วน เพื่อให้จัดการและพัฒนาได้ง่ายขึ้น

frontend/ สำหรับส่วนติดต่อผู้ใช้ พัฒนาด้วย React + Vite

backend/ สำหรับระบบหลังบ้าน พัฒนาด้วย Node.js + Express

วิธีรัน Frontend และ Backend พร้อมกัน

ติดตั้ง dependencies ของ Backend

cd backend

npm install

ติดตั้ง dependencies ของ Frontend

cd ../frontend

npm install

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
