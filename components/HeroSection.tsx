"use client";

import React, { useState, useEffect, useCallback } from "react";
import OptimizedImage from "@/components/OptimizedImage";
import Link from "next/link";
import { useSiteContent } from "@/hooks/useSiteContent";

const DEFAULT_HERO_IMAGE = "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/HERO%20SECTION/KIBANA%20HOME%20PAGE.jpg%20(1).jpeg";
const DEFAULT_HERO_IMAGE_MOBILE = "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/HERO%20SECTION/Mobile%20size%20images.jpg.jpeg";

interface HeroSlide {
  desktop: string;
  mobile: string;
  alt: string;
  link?: string;
}

export default function HeroSection() {
  const { getValue } = useSiteContent(["hero_home"]);

  const heroImage = getValue("hero_home", "image_url", DEFAULT_HERO_IMAGE);
  const heroImageMobile = getValue("hero_home", "mobile_image_url", DEFAULT_HERO_IMAGE_MOBILE);
  const heroAlt = getValue("hero_home", "title", "") || "KibanaLife Collection";

  const slides: HeroSlide[] = [
    {
      desktop: heroImage,
      mobile: heroImageMobile,
      alt: heroAlt,
      link: "/shop",
    },
    {
      desktop: heroImage,
      mobile: heroImageMobile,
      alt: "KIBANA New Collection",
      link: "/women",
    },
  ];

  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = useCallback((index: number) => {
    if (index === current || isTransitioning) return;
    setIsTransitioning(true);
    setCurrent(index);
    setTimeout(() => setIsTransitioning(false), 700);
  }, [current, isTransitioning]);

  const nextSlide = useCallback(() => {
    goToSlide((current + 1) % slides.length);
  }, [current, slides.length, goToSlide]);

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="relative w-full bg-[#F0E6D4] overflow-hidden" style={{ height: 'calc(75svh - 64px)' }}>
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {slide.link ? (
            <Link href={slide.link} className="block w-full h-full">
              {/* Mobile Image */}
              <div className="absolute inset-0 md:hidden">
                <OptimizedImage
                  src={slide.mobile}
                  alt={slide.alt}
                  fill
                  priority={index === 0}
                  className="object-cover object-center"
                  quality={90}
                  sizes="100vw"
                />
              </div>
              {/* Desktop Image */}
              <div className="absolute inset-0 hidden md:block">
                <OptimizedImage
                  src={slide.desktop}
                  alt={slide.alt}
                  fill
                  priority={index === 0}
                  className="object-cover object-center"
                  quality={90}
                  sizes="100vw"
                />
              </div>
            </Link>
          ) : (
            <>
              <div className="absolute inset-0 md:hidden">
                <OptimizedImage
                  src={slide.mobile}
                  alt={slide.alt}
                  fill
                  priority={index === 0}
                  className="object-cover object-center"
                  quality={90}
                  sizes="100vw"
                />
              </div>
              <div className="absolute inset-0 hidden md:block">
                <OptimizedImage
                  src={slide.desktop}
                  alt={slide.alt}
                  fill
                  priority={index === 0}
                  className="object-cover object-center"
                  quality={90}
                  sizes="100vw"
                />
              </div>
            </>
          )}
        </div>
      ))}

      {/* Navigation Dots */}
      <div className="absolute bottom-2 right-2 md:bottom-3 md:right-4 z-20 flex items-center gap-1">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`rounded-full transition-all duration-300 ${
              index === current
                ? "w-2 h-0.5 md:w-3 md:h-1 bg-black/20"
                : "w-0.5 h-0.5 md:w-1 md:h-1 bg-black/10 hover:bg-black/20"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}


