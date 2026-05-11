export interface Category {
  id: string;
  label: string;
  emoji: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  emoji: string;
  unit: string;
}
