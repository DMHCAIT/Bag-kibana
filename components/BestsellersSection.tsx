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
import { motion } from "framer-motion";

const makeSlug = (name: string, color: string) =>
  `${name}-${color}`
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay },
  viewport: { once: true, amount: 0.2 },
});

function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.25, ease: "easeOut" }} className="h-full">
      <Card className="border-0 shadow-none group h-full flex flex-col">
        <CardContent className="p-0 space-y-3 flex flex-col h-full">
          {/* Product Image */}
          <Link href={`/products/${product.slug || product.id}`}>
            <div className="relative w-full aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 rounded-sm overflow-hidden cursor-pointer">
              <Image
                src={product.images[0]}
                alt={`${product.name} - ${product.color}`}
                fill
                className="object-cover transition-opacity duration-300 group-hover:opacity-0"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
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

            {/* Rating */}
            <div className="flex gap-1">
              {[...Array(5)].map((_, idx) => (
                <Star
                  key={idx}
                  className={`w-3 h-3 ${
                    idx < product.rating ? "fill-black stroke-black" : "fill-none stroke-gray-300"
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-green-600">₹{Math.round(product.price * 0.75).toLocaleString()}</p>
              <p className="text-xs text-gray-400 line-through">₹{product.price.toLocaleString()}</p>
              <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-semibold">25% OFF</span>
            </div>

            {/* Color Swatches */}
            {product.colors && product.colors.length > 0 && (
              <div className="flex gap-1.5 items-center">
                {product.colors.map((colorOption) => {
                  const colorVariantId = makeSlug(product.name, colorOption.name);
                  const isCurrentColor = product.color.toLowerCase() === colorOption.name.toLowerCase();

                  return (
                    <Link
                      key={colorOption.name}
                      href={`/products/${colorVariantId}`}
                      className={`relative rounded-full overflow-hidden ${
                        isCurrentColor ? "ring-2 ring-black" : "ring-1 ring-gray-300"
                      }`}
                      style={{
                        width: "24px",
                        height: "24px",
                        minWidth: "24px",
                        minHeight: "24px",
                      }}
                      aria-label={`View ${colorOption.name} variant`}
                      title={colorOption.name}
                    >
                      {colorOption.image ? (
                        <img
                          src={colorOption.image}
                          alt={colorOption.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className="w-full h-full"
                          style={{ backgroundColor: colorOption.value.replace(/\.jpg$/i, "") }}
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Add to Cart */}
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
    </motion.div>
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
        // First, try to fetch products from placements
        const response = await fetch('/api/placements?section=bestsellers');
        const data = await response.json();

        if (!isMounted) return;

        if (response.ok && data.length > 0) {
          // Use products from placements
          setBestsellers(data.slice(0, 4));
        } else {
          // Fallback: Fetch top 4 products from regular products API
          const fallbackResponse = await fetch('/api/products?limit=4');
          const fallbackData = await fallbackResponse.json();
          if (isMounted && fallbackResponse.ok && fallbackData.products) {
            setBestsellers(fallbackData.products);
          }
        }
      } catch (error) {
        if (!isMounted) return;
        if (process.env.NODE_ENV === 'development') {
          console.error('Error fetching bestsellers:', error);
        }
        // Fallback on error
        try {
          const fallbackResponse = await fetch('/api/products?limit=4');
          const fallbackData = await fallbackResponse.json();
          if (isMounted && fallbackResponse.ok && fallbackData.products) {
            setBestsellers(fallbackData.products);
          }
        } catch (fallbackError) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Fallback fetch failed:', fallbackError);
          }
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
    <motion.section {...fadeUp(0)} className="py-16 md:py-24 bg-[#F8F8F8]">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div {...fadeUp(0.1)} className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl tracking-[0.15em] mb-4 font-semibold" style={{fontFamily: 'var(--font-abhaya)'}}>
            BESTSELLERS
          </h2>
          <p className="text-sm md:text-base text-[#111111] tracking-wide" style={{fontFamily: 'var(--font-abhaya)'}}>
            Our most loved bags
          </p>
        </motion.div>

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
                <div className="grid grid-rows-2 grid-flow-col gap-4 auto-cols-[180px]">
                  {bestsellers.map((product, idx) => (
                    <motion.div key={product.id} {...fadeUp(idx * 0.05)} className="w-[180px]">
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Desktop: 4-column grid */}
              <div className="hidden lg:grid lg:grid-cols-4 gap-8">
                {bestsellers.map((product, idx) => (
                <motion.div key={product.id} {...fadeUp(idx * 0.05)}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
              
              {/* View All Link */}
              <motion.div {...fadeUp(0.15)} className="flex justify-center mt-8">
                <Link 
                  href="/shop"
                  className="text-sm uppercase tracking-wider text-black hover:opacity-60 transition-opacity underline underline-offset-4"
                >
                  View All
                </Link>
              </motion.div>
          </TabsContent>

          <TabsContent value="men">
            {/* Coming Soon Design */}
            <motion.div {...fadeUp(0.1)} className="flex flex-col items-center justify-center py-20">
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
            </motion.div>
          </TabsContent>
        </Tabs>
        )}
      </div>
    </motion.section>
  );
}

