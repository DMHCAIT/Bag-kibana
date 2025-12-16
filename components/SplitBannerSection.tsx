"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function SplitBannerSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {/* Women Banner */}
          <Link href="/women" className="block">
            <div className="relative h-[500px] md:h-[700px] bg-gray-100 rounded-sm overflow-hidden group cursor-pointer">
              {/* Women Model Image */}
              <Image
                src="/women-model.png"
                alt="Women Collection"
                fill
                className="object-cover"
                priority
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-500" />

              {/* CTA Content - Bottom Left */}
              <div className="absolute bottom-8 left-8 space-y-4 z-10">
                <h3 className="font-serif text-3xl md:text-4xl tracking-[0.15em] text-white drop-shadow-lg">
                  WOMEN
                </h3>
                <Button
                  variant="outline"
                  className="bg-white text-black border-white hover:bg-black hover:text-white transition-all duration-300 uppercase tracking-wider text-xs px-6"
                >
                  Shop All Women
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          </Link>

          {/* Men Banner */}
          <Link href="/men" className="block">
            <div className="relative h-[500px] md:h-[700px] bg-gray-100 rounded-sm overflow-hidden group cursor-pointer">
              {/* Men Model Image */}
              <Image
                src="https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/men-icon.jpg"
                alt="Men Collection"
                fill
                className="object-cover"
                priority
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-500" />

              {/* CTA Content - Bottom Left */}
              <div className="absolute bottom-8 left-8 space-y-4 z-10">
                <h3 className="font-serif text-3xl md:text-4xl tracking-[0.15em] text-white drop-shadow-lg">
                  MEN
                </h3>
                <Button
                  variant="outline"
                  className="bg-white text-black border-white hover:bg-black hover:text-white transition-all duration-300 uppercase tracking-wider text-xs px-6"
                >
                  Shop All Men
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
