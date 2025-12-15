"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function HeroSection() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-white">
      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          poster="https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/VISTARA%20TOTE%20(%20png%20)/VISTARA%20TOTE%20-%20Milky%20Blue/09-10-2025--livia00521.jpg"
        >
          <source
            src={isMobile ? "/videos/hero-mobile.mp4" : "/videos/homepage hero section.mp4"}
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/20 to-white" />
      </div>

      {/* Overlay content */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 md:px-8 lg:px-12 min-h-screen flex items-center">
          <div className="w-full max-w-3xl">
            <div className="space-y-6 md:space-y-8">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-black/5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs tracking-[0.2em] uppercase">50% OFF - Limited Time</span>
              </div>

              <div className="space-y-4">
                <p className="text-sm md:text-base tracking-[0.28em] text-gray-800 uppercase">
                  KibanaLife
                </p>

                <h1
                  className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-semibold leading-tight tracking-tight text-gray-900"
                  style={{ fontFamily: "var(--font-abhaya)" }}
                >
                  Luxury that defines you.
                </h1>

                <p className="text-base md:text-lg text-gray-700 max-w-2xl">
                  Handcrafted silhouettes, premium leather finishes, and a modern 3D showcase so your next signature piece is seen in every dimension.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Link href="/shop">
                  <button className="px-8 md:px-8 py-3.5 md:py-3.5 bg-black text-white rounded-full text-sm tracking-[0.18em] uppercase shadow-lg shadow-black/10 touch-manipulation min-h-[44px] hover:bg-gray-800 transition-colors">
                    Shop Now
                  </button>
                </Link>
                <Link href="/collections/tote">
                  <button className="px-6 md:px-8 py-3 md:py-3.5 bg-white/80 text-black border border-black/10 rounded-full text-sm tracking-[0.18em] uppercase shadow-sm hover:bg-gray-100 transition-colors">
                    Explore Bags
                  </button>
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-xl pt-2">
                {["Premium leather", "Hand finished", "Made in India"].map((item, idx) => (
                  <div
                    key={item}
                    className="px-4 py-3 rounded-xl bg-white/80 backdrop-blur-sm border border-black/5 shadow-sm text-sm text-gray-700"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

