"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ShoppingCart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
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
    <Card className="border-0 shadow-sm hover:shadow-lg transition-shadow group">
      <CardContent className="p-0 space-y-4">
        {/* Product Image */}
        <Link href={`/products/${product.slug || product.id}`}>
          <div className="relative aspect-3/4 bg-linear-to-br from-gray-100 to-gray-200 rounded-sm overflow-hidden cursor-pointer">
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <p className="text-xs uppercase tracking-wider">{product.name}</p>
              </div>
            </div>
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
          </div>
        </Link>

        {/* Product Info */}
        <div className="p-4 space-y-3">
          <Link href={`/products/${product.slug || product.id}`}>
            <h3 className="text-sm md:text-base font-medium tracking-wide hover:opacity-60 transition-opacity cursor-pointer">
              {product.name} - {product.color}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? "fill-black text-black"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-600">
              ({product.reviews} reviews)
            </span>
          </div>

          <p className="text-sm md:text-base font-medium">
            ₹{product.price.toLocaleString()}
          </p>

          {/* Color Options */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex gap-2">
              {product.colors.map((colorOption, idx) => {
                const colorSlug = colorOption.name.toLowerCase().replace(/\s+/g, '-');
                const productNameSlug = product.name.toLowerCase().replace(/\s+/g, '-');
                const colorVariantId = `${productNameSlug}-${colorSlug}`;
                const isCurrentColor = product.color.toLowerCase() === colorOption.name.toLowerCase();
                
                return (
                  <Link
                    key={idx}
                    href={`/products/${colorVariantId}`}
                    className={`relative w-7 h-7 rounded-full overflow-hidden transition-all ${
                      isCurrentColor 
                        ? 'ring-2 ring-black ring-offset-2' 
                        : 'ring-1 ring-gray-300 hover:ring-black hover:ring-2'
                    }`}
                    aria-label={`View ${colorOption.name} variant`}
                    title={colorOption.name}
                  >
                    {colorOption.image ? (
                      <Image
                        src={colorOption.image}
                        alt={colorOption.name}
                        fill
                        className="object-cover"
                        sizes="28px"
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

export default function MenCollectionPage() {
  const [sortBy, setSortBy] = useState<string>("featured");
  const [menProducts, setMenProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products from API
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/products');
        const data = await response.json();
        
        if (response.ok && data.products) {
          // For men's collection, showing backpacks and messenger bags primarily
          const menItems = data.products.filter((p: Product) => 
            p.category === "Backpack" || 
            p.category === "Messenger Bag" ||
            p.category === "Briefcase" ||
            p.category === "backpack" ||
            p.category === "messenger"
          );
          setMenProducts(menItems);
        } else {
          setError(data.error || 'Failed to load products');
          setMenProducts([]);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again.');
        setMenProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const sortedProducts = [...menProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl tracking-[0.15em] mb-4">
            MEN&apos;S COLLECTION
          </h1>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Discover our curated selection of bags designed for the modern man. From backpacks to briefcases, elevate your everyday carry.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <p className="text-gray-600">Loading products...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Sort Bar */}
        <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-200">
          <p className="text-sm text-gray-600">
            {menProducts.length} {menProducts.length === 1 ? "Product" : "Products"}
          </p>
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm text-gray-600">
              Sort by:
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Empty State */}
        {menProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-600">No products found in this collection.</p>
            <p className="text-sm text-gray-500 mt-2">Check back soon for new arrivals!</p>
          </div>
        )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
