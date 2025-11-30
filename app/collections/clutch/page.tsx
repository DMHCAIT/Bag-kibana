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
    <Card className="border-0 shadow-none group">
      <CardContent className="p-0 space-y-3">
        <Link href={`/products/${product.id}`}>
          <div className="relative aspect-3/4 bg-linear-to-br from-gray-100 to-gray-200 rounded-sm overflow-hidden cursor-pointer">
            <Image
              src={product.images[0]}
              alt={`${product.name} - ${product.color}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
        </Link>
        <div className="space-y-2">
          <Link href={`/products/${product.id}`}>
            <h3 className="text-sm font-medium tracking-wide hover:opacity-60 transition-opacity">
              {product.name} - {product.color}
            </h3>
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, idx) => (
                <Star key={idx} className={`w-3 h-3 ${idx < Math.floor(product.rating) ? "fill-black stroke-black" : "fill-none stroke-gray-300"}`} />
              ))}
            </div>
            <span className="text-xs text-gray-500">({product.reviews})</span>
          </div>
          <p className="text-sm font-medium">₹{product.price.toLocaleString()}</p>
          <Button variant="outline" onClick={handleAddToCart} className="w-full uppercase tracking-wider text-xs py-5 hover:bg-black hover:text-white transition-all duration-300">
            <ShoppingCart className="w-4 h-4 mr-2" />
            {isAdded ? "Added!" : "Add to Cart"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ClutchPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        if (response.ok && data.products) {
          const clutches = data.products.filter((p: Product) => p.category?.toLowerCase().includes('clutch'));
          setProducts(clutches);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12">
        <h1 className="text-4xl md:text-5xl font-serif tracking-[0.15em] text-center mb-4">CLUTCHES</h1>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">Elegant clutches perfect for special occasions</p>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

