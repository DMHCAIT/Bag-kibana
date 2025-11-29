"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { products, Product } from "@/lib/products-data";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { ShoppingCart } from "lucide-react";

// Get different product designs for New Collection - one from each major category
const newProducts = [
  products[0],  // VISTARA TOTE - Teal Blue (Index 0)
  products[4],  // PRIZMA SLING - Teal Blue (Index 4) 
  products[16], // SANDESH LAPTOP BAG - Milky Blue (Index 16)
  products[17]  // LEKHA WALLET - Milky Blue (Index 17)
].filter(Boolean); // Remove any undefined products

function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <Card className="border-0 shadow-none group">
      <CardContent className="p-0 space-y-4">
        {/* Product Image */}
        <Link href={`/products/${product.id}`}>
          <div className="relative aspect-3/4 bg-linear-to-br from-gray-100 to-gray-200 rounded-sm overflow-hidden cursor-pointer">
            <Image
              src={product.images[0]}
              alt={`${product.name} - ${product.color}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 45vw, 22vw"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
          </div>
        </Link>

        {/* Product Info */}
        <div className="space-y-3">
          <Link href={`/products/${product.id}`}>
            <h3 className="text-sm md:text-base font-medium tracking-wide hover:opacity-60 transition-opacity cursor-pointer" style={{fontFamily: 'var(--font-abhaya)'}}>
              {product.name} - {product.color}
            </h3>
          </Link>
          <p className="text-sm md:text-base" style={{fontFamily: 'var(--font-abhaya)'}}>₹{product.price.toLocaleString()}</p>

          {/* Color Options - Fixed color display */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex gap-2">
              {product.colors.map((colorOption, idx) => {
                // Fix color values that have .jpg extension
                let colorValue = colorOption.value;
                if (colorValue.includes('.jpg')) {
                  const colorMap: {[key: string]: string} = {
                    '#006D77.jpg': '#006D77',
                    '#98D8C8.jpg': '#98D8C8', 
                    '#B8D4E8.jpg': '#B8D4E8',
                    '#9B6B4F': '#9B6B4F'
                  };
                  colorValue = colorMap[colorValue] || '#9B6B4F';
                }
                
                return (
                  <button
                    key={idx}
                    className="w-7 h-7 rounded-full border-2 border-gray-300 hover:border-black transition-colors ring-1 ring-gray-200"
                    style={{ backgroundColor: colorValue }}
                    aria-label={colorOption.name}
                  />
                );
              })}
            </div>
          )}

          {/* Add to Cart Button */}
          <Button
            variant="outline"
            onClick={handleAddToCart}
            className="w-full uppercase tracking-wider text-xs py-5 hover:bg-black hover:text-white transition-all duration-300"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {isAdded ? "Added!" : "Add to Cart"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function NewCollectionCarousel() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl tracking-[0.15em] mb-4 font-semibold" style={{fontFamily: 'var(--font-abhaya)'}}>
            NEW COLLECTION
          </h2>
          <p className="text-sm md:text-base text-[#111111] tracking-wide" style={{fontFamily: 'var(--font-abhaya)'}}>
            Discover our latest exclusive designs
          </p>
        </div>

        {/* Carousel */}
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {newProducts.map((product) => (
              <CarouselItem
                key={product.id}
                className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
                <ProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-4" />
          <CarouselNext className="hidden md:flex -right-4" />
        </Carousel>

        {/* Dot Indicators - Mobile */}
        <div className="flex justify-center gap-2 mt-8 md:hidden">
          {[0, 1, 2].map((idx) => (
            <div
              key={idx}
              className={`w-2 h-2 rounded-full ${
                idx === 0 ? "bg-black" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
