"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ChevronDown, ShoppingCart } from "lucide-react";
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
        <Link href={`/products/${product.id}`}>
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
          <Link href={`/products/${product.id}`}>
            <h3 className="text-sm font-medium tracking-wide hover:opacity-60 transition-opacity line-clamp-2">
              {product.name}
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

          <p className="text-sm font-medium">₹{product.price.toLocaleString()}</p>

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

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Filter products
  const filteredProducts = products.filter((product: Product) => {
    if (selectedCategory !== "all" && product.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-white">
      {loading ? (
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
              <p>Loading products...</p>
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      ) : (
      <>
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
        {/* Category Selection */}
        <div className="flex justify-center gap-8 mb-12">
          <Link href="/men">
            <button className="flex flex-col items-center gap-3 group">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-linear-to-br from-gray-700 to-gray-900 flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="text-white text-xs uppercase tracking-wider">Bag Icon</span>
              </div>
              <span className="text-sm font-medium">Shop Men</span>
            </button>
          </Link>
          <Link href="/women">
            <button className="flex flex-col items-center gap-3 group">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-linear-to-br from-pink-200 to-pink-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="text-white text-xs uppercase tracking-wider">Bag Icon</span>
              </div>
              <span className="text-sm font-medium">Shop Women</span>
            </button>
          </Link>
        </div>

        {/* Filters and Sort Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-gray-200">
          <div className="flex flex-wrap gap-4">
            <div className="relative">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-sm text-sm hover:border-black transition-colors">
                Gender
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            <div className="relative">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-sm text-sm hover:border-black transition-colors">
                Price
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            <div className="relative">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-sm text-sm hover:border-black transition-colors">
                Color
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            <div className="relative">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-sm text-sm hover:border-black transition-colors">
                Availability
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-sm text-sm hover:border-black transition-colors outline-none cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest</option>
              <option value="rating">Best Rating</option>
            </select>
            <span className="text-sm text-gray-600 ml-2">{filteredProducts.length} products</span>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {filteredProducts.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Load More */}
        {filteredProducts.length >= 8 && (
          <div className="flex justify-center mt-12">
            <Button
              variant="outline"
              className="px-8 py-6 uppercase tracking-wider text-sm hover:bg-black hover:text-white transition-all duration-300"
            >
              Load More Products
            </Button>
          </div>
        )}
      </div>
      </>
      )}
    </div>
  );
}
