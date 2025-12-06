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
        <Link href={`/products/${product.slug || product.id}`}>
          <div className="relative w-full aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 rounded-sm overflow-hidden cursor-pointer">
            {/* First Image - always visible */}
            <Image
              src={product.images[0]}
              alt={`${product.name} - ${product.color}`}
              fill
              className="object-cover transition-opacity duration-300 group-hover:opacity-0"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            {/* Second Image - visible on hover */}
            {product.images[1] && (
              <Image
                src={product.images[1]}
                alt={`${product.name} - ${product.color} hover`}
                fill
                className="object-cover transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            )}
          </div>
        </Link>

        {/* Product Info */}
        <div className="space-y-2 flex-1 flex flex-col">
          <Link href={`/products/${product.slug || product.id}`}>
            <h3 className="text-sm font-medium tracking-wide hover:opacity-60 transition-opacity cursor-pointer line-clamp-2">
              {product.name} - {product.color}
            </h3>
          </Link>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-green-600">₹{Math.round(product.price * 0.75).toLocaleString()}</p>
            <p className="text-xs text-gray-400 line-through">₹{product.price.toLocaleString()}</p>
            <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-semibold">25% OFF</span>
          </div>

          {/* Color Swatches - Clickable */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex gap-1.5 items-center">
              {product.colors.map((colorOption, idx) => {
                // Generate product ID for this color variant
                const colorSlug = colorOption.name.toLowerCase().replace(/\s+/g, '-');
                const productNameSlug = product.name.toLowerCase().replace(/\s+/g, '-');
                const colorVariantId = `${productNameSlug}-${colorSlug}`;
                const isCurrentColor = product.color.toLowerCase() === colorOption.name.toLowerCase();
                
                return (
                  <Link
                    key={idx}
                    href={`/products/${colorVariantId}`}
                    className={`relative rounded-full overflow-hidden ${
                      isCurrentColor ? 'ring-2 ring-black' : 'ring-1 ring-gray-300'
                    }`}
                    style={{
                      width: '24px',
                      height: '24px',
                      minWidth: '24px',
                      minHeight: '24px',
                    }}
                    aria-label={`View ${colorOption.name} variant`}
                    title={colorOption.name}
                  >
                    {colorOption.image ? (
                      <Image
                        src={colorOption.image}
                        alt={colorOption.name}
                        fill
                        className="object-cover"
                        sizes="24px"
                      />
                    ) : (
                      <div
                        className="w-full h-full"
                        style={{ backgroundColor: colorOption.value.replace(/\.jpg$/i, '') }}
                      />
                    )}
                  </Link>
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
        // First, try to fetch products from placements
        const response = await fetch('/api/placements?section=new-collection');
        const data = await response.json();

        if (!isMounted) return;

        if (response.ok && data.length > 0) {
          // Use products from placements
          setNewProducts(data);
        } else {
          // Fallback: Fetch latest products from database
          const fallbackResponse = await fetch('/api/products?limit=8');
          const fallbackData = await fallbackResponse.json();
          if (isMounted && fallbackResponse.ok && fallbackData.products) {
            setNewProducts(fallbackData.products);
          }
        }
      } catch (error) {
        if (!isMounted) return;
        console.error('Error fetching new arrivals:', error);
        // Try to get any products
        try {
          const fallbackResponse = await fetch('/api/products?limit=8');
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
            
            {/* View All Link */}
            <div className="flex justify-center mt-8">
              <Link 
                href="/shop"
                className="text-sm uppercase tracking-wider text-black hover:opacity-60 transition-opacity underline underline-offset-4"
              >
                View All
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
