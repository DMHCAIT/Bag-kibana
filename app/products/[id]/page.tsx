"use client";

import { useState, use, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Star, ChevronDown, ChevronUp, X, ChevronLeft, ChevronRight } from "lucide-react";
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

  // Safety check for product data
  if (!product || !product.images || product.images.length === 0) {
    return null;
  }

  return (
    <Card className="border-0 shadow-none group">
      <CardContent className="p-0 space-y-3">
        <Link href={`/products/${product.id}`}>
          <div className="relative aspect-3/4 bg-gray-100 rounded-sm overflow-hidden cursor-pointer">
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
          <p className="text-xs text-gray-500">Color: {product.color}</p>
          <Button
            onClick={handleAddToCart}
            disabled={isAdding}
            variant="outline"
            className="w-full uppercase tracking-wider text-xs py-5 hover:bg-black hover:text-white transition-all duration-300"
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
  
  // State
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity] = useState(1);
  const [showFeatures, setShowFeatures] = useState(true);
  const [showProductCare, setShowProductCare] = useState(false);
  const [showShipping, setShowShipping] = useState(false);
  const [showWarranty, setShowWarranty] = useState(false);
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Fetch product data with complete error handling
  useEffect(() => {
    let isMounted = true;

    async function fetchProduct() {
      if (!productId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch product with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const response = await fetch(`/api/products/${productId}`, {
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!isMounted) return;

        if (!response.ok) {
          console.error('Product fetch failed:', response.status);
          setProduct(null);
          setLoading(false);
          return;
        }

        const data = await response.json();

        if (!isMounted) return;

        if (data.product && data.product.images && Array.isArray(data.product.images)) {
          setProduct(data.product);
          
          // Fetch related products
          try {
            const relatedResponse = await fetch(`/api/products?limit=8`);
            if (relatedResponse.ok) {
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
            setRelatedProducts([]);
          }
        } else {
          console.error('Invalid product data received');
          setProduct(null);
        }
      } catch (err) {
        if (!isMounted) return;
        console.error('Error fetching product:', err);
        setProduct(null);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchProduct();

    return () => {
      isMounted = false;
    };
  }, [productId]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p>Loading product...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Product not found
  if (!product) {
    notFound();
  }

  // Safety checks
  if (!product.images || !Array.isArray(product.images) || product.images.length === 0) {
    console.error('Product has no valid images:', product.id);
    notFound();
  }

  // Keyboard navigation for modal
  useEffect(() => {
    if (!isModalOpen || !product || !product.images || product.images.length === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
      } else if (e.key === 'ArrowLeft') {
        setSelectedImage((prev) => prev === 0 ? product.images.length - 1 : prev - 1);
      } else if (e.key === 'ArrowRight') {
        setSelectedImage((prev) => prev === product.images.length - 1 ? 0 : prev + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, product]);

  const handleColorChange = async (colorIndex: number) => {
    if (!product.colors || !product.colors[colorIndex]) return;
    
    const selectedColorName = product.colors[colorIndex].name;

    try {
      const response = await fetch(`/api/products?search=${encodeURIComponent(product.name)}`);
      const data = await response.json();
      
      if (response.ok && data.products && Array.isArray(data.products)) {
        const colorVariant = data.products.find(
          (p: Product) => p.name === product.name && p.color === selectedColorName
        );

        if (colorVariant && colorVariant.id !== product.id) {
          router.push(`/products/${colorVariant.id}`);
        }
      }
    } catch (error) {
      console.error('Error finding color variant:', error);
    }
  };

  const handleAddToCart = () => {
    setIsAdding(true);
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setTimeout(() => setIsAdding(false), 2000);
  };

  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-12">
        {/* Product Section */}
        <div className="flex flex-col md:grid md:grid-cols-[1fr_1.2fr] gap-6 md:gap-16">
          {/* Left - Image Gallery */}
          <div className="space-y-4 md:space-y-4 order-1 md:order-0">
            {/* Desktop: Image Grid - 2x2 */}
            <div className="hidden md:grid grid-cols-2 gap-3">
              {product.images.slice(0, 4).map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedImage(idx);
                    setIsModalOpen(true);
                  }}
                  className={`relative aspect-square bg-gray-100 rounded-sm overflow-hidden border-2 transition-all hover:border-gray-300 group ${
                    selectedImage === idx ? "border-gray-300" : "border-transparent"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} - View ${idx + 1}`}
                    fill
                    priority={idx === 0}
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </button>
              ))}
            </div>

            {/* Mobile: Horizontal Scroll */}
            <div className="md:hidden space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Tap images to view full screen</p>
              </div>
              
              <div className="-mx-4 px-4">
                <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide scroll-smooth">
                  {product.images.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedImage(idx);
                        setIsModalOpen(true);
                      }}
                      className={`relative w-80 h-80 bg-gray-100 rounded-lg overflow-hidden border-2 transition-all shrink-0 snap-center ${
                        selectedImage === idx ? "border-gray-300 ring-2 ring-gray-200" : "border-gray-200"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} - View ${idx + 1}`}
                        fill
                        priority={idx === 0}
                        className="object-cover"
                        sizes="320px"
                      />
                      <div className="absolute top-3 right-3 bg-white bg-opacity-90 text-gray-800 text-sm px-3 py-1 rounded-full border border-gray-200">
                        {idx + 1}/{product.images.length}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-center gap-2 mt-4">
                {product.images.map((_: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      selectedImage === idx ? "bg-black" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right - All Product Info */}
          <div className="space-y-6 md:space-y-8 order-2 md:order-0">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif tracking-wide mb-3">
                {product.name} - {product.color}
              </h1>
              <p className="text-sm md:text-sm text-gray-600 uppercase tracking-wider mb-4">
                {product.category}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex gap-1">
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
                <span className="text-sm text-gray-600">{product.reviews} Reviews</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 mb-6 text-xs sm:text-xs">
                <span className="flex items-center gap-2">
                  Easy Returns (T&amp;C Applied)*
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="text-2xl md:text-3xl font-semibold mb-6">
              ₹{product.price.toLocaleString()}
              <span className="text-sm text-gray-500 font-normal ml-2">
                M.R.P (inclusive of all taxes)
              </span>
            </div>

            {/* Color Selection */}
            {product.colors && Array.isArray(product.colors) && product.colors.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-medium mb-4">Color: {product.color}</p>
                <div className="flex gap-2 flex-wrap">
                  {product.colors.map((color, idx: number) => {
                    // Clean color value (remove .jpg if present)
                    let colorValue = color.value;
                    if (colorValue.includes('.jpg')) {
                      const colorMap: {[key: string]: string} = {
                        '#006D77.jpg': '#006D77',
                        '#98D8C8.jpg': '#98D8C8',
                        '#B8D4E8.jpg': '#B8D4E8',
                        '#9B6B4F': '#9B6B4F'
                      };
                      colorValue = colorMap[colorValue] || '#9B6B4F';
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleColorChange(idx)}
                        className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-2 transition-all ${
                          color.name === product.color 
                            ? "border-black scale-110 ring-2 ring-black ring-opacity-20" 
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                        style={{ backgroundColor: colorValue }}
                        aria-label={color.name}
                        title={color.name}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Add to Cart Buttons */}
            <div className="space-y-4">
              <Button
                onClick={handleAddToCart}
                disabled={isAdding}
                variant="outline"
                size="lg"
                className="w-full uppercase tracking-wider text-sm py-4 md:py-6 hover:bg-black hover:text-white transition-all duration-300 border-black rounded-lg font-medium"
              >
                {isAdding ? "Added!" : "Add to Cart +"}
              </Button>
              <Button
                onClick={handleBuyNow}
                size="lg"
                className="w-full uppercase tracking-wider text-sm py-4 md:py-6 bg-black text-white hover:bg-gray-900 transition-all duration-300 rounded-lg font-medium"
              >
                Buy It Now
              </Button>
            </div>

            {/* Description */}
            <div className="pt-6 border-t border-gray-200">
              <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-4">
                {product.description.substring(0, 200)}...
              </p>
              <button className="text-sm font-medium hover:opacity-60 transition-opacity underline">
                Read More
              </button>
            </div>

            {/* Expandable Sections - Features */}
            <div className="border-t border-gray-200">
              <button
                onClick={() => setShowFeatures(!showFeatures)}
                className="w-full flex items-center justify-between py-6 text-left hover:bg-gray-50 px-2 -mx-2 rounded-lg transition-colors"
              >
                <span className="text-lg font-medium">Features</span>
                {showFeatures ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              {showFeatures && (
                <div className="pb-6 space-y-4 px-2 -mx-2">
                  <div className="border-l-2 border-black pl-4">
                    <span className="text-sm md:text-base font-medium">Material : </span>
                    <span className="text-sm md:text-base text-gray-600">{product.specifications.material}</span>
                  </div>
                  <div className="border-l-2 border-black pl-4">
                    <span className="text-sm md:text-base font-medium">Texture : </span>
                    <span className="text-sm md:text-base text-gray-600">{product.specifications.texture}</span>
                  </div>
                  <div className="border-l-2 border-black pl-4">
                    <span className="text-sm md:text-base font-medium">Closure Type : </span>
                    <span className="text-sm md:text-base text-gray-600">{product.specifications.closureType}</span>
                  </div>
                  <div className="border-l-2 border-black pl-4">
                    <span className="text-sm md:text-base font-medium">Hardware : </span>
                    <span className="text-sm md:text-base text-gray-600">{product.specifications.hardware}</span>
                  </div>
                  {product.specifications.compartments && Array.isArray(product.specifications.compartments) && product.specifications.compartments.length > 0 && (
                    <div className="border-l-2 border-black pl-4">
                      <span className="text-sm md:text-base font-medium">Compartments :</span>
                      <ul className="mt-3 space-y-2">
                        {product.specifications.compartments.map((comp: string, idx: number) => (
                          <li key={idx} className="text-sm md:text-base text-gray-600 ml-2 flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 shrink-0"></span>
                            {comp}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {product.specifications.shoulderDrop && (
                    <div className="border-l-2 border-black pl-4">
                      <span className="text-sm md:text-base font-medium">Shoulder Drop : </span>
                      <span className="text-sm md:text-base text-gray-600">{product.specifications.shoulderDrop}</span>
                    </div>
                  )}
                  {product.specifications.capacity && (
                    <div className="border-l-2 border-black pl-4">
                      <span className="text-sm md:text-base font-medium">Capacity : </span>
                      <span className="text-sm md:text-base text-gray-600">{product.specifications.capacity}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="border-t border-gray-200">
              <div className="py-6">
                <h3 className="text-lg font-medium mb-6">Product Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  {product.specifications.dimensions && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <span className="font-medium block mb-2 text-black">Dimensions :</span>
                      <p className="text-gray-600">{product.specifications.dimensions}</p>
                    </div>
                  )}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <span className="font-medium block mb-2 text-black">Material :</span>
                    <p className="text-gray-600">{product.specifications.material}</p>
                  </div>
                  <div>
                    <span className="font-medium">Colour :</span>
                    <p className="text-gray-600">{product.color}</p>
                  </div>
                  <div>
                    <span className="font-medium">Product Code :</span>
                    <p className="text-gray-600">{product.id}</p>
                  </div>
                  <div>
                    <span className="font-medium">Texture :</span>
                    <p className="text-gray-600">{product.specifications.texture}</p>
                  </div>
                  <div>
                    <span className="font-medium">Category :</span>
                    <p className="text-gray-600">{product.category}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  <span className="font-medium">Disclaimer:</span> Product color may slightly vary due
                  to photographic lighting, device screen settings, and natural variations in materials.
                </p>
              </div>
            </div>

            {/* Product Care */}
            <div className="border-t border-gray-200">
              <button
                onClick={() => setShowProductCare(!showProductCare)}
                className="w-full flex items-center justify-between py-6 text-left hover:bg-gray-50 px-2 -mx-2 rounded-lg transition-colors"
              >
                <span className="text-lg font-medium">Product Care</span>
                {showProductCare ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              {showProductCare && (
                <div className="pb-6 px-2 -mx-2">
                  <div className="bg-yellow-50 p-4 rounded-lg space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 shrink-0"></span>
                      <p className="text-sm md:text-base text-gray-700">Keep away from water and moisture</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 shrink-0"></span>
                      <p className="text-sm md:text-base text-gray-700">Clean with a soft, dry cloth</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 shrink-0"></span>
                      <p className="text-sm md:text-base text-gray-700">Store in a cool, dry place</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 shrink-0"></span>
                      <p className="text-sm md:text-base text-gray-700">Avoid direct sunlight for extended periods</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Shipping and Return */}
            <div className="border-t border-gray-200">
              <button
                onClick={() => setShowShipping(!showShipping)}
                className="w-full flex items-center justify-between py-6 text-left hover:bg-gray-50 px-2 -mx-2 rounded-lg transition-colors"
              >
                <span className="text-lg font-medium">Shipping And Return</span>
                {showShipping ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              {showShipping && (
                <div className="pb-6 px-2 -mx-2">
                  <div className="bg-green-50 p-4 rounded-lg space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 shrink-0"></span>
                      <p className="text-sm md:text-base text-gray-700">Free shipping on all orders</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 shrink-0"></span>
                      <p className="text-sm md:text-base text-gray-700">Delivery within 5-7 business days</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 shrink-0"></span>
                      <p className="text-sm md:text-base text-gray-700">Easy returns within 15 days</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 shrink-0"></span>
                      <p className="text-sm md:text-base text-gray-700">COD available</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Lifetime Service Warranty */}
            <div className="border-t border-gray-200">
              <button
                onClick={() => setShowWarranty(!showWarranty)}
                className="w-full flex items-center justify-between py-6 text-left hover:bg-gray-50 px-2 -mx-2 rounded-lg transition-colors"
              >
                <span className="text-lg font-medium">Lifetime Service Warranty</span>
                {showWarranty ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              {showWarranty && (
                <div className="pb-6 px-2 -mx-2">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                      We offer lifetime service warranty on all our products. Contact our customer
                      support for any repairs or maintenance needs.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Information */}
            <div className="border-t border-b border-gray-200">
              <button
                onClick={() => setShowAdditionalInfo(!showAdditionalInfo)}
                className="w-full flex items-center justify-between py-6 text-left hover:bg-gray-50 px-2 -mx-2 rounded-lg transition-colors"
              >
                <span className="text-lg font-medium">Additional Information</span>
                {showAdditionalInfo ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              {showAdditionalInfo && (
                <div className="pb-6 px-2 -mx-2">
                  <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                    <div>
                      <span className="font-medium text-black block mb-1">Manufactured & Packed By:</span>
                      <p className="text-sm md:text-base text-gray-600">Tulayan Impex Pvt. Ltd. (CIN: U51909WB1983PTC035748)</p>
                    </div>
                    <div>
                      <span className="font-medium text-black block mb-1">Address:</span>
                      <p className="text-sm md:text-base text-gray-600">17, Ballygunge Place, Kolkata- 700019, India</p>
                    </div>
                    <div>
                      <span className="font-medium text-black block mb-1">Customer Care Contact No:</span>
                      <p className="text-sm md:text-base text-gray-600">6292243788</p>
                    </div>
                    <div>
                      <span className="font-medium text-black block mb-1">Consumer Care Email ID:</span>
                      <p className="text-sm md:text-base text-gray-600">info@kibana.in</p>
                    </div>
                    <div>
                      <span className="font-medium text-black block mb-1">Country of Origin:</span>
                      <p className="text-sm md:text-base text-gray-600">INDIA</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Feature Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-16 py-12 border-y border-gray-200">
          <div className="text-center">
            <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-2xl md:text-3xl">📦</span>
            </div>
            <p className="text-xs md:text-sm uppercase tracking-wider leading-tight">Premium Leather</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-2xl md:text-3xl">🚚</span>
            </div>
            <p className="text-xs md:text-sm uppercase tracking-wider leading-tight">Free Shipping</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-2xl md:text-3xl">💰</span>
            </div>
            <p className="text-xs md:text-sm uppercase tracking-wider leading-tight">COD Available</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-2xl md:text-3xl">🛡️</span>
            </div>
            <p className="text-xs md:text-sm uppercase tracking-wider leading-tight">Lifetime Warranty</p>
          </div>
        </div>

        {/* You May Also Like */}
        {relatedProducts && Array.isArray(relatedProducts) && relatedProducts.length > 0 && (
          <div>
            <h2 className="font-serif text-3xl md:text-4xl tracking-[0.15em] text-center mb-8">
              YOU MAY ALSO LIKE
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {relatedProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Full-Screen Image Modal */}
      {isModalOpen && product && product.images && product.images.length > 0 && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="relative max-w-6xl max-h-full w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6 text-black" />
            </button>

            {/* Navigation Arrows */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage((prev) => prev === 0 ? product.images.length - 1 : prev - 1);
                  }}
                  className="absolute left-4 z-10 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-black" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage((prev) => prev === product.images.length - 1 ? 0 : prev + 1);
                  }}
                  className="absolute right-4 z-10 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
                >
                  <ChevronRight className="w-6 h-6 text-black" />
                </button>
              </>
            )}

            {/* Full-Screen Image */}
            <div className="relative w-full h-full max-w-4xl max-h-[90vh]">
              <Image
                src={product.images[selectedImage]}
                alt={`${product.name} - Full View ${selectedImage + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg">
              {selectedImage + 1} / {product.images.length}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
