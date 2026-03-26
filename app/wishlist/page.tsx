"use client";

import { useState } from "react";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { Product } from "@/lib/products-data";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OptimizedImage from "@/components/OptimizedImage";
import Link from "next/link";
import { Heart, ShoppingCart, X } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [addingItems, setAddingItems] = useState<string[]>([]);

  const handleAddToCart = (product: Product) => {
    setAddingItems(prev => [...prev, product.id]);
    addToCart(product);
    setTimeout(() => {
      setAddingItems(prev => prev.filter(id => id !== product.id));
    }, 1500);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-light text-gray-900 tracking-tight">
              My Wishlist
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
            </p>
          </div>

          {/* Empty State */}
          {wishlistItems.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h2 className="text-xl font-light text-gray-900 mb-2">
                Your wishlist is empty
              </h2>
              <p className="text-gray-600 mb-6">
                Save your favorite items to easily find them later
              </p>
              <Link href="/shop">
                <Button className="bg-black text-white hover:bg-gray-800 px-8 py-4 rounded-none uppercase text-sm">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          ) : (
            /* Wishlist Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistItems.map((product) => (
                <div key={product.id} className="group relative">
                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-2 right-2 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                    aria-label="Remove from wishlist"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>

                  {/* Product Image */}
                  <Link href={`/products/${product.slug || product.id}`}>
                    <div className="relative aspect-[3/4] bg-[#F5F4F0] rounded-sm overflow-hidden mb-3 cursor-pointer">
                      <OptimizedImage
                        src={product.images[0]}
                        alt={`${product.name} - ${product.color}`}
                        fill
                        className="object-contain p-4 transition-opacity duration-300 group-hover:opacity-80"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    </div>
                  </Link>

                  {/* Product Details */}
                  <div className="space-y-2">
                    <Link href={`/products/${product.slug || product.id}`}>
                      <h3 className="text-sm font-medium text-gray-900 hover:opacity-60 transition-opacity">
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-500">{product.color}</p>
                    </Link>

                    {/* Price */}
                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-medium text-gray-900">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-xs text-gray-400 line-through">
                        {formatPrice(Math.round(product.price / 0.72))}
                      </span>
                      <span className="text-xs text-black font-medium">
                        28% OFF
                      </span>
                    </div>

                    {/* Add to Cart Button */}
                    <Button
                      onClick={() => handleAddToCart(product)}
                      disabled={addingItems.includes(product.id)}
                      className="w-full py-3 bg-black text-white hover:bg-gray-800 rounded-none text-xs uppercase tracking-wider mt-2"
                    >
                      {addingItems.includes(product.id) ? (
                        "Added to Cart"
                      ) : (
                        <>
                          <ShoppingCart className="w-3.5 h-3.5 mr-2" />
                          Add to Cart
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
