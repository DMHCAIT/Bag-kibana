"use client";

import React, { useEffect, useState } from "react";

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
        preload="auto"
        className="w-full h-screen object-cover"
        key={isMobile ? "mobile" : "desktop"}
      >
        <source
          src={isMobile ? "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/Kiabana%20reel-%20mobile%20version%202%20(1).mp4" : "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/homepage%20hero%20section.mp4"}
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
    </section>
  );
}

