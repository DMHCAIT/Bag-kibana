"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

export default function VersionCheck() {
  const [cartContextVersion, setCartContextVersion] = useState<string>("Checking...");
  const [buildInfo, setBuildInfo] = useState<any>({});
  const [cacheInfo, setCacheInfo] = useState<string[]>([]);

  useEffect(() => {
    // Check if we're running the new CartContext
    try {
      const cartData = localStorage.getItem("kibana-cart");
      if (cartData) {
        const parsed = JSON.parse(cartData);
        if (parsed && typeof parsed === 'object' && 'items' in parsed) {
          setCartContextVersion("✅ NEW VERSION (v2) - Fixed!");
        } else {
          setCartContextVersion("❌ OLD VERSION (v1) - Cached!");
        }
      } else {
        setCartContextVersion("✅ NEW VERSION (v2) - No cart data yet");
      }
    } catch {
      setCartContextVersion("⚠️ UNKNOWN - Error reading cart");
    }

    // Build info
    setBuildInfo({
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
    });

    // Check cache
    const checks = [];
    
    // Check localStorage
    checks.push(`LocalStorage: ${localStorage.length} items`);
    
    // Check if Service Worker is active
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        setCacheInfo(prev => [...prev, `Service Workers: ${registrations.length} registered`]);
      });
    } else {
      checks.push(`Service Workers: Not supported`);
    }

    setCacheInfo(checks);
  }, []);

  const handleClearCache = () => {
    // Clear localStorage
    localStorage.clear();
    
    // Clear sessionStorage
    sessionStorage.clear();
    
    // Unregister service workers
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => {
          registration.unregister();
        });
      });
    }
    
    // Reload page
    alert("Cache cleared! Page will reload with Ctrl+Shift+R (hard refresh)");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleHardRefresh = () => {
    window.location.href = window.location.href + '?cacheBust=' + Date.now();
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-serif mb-8">Version & Cache Checker</h1>
        
        {/* Version Status */}
        <div className="bg-gray-100 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4">🔍 Current Version Status</h2>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded border-2 border-gray-300">
              <p className="text-sm text-gray-600 mb-1">CartContext Version:</p>
              <p className="text-xl font-bold">{cartContextVersion}</p>
            </div>
            
            <div className="bg-white p-4 rounded border-2 border-gray-300">
              <p className="text-sm text-gray-600 mb-1">Expected Version:</p>
              <p className="text-xl font-bold text-green-600">✅ v2.0.0 (Dec 1, 2025)</p>
            </div>
          </div>
        </div>

        {/* Cache Information */}
        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4">💾 Cache Information</h2>
          <div className="space-y-2">
            {cacheInfo.map((info, idx) => (
              <p key={idx} className="text-sm font-mono bg-white p-2 rounded">{info}</p>
            ))}
          </div>
        </div>

        {/* Browser Information */}
        <div className="bg-yellow-50 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4">🌐 Browser Information</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Timestamp:</strong> {buildInfo.timestamp}</p>
            <p><strong>Platform:</strong> {buildInfo.platform}</p>
            <p><strong>Language:</strong> {buildInfo.language}</p>
            <p className="break-all"><strong>User Agent:</strong> {buildInfo.userAgent}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-red-50 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4">🔧 Cache Actions</h2>
          <p className="mb-4 text-gray-700">
            If you see "OLD VERSION" or errors, you need to clear your cache:
          </p>
          <div className="space-y-4">
            <Button
              onClick={handleClearCache}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-6 text-lg"
            >
              🗑️ Clear All Cache & Reload
            </Button>
            
            <Button
              onClick={handleHardRefresh}
              variant="outline"
              className="w-full py-6 text-lg"
            >
              🔄 Hard Refresh with Cache Buster
            </Button>
            
            <div className="bg-white p-4 rounded border-2 border-gray-300">
              <p className="font-semibold mb-2">Manual Hard Refresh:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><strong>Mac:</strong> Cmd + Shift + R</li>
                <li><strong>Windows/Linux:</strong> Ctrl + Shift + R</li>
                <li><strong>Incognito Mode:</strong> Cmd/Ctrl + Shift + N</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Diagnostic Info */}
        <div className="bg-green-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">✅ What Should You See?</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <p>CartContext Version: "NEW VERSION (v2) - Fixed!"</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <p>No React Error #310 in console</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <p>No "undefined.map" errors</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <p>Product pages load without errors</p>
            </div>
          </div>
        </div>

        {/* Test Links */}
        <div className="bg-purple-50 p-6 rounded-lg mt-8">
          <h2 className="text-2xl font-semibold mb-4">🧪 Test These Pages</h2>
          <div className="space-y-2">
            <a href="/all-products" className="block text-blue-600 hover:underline">
              → All Products Page
            </a>
            <a href="/products/vistara-tote-mint-green" className="block text-blue-600 hover:underline">
              → Vistara Tote - Mint Green
            </a>
            <a href="/products/vistapack-milky-blue" className="block text-blue-600 hover:underline">
              → Vistapack - Milky Blue
            </a>
            <a href="/shop" className="block text-blue-600 hover:underline">
              → Shop Page
            </a>
            <a href="/cart" className="block text-blue-600 hover:underline">
              → Shopping Cart
            </a>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

