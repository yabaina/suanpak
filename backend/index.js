import fs from "fs/promises";
import express from "express";
import cors from "cors";
import { PRODUCTS, CATEGORIES } from "./data/products.js";

const app = express();
const port = process.env.PORT || 4000;
const usersFile = new URL("./data/users.json", import.meta.url);
const feedbackFile = new URL("./data/feedback.json", import.meta.url);
const farmerProductsFile = new URL("./data/farmer-products.json", import.meta.url);

app.use(cors());
app.use(express.json());

async function loadUsers() {
  try {
    const text = await fs.readFile(usersFile, "utf-8");
    return JSON.parse(text);
  } catch (error) {
    await fs.writeFile(usersFile, "[]", "utf-8");
    return [];
  }
}

async function saveUsers(users) {
  await fs.writeFile(usersFile, JSON.stringify(users, null, 2), "utf-8");
}

async function loadFeedback() {
  try {
    const text = await fs.readFile(feedbackFile, "utf-8");
    return JSON.parse(text);
  } catch (error) {
    await fs.writeFile(feedbackFile, "[]", "utf-8");
    return [];
  }
}

async function saveFeedback(feedback) {
  await fs.writeFile(feedbackFile, JSON.stringify(feedback, null, 2), "utf-8");
}

async function loadFarmerProducts() {
  try {
    const text = await fs.readFile(farmerProductsFile, "utf-8");
    return JSON.parse(text);
  } catch (error) {
    await fs.writeFile(farmerProductsFile, "[]", "utf-8");
    return [];
  }
}

async function saveFarmerProducts(products) {
  await fs.writeFile(farmerProductsFile, JSON.stringify(products, null, 2), "utf-8");
}

function sanitizeUser(user) {
  const { password, ...safe } = user;
  return safe;
}

async function requireAdmin(req, res, next) {
  const email = req.body?.email || req.query?.email || req.headers["x-user-email"];
  if (!email) {
    return res.status(403).json({ error: "Admin access required" });
  }

  const users = await loadUsers();
  const user = users.find((item) => item.email === email && item.role === "admin");
  if (!user) {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
}

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "suanpak-backend" });
});

app.get("/api/categories", (req, res) => {
  res.json(CATEGORIES);
});

app.get("/api/products", (req, res) => {
  res.json(PRODUCTS);
});

app.get("/api/products/:id", (req, res) => {
  const product = PRODUCTS.find((item) => item.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  res.json(product);
});

// Admin-only product management
app.post("/api/admin/products", requireAdmin, (req, res) => {
  const { name, category, price, emoji, unit } = req.body;
  if (!name || !category || !price || !emoji || !unit) {
    return res.status(400).json({ error: "All product fields are required" });
  }

  const id = `ADM-${Date.now()}`;
  const newProduct = { id, name, category, price, emoji, unit };
  PRODUCTS.push(newProduct);
  res.status(201).json(newProduct);
});

app.put("/api/admin/products/:id", requireAdmin, (req, res) => {
  const { name, category, price, emoji, unit } = req.body;
  const productIndex = PRODUCTS.findIndex((item) => item.id === req.params.id);
  if (productIndex === -1) {
    return res.status(404).json({ error: "Product not found" });
  }

  PRODUCTS[productIndex] = { ...PRODUCTS[productIndex], name, category, price, emoji, unit };
  res.json(PRODUCTS[productIndex]);
});

app.delete("/api/admin/products/:id", requireAdmin, (req, res) => {
  const productIndex = PRODUCTS.findIndex((item) => item.id === req.params.id);
  if (productIndex === -1) {
    return res.status(404).json({ error: "Product not found" });
  }

  PRODUCTS.splice(productIndex, 1);
  res.json({ message: "Product deleted successfully" });
});

// Feedback management
app.get("/api/admin/feedback", requireAdmin, async (req, res) => {
  const feedback = await loadFeedback();
  res.json(feedback);
});

app.post("/api/feedback", async (req, res) => {
  const { type, userEmail, subject, message } = req.body;
  if (!type || !userEmail || !subject || !message) {
    return res.status(400).json({ error: "All feedback fields are required" });
  }

  const feedback = await loadFeedback();
  const newFeedback = {
    id: `fb-${Date.now()}`,
    type,
    userEmail,
    subject,
    message,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  feedback.push(newFeedback);
  await saveFeedback(feedback);
  res.status(201).json(newFeedback);
});

app.put("/api/admin/feedback/:id", requireAdmin, async (req, res) => {
  const { status } = req.body;
  const feedback = await loadFeedback();
  const feedbackItem = feedback.find((item) => item.id === req.params.id);
  if (!feedbackItem) {
    return res.status(404).json({ error: "Feedback not found" });
  }

  feedbackItem.status = status;
  await saveFeedback(feedback);
  res.json(feedbackItem);
});

// Farmer products management
app.get("/api/farmer/products", async (req, res) => {
  const products = await loadFarmerProducts();
  res.json(products.filter(p => p.status === "approved"));
});

app.post("/api/farmer/products", async (req, res) => {
  const { farmerEmail, name, category, price, description, unit, stock } = req.body;
  if (!farmerEmail || !name || !category || !price || !description || !unit || stock === undefined) {
    return res.status(400).json({ error: "All product fields are required" });
  }

  const products = await loadFarmerProducts();
  const newProduct = {
    id: `fp-${Date.now()}`,
    farmerEmail,
    name,
    category,
    price,
    description,
    unit,
    stock,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  products.push(newProduct);
  await saveFarmerProducts(products);
  res.status(201).json(newProduct);
});

app.get("/api/admin/farmer-products", requireAdmin, async (req, res) => {
  const products = await loadFarmerProducts();
  res.json(products);
});

app.put("/api/admin/farmer-products/:id", requireAdmin, async (req, res) => {
  const { status } = req.body;
  const products = await loadFarmerProducts();
  const product = products.find((item) => item.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: "Farmer product not found" });
  }

  product.status = status;
  await saveFarmerProducts(products);
  res.json(product);
});

app.get("/api/users", async (req, res) => {
  const users = await loadUsers();
  res.json(users.map(sanitizeUser));
});

app.post("/api/auth/register", async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required" });
  }

  const users = await loadUsers();
  const existing = users.find((user) => user.email === email);
  if (existing) {
    return res.status(409).json({ error: "บัญชีนี้ถูกสร้างขึ้นแล้ว" });
  }

  const createdAt = new Date().toISOString();
  const newUser = {
    name,
    email,
    password,
    phone: phone || "",
    role: "customer",
    createdAt,
    address: {
      line1: "",
      city: "",
      province: "",
      postcode: "",
    },
    orders: [],
  };

  users.push(newUser);
  await saveUsers(users);

  res.status(201).json({ user: sanitizeUser(newUser) });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const users = await loadUsers();
  const user = users.find((item) => item.email === email && item.password === password);
  if (!user) {
    return res.status(401).json({ error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
  }

  res.json({ user: sanitizeUser(user) });
});

app.post("/api/auth/forgot-password", async (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) {
    return res.status(400).json({ error: "Email and new password are required" });
  }

  const users = await loadUsers();
  const user = users.find((item) => item.email === email);
  if (!user) {
    return res.status(404).json({ error: "ไม่พบบัญชีผู้ใช้" });
  }

  user.password = newPassword;
  await saveUsers(users);
  res.json({ message: "รหัสผ่านใหม่ถูกตั้งค่าเรียบร้อยแล้ว" });
});

app.post("/api/auth/update-profile", async (req, res) => {
  const { email, name, phone, address } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const users = await loadUsers();
  const user = users.find((item) => item.email === email);
  if (!user) {
    return res.status(404).json({ error: "ไม่พบบัญชีผู้ใช้" });
  }

  if (name) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (address) {
    user.address = {
      line1: address.line1 || user.address.line1,
      city: address.city || user.address.city,
      province: address.province || user.address.province,
      postcode: address.postcode || user.address.postcode,
    };
  }

  await saveUsers(users);
  res.json({ user: sanitizeUser(user) });
});

app.post("/api/auth/update-password", async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;
  if (!email || !currentPassword || !newPassword) {
    return res.status(400).json({ error: "Email, current password and new password are required" });
  }

  const users = await loadUsers();
  const user = users.find((item) => item.email === email);
  if (!user) {
    return res.status(404).json({ error: "ไม่พบบัญชีผู้ใช้" });
  }
  if (user.password !== currentPassword) {
    return res.status(401).json({ error: "รหัสผ่านเดิมไม่ถูกต้อง" });
  }

  user.password = newPassword;
  await saveUsers(users);
  res.json({ message: "เปลี่ยนรหัสผ่านเรียบร้อยแล้ว" });
});

app.listen(port, () => {
  console.log(`Suanpak backend listening at http://localhost:${port}`);
});
