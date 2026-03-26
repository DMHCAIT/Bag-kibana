"use client";

import { useState, use, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Star, ChevronDown, ChevronUp, X, Check, Heart } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import OptimizedImage from "@/components/OptimizedImage";
import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@/lib/products-data";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { formatPrice } from "@/lib/utils";
import QuickCheckoutModal from "@/components/QuickCheckoutModal";

function ProductCard({ product }: { product: Product }) {
  if (!product || !product.images || product.images.length === 0) {
    return null;
  }

  return (
    <div className="group h-full">
      <Card className="border-0 shadow-md hover:shadow-2xl group h-full flex flex-col transition-all duration-500 rounded-xl overflow-hidden bg-white transform hover:-translate-y-2">
        <CardContent className="p-0 flex flex-col h-full">
          <Link href={`/products/${product.slug || product.id}`} className="relative">
            <div className="relative w-full aspect-square bg-linear-to-br from-gray-50 via-white to-gray-100 overflow-hidden cursor-pointer">
              <OptimizedImage
                src={product.images[0]}
                alt={`${product.name} - ${product.color}`}
                fill
                className="object-cover p-4 transition-all duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
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

              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white text-sm font-medium uppercase tracking-widest" style={{fontFamily: 'var(--font-abhaya)', letterSpacing: '0.15em'}}>
                  Quick View →
                </span>
              </div>
            </div>
          </Link>

          <div className="space-y-2 flex-1 flex flex-col p-4 bg-white">
            <div className="flex items-start justify-between gap-2">
              <Link href={`/products/${product.slug || product.id}`} className="flex-1 space-y-1">
                <h3 className="text-sm font-normal tracking-wider hover:text-gray-700 transition-colors line-clamp-2 uppercase leading-snug" style={{fontFamily: 'var(--font-abhaya)', letterSpacing: '0.08em', fontWeight: 400}}>
                  {product.name}
                </h3>
                <p className="text-xs text-gray-500 font-light" style={{fontFamily: 'var(--font-abhaya)'}}>
                  {product.color}
                </p>
              </Link>

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

            <div className="flex items-center justify-between pt-1">
              <p className="text-2xl font-medium text-black" style={{fontFamily: 'var(--font-abhaya)', fontWeight: 500}}>
                {formatPrice(product.price)}
              </p>
            </div>

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
                          <OptimizedImage
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

            <Link href={`/products/${product.slug || product.id}`} className="mt-auto pt-2">
              <Button
                className="w-full bg-black text-white hover:bg-linear-to-r hover:from-gray-900 hover:to-black uppercase tracking-widest text-xs py-4 rounded-full transition-all duration-300 hover:shadow-xl font-medium group/btn"
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

// Accordion Component
function AccordionItem({ 
  title, 
  children, 
  isOpen, 
  onToggle 
}: { 
  title: string; 
  children: React.ReactNode; 
  isOpen: boolean; 
  onToggle: () => void;
}) {
  return (
    <div className={`${
      isOpen 
        ? 'border border-gray-900 rounded-md overflow-hidden' 
        : 'border-b border-gray-200'
    }`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-4 text-left transition-colors hover:bg-gray-50"
      >
        <span className="font-medium text-sm text-gray-900">{title}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-600" />
        )}
      </button>
      {isOpen && (
        <div className="px-4 pb-5 bg-white">
          {children}
        </div>
      )}
    </div>
  );
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const productId = unwrappedParams.id;
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [quickCheckoutOpen, setQuickCheckoutOpen] = useState(false);

  const [pincode, setPincode] = useState("");
  const [pincodeChecked, setPincodeChecked] = useState(false);
  const [promoExpanded, setPromoExpanded] = useState(false);

  // Accordion states
  const [openSection, setOpenSection] = useState<string | null>("features");

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
            setError("Product not found");
            setLoading(false);
            return;
          }
          throw new Error(`Failed to fetch product: ${response.status}`);
        }

        const data = await response.json();

        if (!isMounted) return;

        if (!data.product || !data.product.images || !Array.isArray(data.product.images)) {
          throw new Error('Invalid product data received');
        }

        const productData = data.product;
        
        // Client-side fallback: If colors array is empty, generate from variants
        console.log(`📦 Product: ${productData.name} - Colors array:`, productData.colors);
        
        if (!productData.colors || productData.colors.length === 0) {
          console.log('⚠️ Colors array is empty, fetching variants...');
          try {
            const variantsResponse = await fetch(`/api/products?category=all&limit=100`);
            if (variantsResponse.ok) {
              const variantsData = await variantsResponse.json();
              console.log(`📦 Fetched ${variantsData.products?.length || 0} total products`);
              
              const sameNameProducts = variantsData.products?.filter(
                (p: Product) => p.name === productData.name
              ) || [];
              
              console.log(`🎨 Found ${sameNameProducts.length} variants for ${productData.name}:`, 
                sameNameProducts.map((p: Product) => p.color).join(', '));
              
              if (sameNameProducts.length > 0) {
                productData.colors = sameNameProducts.map((variant: Product) => ({
                  name: variant.color,
                  value: '#000000',
                  available: true,
                  // Use variant's image if it exists, otherwise use current product's first image
                  image: variant.images?.[0] || productData.images?.[0] || null
                }));
                console.log(`✅ Client-side: Generated ${productData.colors.length} colors for ${productData.name}`);
                console.log('🖼️ Colors with images:', productData.colors);
              } else {
                console.warn('❌ No variants found! Creating single color from current product');
                productData.colors = [{
                  name: productData.color,
                  value: '#000000',
                  available: true,
                  image: productData.images?.[0] || null
                }];
              }
            } else {
              console.error('❌ Failed to fetch variants:', variantsResponse.status);
            }
          } catch (err) {
            console.error('❌ Error generating colors from variants:', err);
            // Ultimate fallback: at least show current color
            productData.colors = [{
              name: productData.color,
              value: '#000000',
              available: true,
              image: productData.images?.[0] || null
            }];
          }
        } else {
          console.log(`✅ Product already has ${productData.colors.length} colors`);
        }
        
        setProduct(productData);
        
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

      } catch (err: unknown) {
        if (!isMounted) return;
        
        if (err instanceof Error && err.name === 'AbortError') {
          setError('Request timed out. Please try again.');
        } else {
        console.error('Error fetching product:', err);
          setError(err instanceof Error ? err.message : 'Failed to load product');
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
    setQuickCheckoutOpen(true);
  };

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
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

  // Product JSON-LD structured data
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.images || [],
    "description": product.description || `${product.name} in ${product.color} by KIBANA`,
    "sku": product.slug,
    "brand": {
      "@type": "Brand",
      "name": "KIBANA"
    },
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock",
      "url": `https://kibanalife.com/products/${product.slug}`,
      "seller": {
        "@type": "Organization",
        "name": "KIBANA"
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Product Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      
      <Header />
      
      <div className="flex-1">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-6 max-w-7xl">
          {/* Breadcrumb Only */}
          <div className="mb-6">
            <nav className="text-xs text-gray-500">
              <Link href="/" className="hover:text-black">Home</Link>
              {" / "}
              <Link href="/shop" className="hover:text-black">Shop</Link>
              {" / "}
              <span className="text-black">{product.name}</span>
            </nav>
          </div>

          {/* Mobile Thumbnails - Horizontal */}
          <div className="lg:hidden mb-4 overflow-x-auto scrollbar-hide">
            <div className="flex gap-3 min-w-max">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-16 h-16 rounded overflow-hidden border-2 transition-all shrink-0 bg-[#F5F4F0] ${
                    selectedImage === index
                      ? "border-black"
                      : "border-gray-200"
                  }`}
                >
                  <OptimizedImage
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-contain p-2"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* LEFT SIDE - Vertical Thumbnails */}
            <div className="hidden lg:flex flex-col gap-3 sticky top-6 self-start">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-20 h-20 rounded overflow-hidden border-2 transition-all shrink-0 bg-[#F5F4F0] ${
                    selectedImage === index
                      ? "border-black"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <OptimizedImage
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-contain p-2"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>

            {/* CENTER - Main Product Image */}
            <div className="flex-1 lg:max-w-xl">
              <div className="sticky top-6">
                <div
                  className="relative w-full rounded-lg overflow-hidden cursor-zoom-in bg-[#F5F4F0]"
                  style={{ aspectRatio: '3/4' }}
                  onClick={() => setIsModalOpen(true)}
                >
                  <OptimizedImage
                    src={images[selectedImage]}
                    alt={`${product.name} - ${product.color} - View ${selectedImage + 1}`}
                    fill
                    priority
                    className="object-contain p-8"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - PRODUCT DETAILS */}
            <div className="lg:w-100 shrink-0">
              {/* Title & Wishlist */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl font-light text-gray-900 tracking-tight leading-tight">
                    {product.name}
                  </h1>
                  <p className="text-sm text-gray-500 mt-1.5">{product.color}</p>
                </div>
                <button
                  onClick={() => toggleWishlist(product)}
                  className="p-2 hover:bg-gray-50 rounded-full transition-colors mt-1"
                  aria-label="Add to wishlist"
                >
                  <Heart
                    className={`w-5 h-5 transition-colors ${
                      isInWishlist(product.id) ? "fill-red-500 stroke-red-500" : "stroke-gray-400 hover:stroke-red-500"
                    }`}
                  />
                </button>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-5">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, idx) => (
                    <Star
                      key={idx}
                      className={`w-4 h-4 ${
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
              <div className="border-t border-gray-100 mt-5 pt-5">
                <div className="flex items-baseline gap-3">
                  <p className="text-3xl font-medium text-gray-900">{formatPrice(product.price)}</p>
                  <p className="text-base text-gray-400 line-through">
                    MRP {formatPrice(Math.round(product.price / 0.72))}
                  </p>
                  <span className="text-sm font-medium text-black">28% OFF</span>
                </div>
                <p className="text-xs text-gray-500 mt-1.5">Inclusive of all Taxes</p>
                <div className="mt-3">
                  <span className="inline-block bg-green-600 text-white px-3 py-1.5 rounded text-xs font-medium">
                    Flat 10% cashback up to ₹500
                  </span>
                </div>
              </div>

              {/* Available Colors */}
              {product.colors && product.colors.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Color</h3>
                  <div className="flex flex-wrap gap-4">
                    {product.colors.map((colorOption, index) => {
                      const baseName = product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                      const colorSlug = colorOption.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                      const productLink = `/products/${baseName}-${colorSlug}`;
                      const isCurrentColor = colorOption.name.toLowerCase().trim() === product.color.toLowerCase().trim();
                      const imageToShow = colorOption.image || null;
                      
                      return (
                        <Link
                          key={index}
                          href={productLink}
                          className="flex flex-col items-center gap-1.5 group"
                        >
                          <div className={`relative rounded-full overflow-hidden border-2 transition-all ${
                            isCurrentColor 
                              ? 'border-gray-900 shadow-md' 
                              : 'border-gray-200 hover:border-gray-400'
                          } ${!colorOption.available ? 'opacity-50 pointer-events-none' : ''}`}>
                            <div className="relative w-12 h-12 overflow-hidden bg-gray-50">
                              {imageToShow ? (
                                <OptimizedImage
                                  src={imageToShow}
                                  alt={`${product.name} - ${colorOption.name}`}
                                  fill
                                  className="object-contain p-1.5"
                                  sizes="48px"
                                  priority={isCurrentColor}
                                />
                              ) : (
                                <div
                                  className="w-full h-full"
                                  style={{ 
                                    backgroundColor: colorOption.value && colorOption.value !== '#000000' 
                                      ? colorOption.value 
                                      : '#e5e7eb' 
                                  }}
                                />
                              )}
                            </div>
                          </div>
                          <span className={`text-xs ${isCurrentColor ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                            {colorOption.name}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Quantity</h3>
                <div className="inline-flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2.5 hover:bg-gray-50 transition-colors text-gray-700"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <input
                    type="text"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      setQuantity(Math.max(1, Math.min(99, val)));
                    }}
                    className="w-14 text-center border-x border-gray-300 py-2.5 focus:outline-none text-sm"
                    aria-label="Quantity"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(99, quantity + 1))}
                    className="px-4 py-2.5 hover:bg-gray-50 transition-colors text-gray-700"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className="w-full py-6 bg-black text-white hover:bg-gray-800 font-normal text-sm uppercase tracking-wider rounded-none"
                >
                  {isAdding ? "Added to Cart" : "ADD TO CART"}
                </Button>
                <Button
                  onClick={handleBuyNow}
                  variant="outline"
                  className="w-full py-6 font-normal text-sm uppercase tracking-wider border-2 border-black hover:bg-gray-50 rounded-none"
                >
                  BUY IT NOW
                </Button>
              </div>

              {/* Promotional Offer */}
              <div className="mt-6 border border-gray-200 rounded-md overflow-hidden">
                <button
                  onClick={() => setPromoExpanded(!promoExpanded)}
                  className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm text-gray-900">
                    Buy any 2 items and get Extra 10% OFF
                  </span>
                  {promoExpanded ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </button>
                {promoExpanded && (
                  <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                    <p className="text-sm text-gray-600">
                      Add any 2 or more items to your cart and get an additional 10% discount automatically applied at checkout.
                    </p>
                  </div>
                )}
              </div>

              {/* Delivery Details */}
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Delivery Details</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter your Pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="flex-1 px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-black transition-colors"
                    maxLength={6}
                  />
                  <Button
                    onClick={() => {
                      if (pincode.length === 6) {
                        setPincodeChecked(true);
                      }
                    }}
                    className="px-6 py-2.5 bg-black text-white hover:bg-gray-800 rounded-md text-sm font-medium"
                  >
                    CHECK
                  </Button>
                </div>
                {pincodeChecked && pincode.length === 6 && (
                  <div className="flex items-center gap-2 text-sm text-green-600 mt-2">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>Delivery available for pincode {pincode}</span>
                  </div>
                )}
              </div>

              {/* Key Features */}
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Key Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-gray-600 shrink-0" />
                    <span className="text-sm text-gray-700">Fits 14&quot; Laptop</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-gray-600 shrink-0" />
                    <span className="text-sm text-gray-700">Secure Top Zipper Closure</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-gray-600 shrink-0" />
                    <span className="text-sm text-gray-700">Multiple Functional Pockets</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-gray-600 shrink-0" />
                    <span className="text-sm text-gray-700">Adjustable & Detachable Sling</span>
                  </div>
                </div>
              </div>

              {/* Product Details Accordion */}
              <div className="mt-8 border-t border-gray-100 pt-6">
                <AccordionItem 
                  title="Product Details" 
                  isOpen={openSection === "specifications"}
                  onToggle={() => toggleSection("specifications")}
                >
                  {product.specifications && (
                    <dl className="text-base">
                      {product.specifications.dimensions && (
                        <div className="grid grid-cols-[120px_1fr] gap-4 py-3 border-b border-gray-100 items-start">
                          <dt className="text-gray-600">Dimensions</dt>
                          <dd className="text-gray-900 font-medium text-left">{product.specifications.dimensions}</dd>
                        </div>
                      )}
                      {product.specifications.shoulderDrop && (
                        <div className="grid grid-cols-[120px_1fr] gap-4 py-3 border-b border-gray-100 items-start">
                          <dt className="text-gray-600">Handle Drop</dt>
                          <dd className="text-gray-900 font-medium text-left">{product.specifications.shoulderDrop}</dd>
                        </div>
                      )}
                      <div className="grid grid-cols-[120px_1fr] gap-4 py-3 border-b border-gray-100 items-start">
                        <dt className="text-gray-600">Material</dt>
                        <dd className="text-gray-900 font-medium text-left">{product.specifications.material}</dd>
                      </div>
                      <div className="grid grid-cols-[120px_1fr] gap-4 py-3 border-b border-gray-100 items-start">
                        <dt className="text-gray-600">Closure</dt>
                        <dd className="text-gray-900 font-medium text-left">{product.specifications.closureType}</dd>
                      </div>
                      {product.specifications.hardware && (
                        <div className="grid grid-cols-[120px_1fr] gap-4 py-3 items-start">
                          <dt className="text-gray-600">Hardware</dt>
                          <dd className="text-gray-900 font-medium text-left">{product.specifications.hardware}</dd>
                        </div>
                      )}
                    </dl>
                  )}
                </AccordionItem>
              </div>

              {/* Shipping & Returns Accordion */}
              <div className="mt-2">
                <AccordionItem 
                  title="Shipping & Returns" 
                  isOpen={openSection === "shipping"}
                  onToggle={() => toggleSection("shipping")}
                >
                  <div className="text-sm text-gray-700 space-y-3 leading-relaxed">
                    <p>• Free shipping on all orders above ₹999</p>
                    <p>• Easy returns within 30 days of delivery</p>
                    <p>• Products must be unused and in original packaging</p>
                  </div>
                </AccordionItem>
              </div>

          </div>
        </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-20">
              <div className="mb-8">
                <h2 className="text-2xl font-light tracking-tight text-gray-900">
                  You May Also Like
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}

        {/* Sticky Mobile Buy Bar */}
        {product && (
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40 px-3 py-3 safe-area-inset-bottom">
            <div className="flex items-center gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900 truncate">{product.name}</p>
                <p className="text-sm font-bold text-gray-900">{formatPrice(product.price)}</p>
              </div>
              <Button 
                onClick={handleAddToCart} 
                disabled={isAdding}
                className="px-4 py-2.5 text-xs bg-black text-white hover:bg-gray-800 font-medium rounded"
              >
                {isAdding ? "✓" : "Add"}
              </Button>
              <Button 
                onClick={handleBuyNow}
                variant="outline"
                className="px-4 py-2.5 text-xs border border-black font-medium rounded hover:bg-gray-50"
              >
                Buy
              </Button>
            </div>
          </div>
        )}
        </div>
      </div>

      <Footer />

      {/* Image Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setIsModalOpen(false)}
        >
          {/* Close Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(false);
            }}
            className="absolute top-4 right-4 text-white hover:text-gray-300 bg-black/50 rounded-full p-3 shadow-lg transition-colors z-10"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Image Counter */}
          <div className="absolute top-4 left-4 text-white bg-black/50 rounded-full px-4 py-2 text-sm font-medium z-10">
            {selectedImage + 1} / {images.length}
          </div>

          {/* Previous Button */}
          {images.length > 1 && selectedImage > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(selectedImage - 1);
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 bg-black/50 rounded-full p-3 shadow-lg transition-colors z-10"
              aria-label="Previous image"
            >
              <ChevronUp className="w-6 h-6 -rotate-90" />
            </button>
          )}

          {/* Next Button */}
          {images.length > 1 && selectedImage < images.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(selectedImage + 1);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 bg-black/50 rounded-full p-3 shadow-lg transition-colors z-10"
              aria-label="Next image"
            >
              <ChevronUp className="w-6 h-6 rotate-90" />
            </button>
          )}

          {/* Image Container */}
          <div 
            className="relative max-w-6xl w-full h-[90vh] px-16"
            onClick={(e) => e.stopPropagation()}
          >
            {currentImage && (
              <OptimizedImage
                src={currentImage}
                alt={`${product.name} - ${product.color} - View ${selectedImage + 1}`}
                fill
                className="object-contain"
                sizes="90vw"
                priority
              />
            )}
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 rounded-full px-4 py-3 z-10">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(idx);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === selectedImage ? "bg-white w-8" : "bg-white/50 hover:bg-white/80"
                  }`}
                  aria-label={`View image ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Quick Checkout Modal */}
      <QuickCheckoutModal
        isOpen={quickCheckoutOpen}
        onClose={() => setQuickCheckoutOpen(false)}
        buyNowProduct={product}
        buyNowQuantity={quantity}
      />
    </div>
  );
}
