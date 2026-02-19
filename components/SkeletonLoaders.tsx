'use client';

/**
 * Skeleton Components for Loading States
 * Uses Tailwind animate-pulse for smooth loading animations
 */

// Product Skeleton - for single product card
export function ProductSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-3/4 rounded-sm bg-gray-200" />
      
      {/* Title skeleton */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
      </div>
      
      {/* Price skeleton */}
      <div className="h-4 bg-gray-200 rounded w-1/4" />
      
      {/* Button skeleton */}
      <div className="h-10 bg-gray-200 rounded" />
    </div>
  );
}

// Product Grid Skeleton - for grid of products
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}

// List Item Skeleton - for sidebar, filters, etc
export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center space-x-3 animate-pulse">
          {/* Checkbox skeleton */}
          <div className="w-4 h-4 bg-gray-200 rounded" />
          {/* Text skeleton */}
          <div className="flex-1">
            <div className="h-3 bg-gray-200 rounded w-3/4" />
          </div>
          {/* Count skeleton */}
          <div className="h-3 bg-gray-200 rounded w-8" />
        </div>
      ))}
    </div>
  );
}

// Header Skeleton
export function HeaderSkeleton() {
  return (
    <div className="h-16 bg-gray-200 rounded animate-pulse" />
  );
}

// Banner Skeleton
export function BannerSkeleton() {
  return (
    <div className="h-96 bg-gray-200 rounded animate-pulse" />
  );
}

// Collection Card Skeleton
export function CollectionCardSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-square rounded-lg bg-gray-200" />
      
      {/* Title skeleton */}
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      
      {/* Description skeleton */}
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-4/5" />
      </div>
    </div>
  );
}

// Checkout Form Skeleton
export function CheckoutFormSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Form group 1 */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/4" />
        <div className="h-10 bg-gray-200 rounded" />
      </div>
      
      {/* Form group 2 */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/4" />
        <div className="h-10 bg-gray-200 rounded" />
      </div>
      
      {/* Form group 3 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-10 bg-gray-200 rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-10 bg-gray-200 rounded" />
        </div>
      </div>
      
      {/* Button */}
      <div className="h-12 bg-gray-200 rounded" />
    </div>
  );
}

// Review Card Skeleton
export function ReviewCardSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="h-4 bg-gray-200 rounded w-24" />
          <div className="h-3 bg-gray-200 rounded w-32" />
        </div>
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-4 h-4 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
      
      {/* Review text */}
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-4/5" />
      </div>
    </div>
  );
}

// Table Skeleton
export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} className="flex gap-4 animate-pulse">
          {Array.from({ length: cols }).map((_, colIdx) => (
            <div key={colIdx} className="flex-1 h-10 bg-gray-200 rounded" />
          ))}
        </div>
      ))}
    </div>
  );
}

// Combined Loading State Component
export function PageLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <HeaderSkeleton />
      <BannerSkeleton />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <ListSkeleton count={6} />
        </div>
        <div className="lg:col-span-3">
          <ProductGridSkeleton count={12} />
        </div>
      </div>
    </div>
  );
}

const SkeletonComponents = {
  ProductSkeleton,
  ProductGridSkeleton,
  ListSkeleton,
  HeaderSkeleton,
  BannerSkeleton,
  CollectionCardSkeleton,
  CheckoutFormSkeleton,
  ReviewCardSkeleton,
  TableSkeleton,
  PageLoadingSkeleton,
};

export default SkeletonComponents;
