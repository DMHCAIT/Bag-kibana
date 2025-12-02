"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, ShoppingCart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/products-data";
import { useCart } from "@/contexts/CartContext";
import { useState, useEffect } from "react";

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
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
          </div>
        </Link>

        {/* Product Info */}
        <div className="space-y-3">
          <Link href={`/products/${product.id}`}>
            <h3 className="text-sm md:text-base font-medium tracking-wide hover:opacity-60 transition-opacity cursor-pointer">
              {product.name} - {product.color}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex gap-1">
            {[...Array(5)].map((_, idx) => (
              <Star
                key={idx}
                className={`w-4 h-4 ${
                  idx < product.rating
                    ? "fill-black stroke-black"
                    : "fill-none stroke-gray-300"
                }`}
              />
            ))}
          </div>

          <p className="text-sm md:text-base">₹{product.price.toLocaleString()}</p>

          {/* Color Swatches */}
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
                
                // Generate product ID for this color variant
                const colorSlug = colorOption.name.toLowerCase().replace(/\s+/g, '-');
                const productNameSlug = product.name.toLowerCase().replace(/\s+/g, '-');
                const colorVariantId = `${productNameSlug}-${colorSlug}`;
                const isCurrentColor = product.color.toLowerCase() === colorOption.name.toLowerCase();
                
                return (
                  <Link
                    key={idx}
                    href={`/products/${colorVariantId}`}
                    className={`w-7 h-7 rounded-full border-2 transition-all ring-1 ${
                      isCurrentColor 
                        ? 'border-black ring-black ring-2' 
                        : 'border-gray-300 hover:border-black ring-gray-200'
                    }`}
                    style={{ backgroundColor: colorValue }}
                    aria-label={`View ${colorOption.name} variant`}
                    title={colorOption.name}
                  />
                );
              })}
            </div>
          )}

          {/* Add to Cart */}
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

export default function BestsellersSection() {
  const [bestsellers, setBestsellers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    async function fetchBestsellers() {
      try {
        setLoading(true);
        const response = await fetch('/api/products/sections/bestsellers');
        const data = await response.json();

        if (!isMounted) return;

        if (response.ok && data.products) {
          // If section has products, use them. Otherwise, show top 4 products as fallback
          if (data.products.length > 0) {
            setBestsellers(data.products.slice(0, 4));
          } else {
            // Fallback: Fetch top 4 products
            const fallbackResponse = await fetch('/api/products?limit=4');
            const fallbackData = await fallbackResponse.json();
            if (isMounted && fallbackResponse.ok && fallbackData.products) {
              setBestsellers(fallbackData.products);
            }
          }
        }
      } catch (error) {
        if (!isMounted) return;
        console.error('Error fetching bestsellers:', error);
        // Fallback on error
        try {
          const fallbackResponse = await fetch('/api/products?limit=4');
          const fallbackData = await fallbackResponse.json();
          if (isMounted && fallbackResponse.ok && fallbackData.products) {
            setBestsellers(fallbackData.products);
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
    
    fetchBestsellers();
    
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="py-16 md:py-24 bg-[#F8F8F8]">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl tracking-[0.15em] mb-4 font-semibold" style={{fontFamily: 'var(--font-abhaya)'}}>
            BESTSELLERS
          </h2>
          <p className="text-sm md:text-base text-[#111111] tracking-wide" style={{fontFamily: 'var(--font-abhaya)'}}>
            Our most loved bags
          </p>
        </div>

        {/* Products */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
              <p>Loading bestsellers...</p>
            </div>
          </div>
        ) : bestsellers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No bestsellers available yet. Check back soon!</p>
          </div>
        ) : (
          <Tabs defaultValue="women" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
              <TabsTrigger
                value="women"
                className="uppercase tracking-wider text-sm data-[state=active]:bg-black data-[state=active]:text-white"
              >
                Women
              </TabsTrigger>
              <TabsTrigger
                value="men"
                className="uppercase tracking-wider text-sm data-[state=active]:bg-black data-[state=active]:text-white"
              >
                Men
              </TabsTrigger>
            </TabsList>

            <TabsContent value="women">
              {/* Mobile: 2-row horizontal scroll */}
              <div className="lg:hidden overflow-x-auto scrollbar-hide pb-4">
                <div className="grid grid-rows-2 grid-flow-col gap-4" style={{ gridAutoColumns: 'minmax(160px, 1fr)' }}>
                  {bestsellers.map((product) => (
                    <div key={product.id} className="w-[160px]">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Desktop: 4-column grid */}
              <div className="hidden lg:grid lg:grid-cols-4 gap-8">
                {bestsellers.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="men">
              {/* Coming Soon Design */}
              <div className="flex flex-col items-center justify-center py-20">
                <div className="text-center max-w-md mx-auto">
                  {/* Icon */}
                  <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <span className="text-4xl">👜</span>
                  </div>
                  
                  {/* Coming Soon Text */}
                  <h3 className="text-3xl md:text-4xl font-semibold mb-4 text-gray-900" style={{fontFamily: 'var(--font-outfit)'}}>
                    COMING SOON
                  </h3>
                  
                  <p className="text-gray-600 text-lg mb-8 leading-relaxed" style={{fontFamily: 'var(--font-outfit)'}}>
                    We're crafting an exclusive collection for men. 
                    <br />
                    Stay tuned for premium bags designed for the modern gentleman.
                  </p>
                  
                  {/* Notify Button */}
                  <Button 
                    variant="outline" 
                    className="px-8 py-3 rounded-full border-2 border-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300 text-gray-900 font-medium tracking-wider"
                    style={{fontFamily: 'var(--font-outfit)'}}
                  >
                    NOTIFY ME
                  </Button>
                  
                  {/* Decorative Elements */}
                  <div className="flex justify-center gap-2 mt-12">
                    {[0, 1, 2].map((idx) => (
                      <div
                        key={idx}
                        className={`w-2 h-2 rounded-full ${
                          idx === 1 ? "bg-gray-900" : "bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </section>
  );
}
