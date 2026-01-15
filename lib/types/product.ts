export const PRODUCT_CATEGORIES = [
  "Tote Bag",
  "Crossbody Bag",
  "Shoulder Bag",
  "Clutch",
  "Backpack",
  "Satchel",
  "Hobo Bag",
  "Bucket Bag",
  "Wallet",
  "Other"
] as const;

export const PRODUCT_SECTIONS = [
  { id: "new-arrivals", name: "New Arrivals" },
  { id: "bestsellers", name: "Bestsellers" },
  { id: "featured", name: "Featured" },
  { id: "sale", name: "Sale" },
  { id: "women", name: "Women" },
  { id: "men", name: "Men" }
] as const;

export const PRODUCT_STATUS = [
  "active",
  "draft",
  "published",
  "archived",
  "out-of-stock"
] as const;

export type ProductCategory = typeof PRODUCT_CATEGORIES[number];
export type ProductSection = typeof PRODUCT_SECTIONS[number];
export type ProductStatus = typeof PRODUCT_STATUS[number];

export interface ProductFormData {
  name: string;
  category: ProductCategory;
  color?: string;
  price: number;
  salePrice?: number;
  stock?: number;
  rating?: number;
  reviews?: number;
  description: string;
  images: string[];
  status: ProductStatus;
  sections?: string[];
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  tags?: string[];
  isFeatured?: boolean;
  isNewArrival?: boolean;
  publishedAt?: string;
  specifications?: {
    material?: string;
    texture?: string;
    closureType?: string;
    hardware?: string;
    compartments?: string[];
    shoulderDrop?: string;
    capacity?: string;
    dimensions?: string;
    idealFor?: string;
  };
  features?: string[];
  colors?: Array<{
    name: string;
    value: string;
    image?: string;
    available: boolean;
  }>;
}
