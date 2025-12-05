"use client";

import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative w-full h-screen">
      {/* Christmas Promotional Image */}
      <Image
        src="https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/Artboard%203.jpg"
        alt="Santa's Favorite - Christmas Collection"
        fill
        priority
        className="object-cover"
        sizes="100vw"
        quality={95}
      />
    </section>
  );
}
