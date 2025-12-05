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
  { value: "bestsellers", label: "Bestsellers Section" },
  { value: "new-collection", label: "New Collection Carousel" },
  { value: "featured", label: "Featured Products" },
  { value: "hero-products", label: "Hero Products" },
];

export default function PlacementsPage() {
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedSection, setSelectedSection] = useState("bestsellers");
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [selectedPosition, setSelectedPosition] = useState<string>("end");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchPlacements();
    fetchProducts();
  }, [selectedSection]);

  const fetchPlacements = async () => {
    try {
      const response = await fetch(
        `/api/admin/placements?section=${selectedSection}`
      );
      const data = await response.json();
      // Ensure data is an array
      setPlacements(Array.isArray(data) ? data : []);
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
      console.log("Fetched products:", data);
      console.log("Products count:", data?.length);
      // Ensure data is an array
      setProducts(Array.isArray(data) ? data : []);
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
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Product Placements Manager</h1>

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

      {/* Section Selector */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Select Section</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedSection} onValueChange={setSelectedSection}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SECTIONS.map((section) => (
                <SelectItem key={section.value} value={section.value}>
                  {section.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
                          const availableProducts = products.filter(
                            (p) => !placements.some((pl) => pl.product_id === p.dbId)
                          );
                          console.log("Total products:", products.length);
                          console.log("Placements:", placements.map(pl => pl.product_id));
                          console.log("Available products for dropdown:", availableProducts.length);
                          console.log("Products with dbId:", products.filter(p => p.dbId).length);
                          console.log("Sample product:", products[0]);
                          
                          if (availableProducts.length === 0) {
                            return (
                              <div className="p-4 text-sm text-gray-500 text-center">
                                All products are already placed in this section
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
