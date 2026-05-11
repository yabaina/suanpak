import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { Product } from "../data/products";

export interface CartItem extends Product {
  qty: number;
}

interface CartContextValue {
  items: Record<string, CartItem>;
  cartList: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  changeQty: (id: string, delta: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Record<string, CartItem>>({});

  const addItem = (product: Product) => {
    setItems((prev) => {
      const exists = prev[product.id];
      return {
        ...prev,
        [product.id]: exists
          ? { ...exists, qty: exists.qty + 1 }
          : { ...product, qty: 1 },
      };
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const changeQty = (id: string, delta: number) => {
    setItems((prev) => {
      const current = prev[id];
      if (!current) return prev;
      const newQty = current.qty + delta;
      if (newQty <= 0) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: { ...current, qty: newQty } };
    });
  };

  const clearCart = () => setItems({});

  const cartList = Object.values(items);
  const totalItems = cartList.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cartList.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <CartContext.Provider value={{ items, cartList, totalItems, totalPrice, addItem, removeItem, changeQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
