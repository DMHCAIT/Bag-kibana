"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSiteContent } from "@/hooks/useSiteContent";

export default function SplitBannerSection() {
  const { getValue } = useSiteContent(["split_banner"]);

  const womenImage = getValue("split_banner", "women_image", "/women-model.png");
  const womenTitle = getValue("split_banner", "women_title", "WOMEN");
  const womenCta = getValue("split_banner", "women_cta", "Shop All Women");
  const womenLink = getValue("split_banner", "women_link", "/women");

  const menImage = getValue("split_banner", "men_image", "/man-model-monochrome.png");
  const menTitle = getValue("split_banner", "men_title", "MEN");
  const menCta = getValue("split_banner", "men_cta", "Shop All Men");
  const menLink = getValue("split_banner", "men_link", "/men");

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {/* Women Banner */}
          <Link href={womenLink} className="block">
            <div className="relative h-[500px] md:h-[700px] bg-gray-100 rounded-sm overflow-hidden group cursor-pointer">
              <Image
                src={womenImage}
                alt={`${womenTitle} Collection`}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
              <div className="absolute bottom-8 left-8 space-y-4 z-10">
                <h3 className="font-serif text-3xl md:text-4xl tracking-[0.15em] text-white drop-shadow-lg">
                  {womenTitle}
                </h3>
                <Button
                  variant="outline"
                  className="bg-white text-black border-white hover:bg-black hover:text-white transition-all duration-300 uppercase tracking-wider text-xs px-6"
                >
                  {womenCta}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          </Link>

          {/* Men Banner */}
          <Link href={menLink} className="block">
            <div className="relative h-[500px] md:h-[700px] bg-gray-100 rounded-sm overflow-hidden group cursor-pointer">
              <Image
                src={menImage}
                alt={`${menTitle} Collection`}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
              <div className="absolute bottom-8 left-8 space-y-4 z-10">
                <h3 className="font-serif text-3xl md:text-4xl tracking-[0.15em] text-white drop-shadow-lg">
                  {menTitle}
                </h3>
                <Button
                  variant="outline"
                  className="bg-white text-black border-white hover:bg-black hover:text-white transition-all duration-300 uppercase tracking-wider text-xs px-6"
                >
                  {menCta}
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
