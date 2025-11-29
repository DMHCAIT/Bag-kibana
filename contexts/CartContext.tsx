"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { CartContextType, CartItem } from "@/lib/types/cart";
import { Product } from "@/lib/products-data";
import { safeStorage, reportError } from "@/lib/utils/production";

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Handle hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load cart from localStorage on mount
  useEffect(() => {
    if (!isClient) return;
    
    try {
      const savedCart = safeStorage.getItem("kibana-cart");
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        // Validate and filter items to ensure they have valid product data
        const validItems = (parsedCart.items || []).filter(
          (item: CartItem) => 
            item && 
            item.product && 
            item.product.id && 
            typeof item.product.price === 'number' &&
            item.quantity > 0
        );
        // Only update if different from current state
        if (validItems.length > 0) {
          setCartItems(validItems);
        }
      }
    } catch (error) {
      reportError(error as Error, "Cart loading from localStorage");
      // Clear corrupted cart data
      safeStorage.removeItem("kibana-cart");
    } finally {
      setIsLoaded(true);
    }
  }, [isClient]);

  // Calculate totals from items with stable reference
  const cart = useMemo(() => {
    if (!isLoaded) {
      // Return a consistent object during loading
      return { items: [], totalItems: 0, subtotal: 0, isEmpty: true };
    }
    
    // Filter out any invalid items (missing product or price)
    const validItems = cartItems.filter(
      (item) => item && item.product && typeof item.product.price === 'number'
    );
    
    const totalItems = validItems.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = validItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    
    // Return object with consistent structure to prevent re-renders
    return { 
      items: validItems, 
      totalItems, 
      subtotal, 
      isEmpty: totalItems === 0 
    };
  }, [cartItems, isLoaded]);

  // Save cart to localStorage whenever cartItems changes
  useEffect(() => {
    if (!isClient || !isLoaded) return;
    
    try {
      // Calculate current cart state for saving
      const validItems = cartItems.filter(
        (item) => item && item.product && typeof item.product.price === 'number'
      );
      
      const totalItems = validItems.reduce((sum, item) => sum + item.quantity, 0);
      const subtotal = validItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );
      
      const cartToSave = { items: validItems, totalItems, subtotal };
      safeStorage.setItem("kibana-cart", JSON.stringify(cartToSave));
    } catch (error) {
      reportError(error as Error, "Cart saving to localStorage");
    }
  }, [cartItems, isClient, isLoaded]);

  const addToCart = useCallback((
    product: Product,
    quantity: number = 1,
    selectedColor?: { name: string; value: string }
  ) => {
    setCartItems((prev) => {
      const existingItemIndex = prev.findIndex(
        (item) => item.product.id === product.id
      );

      if (existingItemIndex > -1) {
        // Update quantity of existing item
        const updatedItems = [...prev];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        // Add new item
        const newItem: CartItem = {
          product,
          quantity,
          selectedColor: selectedColor || (product.colors && product.colors.length > 0 ? product.colors[0] : undefined),
        };
        return [...prev, newItem];
      }
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

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => {
    if (process.env.NODE_ENV === 'development') {
      console.debug('Cart context value updated:', { 
        totalItems: cart.totalItems, 
        isLoaded,
        itemsLength: cart.items.length 
      });
    }
    
    return {
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getItemQuantity,
      isLoaded
    };
  }, [cart, isLoaded, addToCart, removeFromCart, updateQuantity, clearCart, getItemQuantity]);

  return (
    <CartContext.Provider value={contextValue}>
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
