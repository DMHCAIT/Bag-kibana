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
import { Product } from "@/lib/products-data";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";

function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <Card className="border-0 shadow-none group h-full flex flex-col">
      <CardContent className="p-0 space-y-3 flex flex-col h-full">
        {/* Product Image */}
        <Link href={`/products/${product.id}`}>
          <div className="relative w-full aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 rounded-sm overflow-hidden cursor-pointer">
            <Image
              src={product.images[0]}
              alt={`${product.name} - ${product.color}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
          </div>
        </Link>

        {/* Product Info */}
        <div className="space-y-2 flex-1 flex flex-col">
          <Link href={`/products/${product.id}`}>
            <h3 className="text-sm font-medium tracking-wide hover:opacity-60 transition-opacity cursor-pointer line-clamp-2">
              {product.name} - {product.color}
            </h3>
          </Link>
          <p className="text-sm font-medium">₹{product.price.toLocaleString()}</p>

          {/* Color Swatches - Clickable */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex gap-1 md:gap-1.5 items-center">
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
                
                // Generate product ID for this color variant
                const colorSlug = colorOption.name.toLowerCase().replace(/\s+/g, '-');
                const productNameSlug = product.name.toLowerCase().replace(/\s+/g, '-');
                const colorVariantId = `${productNameSlug}-${colorSlug}`;
                const isCurrentColor = product.color.toLowerCase() === colorOption.name.toLowerCase();
                
                return (
                  <Link
                    key={idx}
                    href={`/products/${colorVariantId}`}
                    className={`w-3 h-3 md:w-4 md:h-4 rounded-full border flex-shrink-0 transition-all ${
                      isCurrentColor 
                        ? 'border-black ring-1 ring-black' 
                        : 'border-gray-300 hover:border-black'
                    }`}
                    style={{ backgroundColor: colorValue }}
                    aria-label={`View ${colorOption.name} variant`}
                    title={colorOption.name}
                  />
                );
              })}
            </div>
          )}

          {/* Add to Cart Button */}
          <Button
            variant="outline"
            onClick={handleAddToCart}
            className="w-full uppercase tracking-wider text-xs py-4 hover:bg-black hover:text-white transition-all duration-300 mt-auto"
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
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    async function fetchNewArrivals() {
      try {
        setLoading(true);
        const response = await fetch('/api/products/sections/new-arrivals');
        const data = await response.json();

        if (!isMounted) return;

        if (response.ok && data.products) {
          // If section has products, use them. Otherwise, show latest 4 products as fallback
          if (data.products.length > 0) {
            setNewProducts(data.products);
          } else {
            // Fallback: Fetch latest 4 products
            const fallbackResponse = await fetch('/api/products?limit=4');
            const fallbackData = await fallbackResponse.json();
            if (isMounted && fallbackResponse.ok && fallbackData.products) {
              setNewProducts(fallbackData.products);
            }
          }
        }
      } catch (error) {
        if (!isMounted) return;
        console.error('Error fetching new arrivals:', error);
        // Fallback on error
        try {
          const fallbackResponse = await fetch('/api/products?limit=4');
          const fallbackData = await fallbackResponse.json();
          if (isMounted && fallbackResponse.ok && fallbackData.products) {
            setNewProducts(fallbackData.products);
          }
        } catch (fallbackError) {
          console.error('Fallback fetch failed:', fallbackError);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    
    fetchNewArrivals();
    
    return () => {
      isMounted = false;
    };
  }, []);

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

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
              <p>Loading new collection...</p>
            </div>
          </div>
        ) : newProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No new arrivals available yet. Check back soon!</p>
          </div>
        ) : (
          <>
            {/* Mobile: 2-row horizontal scroll */}
            <div className="lg:hidden overflow-x-auto scrollbar-hide pb-4">
              <div className="grid grid-rows-2 grid-flow-col gap-4 auto-cols-[180px]">
                {newProducts.map((product) => (
                  <div key={product.id} className="w-[180px]">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Desktop: Carousel with 4 items */}
            <div className="hidden lg:block">
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
                      className="pl-4 basis-1/4"
                    >
                      <ProductCard product={product} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="-left-4" />
                <CarouselNext className="-right-4" />
              </Carousel>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
