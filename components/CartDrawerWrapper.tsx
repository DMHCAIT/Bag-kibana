"use client";

import { useCart } from "@/contexts/CartContext";
import CartDrawer from "./CartDrawer";

export default function CartDrawerWrapper() {
  const { isCartOpen, closeCart } = useCart();
  
  return <CartDrawer isOpen={isCartOpen} onClose={closeCart} />;
}
