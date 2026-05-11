import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type Address = {
  line1: string;
  city: string;
  province: string;
  postcode: string;
};

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  date: string;
  total: number;
  items: OrderItem[];
};

type UserRole = "customer" | "admin" | "farmer";

interface User {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  createdAt: string;
  address: Address;
  orders: Order[];
}

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (data: Partial<User>) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  forgotPassword: (email: string, newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const API_URL = "/api";

async function safeFetch(path: string, options: RequestInit = {}) {
  console.log('Making request to:', `${API_URL}${path}`, options);
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });
  console.log('Response status:', response.status);
  let body: any = {};
  try {
    body = await response.json();
    console.log('Response body:', body);
  } catch (error) {
    console.log('Failed to parse response:', error);
    body = {};
  }

  return { response, body };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    const { response, body } = await safeFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) return false;
    setUser(body.user);
    return true;
  };

  const register = async (name: string, email: string, password: string, phone = "") => {
    console.log('Registering user:', { name, email, phone });
    const { response, body } = await safeFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, phone }),
    });
    console.log('Registration response:', response.status, body);
    if (!response.ok) {
      console.error("Registration failed:", body);
      return false;
    }
    setUser(body.user);
    return true;
  };

  const updateUser = async (data: Partial<User>) => {
    if (!user) return false;
    const { response, body } = await safeFetch("/auth/update-profile", {
      method: "POST",
      body: JSON.stringify({ email: user.email, ...data }),
    });
    if (!response.ok) return false;
    setUser(body.user);
    return true;
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!user) return false;
    const { response } = await safeFetch("/auth/update-password", {
      method: "POST",
      body: JSON.stringify({ email: user.email, currentPassword, newPassword }),
    });
    return response.ok;
  };

  const forgotPassword = async (email: string, newPassword: string) => {
    const { response } = await safeFetch("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email, newPassword }),
    });
    return response.ok;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, changePassword, forgotPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
