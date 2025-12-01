"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { CartContextType, CartItem } from "@/lib/types/cart";
import { Product } from "@/lib/products-data";

const CartContext = createContext<CartContextType | undefined>(undefined);

// Safe localStorage access
const getStoredCart = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem("kibana-cart");
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed.items) ? parsed.items : [];
  } catch {
    return [];
  }
};

const saveCart = (items: CartItem[]) => {
  if (typeof window === 'undefined') return;
  try {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    localStorage.setItem("kibana-cart", JSON.stringify({ items, totalItems, subtotal }));
  } catch (error) {
    console.error('Failed to save cart:', error);
  }
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart ONCE on mount
  useEffect(() => {
    const stored = getStoredCart();
    setCartItems(stored);
    setIsLoaded(true);
  }, []); // Empty dependency array - runs ONCE

  // Save cart when items change (but NOT on initial load)
  useEffect(() => {
    if (!isLoaded) return; // Don't save on initial load
    saveCart(cartItems);
  }, [cartItems, isLoaded]);

  // Memoized cart state
  const cart = useMemo(() => {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    return {
      items: cartItems,
      totalItems,
      subtotal,
      isEmpty: totalItems === 0
    };
  }, [cartItems]);

  const addToCart = useCallback((
    product: Product,
    quantity: number = 1,
    selectedColor?: { name: string; value: string }
  ) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        return updated;
      }
      return [...prev, {
        product,
        quantity,
        selectedColor: selectedColor || product.colors?.[0]
      }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const getItemQuantity = useCallback((productId: string): number => {
    const item = cartItems.find((item) => item.product.id === productId);
    return item?.quantity || 0;
  }, [cartItems]);

  const value = useMemo(() => ({
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemQuantity,
    isLoaded
  }), [cart, addToCart, removeFromCart, updateQuantity, clearCart, getItemQuantity, isLoaded]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
