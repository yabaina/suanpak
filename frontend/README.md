# SUANPAK — Mini Marketplace (PC Version)

## โครงสร้างโปรเจค

```
src/
├── App.tsx                  # Main app + simple client-side router
├── context/
│   ├── AuthContext.tsx      # Login / Register / Logout state
│   └── CartContext.tsx      # Cart state (add / remove / qty)
├── data/
│   └── products.ts          # Mock product data (ชื่อ, รหัส, ราคา, ประเภท)
├── components/
│   └── Navbar.tsx           # Top navigation bar
├── pages/
│   ├── LoginPage.tsx        # หน้า Sign In
│   ├── RegisterPage.tsx     # หน้า Register
│   ├── ShopPage.tsx         # หน้าสินค้า (grid + table view / sidebar filter)
│   ├── CartPage.tsx         # หน้าตะกร้า
│   ├── CheckoutPage.tsx     # หน้า Checkout + Order Success
│   └── ProfilePage.tsx      # หน้าโปรไฟล์ (Logged in + Guest)
└── styles/
    ├── global.css           # CSS variables, reset, shared components
    ├── auth.css             # Login / Register styles
    ├── shop.css             # Shop page styles
    ├── cart.css             # Cart page styles
    ├── checkout.css         # Checkout + Success styles
    └── profile.css          # Profile (guest + logged in) styles
```

## วิธีติดตั้ง

```bash
npm install
npm run dev
```

แล้วเปิด http://localhost:5173

---

## Mock Data

ไฟล์ `src/data/products.ts` มีสินค้าตัวอย่าง 20 รายการ:
- รหัสสินค้า: `VEG-001`, `FRT-001`, `PRC-001`
- ประเภท: `veg` (ผักสด), `fruit` (ผลไม้), `processed` (สินค้าแปรรูป)
- ข้อมูล: ชื่อ, ราคา, หน่วย, emoji

เมื่อเชื่อมต่อ Backend จริง ให้แทนที่ข้อมูลใน `ShopPage.tsx` ด้วย `useEffect` + fetch API
