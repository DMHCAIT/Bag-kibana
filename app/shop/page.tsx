"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ChevronDown, ShoppingCart, X, Filter } from "lucide-react";
import { Product } from "@/lib/products-data";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";

const makeSlug = (name: string, color: string) =>
  `${name}-${color}`
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="h-full">
      <Card className="border-0 shadow-none group h-full flex flex-col">
        <CardContent className="p-0 space-y-3 flex flex-col h-full">
          {/* Product Image */}
          <Link href={`/products/${product.slug || product.id}`}>
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
            <Link href={`/products/${product.slug || product.id}`}>
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

            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-black">₹{Math.round(product.price * 0.7).toLocaleString()}</p>
              <p className="text-xs text-gray-400 line-through">₹{product.price.toLocaleString()}</p>
              <span className="text-[10px] bg-black text-white px-1.5 py-0.5 rounded font-semibold">30% OFF</span>
            </div>

            {/* Color Swatches */}
            {product.colors && product.colors.length > 0 && (
              <div className="flex gap-1.5 items-center">
                {product.colors.map((colorOption) => {
                  const colorVariantId = makeSlug(product.name, colorOption.name);
                  const isCurrentColor = product.color.toLowerCase() === colorOption.name.toLowerCase();
                  
                  return (
                    <Link
                      key={colorOption.name}
                      href={`/products/${colorVariantId}`}
                      className={`relative rounded-full overflow-hidden ${
                        isCurrentColor ? 'ring-2 ring-black' : 'ring-1 ring-gray-300'
                      }`}
                      style={{
                        width: '24px',
                        height: '24px',
                        minWidth: '24px',
                        minHeight: '24px',
                      }}
                      aria-label={`View ${colorOption.name} variant`}
                      title={colorOption.name}
                    >
                      {colorOption.image ? (
                        <Image
                          src={colorOption.image}
                          alt={colorOption.name}
                          fill
                          className="object-cover"
                          sizes="24px"
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
        className={`flex items-center gap-2 px-4 py-2 border rounded-sm text-sm transition-colors ${
          value !== 'all' ? 'border-black bg-black text-white' : 'border-gray-300 hover:border-black'
        }`}
      >
        {label}
        {value !== 'all' && <span className="ml-1">•</span>}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-[180px]">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                onToggle();
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                value === option.value ? 'bg-gray-100 font-medium' : ''
              }`}
            >
              {option.label}
            </button>
          ))}
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
        {/* Category Links */}
        <div className="flex justify-center gap-6 mb-12">
          <Link href="/women">
            <button className="flex flex-col items-center gap-2 group">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden group-hover:scale-105 transition-transform relative">
                <Image
                  src="https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/women-icon.jpg"
                  alt="Women's Collection"
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <span className="text-xs font-medium">Shop Women</span>
            </button>
          </Link>
          <Link href="/men">
            <button className="flex flex-col items-center gap-2 group">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden group-hover:scale-105 transition-transform relative">
                <Image
                  src="https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/men-icon.jpg"
                  alt="Men's Collection"
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <span className="text-xs font-medium">Shop Men</span>
            </button>
          </Link>
        </div>

        {/* Mobile Filter Button */}
        <div className="md:hidden mb-4">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </Button>
        </div>

        {/* Filters and Sort Bar */}
        <div className={`${showMobileFilters ? 'block' : 'hidden'} md:flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-gray-200`}>
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
                className="flex items-center gap-1 px-4 py-2 text-sm text-gray-600 hover:text-black transition-colors"
              >
                <X className="w-4 h-4" />
                Clear all
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 mt-4 md:mt-0">
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

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm">
                {selectedCategory}
                <button onClick={() => setSelectedCategory('all')} className="hover:text-red-500">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {priceRange !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm">
                {priceOptions.find(o => o.value === priceRange)?.label}
                <button onClick={() => setPriceRange('all')} className="hover:text-red-500">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedColor !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm">
                {selectedColor}
                <button onClick={() => setSelectedColor('all')} className="hover:text-red-500">
                  <X className="w-3 h-3" />
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

