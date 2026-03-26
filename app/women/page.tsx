"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ShoppingCart } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Product } from "@/lib/products-data";
import { useCart } from "@/contexts/CartContext";
import { useSiteContent } from "@/hooks/useSiteContent";
import { formatPrice } from "@/lib/utils";

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group h-full">
      <Card className="border-0 shadow-md hover:shadow-2xl group h-full flex flex-col transition-all duration-500 rounded-xl overflow-hidden bg-white transform hover:-translate-y-2">
        <CardContent className="p-0 flex flex-col h-full">
          {/* Product Image - Shorter aspect ratio */}
          <Link href={`/products/${product.slug || product.id}`} className="relative">
            <div className="relative w-full aspect-square bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden cursor-pointer">
              <Image
                src={product.images[0]}
                alt={`${product.name} - ${product.color}`}
                fill
                className="object-cover p-4 transition-all duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              {/* Premium gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Eye-catching badges */}
              {product.sections?.includes('bestsellers') && (
                <div className="absolute top-3 right-3 bg-gray-900 text-white px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider shadow-lg" style={{fontFamily: 'var(--font-abhaya)'}}>
                  Best Seller
                </div>
              )}
              {product.sections?.includes('new-arrivals') && (
                <div className="absolute top-3 right-3 bg-gray-200 text-gray-900 px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider shadow-lg" style={{fontFamily: 'var(--font-abhaya)'}}>
                  New
                </div>
              )}

              {/* Quick View overlay - appears on hover */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white text-sm font-medium uppercase tracking-widest" style={{fontFamily: 'var(--font-abhaya)', letterSpacing: '0.15em'}}>
                  Quick View →
                </span>
              </div>
            </div>
          </Link>

          {/* Product Info - Compact */}
          <div className="space-y-2 flex-1 flex flex-col p-4 bg-white">
            {/* Product Name and Rating */}
            <div className="flex items-start justify-between gap-2">
              <Link href={`/products/${product.slug || product.id}`} className="flex-1 space-y-1">
                <h3 className="text-sm font-normal tracking-wider hover:text-gray-700 transition-colors line-clamp-2 uppercase leading-snug" style={{fontFamily: 'var(--font-abhaya)', letterSpacing: '0.08em', fontWeight: 400}}>
                  {product.name}
                </h3>
                <p className="text-xs text-gray-500 font-light" style={{fontFamily: 'var(--font-abhaya)'}}>
                  {product.color}
                </p>
              </Link>

              {/* Rating with stars - right side */}
              <div className="flex flex-col items-end gap-1 shrink-0">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, idx) => (
                    <Star
                      key={idx}
                      className={`w-3 h-3 ${
                        idx < Math.floor(product.rating)
                          ? "fill-black stroke-black"
                          : "fill-none stroke-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-600 font-medium" style={{fontFamily: 'var(--font-abhaya)'}}>
                  {product.rating} ({product.reviews})
                </span>
              </div>
            </div>

            {/* Price - More prominent */}
            <div className="flex items-center justify-between pt-1">
              <p className="text-2xl font-medium text-black" style={{fontFamily: 'var(--font-abhaya)', fontWeight: 500}}>
                {formatPrice(product.price)}
              </p>
            </div>

            {/* Color Swatches - Compact */}
            {product.colors && product.colors.length > 1 && (
              <div className="flex gap-1.5 items-center pt-1">
                {product.colors.slice(0, 4).map((colorOption, idx) => {
                  const colorSlug = colorOption.name.toLowerCase().replace(/\s+/g, '-');
                  const productNameSlug = product.name.toLowerCase().replace(/\s+/g, '-');
                  const colorVariantId = `${productNameSlug}-${colorSlug}`;
                  const isCurrentColor = product.color.toLowerCase() === colorOption.name.toLowerCase();
                  
                  return (
                    <Link
                      key={idx}
                      href={`/products/${colorVariantId}`}
                      className="group/color relative"
                      title={colorOption.name}
                    >
                      {colorOption.image ? (
                        <div
                          className={`relative rounded-full overflow-hidden transition-all duration-300 hover:scale-110 ${
                            isCurrentColor
                              ? 'ring-2 ring-black ring-offset-1 scale-110'
                              : 'ring-1 ring-gray-200 hover:ring-2 hover:ring-black'
                          }`}
                          style={{
                            width: '18px',
                            height: '18px',
                          }}
                        >
                          <Image
                            src={colorOption.image}
                            alt={colorOption.name}
                            fill
                            className="object-cover"
                            sizes="18px"
                          />
                        </div>
                      ) : (
                        <div
                          style={{ 
                            backgroundColor: colorOption.value,
                            width: '18px',
                            height: '18px',
                          }}
                          className={`rounded-full ${
                            isCurrentColor
                              ? 'ring-2 ring-black ring-offset-1 scale-110'
                              : 'ring-1 ring-gray-200 hover:ring-2 hover:ring-black'
                          } transition-all duration-300 hover:scale-110`}
                        />
                      )}
                    </Link>
                  );
                })}
                {product.colors.length > 4 && (
                  <span className="text-xs text-gray-400 ml-1" style={{fontFamily: 'var(--font-abhaya)'}}>
                    +{product.colors.length - 4}
                  </span>
                )}
              </div>
            )}

            {/* View Product Button - Compact and attractive */}
            <Link href={`/products/${product.slug || product.id}`} className="mt-auto pt-2">
              <Button
                className="w-full bg-black text-white hover:bg-gradient-to-r hover:from-gray-900 hover:to-black uppercase tracking-widest text-xs py-4 rounded-full transition-all duration-300 hover:shadow-xl font-medium group/btn"
                style={{fontFamily: 'var(--font-abhaya)', letterSpacing: '0.15em', fontWeight: 400}}
              >
                <span className="inline-flex items-center gap-2">
                  View Product
                  <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                </span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function WomenPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getValue } = useSiteContent(["hero_women", "women_categories"]);

  const heroImage = getValue("hero_women", "image_url", "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/HERO%20SECTION/Cover%20page%20.jpg%20(1).jpeg");

  // Build custom category cards from admin settings
  const useCustomCategories = getValue("women_categories", "enabled", "false") === "true";
  const customCategories = [];
  for (let i = 1; i <= 6; i++) {
    const label = getValue("women_categories", `cat_${i}_label`, "");
    if (label) {
      customCategories.push({
        label,
        image: getValue("women_categories", `cat_${i}_image`, ""),
        link: getValue("women_categories", `cat_${i}_link`, `/collections/${label.toLowerCase().replace(/\s+/g, '-')}`),
      });
    }
  }

  // Fetch products from API with timeout and fallback
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        
        // Race between API call and timeout for faster response
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout
        
        const response = await fetch('/api/products', {
          signal: controller.signal,
          next: { revalidate: 60 } // Cache for 60 seconds
        });
        clearTimeout(timeoutId);
        
        const data = await response.json();
        
        if (response.ok && data.products) {
          // Filter for women's products (all current products are for women)
          setProducts(data.products);
        } else {
          setError('Failed to load products');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        // On error, fallback to static products for better UX
        try {
          const { products: staticProducts } = await import('@/lib/products-data');
          setProducts(staticProducts);
          setError(null); // Clear error since we have fallback data
        } catch {
          setError('Failed to load products');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <div className="relative w-full overflow-hidden">
        <div className="relative w-full" style={{ aspectRatio: '1916/420' }}>
          <Image
            src={heroImage}
            alt="Women's Collection"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
        {/* Category Cards */}
        {useCustomCategories && customCategories.length > 0 ? (
          <div className="overflow-x-auto mb-12 -mx-4 px-4 md:mx-0 md:px-0">
            <div className="flex md:flex-wrap md:justify-center gap-4 md:gap-6 min-w-max md:min-w-0">
              {customCategories.map((cat, idx) => (
                <Link
                  key={idx}
                  href={cat.link}
                  className="group flex flex-col items-center flex-shrink-0"
                >
                  <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-gray-100 hover:shadow-xl transition-all duration-300 ring-2 ring-gray-200 hover:ring-black">
                    {cat.image ? (
                      <Image
                        src={cat.image}
                        alt={cat.label}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        sizes="(max-width: 768px) 64px, 80px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg font-semibold">
                        {cat.label.charAt(0)}
                      </div>
                    )}
                  </div>
                  <p className="mt-2 text-[10px] md:text-xs font-medium uppercase tracking-wider text-gray-800 group-hover:text-black transition-colors max-w-[64px] md:max-w-[80px] text-center leading-tight">
                    {cat.label}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        ) : !loading && !error && (
          <div className="overflow-x-auto mb-12 -mx-4 px-4 md:mx-0 md:px-0">
            <div className="flex md:flex-wrap md:justify-center gap-4 md:gap-6 min-w-max md:min-w-0">
              {(Array.from(new Set(products.map(p => p.category))) as string[])
                .filter((category: string) => category.toLowerCase() !== 'wallet')
                .sort()
                .map((category: string) => (
                <Link 
                  key={category} 
                  href={`/collections/${category.toLowerCase().replace(/\s+/g, '-')}`}
                  className="group flex flex-col items-center flex-shrink-0"
                >
                  <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-gray-100 hover:shadow-xl transition-all duration-300 ring-2 ring-gray-200 hover:ring-black">
                    {products.find(p => p.category === category)?.images[0] && (
                      <Image
                        src={products.find(p => p.category === category)!.images[0]}
                        alt={category}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        sizes="(max-width: 768px) 64px, 80px"
                      />
                    )}
                  </div>
                  <p className="mt-2 text-[10px] md:text-xs font-medium uppercase tracking-wider text-gray-800 group-hover:text-black transition-colors max-w-[64px] md:max-w-[80px] text-center leading-tight">
                    {category}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
              <p>Loading products...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        ) : (
          <>
            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {products.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}

