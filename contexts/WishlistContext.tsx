"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Product } from "@/lib/products-data";

interface WishlistContextType {
  wishlistItems: Product[];
  isInWishlist: (productId: string) => boolean;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (product: Product) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

// Safe localStorage access
const getStoredWishlist = (): Product[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem("kibana-wishlist");
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveWishlist = (items: Product[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem("kibana-wishlist", JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save wishlist:', error);
  }
};

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<Product[]>(() => getStoredWishlist());

  // Save wishlist when items change
  useEffect(() => {
    saveWishlist(wishlistItems);
  }, [wishlistItems]);

  const isInWishlist = useCallback((productId: string): boolean => {
    return wishlistItems.some(item => item.id === productId);
  }, [wishlistItems]);

  const addToWishlist = useCallback((product: Product) => {
    setWishlistItems((prev) => {
      if (prev.some(item => item.id === product.id)) {
        return prev; // Already in wishlist
      }
      return [...prev, product];
    });
  }, []);

  const removeFromWishlist = useCallback((productId: string) => {
    setWishlistItems((prev) => prev.filter(item => item.id !== productId));
  }, []);

  const toggleWishlist = useCallback((product: Product) => {
    setWishlistItems((prev) => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        return prev.filter(item => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
}
