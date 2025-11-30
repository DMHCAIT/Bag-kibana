import { Product } from "@/lib/products-data";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: {
    name: string;
    value: string;
  };
}

export interface Cart {
  items: CartItem[];
  total: number;
}

