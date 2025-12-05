"use client";

import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative w-full h-screen">
      {/* Desktop Christmas Image - Hidden on mobile */}
      <Image
        src="https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/Artboard%203.jpg"
        alt="Santa's Favorite - Christmas Collection"
        fill
        priority
        className="hidden md:block object-cover"
        sizes="100vw"
        quality={95}
      />

      {/* Mobile Christmas Image - Hidden on desktop */}
      <Image
        src="https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/Artboard%203.jpg"
        alt="Santa's Favorite - Christmas Collection"
        fill
        priority
        className="md:hidden object-cover object-center"
        sizes="100vw"
        quality={90}
      />
    </section>
  );
}
