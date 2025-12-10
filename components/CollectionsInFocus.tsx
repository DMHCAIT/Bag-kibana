"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import Image from "next/image";

const collections = [
  {
    id: 1,
    title: "TOTE",
    subtitle: "Edit",
    image: "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/VISTARA%20TOTE%20(%20png%20)/VISTARA%20TOTE%20-%20Milky%20Blue/09-10-2025--livia00521.jpg",
    href: "/collections/tote",
  },
  {
    id: 2,
    title: "CLUTCH",
    subtitle: "Edit",
    image: "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/lekha%20wallet%20(%20clutch)%203/LEKHA%20WALLET%20-%20Teal%20Blue/09-10-2025--livia00974.jpg",
    href: "/collections/clutch",
  },
  {
    id: 3,
    title: "SLING",
    subtitle: "Edit",
    image: "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/collections/sling-collection-mocha.jpg",
    href: "/collections/sling",
  },
];

function CollectionBanner({ collection }: { collection: typeof collections[0] }) {
  return (
    <Link href={collection.href} className="block">
      <div className="relative h-[600px] md:h-[800px] bg-linear-to-br from-gray-100 to-gray-200 rounded-sm overflow-hidden group cursor-pointer">
        {/* Actual Image */}
        <Image
          src={collection.image}
          alt={`${collection.title} Collection`}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-20 group-hover:opacity-30 transition-opacity duration-500" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 md:pb-16 z-10">
          <div className="text-center space-y-4">
            <h3 className="text-4xl md:text-5xl tracking-[0.2em] text-white drop-shadow-lg" style={{fontFamily: 'var(--font-abhaya)'}}>
              {collection.title}
            </h3>
            <p className="text-sm md:text-base tracking-[0.15em] text-white drop-shadow-md" style={{fontFamily: 'var(--font-abhaya)'}}>
              {collection.subtitle}
            </p>
            <Button
              variant="outline"
              className="mt-4 uppercase tracking-wider text-xs px-6 bg-white text-black border-white hover:bg-black hover:text-white hover:border-black transition-all duration-300"
            >
              Explore
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function CollectionsInFocus() {
  return (
    <section className="py-16 md:py-24 bg-[#F8F8F8]">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl tracking-[0.15em] mb-4" style={{fontFamily: 'var(--font-abhaya)'}}>
            COLLECTIONS IN FOCUS
          </h2>
          <p className="text-sm md:text-base text-[#111111] tracking-wide" style={{fontFamily: 'var(--font-abhaya)'}}>
            Curated selections for every occasion
          </p>
        </div>

        {/* Three Column Grid */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {collections.map((collection) => (
            <CollectionBanner key={collection.id} collection={collection} />
          ))}
        </div>
      </div>
    </section>
  );
}
