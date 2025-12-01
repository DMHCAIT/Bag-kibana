// Complete Product Type System

export interface ProductColor {
  name: string;
  value: string; // Hex color or image URL
  available: boolean;
}

export interface ProductSpecifications {
  material: string;
  texture: string;
  closureType: string;
  hardware: string;
  compartments: string[];
  shoulderDrop?: string;
  capacity?: string;
  dimensions?: string;
  idealFor: string;
}

export interface ProductSection {
  id: string;
  name: string;
  slug: string;
  order: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  color: string;
  price: number;
  salePrice?: number;
  stock: number;
  rating: number;
  reviews: number;
  images: string[];
  description: string;
  specifications: ProductSpecifications;
  features: string[];
  colors: ProductColor[];
  
  // Section assignments
  sections: string[]; // Array of section IDs (e.g., ['homepage', 'bestsellers', 'new-arrivals'])
  
  // SEO & Metadata
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  tags?: string[];
  
  // Status & Dates
  status: 'draft' | 'published' | 'archived';
  isFeatured: boolean;
  isNewArrival: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface ProductFormData extends Omit<Product, 'id' | 'createdAt' | 'updatedAt'> {
  id?: string;
}

// Available sections where products can be displayed
export const PRODUCT_SECTIONS: ProductSection[] = [
  { id: 'homepage-hero', name: 'Homepage Hero', slug: 'homepage-hero', order: 1 },
  { id: 'bestsellers', name: 'Bestsellers', slug: 'bestsellers', order: 2 },
  { id: 'new-arrivals', name: 'New Arrivals', slug: 'new-arrivals', order: 3 },
  { id: 'featured', name: 'Featured Products', slug: 'featured', order: 4 },
  { id: 'trending', name: 'Trending Now', slug: 'trending', order: 5 },
  { id: 'sale', name: 'On Sale', slug: 'sale', order: 6 },
];

// Product categories
export const PRODUCT_CATEGORIES = [
  'Tote Bag',
  'Handbag',
  'Sling Bag',
  'Clutch',
  'Backpack',
  'Laptop Bag',
  'Wallet',
  'Accessories',
] as const;

export type ProductCategory = typeof PRODUCT_CATEGORIES[number];

// Product status options
export const PRODUCT_STATUS = ['draft', 'published', 'archived'] as const;
export type ProductStatus = typeof PRODUCT_STATUS[number];

