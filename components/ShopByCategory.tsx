"use client";

import Link from "next/link";
import Image from "next/image";

interface Category {
  name: string;
  slug: string;
  image: string;
}

const categories: Category[] = [
  {
    name: "TOTES",
    slug: "/collections/tote",
    image: "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/VISTARA%20TOTE%20(%20png%20)/VISTARA%20TOTE%20-%20Teal%20Blue/09-10-2025--livia00539.jpg",
  },
  {
    name: "CROSS BODY",
    slug: "/collections/sling",
    image: "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/PRIZMA%20SLING(%20png%20)/PRIZMA%20SLING%20-%20Teal%20Blue/09-10-2025--livia00834.jpg",
  },
  {
    name: "TOP HANDLES",
    slug: "/collections/handbags",
    image: "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/VISTARA%20TOTE%20(%20png%20)/VISTARA%20TOTE%20-%20Milky%20Blue/09-10-2025--livia00507.jpg",
  },
  {
    name: "MINI BAGS",
    slug: "/collections/sling",
    image: "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/Halo%20Mini/Halo%20Mini%20-%20Green/02-04-2026--paulina05791.jpg",
  },
];

export default function ShopByCategory() {
  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="text-xl md:text-2xl font-semibold tracking-widest text-gray-900 mb-8 md:mb-10 uppercase">
          NEW COLLECTION
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.slug}
              className="group block"
            >
              <div className="relative w-full aspect-3/4 overflow-hidden bg-gray-100">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
              <h3 className="mt-3 text-xs md:text-sm font-medium tracking-widest text-gray-900 uppercase">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
