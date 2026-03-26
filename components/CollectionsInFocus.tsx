"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import OptimizedImage from "@/components/OptimizedImage";
import { useSiteContent } from "@/hooks/useSiteContent";

const DEFAULT_COLLECTIONS = [
  {
    id: 1,
    title: "TOTE",
    subtitle: "Elegant & Spacious",
    image: "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/Cordia%20Bag/Cordia%20Bag%20-%20Purple/02-04-2026--paulina06371.jpg",
    href: "/collections/tote",
  },
  {
    id: 2,
    title: "CLUTCH",
    subtitle: "Compact & Chic",
    image: "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/PRIZMA%20SLING(%20png%20)/PRIZMA%20SLING%20-%20Mocha%20Tan/09-10-2025--livia00776.jpg",
    href: "/collections/clutch",
  },
  {
    id: 3,
    title: "SLING",
    subtitle: "Light & Versatile",
    image: "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/Halo%20Mini/Halo%20Mini%20-%20Green/02-04-2026--paulina05791.jpg",
    href: "/collections/sling",
  },
];

interface CollectionItem {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  href: string;
}

function CollectionBanner({ collection }: { collection: CollectionItem }) {
  return (
    <Link href={collection.href} className="block">
      <div className="relative h-[600px] md:h-[800px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-sm overflow-hidden group cursor-pointer">
        {/* Actual Image */}
        <OptimizedImage
          src={collection.image}
          alt={`${collection.title} Collection`}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
          quality={85}
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
  const { getValue } = useSiteContent(["collections_focus"]);

  const sectionTitle = getValue("collections_focus", "title", "COLLECTIONS IN FOCUS");
  const sectionSubtitle = getValue("collections_focus", "subtitle", "Curated selections for every occasion");

  const collections: CollectionItem[] = [
    {
      id: 1,
      title: getValue("collections_focus", "collection_1_title", DEFAULT_COLLECTIONS[0].title),
      subtitle: getValue("collections_focus", "collection_1_subtitle", DEFAULT_COLLECTIONS[0].subtitle),
      image: getValue("collections_focus", "collection_1_image", DEFAULT_COLLECTIONS[0].image),
      href: getValue("collections_focus", "collection_1_link", DEFAULT_COLLECTIONS[0].href),
    },
    {
      id: 2,
      title: getValue("collections_focus", "collection_2_title", DEFAULT_COLLECTIONS[1].title),
      subtitle: getValue("collections_focus", "collection_2_subtitle", DEFAULT_COLLECTIONS[1].subtitle),
      image: getValue("collections_focus", "collection_2_image", DEFAULT_COLLECTIONS[1].image),
      href: getValue("collections_focus", "collection_2_link", DEFAULT_COLLECTIONS[1].href),
    },
    {
      id: 3,
      title: getValue("collections_focus", "collection_3_title", DEFAULT_COLLECTIONS[2].title),
      subtitle: getValue("collections_focus", "collection_3_subtitle", DEFAULT_COLLECTIONS[2].subtitle),
      image: getValue("collections_focus", "collection_3_image", DEFAULT_COLLECTIONS[2].image),
      href: getValue("collections_focus", "collection_3_link", DEFAULT_COLLECTIONS[2].href),
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-[#F8F8F8]">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="section-title mb-4">
            {sectionTitle}
          </h2>
          <p className="subtitle text-center">
            {sectionSubtitle}
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
