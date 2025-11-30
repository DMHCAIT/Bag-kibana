import { Product } from "../products-data";

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
  totalItems: number;
  subtotal: number;
}

export interface CartContextType {
  cart: Cart;
  addToCart: (product: Product, quantity?: number, selectedColor?: { name: string; value: string }) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
}
