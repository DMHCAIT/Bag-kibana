// Shared product store for both admin and frontend
// This module provides a unified way to access and update product data

import { products as staticProducts, Product } from './products-data';

// Global store for product updates (shared across API routes)
// Note: In production, use a database like Supabase
declare global {
  var productUpdates: Map<string, Product> | undefined;
}

// Initialize the global store if it doesn't exist
if (!global.productUpdates) {
  global.productUpdates = new Map<string, Product>();
}

const productUpdates = global.productUpdates;

/**
 * Get a product by ID
 * Checks for updates first, then falls back to static data
 */
export function getProduct(id: string): Product | undefined {
  // First check if there's an updated version
  if (productUpdates.has(id)) {
    return productUpdates.get(id);
  }
  
  // Fall back to static data
  return staticProducts.find(p => p.id === id);
}

/**
 * Get all products
 * Returns updated products merged with static products
 */
export function getAllProducts(): Product[] {
  // Create a map of all products starting with static data
  const allProducts = new Map<string, Product>();
  
  // Add all static products
  staticProducts.forEach(product => {
    allProducts.set(product.id, product);
  });
  
  // Override with any updated products
  productUpdates.forEach((product, id) => {
    allProducts.set(id, product);
  });
  
  return Array.from(allProducts.values());
}

/**
 * Update a product
 */
export function updateProduct(id: string, data: Partial<Product>): Product | null {
  const existingProduct = getProduct(id);
  
  if (!existingProduct) {
    return null;
  }
  
  const updatedProduct: Product = {
    ...existingProduct,
    ...data,
    id, // Ensure ID doesn't change
  };
  
  productUpdates.set(id, updatedProduct);
  
  return updatedProduct;
}

/**
 * Add a new product
 */
export function addProduct(product: Product): Product {
  productUpdates.set(product.id, product);
  return product;
}

/**
 * Delete a product (removes from updates, can't delete static data)
 */
export function deleteProduct(id: string): boolean {
  return productUpdates.delete(id);
}

/**
 * Get products by category
 */
export function getProductsByCategory(category: string): Product[] {
  return getAllProducts().filter(p => 
    p.category.toLowerCase() === category.toLowerCase()
  );
}

/**
 * Get products by section (bestsellers, new-arrivals, etc.)
 */
export function getProductsBySection(section: string): Product[] {
  return getAllProducts().filter(p => 
    p.sections?.includes(section)
  );
}

/**
 * Search products by name or description
 */
export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase();
  return getAllProducts().filter(p => 
    p.name.toLowerCase().includes(lowerQuery) ||
    p.description.toLowerCase().includes(lowerQuery) ||
    p.color.toLowerCase().includes(lowerQuery)
  );
}

// Export for convenience
export { Product };

