"use client";

import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Product } from "@/lib/products-data";
import Link from "next/link";
import OptimizedImage from "@/components/OptimizedImage";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

function ProductCard({ product, index }: { product: Product; index: number }) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [isVisible, setIsVisible] = useState(index < 8); // Load first 8 images immediately
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (index >= 8 && cardRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        { rootMargin: '50px' }
      );
      observer.observe(cardRef.current);
      return () => observer.disconnect();
    }
  }, [index]);

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product);
    setTimeout(() => setIsAdding(false), 1500);
  };

  return (
    <Card ref={cardRef} className="border-0 shadow-sm hover:shadow-md transition-shadow group h-full flex flex-col">
      <CardContent className="p-4 space-y-3 flex flex-col h-full">
        <Link href={`/products/${product.id}`}>
          <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden cursor-pointer">
            {isVisible && (
              <OptimizedImage
                src={product.images[0]}
                alt={`${product.name} - ${product.color}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                priority={index < 4}
              />
            )}
          </div>
        </Link>
        
        <div className="space-y-2 flex-1 flex flex-col">
          <Link href={`/products/${product.id}`}>
            <h3 className="text-sm font-medium tracking-wide hover:opacity-60 transition-opacity line-clamp-2">
              {product.name} - {product.color}
            </h3>
          </Link>
          
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
            <p className="text-sm font-semibold text-black">₹{Math.round(product.price * 0.8).toLocaleString()}</p>
            <p className="text-xs text-gray-400 line-through">₹{product.price.toLocaleString()}</p>
            <span className="text-[10px] bg-black text-white px-1.5 py-0.5 rounded font-semibold">20% OFF</span>
          </div>
          <p className="text-xs text-gray-500">{product.category}</p>
          
          {/* Color Swatches */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex gap-1.5 items-center flex-wrap">
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
                    className="group relative"
                  >
                    <div
                      style={{ 
                        backgroundColor: colorValue,
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        border: isCurrentColor ? '2px solid black' : '1px solid #d1d5db',
                        boxShadow: isCurrentColor ? '0 0 0 2px white, 0 0 0 3px black' : 'none',
                      }}
                      className="hover:scale-110 transition-transform cursor-pointer"
                      title={colorOption.name}
                    />
                  </Link>
                );
              })}
            </div>
          )}
          
          <Button
            onClick={handleAddToCart}
            disabled={isAdding}
            variant="outline"
            size="sm"
            className="w-full uppercase tracking-wider text-xs hover:bg-black hover:text-white transition-all mt-auto"
          >
            {isAdding ? "Added!" : "Add to Cart +"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AllProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        if (response.ok && data.products) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const categories = ["all", ...Array.from(new Set(products.map(p => p.category)))];
  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const productsByCategory = categories
    .filter(cat => cat !== "all")
    .map(category => ({
      category,
      products: products.filter(p => p.category === category)
    }));

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif tracking-[0.15em] mb-4">
            ALL PRODUCTS
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse our complete collection of {products.length} premium bags and accessories
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
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
              {category !== "all" && (
                <span className="ml-2 text-xs opacity-75">
                  ({products.filter(p => p.category === category).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        ) : selectedCategory === "all" ? (
          /* Show by category when "all" is selected */
          <div className="space-y-16">
            {productsByCategory.map(({ category, products: categoryProducts }) => (
              <div key={category}>
                <h2 className="text-2xl font-serif tracking-wider mb-6 pb-2 border-b border-gray-200">
                  {category}
                  <span className="text-sm text-gray-500 ml-3 font-sans">
                    ({categoryProducts.length} items)
                  </span>
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {categoryProducts.map((product, idx) => (
                    <ProductCard key={product.id} product={product} index={idx} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Show filtered products */
          <div>
            <h2 className="text-2xl font-serif tracking-wider mb-6">
              {selectedCategory}
              <span className="text-sm text-gray-500 ml-3 font-sans">
                ({filteredProducts.length} items)
              </span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product, idx) => (
                <ProductCard key={product.id} product={product} index={idx} />
              ))}
            </div>
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500">No products found in this category.</p>
          </div>
        )}

        {/* Summary Stats */}
        {!loading && selectedCategory === "all" && (
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 p-8 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-3xl font-bold text-black mb-2">{products.length}</div>
              <div className="text-sm text-gray-600 uppercase tracking-wider">Total Products</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-black mb-2">{categories.length - 1}</div>
              <div className="text-sm text-gray-600 uppercase tracking-wider">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-black mb-2">
                {Array.from(new Set(products.map(p => p.color))).length}
              </div>
              <div className="text-sm text-gray-600 uppercase tracking-wider">Colors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-black mb-2">100%</div>
              <div className="text-sm text-gray-600 uppercase tracking-wider">Available</div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

