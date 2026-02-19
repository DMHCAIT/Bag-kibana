"use client";

import React, { useEffect, useState } from "react";
import OptimizedImage from "@/components/OptimizedImage";
import { useSiteContent } from "@/hooks/useSiteContent";
import Link from "next/link";

const DEFAULT_HERO_IMAGE = "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/HERO%20SECTION/KIBANA%20HOME%20PAGE.jpg%20(1).jpeg";

export default function HeroSection() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const { getValue } = useSiteContent(["hero_home"]);

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

  const heroImage = getValue("hero_home", "image_url", DEFAULT_HERO_IMAGE);
  const heroAlt = getValue("hero_home", "title", "") || "KibanaLife Collection";
  const heroTitle = getValue("hero_home", "title", "");
  const heroSubtitle = getValue("hero_home", "subtitle", "");
  const ctaText = getValue("hero_home", "cta_text", "");
  const ctaLink = getValue("hero_home", "cta_link", "/shop");

  return (
    <section className="relative overflow-hidden bg-black">
      {/* Hero Image */}
      <div className={`relative w-full ${getHeight()}`}>
        <OptimizedImage
          src={heroImage}
          alt={heroAlt}
          fill
          priority
          className="object-cover object-center"
          quality={100}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
        />
        
        {/* Optional text overlay - only shows if title is set in admin */}
        {(heroTitle || heroSubtitle || ctaText) && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="text-center text-white px-4">
              {heroTitle && (
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-wider mb-4">
                  {heroTitle}
                </h1>
              )}
              {heroSubtitle && (
                <p className="text-lg md:text-xl lg:text-2xl mb-6 max-w-2xl mx-auto">
                  {heroSubtitle}
                </p>
              )}
              {ctaText && (
                <Link
                  href={ctaLink}
                  className="inline-block bg-white text-black px-8 py-3 text-sm font-semibold tracking-wider hover:bg-gray-100 transition-colors"
                >
                  {ctaText}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}


