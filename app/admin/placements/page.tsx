"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, MoveUp, MoveDown, Eye, EyeOff } from "lucide-react";
import Image from "next/image";

interface Product {
  id: string | number;
  dbId?: number;
  name: string;
  slug: string;
  color: string;
  price: number;
  images: string[];
}

interface Placement {
  id: number;
  product_id: number;
  section: string;
  display_order: number;
  is_active: boolean;
  products: Product;
}

const SECTIONS = [
  { value: "bestsellers", label: "Homepage - Bestsellers Section" },
  { value: "new-collection", label: "Homepage - New Collection Carousel" },
  { value: "featured", label: "Homepage - Featured Products" },
  { value: "hero-products", label: "Homepage - Hero Products" },
  { value: "women-featured", label: "Women's Page - Featured Products" },
  { value: "women-trending", label: "Women's Page - Trending" },
  { value: "men-featured", label: "Men's Page - Featured Products" },
  { value: "men-trending", label: "Men's Page - Trending" },
  { value: "shop-featured", label: "Shop Page - Featured" },
  { value: "shop-new-arrivals", label: "Shop Page - New Arrivals" },
  { value: "collections-featured", label: "Collections Page - Featured" },
  { value: "all-products-top", label: "All Products - Top Picks" },
];

export default function PlacementsPage() {
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [allPlacementsCounts, setAllPlacementsCounts] = useState<Record<string, number>>({});
  const [selectedSection, setSelectedSection] = useState("bestsellers");
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [selectedPosition, setSelectedPosition] = useState<string>("end");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchPlacements();
    fetchProducts();
    fetchAllPlacementsCounts();
  }, [selectedSection]);

  const fetchAllPlacementsCounts = async () => {
    try {
      const counts: Record<string, number> = {};
      for (const section of SECTIONS) {
        const response = await fetch(`/api/admin/placements?section=${section.value}`);
        const data = await response.json();
        counts[section.value] = Array.isArray(data) ? data.length : 0;
      }
      setAllPlacementsCounts(counts);
    } catch (error) {
      console.error("Error fetching placement counts:", error);
    }
  };

  const fetchPlacements = async () => {
    try {
      const response = await fetch(
        `/api/admin/placements?section=${selectedSection}`
      );
      const data = await response.json();
      console.log("Fetched placements:", data);
      console.log("Placements count:", Array.isArray(data) ? data.length : 0);
      
      // Ensure data is an array
      const placementsArray = Array.isArray(data) ? data : [];
      setPlacements(placementsArray);
    } catch (error) {
      console.error("Error fetching placements:", error);
      showMessage("Error loading placements", "error");
      setPlacements([]);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      console.log("Fetched products data:", data);
      
      // The API returns { products: [...] } structure
      const productsArray = data.products || [];
      console.log("Products count:", productsArray.length);
      console.log("Sample product:", productsArray[0]);
      
      setProducts(productsArray);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
  };

  const addPlacement = async () => {
    if (!selectedProduct) {
      showMessage("Please select a product", "error");
      return;
    }

    setLoading(true);
    try {
      // Calculate display order based on selected position
      let displayOrder = placements.length; // Default: add at end
      
      if (selectedPosition === "start") {
        displayOrder = 0;
        // Shift all existing placements down by 1
        await Promise.all(
          placements.map((p, index) =>
            fetch(`/api/admin/placements/${p.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ display_order: index + 1 }),
            })
          )
        );
      } else if (selectedPosition !== "end") {
        // Specific position selected (1, 2, 3, etc.)
        displayOrder = parseInt(selectedPosition);
        // Shift placements at and after this position down by 1
        await Promise.all(
          placements
            .filter((p) => p.display_order >= displayOrder)
            .map((p) =>
              fetch(`/api/admin/placements/${p.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ display_order: p.display_order + 1 }),
              })
            )
        );
      }

      const response = await fetch("/api/admin/placements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: parseInt(selectedProduct),
          section: selectedSection,
          display_order: displayOrder,
          is_active: true,
        }),
      });

      if (response.ok) {
        showMessage("Product added successfully", "success");
        fetchPlacements();
        setSelectedProduct("");
        setSelectedPosition("end");
      } else {
        const error = await response.json();
        showMessage(error.error || "Error adding product", "error");
      }
    } catch (error) {
      console.error("Error adding placement:", error);
      showMessage("Error adding product", "error");
    }
    setLoading(false);
  };

  const removePlacement = async (id: number) => {
    if (!confirm("Remove this product from the section?")) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/placements/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        showMessage("Product removed successfully", "success");
        fetchPlacements();
      } else {
        showMessage("Error removing product", "error");
      }
    } catch (error) {
      console.error("Error removing placement:", error);
      showMessage("Error removing product", "error");
    }
    setLoading(false);
  };

  const toggleActive = async (id: number, currentStatus: boolean) => {
    console.log("Toggling active for placement:", id, "Current status:", currentStatus, "New status:", !currentStatus);
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/placements/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !currentStatus }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Toggle response:", data);
        showMessage("Status updated successfully", "success");
        fetchPlacements();
      } else {
        const error = await response.json();
        console.error("Toggle failed:", error);
        showMessage("Error updating status", "error");
      }
    } catch (error) {
      console.error("Error toggling active:", error);
      showMessage("Error updating status", "error");
    }
    setLoading(false);
  };

  const moveProduct = async (id: number, direction: "up" | "down") => {
    const currentIndex = placements.findIndex((p) => p.id === id);
    if (
      (direction === "up" && currentIndex === 0) ||
      (direction === "down" && currentIndex === placements.length - 1)
    ) {
      return;
    }

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const currentPlacement = placements[currentIndex];
    const swapPlacement = placements[newIndex];

    setLoading(true);
    try {
      // Update both placements
      await Promise.all([
        fetch(`/api/admin/placements/${currentPlacement.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ display_order: newIndex }),
        }),
        fetch(`/api/admin/placements/${swapPlacement.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ display_order: currentIndex }),
        }),
      ]);

      showMessage("Order updated successfully", "success");
      fetchPlacements();
    } catch (error) {
      console.error("Error moving product:", error);
      showMessage("Error updating order", "error");
    }
    setLoading(false);
  };

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage(text);
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Product Placements Manager</h1>
        <p className="text-gray-600">
          Control which products appear on different pages and sections of your website
        </p>
      </div>

      {message && (
        <div
          className={`mb-4 p-4 rounded ${
            message.includes("Error") || message.includes("error")
              ? "bg-red-100 text-red-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {message}
        </div>
      )}

      {/* Overview Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Placements Overview</CardTitle>
          <p className="text-sm text-gray-600">Quick view of product placements across all pages</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Homepage */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <span>🏠</span> Homepage
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Bestsellers:</span>
                  <span className="font-medium">{allPlacementsCounts["bestsellers"] || 0} products</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">New Collection:</span>
                  <span className="font-medium">{allPlacementsCounts["new-collection"] || 0} products</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Featured:</span>
                  <span className="font-medium">{allPlacementsCounts["featured"] || 0} products</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hero:</span>
                  <span className="font-medium">{allPlacementsCounts["hero-products"] || 0} products</span>
                </div>
              </div>
            </div>

            {/* Women's Page */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <span>👜</span> Women&apos;s Page
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Featured:</span>
                  <span className="font-medium">{allPlacementsCounts["women-featured"] || 0} products</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trending:</span>
                  <span className="font-medium">{allPlacementsCounts["women-trending"] || 0} products</span>
                </div>
              </div>
            </div>

            {/* Men's Page */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <span>💼</span> Men&apos;s Page
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Featured:</span>
                  <span className="font-medium">{allPlacementsCounts["men-featured"] || 0} products</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trending:</span>
                  <span className="font-medium">{allPlacementsCounts["men-trending"] || 0} products</span>
                </div>
              </div>
            </div>

            {/* Shop Page */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <span>🛍️</span> Shop Page
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Featured:</span>
                  <span className="font-medium">{allPlacementsCounts["shop-featured"] || 0} products</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">New Arrivals:</span>
                  <span className="font-medium">{allPlacementsCounts["shop-new-arrivals"] || 0} products</span>
                </div>
              </div>
            </div>

            {/* Collections Page */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <span>📚</span> Collections
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Featured:</span>
                  <span className="font-medium">{allPlacementsCounts["collections-featured"] || 0} products</span>
                </div>
              </div>
            </div>

            {/* All Products Page */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <span>📦</span> All Products
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Top Picks:</span>
                  <span className="font-medium">{allPlacementsCounts["all-products-top"] || 0} products</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section Selector with Page Grouping */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Select Page & Section</CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Choose which page and section you want to manage product placements for
          </p>
        </CardHeader>
        <CardContent>
          <Select value={selectedSection} onValueChange={setSelectedSection}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-[400px]">
              {/* Homepage Sections */}
              <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 bg-gray-100">
                🏠 HOMEPAGE
              </div>
              <SelectItem value="bestsellers">Bestsellers Section</SelectItem>
              <SelectItem value="new-collection">New Collection Carousel</SelectItem>
              <SelectItem value="featured">Featured Products</SelectItem>
              <SelectItem value="hero-products">Hero Products</SelectItem>
              
              {/* Women's Page */}
              <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 bg-gray-100 mt-2">
                👜 WOMEN&apos;S PAGE
              </div>
              <SelectItem value="women-featured">Featured Products</SelectItem>
              <SelectItem value="women-trending">Trending Now</SelectItem>
              
              {/* Men's Page */}
              <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 bg-gray-100 mt-2">
                💼 MEN&apos;S PAGE
              </div>
              <SelectItem value="men-featured">Featured Products</SelectItem>
              <SelectItem value="men-trending">Trending Now</SelectItem>
              
              {/* Shop Page */}
              <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 bg-gray-100 mt-2">
                🛍️ SHOP PAGE
              </div>
              <SelectItem value="shop-featured">Featured</SelectItem>
              <SelectItem value="shop-new-arrivals">New Arrivals</SelectItem>
              
              {/* Collections Page */}
              <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 bg-gray-100 mt-2">
                📚 COLLECTIONS PAGE
              </div>
              <SelectItem value="collections-featured">Featured Collections</SelectItem>
              
              {/* All Products Page */}
              <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 bg-gray-100 mt-2">
                📦 ALL PRODUCTS PAGE
              </div>
              <SelectItem value="all-products-top">Top Picks</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Current selection info */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Currently managing:</strong> {SECTIONS.find(s => s.value === selectedSection)?.label}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Add Product */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add Product to {SECTIONS.find(s => s.value === selectedSection)?.label}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Select Product</label>
                {products.length === 0 ? (
                  <div className="border rounded-md p-3 text-sm text-gray-500">
                    Loading products...
                  </div>
                ) : (
                  <>
                    <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a product" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {(() => {
                          // Get list of placed product IDs in current section
                          const placedProductIds = placements.map(pl => pl.product_id);
                          
                          // Filter out already placed products
                          const availableProducts = products.filter((p) => {
                            const productId = p.dbId || p.id;
                            const isPlaced = placedProductIds.includes(Number(productId));
                            return !isPlaced;
                          });
                          
                          console.log("=== PRODUCT SELECTOR DEBUG ===");
                          console.log("Total products fetched:", products.length);
                          console.log("Placed product IDs:", placedProductIds);
                          console.log("Available products:", availableProducts.length);
                          console.log("First 3 products:", products.slice(0, 3).map(p => ({
                            id: p.id,
                            dbId: p.dbId,
                            name: p.name,
                            color: p.color
                          })));
                          
                          if (availableProducts.length === 0) {
                            return (
                              <div className="p-4 text-sm text-gray-500 text-center">
                                {products.length === 0 
                                  ? "No products found in database" 
                                  : "All products are already placed in this section"}
                              </div>
                            );
                          }
                          
                          return availableProducts.map((product) => (
                            <SelectItem 
                              key={product.id} 
                              value={(product.dbId || product.id).toString()}
                            >
                              {product.name} - {product.color}
                            </SelectItem>
                          ));
                        })()}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">
                      {products.filter(p => !placements.some(pl => pl.product_id === p.dbId)).length} products available
                    </p>
                  </>
                )}
              </div>
              
              <div className="w-48">
                <label className="text-sm font-medium mb-2 block">Position</label>
                <Select value={selectedPosition} onValueChange={setSelectedPosition}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="start">At Start (Position 1)</SelectItem>
                    {placements.map((_, index) => (
                      <SelectItem key={index} value={index.toString()}>
                        Position {index + 1}
                      </SelectItem>
                    ))}
                    <SelectItem value="end">At End (Position {placements.length + 1})</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button
              onClick={addPlacement}
              disabled={loading || !selectedProduct}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product at Selected Position
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Placements */}
      <Card>
        <CardHeader>
          <CardTitle>
            Current Products ({placements.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {placements.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No products in this section yet. Add some above!
            </p>
          ) : (
            <div className="space-y-4">
              {placements.map((placement, index) => (
                <div
                  key={placement.id}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50"
                >
                  {/* Product Image */}
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <Image
                      src={placement.products.images[0] || "/placeholder.png"}
                      alt={placement.products.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold">
                      {placement.products.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {placement.products.color}
                    </p>
                    <p className="text-sm font-medium">
                      ${placement.products.price}
                    </p>
                  </div>

                  {/* Order Number */}
                  <div className="text-center px-4">
                    <div className="text-xs text-gray-500">Position</div>
                    <div className="text-lg font-bold">{index + 1}</div>
                  </div>

                  {/* Status Badge */}
                  <Badge variant={placement.is_active ? "default" : "secondary"}>
                    {placement.is_active ? "Active" : "Inactive"}
                  </Badge>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => moveProduct(placement.id, "up")}
                      disabled={index === 0 || loading}
                    >
                      <MoveUp className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => moveProduct(placement.id, "down")}
                      disabled={index === placements.length - 1 || loading}
                    >
                      <MoveDown className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        toggleActive(placement.id, placement.is_active)
                      }
                      disabled={loading}
                    >
                      {placement.is_active ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removePlacement(placement.id)}
                      disabled={loading}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="mt-6 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-lg">How to Use</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>• <strong>Select Section:</strong> Choose which homepage section to manage</p>
          <p>• <strong>Add Products:</strong> Select a product and choose where to place it (start, middle, or end)</p>
          <p>• <strong>Position Control:</strong> New products can be inserted at any position - existing products automatically shift</p>
          <p>• <strong>Reorder:</strong> Use arrow buttons to move products up/down one position at a time</p>
          <p>• <strong>Toggle Visibility:</strong> Eye icon to show/hide without removing</p>
          <p>• <strong>Remove:</strong> Trash icon to permanently remove from section</p>
        </CardContent>
      </Card>
    </div>
  );
}
