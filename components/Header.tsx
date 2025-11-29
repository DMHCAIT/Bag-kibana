"use client";

import Link from "next/link";
import { Search, User, ShoppingBag, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { cart } = useCart();

  // Handle hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-[#EDEDED]">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Left Section - Navigation Links & Cart */}
          <div className="flex items-center gap-4 md:gap-6 flex-1">
            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6 text-sm tracking-wider">
              <Link
                href="/shop"
                className="hover:opacity-60 transition-opacity uppercase"
              >
                Shop
              </Link>
              <Link
                href="/women"
                className="hover:opacity-60 transition-opacity uppercase"
              >
                Women
              </Link>
              <Link
                href="/men"
                className="hover:opacity-60 transition-opacity uppercase"
              >
                Men
              </Link>
            </nav>
          </div>

          {/* Center - Logo */}
          <Link
            href="/"
            className="hover:opacity-60 transition-opacity"
          >
            <h1 className="text-2xl md:text-3xl font-bold tracking-[0.3em] text-black font-abhaya">
              KIBANA
            </h1>
          </Link>

          {/* Right Section - Icons (Desktop) & Cart */}
          <div className="flex items-center justify-end gap-4 md:gap-6 flex-1">
            {/* Desktop Icons */}
            <div className="hidden md:flex items-center gap-6">
              <button className="hover:opacity-60 transition-opacity" aria-label="Search">
                <Search className="w-5 h-5" />
              </button>
              <button className="hover:opacity-60 transition-opacity" aria-label="Account">
                <User className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Icon */}
            <Link href="/cart" className="relative hover:opacity-60 transition-opacity" aria-label="Shopping bag">
              <ShoppingBag className="w-5 h-5" />
              {isClient && cart.totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#EDEDED] bg-white">
          <nav className="container mx-auto px-4 py-6 flex flex-col gap-4">
            <Link
              href="/shop"
              className="text-lg uppercase tracking-wider hover:opacity-60 transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              href="/women"
              className="text-lg uppercase tracking-wider hover:opacity-60 transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            >
              Women
            </Link>
            <Link
              href="/men"
              className="text-lg uppercase tracking-wider hover:opacity-60 transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            >
              Men
            </Link>
            <div className="flex gap-6 pt-4 border-t border-[#EDEDED]">
              <button className="flex items-center gap-2 hover:opacity-60 transition-opacity">
                <Search className="w-5 h-5" />
                <span className="text-sm uppercase tracking-wider">Search</span>
              </button>
              <button className="flex items-center gap-2 hover:opacity-60 transition-opacity">
                <User className="w-5 h-5" />
                <span className="text-sm uppercase tracking-wider">Account</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
