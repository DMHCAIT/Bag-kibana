"use client";

import Link from "next/link";
import Image from "next/image";

export default function WomenMenBanner() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="section-title mb-12">Women and Men</h2>
        
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-7xl mx-auto">
          {/* Women Section */}
          <Link
            href="/women"
            className="group relative overflow-hidden rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <div className="relative aspect-[4/5] bg-gray-100">
              <Image
                src="https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/HERO%20SECTION/KIBANA%20HOME%20PAGE.jpg%20(1).jpeg"
                alt="Women's Collection"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                <h3 className="text-white text-4xl md:text-5xl font-montserrat font-bold mb-6 tracking-wider">
                  WOMEN
                </h3>
                <button className="bg-white text-black px-8 py-3 btn-text hover:bg-black hover:text-white transition-colors duration-300 flex items-center gap-2">
                  SHOP ALL WOMEN
                  <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                </button>
              </div>
            </div>
          </Link>

          {/* Men Section */}
          <Link
            href="/men"
            className="group relative overflow-hidden rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <div className="relative aspect-[4/5] bg-gray-100">
              <Image
                src="https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/HERO%20SECTION/Mobile%20size%20images.jpg.jpeg"
                alt="Men's Collection"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                <h3 className="text-white text-4xl md:text-5xl font-montserrat font-bold mb-6 tracking-wider">
                  MEN
                </h3>
                <button className="bg-white text-black px-8 py-3 btn-text hover:bg-black hover:text-white transition-colors duration-300 flex items-center gap-2">
                  SHOP ALL MEN
                  <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                </button>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
