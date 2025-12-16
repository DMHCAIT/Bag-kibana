"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, User, ShoppingBag, Menu, X, LogOut, Package } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import OfferBanner from "./OfferBanner";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { cart } = useCart();
  const { user, signOut, isLoading } = useAuth();
  const router = useRouter();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Handle hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [userMenuOpen]);

  const handleSignOut = () => {
    signOut();
    setUserMenuOpen(false);
    router.push('/');
  };

  return (
    <>
      <OfferBanner />
      <header className="sticky top-0 z-50 w-full bg-white border-b border-[#EDEDED]">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 touch-manipulation">
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
            <div className="relative w-28 h-10 md:w-36 md:h-12">
              <Image
                src="https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/logo%20kibana.jpg"
                alt="KIBANA Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Right Section - Icons (Desktop) & Cart */}
          <div className="flex items-center justify-end gap-4 md:gap-6 flex-1">
            {/* Desktop Icons */}
            <div className="hidden md:flex items-center gap-6">
              <button className="hover:opacity-60 transition-opacity" aria-label="Search">
                <Search className="w-5 h-5" />
              </button>
              
              {/* User Menu */}
              {isClient && (
                isLoading ? (
                  <div className="w-5 h-5 animate-pulse bg-gray-200 rounded-full"></div>
                ) : user ? (
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="hover:opacity-60 transition-opacity flex items-center gap-2"
                      aria-label="Account"
                    >
                <User className="w-5 h-5" />
              </button>
                    
                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                        <Link
                          href="/account"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Package className="w-4 h-4" />
                          My Orders
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link href="/signin" className="hover:opacity-60 transition-opacity">
                    <User className="w-5 h-5" />
                  </Link>
                )
              )}
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
            <div className="flex flex-col gap-4 pt-4 border-t border-[#EDEDED]">
              {isClient && user ? (
                <>
                  <div className="text-sm text-gray-600 mb-2">
                    Signed in as <span className="font-medium text-black">{user.name}</span>
                  </div>
                  <Link
                    href="/account"
                    className="flex items-center gap-2 hover:opacity-60 transition-opacity"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Package className="w-5 h-5" />
                    <span className="text-sm uppercase tracking-wider">My Orders</span>
                  </Link>
                  <button 
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 text-red-600 hover:opacity-60 transition-opacity"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm uppercase tracking-wider">Sign Out</span>
              </button>
                </>
              ) : (
                <Link
                  href="/signin"
                  className="flex items-center gap-2 hover:opacity-60 transition-opacity"
                  onClick={() => setMobileMenuOpen(false)}
                >
                <User className="w-5 h-5" />
                  <span className="text-sm uppercase tracking-wider">Sign In</span>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
      </header>
    </>
  );
}
