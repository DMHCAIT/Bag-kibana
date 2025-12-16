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

export interface CartContextType {
  cart: {
    items: CartItem[];
    totalItems: number;
    subtotal: number;
    isEmpty: boolean;
  };
  addToCart: (product: Product, quantity?: number, selectedColor?: { name: string; value: string }) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
  isLoaded: boolean;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

