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
    <section className="relative min-h-screen overflow-hidden bg-black">
      {/* Full Screen Video - No Overlay Content */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-screen object-cover"
        poster="https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/VISTARA%20TOTE%20(%20png%20)/VISTARA%20TOTE%20-%20Milky%20Blue/09-10-2025--livia00521.jpg"
      >
        <source
          src={isMobile ? "/videos/hero-mobile.mp4" : "/videos/homepage hero section.mp4"}
          type="video/mp4"
        />
      </video>
    </section>
  );
}

