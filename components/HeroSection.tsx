"use client";

import React, { useEffect, useState } from "react";
import OptimizedImage from "@/components/OptimizedImage";

export default function HeroSection() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };
    
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const getHeight = () => {
    if (isMobile) return 'h-[60vh] sm:h-[70vh]';
    if (isTablet) return 'h-[75vh]';
    return 'h-[80vh] xl:h-[85vh]';
  };

  return (
    <section className="relative overflow-hidden bg-black">
      {/* Hero Image */}
      <div className={`relative w-full ${getHeight()}`}>
        <OptimizedImage
          src="/KIBANA HOME PAGE.jpg (1).jpeg"
          alt="KibanaLife Collection"
          fill
          priority
          className="object-cover object-center"
          quality={100}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
        />
      </div>
    </section>
  );
}


