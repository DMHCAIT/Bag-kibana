"use client";

import { useState, use, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Star, ChevronDown, ChevronUp, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@/lib/products-data";
import { notFound } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";

function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product);
    setTimeout(() => setIsAdding(false), 1500);
  };

  if (!product || !product.images || product.images.length === 0) {
    return null;
  }

  return (
    <Card className="border-0 shadow-none group">
      <CardContent className="p-0 space-y-3">
        <Link href={`/products/${product.id}`}>
          <div className="relative aspect-[3/4] bg-gray-100 rounded-sm overflow-hidden cursor-pointer">
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
          <Button
            onClick={handleAddToCart}
            disabled={isAdding}
            variant="outline"
            className="w-full uppercase tracking-wider text-xs py-5"
          >
            {isAdding ? "Added!" : "Add to Cart +"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const productId = unwrappedParams.id;
  const { addToCart } = useCart();
  const router = useRouter();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity] = useState(1);
  const [showFeatures, setShowFeatures] = useState(true);
  const [showProductCare, setShowProductCare] = useState(false);
  const [showShipping, setShowShipping] = useState(false);
  const [showWarranty, setShowWarranty] = useState(false);
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    async function fetchProductData() {
      if (!productId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(`/api/products/${productId}`, {
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!isMounted) return;

        if (!response.ok) {
          if (response.status === 404) {
            notFound();
          return;
          }
          throw new Error(`Failed to fetch product: ${response.status}`);
        }

        const data = await response.json();

        if (!isMounted) return;

        if (!data.product || !data.product.images || !Array.isArray(data.product.images)) {
          throw new Error('Invalid product data received');
        }

        setProduct(data.product);
        
        try {
          const relatedController = new AbortController();
          const relatedTimeout = setTimeout(() => relatedController.abort(), 5000);
          
          const relatedResponse = await fetch('/api/products?limit=8', {
            signal: relatedController.signal,
          });
          
          clearTimeout(relatedTimeout);

          if (isMounted && relatedResponse.ok) {
            const relatedData = await relatedResponse.json();
            if (relatedData.products && Array.isArray(relatedData.products)) {
          const filtered = relatedData.products
                .filter((p: Product) => p.id !== productId && p.images && p.images.length > 0)
            .slice(0, 4);
          setRelatedProducts(filtered);
            }
          }
        } catch (err) {
          console.error('Error fetching related products:', err);
        }

      } catch (err: any) {
        if (!isMounted) return;
        
        if (err.name === 'AbortError') {
          setError('Request timed out. Please try again.');
        } else {
        console.error('Error fetching product:', err);
          setError(err.message || 'Failed to load product');
        }
      } finally {
        if (isMounted) {
        setLoading(false);
        }
      }
    }

    fetchProductData();

    return () => {
      isMounted = false;
    };
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;
    
    setIsAdding(true);
    addToCart(product, quantity);
    
    setTimeout(() => {
      setIsAdding(false);
    }, 2000);
  };

  const handleBuyNow = () => {
    if (!product) return;
    
    addToCart(product, quantity);
    router.push("/checkout");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Loading product...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <h2 className="text-2xl font-semibold mb-4">Product Not Found</h2>
            <p className="text-gray-600 mb-8">{error || 'The product you are looking for does not exist.'}</p>
            <Link href="/shop">
              <Button className="uppercase tracking-wider">
                Browse All Products
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const images = product.images || [];
  const currentImage = images[selectedImage] || images[0] || '';

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <div className="flex-1">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-8">
            <Link href="/" className="text-gray-500 hover:text-black">Home</Link>
            <span className="text-gray-300">/</span>
            <Link href="/shop" className="text-gray-500 hover:text-black">Shop</Link>
            <span className="text-gray-300">/</span>
            <span className="text-black">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image - Swipeable */}
              <div className="relative">
                <div 
                  className="overflow-x-auto snap-x snap-mandatory scrollbar-hide"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  <div className="flex gap-4">
                    {images.map((image, index) => (
                      <div
                        key={index}
                        className="relative aspect-[4/5] bg-gray-50 rounded-lg overflow-hidden cursor-zoom-in flex-shrink-0 w-full snap-center"
                  onClick={() => {
                          setSelectedImage(index);
                    setIsModalOpen(true);
                  }}
                >
                  <Image
                          src={image}
                          alt={`${product.name} - ${product.color} - View ${index + 1}`}
                          fill
                          priority={index === 0}
                          className="object-contain p-4"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Scroll Indicator Dots */}
                {images.length > 1 && (
                  <div className="flex justify-center gap-2 mt-4">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedImage(index);
                          const container = document.querySelector('.overflow-x-auto');
                          if (container) {
                            container.scrollTo({
                              left: index * container.clientWidth,
                              behavior: 'smooth'
                            });
                          }
                        }}
                        className={`h-2 rounded-full transition-all ${
                          selectedImage === index
                            ? "w-8 bg-black"
                            : "w-2 bg-gray-300 hover:bg-gray-400"
                        }`}
                        aria-label={`View image ${index + 1}`}
                      />
              ))}
            </div>
                )}
              </div>
              
              {/* Thumbnail Images - Horizontal Scroll */}
              {images.length > 1 && (
                <div 
                  className="overflow-x-auto scrollbar-hide pb-2"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  <div className="flex gap-3 min-w-max">
                    {images.map((image, index) => (
                    <button
                        key={index}
                      onClick={() => {
                          setSelectedImage(index);
                          const container = document.querySelector('.overflow-x-auto');
                          if (container) {
                            container.scrollTo({
                              left: index * container.clientWidth,
                              behavior: 'smooth'
                            });
                          }
                        }}
                        className={`relative aspect-square bg-gray-50 rounded-md overflow-hidden border-2 transition-all flex-shrink-0 ${
                          selectedImage === index
                            ? "border-black w-20 h-20"
                            : "border-transparent hover:border-gray-300 w-20 h-20"
                      }`}
                    >
                      <Image
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                        fill
                          className="object-contain p-2"
                          sizes="80px"
                      />
                    </button>
                  ))}
                </div>
              </div>
              )}
          </div>

            {/* Product Info */}
            <div className="space-y-6">
            <div>
                <h1 className="text-3xl md:text-4xl tracking-[0.1em] mb-2" style={{fontFamily: 'var(--font-abhaya)'}}>
                  {product.name}
              </h1>
                <p className="text-lg text-gray-600">Color: {product.color}</p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, idx) => (
                    <Star
                      key={idx}
                      className={`w-5 h-5 ${
                        idx < Math.floor(product.rating)
                          ? "fill-black stroke-black"
                          : "fill-none stroke-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviews} reviews)
                </span>
            </div>

            {/* Price */}
              <div className="py-4 border-y">
                <p className="text-3xl font-medium">₹{product.price.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-1">Tax included. Shipping calculated at checkout.</p>
              </div>

              {/* Actions */}
              <div className="space-y-3">
              <Button
                onClick={handleAddToCart}
                disabled={isAdding}
                  className="w-full uppercase tracking-wider py-6 bg-black text-white hover:bg-gray-800"
              >
                  {isAdding ? "Added to Cart!" : "Add to Cart"}
              </Button>
              <Button
                onClick={handleBuyNow}
                  variant="outline"
                  className="w-full uppercase tracking-wider py-6"
              >
                Buy It Now
              </Button>
            </div>

            {/* Description */}
                <div>
                <h3 className="text-lg font-medium mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

              {/* Specifications */}
              {product.specifications && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Specifications</h3>
                  <dl className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <dt className="text-gray-600">Material:</dt>
                      <dd className="font-medium">{product.specifications.material}</dd>
                  </div>
                    <div className="grid grid-cols-2 gap-2">
                      <dt className="text-gray-600">Closure:</dt>
                      <dd className="font-medium">{product.specifications.closureType}</dd>
                  </div>
                    {product.specifications.dimensions && (
                      <div className="grid grid-cols-2 gap-2">
                        <dt className="text-gray-600">Dimensions:</dt>
                        <dd className="font-medium">{product.specifications.dimensions}</dd>
              </div>
            )}
                  </dl>
                </div>
              )}
          </div>
        </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16 md:mt-24">
              <h2 className="text-3xl md:text-4xl tracking-[0.1em] mb-8 text-center" style={{fontFamily: 'var(--font-abhaya)'}}>
                You May Also Like
            </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
      </div>

      <Footer />

      {/* Image Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-white flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
            <button
              onClick={() => setIsModalOpen(false)}
            className="absolute top-4 right-4 text-black hover:text-gray-600 bg-white rounded-full p-2 shadow-lg"
            >
            <X className="w-6 h-6" />
            </button>
          <div className="relative max-w-5xl w-full h-[90vh]">
            {currentImage && (
              <Image
                src={currentImage}
                alt={`${product.name} - ${product.color}`}
                fill
                className="object-contain"
                sizes="90vw"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
