"use client";

import { X } from "lucide-react";
import { useState, useEffect } from "react";

export default function OfferBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    // Check if user has closed the banner in this session
    const bannerClosed = sessionStorage.getItem("offer-banner-closed");
    if (bannerClosed === "true") {
      setIsVisible(false);
      setIsClosed(true);
    }
  }, []);

  const closeBanner = () => {
    setIsVisible(false);
    sessionStorage.setItem("offer-banner-closed", "true");
    setTimeout(() => setIsClosed(true), 300);
  };

  if (isClosed) return null;

  return (
    <div
      className={`relative bg-gradient-to-r from-black via-gray-900 to-black text-white overflow-hidden transition-all duration-300 ${
        isVisible ? "max-h-12 opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      {/* Animated scrolling text */}
      <div className="flex items-center h-12">
        <div className="animate-scroll flex whitespace-nowrap">
          <div className="flex items-center space-x-8 px-8">
            <span className="text-sm font-medium">
              🎉 <strong>20% OFF</strong> with code <strong className="bg-white text-black px-2 py-1 rounded">ORDERNOW</strong>
            </span>
            <span className="text-sm">✨ First order? Get <strong>EXTRA 5% OFF!</strong></span>
            <span className="text-sm">🚚 Free Shipping on All Orders</span>
            <span className="text-sm">💝 Limited Time Offer</span>
          </div>
          {/* Duplicate for seamless loop */}
          <div className="flex items-center space-x-8 px-8">
            <span className="text-sm font-medium">
              🎉 <strong>20% OFF</strong> with code <strong className="bg-white text-black px-2 py-1 rounded">ORDERNOW</strong>
            </span>
            <span className="text-sm">✨ First order? Get <strong>EXTRA 5% OFF!</strong></span>
            <span className="text-sm">🚚 Free Shipping on All Orders</span>
            <span className="text-sm">💝 Limited Time Offer</span>
          </div>
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={closeBanner}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors z-10"
        aria-label="Close banner"
      >
        <X className="w-4 h-4" />
      </button>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
