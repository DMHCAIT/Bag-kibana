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
import { Input } from "@/components/ui/input";
import {
  Trash2,
  Plus,
  MoveUp,
  MoveDown,
  Eye,
  EyeOff,
  Search,
  GripVertical,
  ExternalLink,
  RefreshCw,
  Check,
  AlertCircle,
  LayoutGrid,
  List,
  CheckSquare,
  Square,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Product {
  id: string | number;
  dbId?: number;
  name: string;
  slug: string;
  color: string;
  price: number;
  images: string[];
  category?: string;
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
  { value: "bestsellers", label: "Homepage - Bestsellers Section", page: "Homepage", icon: "🏠" },
  { value: "new-collection", label: "Homepage - New Collection Carousel", page: "Homepage", icon: "🏠" },
  { value: "featured", label: "Homepage - Featured Products", page: "Homepage", icon: "🏠" },
  { value: "hero-products", label: "Homepage - Hero Products", page: "Homepage", icon: "🏠" },
  { value: "women-featured", label: "Women's Page - Featured Products", page: "Women", icon: "👜" },
  { value: "women-trending", label: "Women's Page - Trending", page: "Women", icon: "👜" },
  { value: "men-featured", label: "Men's Page - Featured Products", page: "Men", icon: "💼" },
  { value: "men-trending", label: "Men's Page - Trending", page: "Men", icon: "💼" },
  { value: "shop-featured", label: "Shop Page - Featured", page: "Shop", icon: "🛍️" },
  { value: "shop-new-arrivals", label: "Shop Page - New Arrivals", page: "Shop", icon: "🛍️" },
  { value: "collections-featured", label: "Collections Page - Featured", page: "Collections", icon: "📚" },
  { value: "all-products-top", label: "All Products - Top Picks", page: "All Products", icon: "📦" },
];

const PAGE_GROUPS = [...new Set(SECTIONS.map((s) => s.page))];

export default function PlacementsPage() {
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [allPlacementsCounts, setAllPlacementsCounts] = useState<Record<string, number>>({});
  const [selectedSection, setSelectedSection] = useState("bestsellers");
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [selectedPosition, setSelectedPosition] = useState<string>("end");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [productSearch, setProductSearch] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [filterPage, setFilterPage] = useState<string>("all");
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchPlacements();
    fetchProducts();
    fetchAllPlacementsCounts();
  }, [selectedSection]);

  const fetchAllPlacementsCounts = async () => {
    try {
      const counts: Record<string, number> = {};
      const promises = SECTIONS.map(async (section) => {
        const response = await fetch(`/api/admin/placements?section=${section.value}`);
        const data = await response.json();
        counts[section.value] = Array.isArray(data) ? data.length : 0;
      });
      await Promise.all(promises);
      setAllPlacementsCounts(counts);
    } catch (error) {
      console.error("Error fetching placement counts:", error);
    }
  };

  const fetchPlacements = async () => {
    try {
      const response = await fetch(`/api/admin/placements?section=${selectedSection}`);
      const data = await response.json();
      const placementsArray = Array.isArray(data) ? data : [];
      setPlacements(placementsArray);
      setSelectedItems(new Set());
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
      const productsArray = data.products || [];
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
      let displayOrder = placements.length;

      if (selectedPosition === "start") {
        displayOrder = 0;
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
        displayOrder = parseInt(selectedPosition);
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
        showMessage("Product added successfully!", "success");
        fetchPlacements();
        fetchAllPlacementsCounts();
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
      const response = await fetch(`/api/admin/placements/${id}`, { method: "DELETE" });
      if (response.ok) {
        showMessage("Product removed", "success");
        fetchPlacements();
        fetchAllPlacementsCounts();
      } else {
        showMessage("Error removing product", "error");
      }
    } catch {
      showMessage("Error removing product", "error");
    }
    setLoading(false);
  };

  const bulkRemove = async () => {
    if (selectedItems.size === 0) return;
    if (!confirm(`Remove ${selectedItems.size} products from this section?`)) return;

    setLoading(true);
    try {
      await Promise.all(
        [...selectedItems].map((id) =>
          fetch(`/api/admin/placements/${id}`, { method: "DELETE" })
        )
      );
      showMessage(`Removed ${selectedItems.size} products`, "success");
      setSelectedItems(new Set());
      fetchPlacements();
      fetchAllPlacementsCounts();
    } catch {
      showMessage("Error removing products", "error");
    }
    setLoading(false);
  };

  const bulkToggleActive = async (active: boolean) => {
    if (selectedItems.size === 0) return;

    setLoading(true);
    try {
      await Promise.all(
        [...selectedItems].map((id) =>
          fetch(`/api/admin/placements/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ is_active: active }),
          })
        )
      );
      showMessage(`Updated ${selectedItems.size} products`, "success");
      setSelectedItems(new Set());
      fetchPlacements();
    } catch {
      showMessage("Error updating products", "error");
    }
    setLoading(false);
  };

  const toggleActive = async (id: number, currentStatus: boolean) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/placements/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !currentStatus }),
      });
      if (response.ok) {
        showMessage("Status updated", "success");
        fetchPlacements();
      } else {
        showMessage("Error updating status", "error");
      }
    } catch {
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
      showMessage("Order updated", "success");
      fetchPlacements();
    } catch {
      showMessage("Error updating order", "error");
    }
    setLoading(false);
  };

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === dropIndex) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }

    const reordered = [...placements];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(dropIndex, 0, moved);

    setLoading(true);
    try {
      await Promise.all(
        reordered.map((p, index) =>
          fetch(`/api/admin/placements/${p.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ display_order: index }),
          })
        )
      );
      showMessage("Order updated", "success");
      fetchPlacements();
    } catch {
      showMessage("Error updating order", "error");
    }
    setDragIndex(null);
    setDragOverIndex(null);
    setLoading(false);
  };

  const toggleSelectItem = (id: number) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === placements.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(placements.map((p) => p.id)));
    }
  };

  const duplicateToSection = async (targetSection: string) => {
    if (selectedItems.size === 0) return;

    setLoading(true);
    try {
      const selectedPlacements = placements.filter((p) => selectedItems.has(p.id));
      await Promise.all(
        selectedPlacements.map((p, index) =>
          fetch("/api/admin/placements", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              product_id: p.product_id,
              section: targetSection,
              display_order: index,
              is_active: true,
            }),
          })
        )
      );
      showMessage(
        `Copied ${selectedItems.size} products to ${SECTIONS.find((s) => s.value === targetSection)?.label}`,
        "success"
      );
      setSelectedItems(new Set());
      fetchAllPlacementsCounts();
    } catch {
      showMessage("Error copying products", "error");
    }
    setLoading(false);
  };

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !productSearch ||
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.color?.toLowerCase().includes(productSearch.toLowerCase());
    const placedProductIds = placements.map((pl) => pl.product_id);
    const productId = p.dbId || p.id;
    const isNotPlaced = !placedProductIds.includes(Number(productId));
    return matchesSearch && isNotPlaced;
  });

  const filteredSections =
    filterPage === "all" ? SECTIONS : SECTIONS.filter((s) => s.page === filterPage);

  const currentSection = SECTIONS.find((s) => s.value === selectedSection);

  const getPreviewLink = (section: string) => {
    if (section.startsWith("women")) return "/women";
    if (section.startsWith("men")) return "/men";
    if (section.startsWith("shop")) return "/shop";
    if (section.startsWith("collections")) return "/collections";
    if (section.startsWith("all-products")) return "/all-products";
    return "/";
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Product Placements</h1>
          <p className="text-gray-600 mt-1">
            Control which products appear on different pages and sections
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => { fetchPlacements(); fetchAllPlacementsCounts(); }} className="gap-1">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Link href={getPreviewLink(selectedSection)} target="_blank">
            <Button variant="outline" size="sm" className="gap-1">
              <ExternalLink className="w-4 h-4" />
              Preview Page
            </Button>
          </Link>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.type === "success" ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {message.text}
        </div>
      )}

      {/* Overview Grid */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Sections Overview</CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Filter:</span>
              <Select value={filterPage} onValueChange={setFilterPage}>
                <SelectTrigger className="w-36 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Pages</SelectItem>
                  {PAGE_GROUPS.map((page) => (
                    <SelectItem key={page} value={page}>
                      {page}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredSections.map((section) => (
              <button
                key={section.value}
                onClick={() => setSelectedSection(section.value)}
                className={`p-3 rounded-lg border text-left transition-all hover:shadow-md ${
                  selectedSection === section.value
                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-lg">{section.icon}</span>
                  <Badge
                    variant={allPlacementsCounts[section.value] > 0 ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {allPlacementsCounts[section.value] || 0}
                  </Badge>
                </div>
                <p className="text-xs font-medium truncate">
                  {section.label.split(" - ")[1] || section.label}
                </p>
                <p className="text-xs text-gray-500">{section.page}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Section Indicator */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{currentSection?.icon}</span>
          <div>
            <p className="font-medium text-blue-900">{currentSection?.label}</p>
            <p className="text-xs text-blue-600">{placements.length} products placed</p>
          </div>
        </div>
        <Link
          href={getPreviewLink(selectedSection)}
          target="_blank"
          className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
        >
          View on site <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {/* Add Product */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Add Product</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search products by name or color..."
                className="pl-9"
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {filteredProducts.length === 0 ? (
                      <div className="p-4 text-sm text-gray-500 text-center">
                        {products.length === 0
                          ? "No products found"
                          : productSearch
                          ? "No matching products"
                          : "All products placed already"}
                      </div>
                    ) : (
                      filteredProducts.map((product) => (
                        <SelectItem
                          key={product.id}
                          value={(product.dbId || product.id).toString()}
                        >
                          {product.name}
                          {product.color ? ` - ${product.color}` : ""}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">{filteredProducts.length} available</p>
              </div>

              <div className="w-48">
                <Select value={selectedPosition} onValueChange={setSelectedPosition}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="start">Position 1 (Start)</SelectItem>
                    {placements.map((_, index) => (
                      <SelectItem key={index} value={index.toString()}>
                        Position {index + 1}
                      </SelectItem>
                    ))}
                    <SelectItem value="end">Position {placements.length + 1} (End)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={addPlacement} disabled={loading || !selectedProduct} className="w-full gap-2">
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedItems.size > 0 && (
        <div className="mb-4 p-3 bg-indigo-50 border border-indigo-200 rounded-lg flex items-center justify-between flex-wrap gap-2">
          <span className="text-sm font-medium text-indigo-800">
            {selectedItems.size} items selected
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            <Button size="sm" variant="outline" onClick={() => bulkToggleActive(true)} className="text-xs gap-1">
              <Eye className="w-3 h-3" /> Show All
            </Button>
            <Button size="sm" variant="outline" onClick={() => bulkToggleActive(false)} className="text-xs gap-1">
              <EyeOff className="w-3 h-3" /> Hide All
            </Button>
            <Select onValueChange={duplicateToSection}>
              <SelectTrigger className="w-44 h-8 text-xs">
                <SelectValue placeholder="Copy to section..." />
              </SelectTrigger>
              <SelectContent>
                {SECTIONS.filter((s) => s.value !== selectedSection).map((s) => (
                  <SelectItem key={s.value} value={s.value} className="text-xs">
                    {s.icon} {s.label.split(" - ")[1] || s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="sm" variant="destructive" onClick={bulkRemove} className="text-xs gap-1">
              <Trash2 className="w-3 h-3" /> Remove
            </Button>
          </div>
        </div>
      )}

      {/* Products List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Current Products ({placements.length})</CardTitle>
            <div className="flex items-center gap-2">
              {placements.length > 0 && (
                <Button size="sm" variant="ghost" onClick={toggleSelectAll} className="text-xs gap-1">
                  {selectedItems.size === placements.length ? (
                    <CheckSquare className="w-4 h-4" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                  {selectedItems.size === placements.length ? "Deselect" : "Select All"}
                </Button>
              )}
              <div className="flex border rounded-md">
                <Button
                  size="sm"
                  variant={viewMode === "list" ? "default" : "ghost"}
                  onClick={() => setViewMode("list")}
                  className="rounded-r-none px-2"
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  onClick={() => setViewMode("grid")}
                  className="rounded-l-none px-2"
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {placements.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">📦</div>
              <p className="text-gray-500 font-medium">No products in this section yet</p>
              <p className="text-gray-400 text-sm mt-1">Add products using the form above</p>
            </div>
          ) : viewMode === "list" ? (
            <div className="space-y-2">
              {placements.map((placement, index) => (
                <div
                  key={placement.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={() => {
                    setDragIndex(null);
                    setDragOverIndex(null);
                  }}
                  className={`flex items-center gap-3 p-3 border rounded-lg transition-all cursor-move
                    ${selectedItems.has(placement.id) ? "bg-indigo-50 border-indigo-300" : "hover:bg-gray-50 border-gray-200"}
                    ${dragOverIndex === index ? "border-blue-500 border-2 bg-blue-50" : ""}
                    ${dragIndex === index ? "opacity-50" : ""}
                  `}
                >
                  <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0" />

                  <button onClick={(e) => { e.stopPropagation(); toggleSelectItem(placement.id); }} className="flex-shrink-0">
                    {selectedItems.has(placement.id) ? (
                      <CheckSquare className="w-5 h-5 text-indigo-600" />
                    ) : (
                      <Square className="w-5 h-5 text-gray-300" />
                    )}
                  </button>

                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600 flex-shrink-0">
                    {index + 1}
                  </div>

                  <div className="relative w-14 h-14 flex-shrink-0">
                    <Image
                      src={placement.products?.images?.[0] || "/placeholder.png"}
                      alt={placement.products?.name || "Product"}
                      fill
                      className="object-cover rounded"
                      unoptimized
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">{placement.products?.name || "Unknown Product"}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-500">{placement.products?.color}</span>
                      {placement.products?.price && (
                        <span className="text-xs font-medium">₹{placement.products.price}</span>
                      )}
                    </div>
                  </div>

                  <Badge
                    variant={placement.is_active ? "default" : "secondary"}
                    className={`text-xs ${placement.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                  >
                    {placement.is_active ? "Active" : "Hidden"}
                  </Badge>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button size="sm" variant="ghost" onClick={() => moveProduct(placement.id, "up")} disabled={index === 0 || loading} className="h-8 w-8 p-0">
                      <MoveUp className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => moveProduct(placement.id, "down")} disabled={index === placements.length - 1 || loading} className="h-8 w-8 p-0">
                      <MoveDown className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => toggleActive(placement.id, placement.is_active)} disabled={loading} className="h-8 w-8 p-0">
                      {placement.is_active ? <EyeOff className="w-4 h-4 text-gray-500" /> : <Eye className="w-4 h-4 text-green-600" />}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => removePlacement(placement.id)} disabled={loading} className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {placements.map((placement, index) => (
                <div
                  key={placement.id}
                  className={`border rounded-lg overflow-hidden transition-all hover:shadow-md ${
                    selectedItems.has(placement.id) ? "ring-2 ring-indigo-400" : ""
                  }`}
                >
                  <div className="relative aspect-square bg-gray-100">
                    <Image
                      src={placement.products?.images?.[0] || "/placeholder.png"}
                      alt={placement.products?.name || "Product"}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute top-2 left-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center text-xs font-bold shadow">
                      {index + 1}
                    </div>
                    <button onClick={() => toggleSelectItem(placement.id)} className="absolute top-2 right-2">
                      {selectedItems.has(placement.id) ? (
                        <CheckSquare className="w-5 h-5 text-indigo-600 bg-white rounded" />
                      ) : (
                        <Square className="w-5 h-5 text-gray-400 bg-white/80 rounded" />
                      )}
                    </button>
                    {!placement.is_active && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Badge variant="secondary">Hidden</Badge>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm truncate">{placement.products?.name}</h3>
                    <p className="text-xs text-gray-500">{placement.products?.color}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-medium">₹{placement.products?.price}</span>
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="ghost" onClick={() => toggleActive(placement.id, placement.is_active)} className="h-7 w-7 p-0">
                          {placement.is_active ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => removePlacement(placement.id)} className="h-7 w-7 p-0 text-red-500">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Help */}
      <Card className="mt-6 bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg">Tips</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-1.5">
          <p>• <strong>Drag &amp; drop</strong> items to reorder them (list view)</p>
          <p>• <strong>Select multiple</strong> items for bulk show/hide, copy, or remove</p>
          <p>• <strong>Copy to section</strong> to place the same products in another section</p>
          <p>• <strong>Search products</strong> by name or color when adding</p>
          <p>• <strong>Preview</strong> the page to see changes live</p>
        </CardContent>
      </Card>
    </div>
  );
}
