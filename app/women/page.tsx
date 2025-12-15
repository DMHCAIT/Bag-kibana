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
            <p className="text-sm font-semibold text-black">₹{Math.round(product.price * 0.5).toLocaleString()}</p>
            <p className="text-xs text-gray-400 line-through">₹{product.price.toLocaleString()}</p>
            <span className="text-[10px] bg-black text-white px-1.5 py-0.5 rounded font-semibold">50% OFF</span>
          </div>

          {/* Color Swatches */}
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
                    className="group relative"
                  >
                    {colorOption.image ? (
                      // Display color image
                      <div
                        className={`relative rounded-full overflow-hidden transition-all ${
                          isCurrentColor
                            ? 'ring-2 ring-black ring-offset-1'
                            : 'ring-1 ring-gray-300 hover:ring-2 hover:ring-gray-400'
                        }`}
                        style={{
                          width: '24px',
                          height: '24px',
                          minWidth: '24px',
                          minHeight: '24px',
                        }}
                      >
                        <Image
                          src={colorOption.image}
                          alt={colorOption.name}
                          fill
                          className="object-cover"
                          sizes="24px"
                        />
                      </div>
                    ) : (
                      // Fallback to color circle
                      <div
                        style={{ 
                          backgroundColor: colorOption.value.replace('.jpg', ''),
                          width: '16px',
                          height: '16px',
                          minWidth: '16px',
                          minHeight: '16px',
                          borderRadius: '50%',
                        }}
                        className={`${
                          isCurrentColor
                            ? 'ring-2 ring-black ring-offset-1'
                            : 'ring-1 ring-gray-300 hover:ring-2 hover:ring-gray-400'
                        } transition-all`}
                        aria-label={`View ${colorOption.name} variant`}
                        title={colorOption.name}
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
  );
}

export default function WomenPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

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
      
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-serif tracking-[0.15em] mb-4">
            WOMEN'S COLLECTION
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our curated collection of luxury handbags designed for the modern woman
          </p>
        </div>

        {/* Category Filter */}
        {!loading && !error && (
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

