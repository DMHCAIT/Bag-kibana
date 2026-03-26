"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ChevronDown, X, Filter } from "lucide-react";
import { Product } from "@/lib/products-data";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { formatPrice } from "@/lib/utils";

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group h-full">
      <Card className="border-0 shadow-md hover:shadow-2xl group h-full flex flex-col transition-all duration-500 rounded-xl overflow-hidden bg-white transform hover:-translate-y-2">
        <CardContent className="p-0 flex flex-col h-full">
          {/* Product Image */}
          <Link href={`/products/${product.slug || product.id}`} className="relative">
            <div className="relative w-full aspect-square bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden cursor-pointer">
              <Image
                src={product.images[0]}
                alt={`${product.name} - ${product.color}`}
                fill
                className="object-cover p-4 transition-all duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              {/* Premium gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Eye-catching badges */}
              {product.sections?.includes('bestsellers') && (
                <div className="absolute top-3 right-3 bg-gray-900 text-white px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider shadow-lg">
                  Best Seller
                </div>
              )}
              {product.sections?.includes('new-arrivals') && (
                <div className="absolute top-3 right-3 bg-gray-200 text-gray-900 px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider shadow-lg">
                  New
                </div>
              )}

              {/* Quick View overlay - appears on hover */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white text-sm font-medium uppercase tracking-widest">
                  Quick View →
                </span>
              </div>
            </div>
          </Link>

          {/* Product Info - Compact */}
          <div className="space-y-2 flex-1 flex flex-col p-4 bg-white">
            {/* Product Name and Rating */}
            <div className="flex items-start justify-between gap-2">
              <Link href={`/products/${product.slug || product.id}`} className="flex-1 space-y-1">
                <h3 className="text-sm font-normal tracking-wider hover:text-gray-700 transition-colors line-clamp-2 uppercase leading-snug">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-500 font-light">
                  {product.color}
                </p>
              </Link>

              {/* Rating with stars - right side */}
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
                <span className="text-xs text-gray-600 font-medium">
                  {product.rating} ({product.reviews})
                </span>
              </div>
            </div>

            {/* Price - More prominent */}
            <div className="flex items-center justify-between pt-1">
              <p className="text-2xl font-medium text-black">
                {formatPrice(product.price)}
              </p>
            </div>

            {/* Color Swatches - Compact */}
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
                          <Image
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
                  <span className="text-xs text-gray-400 ml-1">
                    +{product.colors.length - 4}
                  </span>
                )}
              </div>
            )}

            {/* View Product Button - Compact and attractive */}
            <Link href={`/products/${product.slug || product.id}`} className="mt-auto pt-2">
              <Button
                className="w-full bg-black text-white hover:bg-gradient-to-r hover:from-gray-900 hover:to-black uppercase tracking-widest text-xs py-4 rounded-full transition-all duration-300 hover:shadow-xl font-medium group/btn"
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

// Filter Dropdown Component
function FilterDropdown({ 
  label, 
  options,
  value, 
  onChange,
  isOpen,
  onToggle 
}: { 
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="relative">
      <button 
        onClick={onToggle}
        className={`flex items-center gap-2 px-5 py-2.5 border-2 rounded-lg text-sm font-medium transition-all duration-300 ${
          value !== 'all' 
            ? 'border-black bg-black text-white shadow-md hover:shadow-lg' 
            : 'border-gray-200 bg-white hover:border-black hover:shadow-md'
        }`}
      >
        {label}
        {value !== 'all' && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-2xl z-50 min-w-[200px] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="py-2">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  onToggle();
                }}
                className={`w-full text-left px-5 py-3 text-sm font-medium hover:bg-gray-50 transition-colors ${
                  value === option.value ? 'bg-gray-100 text-black' : 'text-gray-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [selectedColor, setSelectedColor] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Fetch products from API (database only)
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/products');
        const data = await response.json();
        
        if (response.ok && data.products) {
          setProducts(data.products);
        } else {
          setError(data.error || 'Failed to load products');
          setProducts([]);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Get unique colors from products
  const availableColors = useMemo(() => {
    const colors = new Set<string>();
    products.forEach((p: Product) => {
      if (p.color) colors.add(p.color);
    });
    return Array.from(colors).sort();
  }, [products]);

  // Get unique categories from products
  const availableCategories = useMemo(() => {
    const categories = new Set<string>();
    products.forEach((p: Product) => {
      if (p.category) categories.add(p.category);
    });
    return Array.from(categories).sort();
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];
    
    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter((p: Product) => 
        p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    // Price range filter
    if (priceRange !== "all") {
      result = result.filter((p: Product) => {
        switch (priceRange) {
          case "under-1500":
            return p.price < 1500;
          case "1500-2500":
            return p.price >= 1500 && p.price <= 2500;
          case "2500-3500":
            return p.price >= 2500 && p.price <= 3500;
          case "above-3500":
            return p.price > 3500;
          default:
            return true;
        }
      });
    }
    
    // Color filter
    if (selectedColor !== "all") {
      result = result.filter((p: Product) => 
        p.color.toLowerCase() === selectedColor.toLowerCase()
      );
    }
    
    // Sorting
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result.sort((a, b) => {
          const dateA = (a as any).createdAt || '2025-01-01';
          const dateB = (b as any).createdAt || '2025-01-01';
          return new Date(dateB).getTime() - new Date(dateA).getTime();
        });
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Featured - keep original order
        break;
    }
    
    return result;
  }, [products, selectedCategory, priceRange, selectedColor, sortBy]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = () => setOpenFilter(null);
    if (openFilter) {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [openFilter]);

  // Count active filters
  const activeFiltersCount = [
    selectedCategory !== 'all',
    priceRange !== 'all',
    selectedColor !== 'all',
  ].filter(Boolean).length;

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory('all');
    setPriceRange('all');
    setSelectedColor('all');
    setSortBy('featured');
  };

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...availableCategories.map(cat => ({ value: cat, label: cat }))
  ];

  const priceOptions = [
    { value: 'all', label: 'All Prices' },
    { value: 'under-1500', label: 'Under ₹1,500' },
    { value: '1500-2500', label: '₹1,500 - ₹2,500' },
    { value: '2500-3500', label: '₹2,500 - ₹3,500' },
    { value: 'above-3500', label: 'Above ₹3,500' },
  ];

  const colorOptions = [
    { value: 'all', label: 'All Colors' },
    ...availableColors.map(color => ({ value: color, label: color }))
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
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
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
        {/* Category Links - Premium Design */}
        <div className="flex justify-center gap-8 md:gap-12 mb-16">
          <Link href="/women">
            <div className="flex flex-col items-center gap-3 group cursor-pointer">
              <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-110 ring-2 ring-gray-200 group-hover:ring-black">
                <Image
                  src="https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/Aurelia%20Fan%20Small/Aurelia%20Fan%20Small%20-%20Vine/04-02-2026-product%20shoot0337.jpg"
                  alt="Women's Collection"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="96px"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>
              <span className="text-sm font-medium uppercase tracking-wider group-hover:text-black transition-colors">Shop Women</span>
            </div>
          </Link>
          <Link href="/men">
            <div className="flex flex-col items-center gap-3 group cursor-pointer">
              <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-110 ring-2 ring-gray-200 group-hover:ring-black">
                <Image
                  src="https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/Laptop%20Bag/Laptop%20Bag%20-%20Brown/04-02-2026-product%20shoot0308.jpg"
                  alt="Men's Collection"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="96px"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>
              <span className="text-sm font-medium uppercase tracking-wider group-hover:text-black transition-colors">Shop Men</span>
            </div>
          </Link>
        </div>

        {/* Mobile Filter Button */}
        <div className="md:hidden mb-6">
          <Button 
            variant="outline" 
            className="w-full py-6 text-sm font-medium uppercase tracking-wider hover:bg-black hover:text-white transition-all duration-300 rounded-lg"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters {activeFiltersCount > 0 && <span className="ml-2 bg-black text-white px-2 py-0.5 rounded-full text-xs">{activeFiltersCount}</span>}
          </Button>
        </div>

        {/* Filters and Sort Bar - Modern Design */}
        <div className={`${showMobileFilters ? 'block' : 'hidden'} md:flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 pb-10 border-b-2 border-gray-100`}>
          <div className="flex flex-wrap gap-3" onClick={(e) => e.stopPropagation()}>
            {/* Category Filter */}
            <FilterDropdown
              label="Category"
              options={categoryOptions}
              value={selectedCategory}
              onChange={setSelectedCategory}
              isOpen={openFilter === 'category'}
              onToggle={() => setOpenFilter(openFilter === 'category' ? null : 'category')}
            />
            
            {/* Price Filter */}
            <FilterDropdown
              label="Price"
              options={priceOptions}
              value={priceRange}
              onChange={setPriceRange}
              isOpen={openFilter === 'price'}
              onToggle={() => setOpenFilter(openFilter === 'price' ? null : 'price')}
            />
            
            {/* Color Filter */}
            <FilterDropdown
              label="Color"
              options={colorOptions}
              value={selectedColor}
              onChange={setSelectedColor}
              isOpen={openFilter === 'color'}
              onToggle={() => setOpenFilter(openFilter === 'color' ? null : 'color')}
            />

            {/* Clear Filters */}
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-300 font-medium"
              >
                <X className="w-4 h-4" />
                Clear all
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 mt-4 md:mt-0 w-full md:w-auto">
            <span className="text-sm text-gray-600 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 md:flex-initial px-4 py-2.5 border-2 border-gray-200 rounded-lg text-sm hover:border-black transition-all duration-300 outline-none cursor-pointer bg-white font-medium"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest</option>
              <option value="rating">Best Rating</option>
            </select>
            <span className="text-sm font-semibold text-gray-900 ml-2 bg-gray-100 px-3 py-1.5 rounded-full">{filteredProducts.length} products</span>
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <span className="text-xs uppercase tracking-wider text-gray-500 font-medium py-2">Active Filters:</span>
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-black text-white rounded-full text-sm font-medium">
                {selectedCategory}
                <button onClick={() => setSelectedCategory('all')} className="hover:text-red-300 transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            {priceRange !== 'all' && (
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-black text-white rounded-full text-sm font-medium">
                {priceOptions.find(o => o.value === priceRange)?.label}
                <button onClick={() => setPriceRange('all')} className="hover:text-red-300 transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            {selectedColor !== 'all' && (
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-black text-white rounded-full text-sm font-medium">
                {selectedColor}
                <button onClick={() => setSelectedColor('all')} className="hover:text-red-300 transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
          </div>
        )}

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {filteredProducts.map((product: Product, idx) => (
              <div key={product.id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-4">No products found matching your filters.</p>
            <Button onClick={clearFilters} variant="outline">
              Clear Filters
            </Button>
          </div>
        )}

        {/* Load More */}
        {filteredProducts.length >= 12 && (
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
      )}
      <Footer />
    </div>
  );
}

