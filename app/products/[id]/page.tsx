"use client";

import { useState, use, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Star, ChevronDown, ChevronUp, X, Check } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@/lib/products-data";
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
        <Link href={`/products/${product.slug || product.id}`}>
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
          <Link href={`/products/${product.slug || product.id}`}>
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
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-black">₹{Math.round(product.price * 0.5).toLocaleString()}</p>
            <p className="text-xs text-gray-400 line-through">₹{product.price.toLocaleString()}</p>
            <span className="text-[10px] bg-black text-white px-1.5 py-0.5 rounded font-semibold">50% OFF</span>
          </div>
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
    <div className="border-b border-gray-200">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="font-medium text-gray-900">{title}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>
      {isOpen && (
        <div className="pb-4 text-gray-600">
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
  const router = useRouter();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

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

        let productData = data.product;
        
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

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <div className="flex-1">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
          {/* Back Button & Breadcrumb */}
          <div className="mb-6 md:mb-8">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-3 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <nav className="text-sm">
              <span className="text-gray-500">
                <Link href="/" className="hover:text-black">Home</Link>
                {" / "}
                <Link href="/shop" className="hover:text-black">Shop</Link>
                {" / "}
              </span>
              <span className="text-black">{product.name}</span>
            </nav>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
            {/* Product Images */}
            <div className="space-y-3 md:space-y-4">
              {/* Main Image - Swipeable */}
              <div className="relative">
                <div 
                  className="overflow-x-auto snap-x snap-mandatory scrollbar-hide image-scroll-container"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  onScroll={(e) => {
                    const container = e.currentTarget;
                    const scrollLeft = container.scrollLeft;
                    const containerWidth = container.clientWidth;
                    const newIndex = Math.round(scrollLeft / containerWidth);
                    if (newIndex !== selectedImage && newIndex >= 0 && newIndex < images.length) {
                      setSelectedImage(newIndex);
                    }
                  }}
                >
                  <div className="flex">
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
                  <div className="flex justify-center items-center gap-1.5 mt-3 py-2">
                    {images.map((_, index) => (
                      <span
                        key={index}
                        onClick={() => {
                          setSelectedImage(index);
                          const container = document.querySelector('.image-scroll-container');
                          if (container) {
                            container.scrollTo({
                              left: index * container.clientWidth,
                              behavior: 'smooth'
                            });
                          }
                        }}
                        className={`inline-block cursor-pointer transition-all duration-200 ${
                          selectedImage === index
                            ? "w-2 h-2 bg-black rounded-full"
                            : "w-1.5 h-1.5 bg-gray-400 rounded-full"
                        }`}
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
                  <div className="flex gap-2 md:gap-3 min-w-max">
                    {images.map((image, index) => (
                    <button
                        key={index}
                      onClick={() => {
                          setSelectedImage(index);
                          const container = document.querySelector('.image-scroll-container');
                          if (container) {
                            container.scrollTo({
                              left: index * container.clientWidth,
                              behavior: 'smooth'
                            });
                          }
                        }}
                        className={`relative aspect-square bg-gray-50 rounded-md overflow-hidden border-2 transition-all flex-shrink-0 ${
                          selectedImage === index
                            ? "border-black w-14 h-14 md:w-20 md:h-20"
                            : "border-transparent hover:border-gray-300 w-14 h-14 md:w-20 md:h-20"
                      }`}
                    >
                      <Image
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                        fill
                          className="object-contain p-1 md:p-2"
                          sizes="(max-width: 768px) 56px, 80px"
                      />
                    </button>
                  ))}
                </div>
              </div>
              )}
          </div>

            {/* Product Info */}
            <div className="space-y-4 md:space-y-6">
            <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl tracking-[0.1em] mb-2" style={{fontFamily: 'var(--font-abhaya)'}}>
                  {product.name}
              </h1>
                <p className="text-base md:text-lg text-gray-600">Color: {product.color}</p>
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
              <div className="py-3 md:py-4 border-y">
                <div className="flex items-center flex-wrap gap-2 md:gap-3">
                  <p className="text-2xl md:text-3xl font-medium text-black">₹{Math.round(product.price * 0.5).toLocaleString()}</p>
                  <p className="text-lg md:text-xl text-gray-400 line-through">₹{product.price.toLocaleString()}</p>
                  <span className="bg-black text-white px-2 py-1 rounded text-xs md:text-sm font-semibold">50% OFF</span>
                </div>
                <p className="text-xs md:text-sm text-gray-500 mt-1">Tax included. Shipping calculated at checkout.</p>
            </div>

              {/* Offer Banner - Single Line */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-2.5 md:p-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center flex-wrap gap-1 md:gap-1.5 text-[10px] md:text-xs">
                    <span className="font-semibold text-gray-900">Special Offers</span>
                    <span className="text-gray-400">|</span>
                    <span><strong className="text-black">50% OFF</strong> - Already applied!</span>
                    <span className="text-gray-400">|</span>
                    <span><strong>Free Shipping</strong> across India</span>
                  </div>
                </div>
              </div>

              {/* Available Colors */}
            {product.colors && product.colors.length > 0 ? (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Available Colors ({product.colors.length})</h3>
                  
                  {/* Color Swatches - Responsive Grid */}
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {product.colors.map((colorOption, index) => {
                      const baseName = product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                      const colorSlug = colorOption.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                      const productLink = `/products/${baseName}-${colorSlug}`;
                      const isCurrentColor = colorOption.name.toLowerCase().trim() === product.color.toLowerCase().trim();
                      
                      // Use color's image if available
                      const imageToShow = colorOption.image || null;
                      
                      return (
                        <Link
                          key={index}
                          href={productLink}
                          className={`group relative border-2 rounded-lg overflow-hidden transition-all flex-shrink-0 hover:shadow-md ${
                            isCurrentColor 
                              ? 'border-black ring-2 ring-black ring-offset-2' 
                              : 'border-gray-300 hover:border-black'
                          } ${!colorOption.available ? 'opacity-50 pointer-events-none' : ''}`}
                          title={colorOption.available ? colorOption.name : `${colorOption.name} - Currently unavailable`}
                        >
                          {/* Color Image or Fallback */}
                          <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 overflow-hidden bg-gray-50">
                            {imageToShow ? (
                              <Image
                                src={imageToShow}
                                alt={colorOption.name}
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, 112px"
                              />
                            ) : (
                              <div
                                className="w-full h-full flex items-center justify-center"
                                style={{ 
                                  backgroundColor: colorOption.value && colorOption.value !== '#000000' 
                                    ? colorOption.value 
                                    : '#f3f4f6' 
                                }}
                              >
                                <span className="text-xs font-medium text-gray-700 text-center px-2">
                                  {colorOption.name}
                                </span>
                              </div>
                            )}
                          </div>
                          {/* Color Name Label */}
                          <div className="absolute bottom-0 inset-x-0 bg-white/90 backdrop-blur-sm py-1 px-2">
                            <p className="text-[10px] font-medium text-center truncate">{colorOption.name}</p>
                          </div>
                          {/* Checkmark for current color */}
                          {isCurrentColor && (
                            <div className="absolute top-1 right-1 bg-black rounded-full p-1">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </Link>
                      );
                    })}
                </div>
                </div>
            ) : (
              <div>
                <p className="text-sm text-gray-500">Loading colors...</p>
              </div>
            )}

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
                    {product.specifications.texture && (
                      <div className="grid grid-cols-2 gap-2">
                        <dt className="text-gray-600">Texture:</dt>
                        <dd className="font-medium">{product.specifications.texture}</dd>
                  </div>
                )}
                    <div className="grid grid-cols-2 gap-2">
                      <dt className="text-gray-600">Closure:</dt>
                      <dd className="font-medium">{product.specifications.closureType}</dd>
                  </div>
                    {product.specifications.hardware && (
                      <div className="grid grid-cols-2 gap-2">
                        <dt className="text-gray-600">Hardware:</dt>
                        <dd className="font-medium">{product.specifications.hardware}</dd>
              </div>
            )}
                {product.specifications.dimensions && (
                      <div className="grid grid-cols-2 gap-2">
                        <dt className="text-gray-600">Dimensions:</dt>
                        <dd className="font-medium">{product.specifications.dimensions}</dd>
                  </div>
                )}
                    {product.specifications.shoulderDrop && (
                      <div className="grid grid-cols-2 gap-2">
                        <dt className="text-gray-600">Shoulder Drop:</dt>
                        <dd className="font-medium">{product.specifications.shoulderDrop}</dd>
          </div>
                    )}
                    {product.specifications.capacity && (
                      <div className="grid grid-cols-2 gap-2">
                        <dt className="text-gray-600">Capacity:</dt>
                        <dd className="font-medium">{product.specifications.capacity}</dd>
              </div>
            )}
                    {product.specifications.idealFor && (
                      <div className="grid grid-cols-2 gap-2">
                        <dt className="text-gray-600">Ideal For:</dt>
                        <dd className="font-medium">{product.specifications.idealFor}</dd>
          </div>
                    )}
                  </dl>
                </div>
              )}

              {/* Compartments */}
              {product.specifications?.compartments && product.specifications.compartments.length > 0 && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Compartments</h3>
                  <ul className="space-y-2">
                    {product.specifications.compartments.map((compartment, index) => (
                      <li key={index} className="flex items-center gap-2 text-gray-600">
                        <Check className="w-4 h-4 text-green-600" />
                        {compartment}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Features Accordion */}
              {product.features && product.features.length > 0 && (
                <div className="border-t pt-4">
                  <AccordionItem 
                    title="Features" 
                    isOpen={openSection === "features"}
                    onToggle={() => toggleSection("features")}
                  >
                    <ul className="space-y-2">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </AccordionItem>

                  <AccordionItem 
                    title="Product Care" 
                    isOpen={openSection === "care"}
                    onToggle={() => toggleSection("care")}
                  >
                    <ul className="space-y-2">
                      <li>• Keep away from direct sunlight</li>
                      <li>• Store in a dust bag when not in use</li>
                      <li>• Clean with a soft, dry cloth</li>
                      <li>• Avoid contact with water and oils</li>
                      <li>• Do not overload to maintain shape</li>
                    </ul>
                  </AccordionItem>

                  <AccordionItem 
                    title="Shipping & Returns" 
                    isOpen={openSection === "shipping"}
                    onToggle={() => toggleSection("shipping")}
                  >
                    <div className="space-y-3">
                      <p><strong>Delivery:</strong> 5-7 business days across India</p>
                      <p><strong>Returns:</strong> Easy 7-day returns for unused items</p>
                      <p><strong>Exchange:</strong> Free exchange within 7 days</p>
                  </div>
                  </AccordionItem>

                  <AccordionItem 
                    title="Warranty" 
                    isOpen={openSection === "warranty"}
                    onToggle={() => toggleSection("warranty")}
                  >
                    <div className="space-y-2">
                      <p>All KIBANA products come with a 6-month warranty against manufacturing defects.</p>
                      <p>The warranty does not cover normal wear and tear, misuse, or damage caused by improper handling.</p>
                  </div>
                  </AccordionItem>
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
