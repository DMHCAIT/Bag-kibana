"use client";

import React from "react";
import OptimizedImage from "@/components/OptimizedImage";
import { useSiteContent } from "@/hooks/useSiteContent";
import Link from "next/link";

const DEFAULT_HERO_IMAGE = "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/HERO%20SECTION/KIBANA%20HOME%20PAGE.jpg%20(1).jpeg";

export default function HeroSection() {
  const { getValue } = useSiteContent(["hero_home"]);

  const heroImage = getValue("hero_home", "image_url", DEFAULT_HERO_IMAGE);
  const heroAlt = getValue("hero_home", "title", "") || "KibanaLife Collection";
  const heroTitle = getValue("hero_home", "title", "");
  const heroSubtitle = getValue("hero_home", "subtitle", "");
  const ctaText = getValue("hero_home", "cta_text", "");
  const ctaLink = getValue("hero_home", "cta_link", "/shop");

  return (
    <section className="relative w-full bg-black" style={{ height: 'calc(100svh - 64px)' }}>
      <div className="absolute inset-0">
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
      {(heroTitle || heroSubtitle || ctaText) && (
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
            {ctaText && (
              <Link
                href={ctaLink}
                className="inline-block bg-white text-black px-10 py-3 text-sm font-semibold tracking-widest hover:bg-black hover:text-white border border-white transition-all duration-300"
              >
                {ctaText}
              </Link>
            )}
          </div>
        </div>
      )}
    </section>
  );
}


