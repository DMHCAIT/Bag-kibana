"use client";

import Link from "next/link";
import Image from "next/image";
import { User, ShoppingBag, Menu, X, LogOut, Package, Heart } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useSiteContent } from "@/hooks/useSiteContent";
import SearchBar from "@/components/SearchBar";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { cart, openCart } = useCart();
  const { wishlistItems } = useWishlist();
  const { user, signOut, isLoading } = useAuth();
  const router = useRouter();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { getValue } = useSiteContent(["header"]);

  const logoUrl = getValue("header", "logo_url", "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/KIBANA%20copy.png");
  const logoAlt = getValue("header", "logo_alt", "KIBANA Logo");

  // Handle hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle scroll shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
      <header className={`sticky top-0 z-50 w-full bg-white transition-shadow duration-300 ${
        scrolled ? 'shadow-md border-b border-transparent' : 'border-b border-gray-200'
      }`}>
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 touch-manipulation">
          {/* Left Section - Logo */}
          <div className="flex items-center gap-4 md:gap-6 flex-1">
            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-gray-700" />
              ) : (
                <Menu className="w-5 h-5 text-gray-700" />
              )}
            </button>

            {/* Logo */}
            <Link
              href="/"
              className="hover:opacity-70 transition-all duration-200"
            >
              <div className="relative w-32 h-10 md:w-40 md:h-12 animate-logo-pulse">
                <Image
                  src={logoUrl}
                  alt={logoAlt}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Right Section - Navigation Links & Icons */}
          <div className="flex items-center justify-end gap-4 md:gap-8 flex-1">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8 text-sm tracking-wide font-medium">
              <Link
                href="/shop"
                className="hover:text-gray-600 transition-colors duration-200 uppercase relative group"
              >
                Shop
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-200 group-hover:w-full"></span>
              </Link>
              <Link
                href="/women"
                className="hover:text-gray-600 transition-colors duration-200 uppercase relative group"
              >
                Women
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-200 group-hover:w-full"></span>
              </Link>
              <Link
                href="/men"
                className="hover:text-gray-600 transition-colors duration-200 uppercase relative group"
              >
                Men
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-200 group-hover:w-full"></span>
              </Link>
            </nav>
            {/* Desktop Icons */}
            <div className="hidden md:flex items-center gap-5">
              <SearchBar />
              
              {/* User Menu */}
              {isClient && (
                isLoading ? (
                  <div className="w-5 h-5 animate-pulse bg-gray-200 rounded-full"></div>
                ) : user ? (
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="hover:bg-gray-100 p-2 rounded-full transition-all duration-200 flex items-center gap-2"
                      aria-label="Account"
                    >
                <User className="w-5 h-5 text-gray-700" />
              </button>
                    
                    {userMenuOpen && (
                      <div className="absolute right-0 mt-3 w-64 bg-white border border-gray-200 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
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
                  <Link href="/signin" className="hover:bg-gray-100 p-2 rounded-full transition-all duration-200">
                    <User className="w-5 h-5 text-gray-700" />
                  </Link>
                )
              )}

              {/* Wishlist Icon */}
              <Link href="/wishlist" className="relative hover:bg-gray-100 p-2 rounded-full transition-all duration-200" aria-label="Wishlist">
                <Heart className="w-5 h-5 text-gray-700" />
                {isClient && wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold shadow-lg">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              {/* Cart Icon */}
              <button onClick={openCart} className="relative hover:bg-gray-100 p-2 rounded-full transition-all duration-200" aria-label="Shopping bag">
                <ShoppingBag className="w-5 h-5 text-gray-700" />
                {isClient && cart.totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold shadow-lg">
                    {cart.totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white shadow-lg">
          <nav className="container mx-auto px-4 py-6 flex flex-col gap-2">
            <Link
              href="/shop"
              className="text-base uppercase tracking-wide hover:bg-gray-100 transition-colors duration-200 px-4 py-3 rounded-lg font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              href="/women"
              className="text-base uppercase tracking-wide hover:bg-gray-100 transition-colors duration-200 px-4 py-3 rounded-lg font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Women
            </Link>
            <Link
              href="/men"
              className="text-base uppercase tracking-wide hover:bg-gray-100 transition-colors duration-200 px-4 py-3 rounded-lg font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Men
            </Link>
            <Link
              href="/wishlist"
              className="flex items-center gap-3 hover:bg-gray-100 transition-colors duration-200 px-4 py-3 rounded-lg font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Heart className="w-5 h-5 text-gray-700" />
              <span className="text-base uppercase tracking-wide">
                Wishlist
                {isClient && wishlistItems.length > 0 && (
                  <span className="ml-2 text-xs text-red-600">({wishlistItems.length})</span>
                )}
              </span>
            </Link>
            <div className="flex flex-col gap-2 pt-4 border-t border-gray-200 mt-2">
              {isClient && user ? (
                <>
                  <div className="text-sm text-gray-600 px-4 py-2">
                    Signed in as <span className="font-semibold text-black">{user.name}</span>
                  </div>
                  <Link
                    href="/account"
                    className="flex items-center gap-3 hover:bg-gray-100 transition-colors duration-200 px-4 py-3 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Package className="w-5 h-5 text-gray-700" />
                    <span className="text-sm uppercase tracking-wide font-medium">My Orders</span>
                  </Link>
                  <button 
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 text-red-600 hover:bg-red-50 transition-colors duration-200 px-4 py-3 rounded-lg"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm uppercase tracking-wide font-medium">Sign Out</span>
              </button>
                </>
              ) : (
                <Link
                  href="/signin"
                  className="flex items-center gap-3 hover:bg-gray-100 transition-colors duration-200 px-4 py-3 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                <User className="w-5 h-5 text-gray-700" />
                  <span className="text-sm uppercase tracking-wide font-medium">Sign In</span>
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
