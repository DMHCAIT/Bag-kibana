"use client";

import { useCart } from "@/contexts/CartContext";
import CartDrawer from "./CartDrawer";

export function Providers({ children }: { children: React.ReactNode }) {
  const { isCartOpen, closeCart } = useCart();
  
  return (
    <>
      {children}
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
    </>
  );
}
