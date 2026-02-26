"use client";

import React from "react";
import OptimizedImage from "@/components/OptimizedImage";
import { useSiteContent } from "@/hooks/useSiteContent";

const DEFAULT_HERO_IMAGE = "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/HERO%20SECTION/KIBANA%20HOME%20PAGE.jpg%20(1).jpeg";
const DEFAULT_HERO_IMAGE_MOBILE = "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/HERO%20SECTION/Mobile%20size%20images.jpg.jpeg";

export default function HeroSection() {
  const { getValue } = useSiteContent(["hero_home"]);

  const heroImage = getValue("hero_home", "image_url", DEFAULT_HERO_IMAGE);
  const heroImageMobile = getValue("hero_home", "mobile_image_url", DEFAULT_HERO_IMAGE_MOBILE);
  const heroAlt = getValue("hero_home", "title", "") || "KibanaLife Collection";
  const heroTitle = getValue("hero_home", "title", "");
  const heroSubtitle = getValue("hero_home", "subtitle", "");

  return (
    <section className="relative w-full bg-black" style={{ height: 'calc(100svh - 64px)' }}>
      {/* Mobile Hero Image */}
      <div className="absolute inset-0 md:hidden">
        <OptimizedImage
          src={heroImageMobile}
          alt={heroAlt}
          fill
          priority
          className="object-cover object-top"
          quality={90}
          sizes="100vw"
        />
      </div>

      {/* Desktop Hero Image */}
      <div className="absolute inset-0 hidden md:block">
        <OptimizedImage
          src={heroImage}
          alt={heroAlt}
          fill
          priority
          className="object-cover object-top"
          quality={90}
          sizes="100vw"
        />
      </div>

      {/* Optional text overlay */}
      {(heroTitle || heroSubtitle) && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-3xl mx-auto">
            {heroTitle && (
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-widest mb-4 leading-tight">
                {heroTitle}
              </h1>
            )}
            {heroSubtitle && (
              <p className="text-base md:text-xl lg:text-2xl mb-8 max-w-2xl mx-auto opacity-90">
                {heroSubtitle}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}


