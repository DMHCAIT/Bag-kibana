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
            <span className="flex items-center gap-2 text-sm font-medium">
              <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L9 8H6L10 11L8 17L12 14L16 17L14 11L18 8H15L12 2Z" />
                <rect x="11" y="17" width="2" height="5" fill="currentColor" />
              </svg>
              <strong>50% OFF</strong> on All Products - <strong className="text-green-400">Automatically Applied!</strong>
            </span>
            <span className="flex items-center gap-2 text-sm">
              <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                <rect x="4" y="8" width="16" height="12" rx="1" />
                <path d="M4 12L12 8L20 12" fill="#DC2626" />
                <rect x="10" y="8" width="4" height="4" fill="#FEF3C7" />
              </svg>
              Free Shipping on All Orders
            </span>
            <span className="flex items-center gap-2 text-sm">
              <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L9 8H6L10 11L8 17L12 14L16 17L14 11L18 8H15L12 2Z" />
                <rect x="11" y="17" width="2" height="5" fill="currentColor" />
              </svg>
              Limited Time Offer
            </span>
          </div>
          {/* Duplicate for seamless loop */}
          <div className="flex items-center space-x-8 px-8">
            <span className="flex items-center gap-2 text-sm font-medium">
              <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L9 8H6L10 11L8 17L12 14L16 17L14 11L18 8H15L12 2Z" />
                <rect x="11" y="17" width="2" height="5" fill="currentColor" />
              </svg>
              <strong>50% OFF</strong> on All Products - <strong className="text-white">Automatically Applied!</strong>
            </span>
            <span className="flex items-center gap-2 text-sm">
              <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                <rect x="4" y="8" width="16" height="12" rx="1" />
                <path d="M4 12L12 8L20 12" fill="#DC2626" />
                <rect x="10" y="8" width="4" height="4" fill="#FEF3C7" />
              </svg>
              Free Shipping on All Orders
            </span>
            <span className="flex items-center gap-2 text-sm">
              <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L9 8H6L10 11L8 17L12 14L16 17L14 11L18 8H15L12 2Z" />
                <rect x="11" y="17" width="2" height="5" fill="currentColor" />
              </svg>
              Limited Time Offer
            </span>
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

      <style dangerouslySetInnerHTML={{__html: `
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
      `}} />
    </div>
  );
}
