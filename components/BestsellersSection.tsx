"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface CategoryCard {
  id: string;
  title: string;
  image: string;
  link: string;
}

const categories: CategoryCard[] = [
  {
    id: "tote-bags",
    title: "Tote Bag",
    image: "https://images.unsplash.com/photo-1594633313590-d3589796ded2?auto=format&fit=crop&w=600&h=800&q=80",
    link: "/shop?category=tote-bags"
  },
  {
    id: "sling-bags",
    title: "Sling Bags",
    image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=600&h=800&q=80",
    link: "/shop?category=sling-bags"
  },
  {
    id: "hand-bags",
    title: "Hand Bags",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&h=800&q=80",
    link: "/shop?category=hand-bags"
  },
  {
    id: "party-bags",
    title: "Party Bags",
    image: "https://images.unsplash.com/photo-1564422170194-896b89110ef8?auto=format&fit=crop&w=600&h=800&q=80",
    link: "/shop?category=party-bags"
  }
];

export default function BestsellersSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="section-title">
            BEST SELLERS
          </h2>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.link}
              className="group relative overflow-hidden bg-gray-50 rounded-lg hover:shadow-xl transition-all duration-300"
            >
              {/* Image Container */}
              <div className="relative w-full aspect-[3/4] overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>

              {/* Category Label */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold tracking-wide text-gray-900 group-hover:text-black transition-colors">
                    {category.title}
                  </h3>
                  <ArrowRight className="w-5 h-5 text-gray-900 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

