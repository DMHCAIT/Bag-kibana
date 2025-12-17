"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

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
      {/* Full Screen Christmas Hero Image */}
      <div className="relative w-full h-screen">
        <Image
          src={isMobile 
            ? "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/HERO%20SECTION/hero%20chris%20mobile.jpg"
            : "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/HERO%20SECTION/hero%20chris%20desktop.jpg"
          }
          alt="KibanaLife Christmas Collection"
          fill
          priority
          className="object-cover"
          quality={100}
        />
      </div>
    </section>
  );
}


