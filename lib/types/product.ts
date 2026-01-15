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
  "new-arrivals",
  "bestsellers",
  "featured",
  "sale",
  "women",
  "men"
] as const;

export const PRODUCT_STATUS = [
  "active",
  "draft",
  "archived",
  "out-of-stock"
] as const;

export type ProductCategory = typeof PRODUCT_CATEGORIES[number];
export type ProductSection = typeof PRODUCT_SECTIONS[number];
export type ProductStatus = typeof PRODUCT_STATUS[number];

export interface ProductFormData {
  name: string;
  category: ProductCategory;
  price: number;
  description: string;
  images: string[];
  status: ProductStatus;
  sections: ProductSection[];
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
