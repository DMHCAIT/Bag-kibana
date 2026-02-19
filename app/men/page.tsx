"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Product } from "@/lib/products-data";
import { useCart } from "@/contexts/CartContext";
import { useSiteContent } from "@/hooks/useSiteContent";

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
            <Image
              src={product.images[0]}
              alt={`${product.name} - ${product.color}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
          </div>
        </Link>

        {/* Product Info */}
        <div className="space-y-2 flex-1 flex flex-col">
          <Link href={`/products/${product.slug || product.id}`}>
            <h3 className="text-sm font-medium tracking-wide hover:opacity-60 transition-opacity line-clamp-2">
              {product.name} - {product.color}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
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
            <span className="text-xs text-gray-500">({product.reviews})</span>
          </div>

          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-black">₹{Math.round(product.price * 0.7).toLocaleString()}</p>
            <p className="text-xs text-gray-400 line-through">₹{product.price.toLocaleString()}</p>
            <span className="text-[10px] bg-black text-white px-1.5 py-0.5 rounded font-semibold">30% OFF</span>
          </div>

          {/* Color Swatches */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex gap-1.5 items-center flex-wrap">
              {product.colors.map((colorOption, idx) => {
                const colorSlug = colorOption.name.toLowerCase().replace(/\s+/g, '-');
                const productNameSlug = product.name.toLowerCase().replace(/\s+/g, '-');
                const colorVariantId = `${productNameSlug}-${colorSlug}`;
                const isCurrentColor = product.color.toLowerCase() === colorOption.name.toLowerCase();
                
                return (
                  <Link
                    key={idx}
                    href={`/products/${colorVariantId}`}
                    className="group relative"
                  >
                    {colorOption.image ? (
                      <div
                        className={`relative rounded-full overflow-hidden transition-all ${
                          isCurrentColor
                            ? 'ring-2 ring-black ring-offset-1'
                            : 'ring-1 ring-gray-300 hover:ring-2 hover:ring-gray-400'
                        }`}
                        style={{
                          width: '20px',
                          height: '20px',
                        }}
                      >
                        <Image
                          src={colorOption.image}
                          alt={colorOption.name}
                          fill
                          className="object-cover"
                          sizes="20px"
                        />
                      </div>
                    ) : (
                      <div
                        style={{
                          backgroundColor: colorOption.value,
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          border: isCurrentColor ? '2px solid black' : '1px solid #d1d5db',
                          boxShadow: isCurrentColor ? '0 0 0 2px white, 0 0 0 3px black' : 'none',
                        }}
                        className="hover:scale-110 transition-transform cursor-pointer"
                        title={colorOption.name}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          )}

          <Button
            onClick={handleAddToCart}
            disabled={isAdded}
            variant="outline"
            size="sm"
            className="w-full uppercase tracking-wider text-xs hover:bg-black hover:text-white transition-all mt-auto"
          >
            {isAdded ? "Added!" : "Add to Cart +"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function MenPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { getValue } = useSiteContent(["hero_men"]);

  const heroImage = getValue("hero_men", "image", "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/HERO%20SECTION/Men's%20page%20%20for%20kibana.jpg.jpeg");
  const pageTitle = getValue("hero_men", "page_title", "MEN'S COLLECTION");
  const pageDescription = getValue("hero_men", "page_description", "Discover our collection of premium bags designed for the modern gentleman");

  // Fetch products from API
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch('/api/products', {
          signal: controller.signal,
          next: { revalidate: 60 }
        });
        clearTimeout(timeoutId);
        
        const data = await response.json();
        
        if (response.ok && data.products) {
          // Filter for men's bags (SANDESH LAPTOP BAG and SANDESH TOTE)
          const mensProducts = data.products.filter((p: Product) => 
            p.name.includes('SANDESH') || p.category === 'LAPTOP BAG' || p.category === 'MEN'
          );
          setProducts(mensProducts);
        } else {
          setError('Failed to load products');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
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
            alt={pageTitle}
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-serif tracking-[0.15em] mb-4">
            {pageTitle}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {pageDescription}
          </p>
        </div>

        {/* Category Filter */}
        {!loading && !error && products.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-6 py-2 rounded-full uppercase text-sm tracking-wider transition-all ${
                selectedCategory === "all"
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Bags
            </button>
            {Array.from(new Set(products.map(p => p.category))).sort().map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full uppercase text-sm tracking-wider transition-all ${
                  selectedCategory === category
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
                <span className="ml-2 text-xs opacity-75">
                  ({products.filter(p => p.category === category).length})
                </span>
              </button>
            ))}
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
        ) : products.length === 0 ? (
          <div className="max-w-3xl mx-auto text-center py-16">
            <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <span className="text-5xl">👜</span>
            </div>
            <h2 className="text-3xl font-serif tracking-[0.15em] mb-6 text-gray-900">
              COMING SOON
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              We're crafting an exclusive collection of luxury bags for men.
            </p>
            <Link href="/women">
              <Button className="px-8 py-6 rounded-lg bg-black text-white hover:bg-gray-800 font-medium tracking-wider uppercase">
                Browse Women's Collection
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Products Count */}
            <div className="mb-6">
              <p className="text-sm text-gray-600">
                {selectedCategory === "all" 
                  ? `${products.length} products` 
                  : `${products.filter(p => p.category === selectedCategory).length} products in ${selectedCategory}`
                }
              </p>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {(selectedCategory === "all" 
                ? products 
                : products.filter(p => p.category === selectedCategory)
              ).map((product: Product) => (
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

