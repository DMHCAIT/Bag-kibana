"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus, Package, Palette } from "lucide-react";

interface Product {
  id: string;
  dbId?: number;
  name: string;
  category: string;
  color: string;
  price: number;
  slug: string;
  stock?: number;
  images: string[];
  colors?: Array<{ name: string; value: string; available: boolean }>;
}

interface GroupedProducts {
  [category: string]: {
    [productName: string]: Product[];
  };
}

export default function CategoryProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [groupedProducts, setGroupedProducts] = useState<GroupedProducts>({});
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      groupProductsByCategory();
    }
  }, [products, selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/products");
      const data = await response.json();

      if (data.products) {
        setProducts(data.products);
        
        // Extract unique categories
        const uniqueCategories = [
          ...new Set(data.products.map((p: Product) => p.category)),
        ].sort();
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const groupProductsByCategory = () => {
    const grouped: GroupedProducts = {};

    const filteredProducts =
      selectedCategory === "all"
        ? products
        : products.filter((p) => p.category === selectedCategory);

    filteredProducts.forEach((product) => {
      const category = product.category;
      const name = product.name;

      if (!grouped[category]) {
        grouped[category] = {};
      }

      if (!grouped[category][name]) {
        grouped[category][name] = [];
      }

      grouped[category][name].push(product);
    });

    setGroupedProducts(grouped);
  };

  const handleDelete = async (productId: string | number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Product deleted successfully");
        fetchProducts();
      } else {
        alert("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error deleting product");
    }
  };

  const fixColorValue = (colorValue: string): string => {
    if (colorValue.includes(".jpg")) {
      const colorMap: { [key: string]: string } = {
        "#006D77.jpg": "#006D77",
        "#98D8C8.jpg": "#98D8C8",
        "#B8D4E8.jpg": "#B8D4E8",
        "#9B6B4F": "#9B6B4F",
      };
      return colorMap[colorValue] || "#9B6B4F";
    }
    return colorValue;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Products by Category</h1>
          <p className="text-gray-600">
            Manage products organized by category with color variants
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add New Product
          </Button>
        </Link>
      </div>

      {/* Category Filter */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Filter by Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-500 mt-2">
            Showing {Object.keys(groupedProducts).length} categories
          </p>
        </CardContent>
      </Card>

      {/* Products Grid by Category */}
      <div className="space-y-8">
        {Object.entries(groupedProducts).map(([category, productGroups]) => (
          <Card key={category}>
            <CardHeader className="bg-gray-50">
              <CardTitle className="text-2xl">{category}</CardTitle>
              <p className="text-sm text-gray-600">
                {Object.keys(productGroups).length} product
                {Object.keys(productGroups).length !== 1 ? "s" : ""} with{" "}
                {Object.values(productGroups).reduce(
                  (acc, variants) => acc + variants.length,
                  0
                )}{" "}
                total variants
              </p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {Object.entries(productGroups).map(([productName, variants]) => (
                  <div
                    key={productName}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      {/* Product Main Image */}
                      <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                        <Image
                          src={variants[0].images[0]}
                          alt={productName}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div>
                            <h3 className="font-semibold text-lg mb-1">
                              {productName}
                            </h3>
                            <p className="text-sm text-gray-600">
                              ₹{variants[0].price.toLocaleString()} • {variants.length}{" "}
                              color variant{variants.length !== 1 ? "s" : ""}
                            </p>
                          </div>
                          <Link href="/admin/products">
                            <Button variant="outline" size="sm" className="gap-2">
                              <Pencil className="w-4 h-4" />
                              Manage All
                            </Button>
                          </Link>
                        </div>

                        {/* Color Variants */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <Palette className="w-4 h-4" />
                            Available Colors:
                          </div>
                          <div className="flex flex-wrap gap-3">
                            {variants.map((variant) => (
                              <div
                                key={variant.id}
                                className="flex items-center gap-2 p-2 border rounded-lg hover:border-gray-400 transition-colors"
                              >
                                {/* Color Swatch */}
                                <div
                                  className="w-8 h-8 rounded-full border-2 border-gray-300"
                                  style={{
                                    backgroundColor: variant.colors?.[0]?.value
                                      ? fixColorValue(variant.colors[0].value)
                                      : "#9B6B4F",
                                  }}
                                  title={variant.color}
                                />
                                
                                {/* Color Info */}
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium">
                                    {variant.color}
                                  </span>
                                  <div className="flex gap-1 items-center">
                                    <Badge
                                      variant={
                                        variant.stock && variant.stock > 0
                                          ? "default"
                                          : "destructive"
                                      }
                                      className="text-xs"
                                    >
                                      {variant.stock
                                        ? `${variant.stock} in stock`
                                        : "Out of stock"}
                                    </Badge>
                                  </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-1 ml-2">
                                  <Link
                                    href={`/admin/products/${
                                      variant.dbId || variant.id
                                    }/edit`}
                                  >
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                    >
                                      <Pencil className="w-3 h-3" />
                                    </Button>
                                  </Link>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={() =>
                                      handleDelete(variant.dbId || variant.id)
                                    }
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Product Link */}
                        <div className="mt-3 pt-3 border-t">
                          <Link
                            href={`/products/${variants[0].slug || variants[0].id}`}
                            className="text-sm text-blue-600 hover:underline"
                          >
                            View on website →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {Object.keys(groupedProducts).length === 0 && !loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">
              {selectedCategory === "all"
                ? "Start by adding your first product"
                : `No products found in the ${selectedCategory} category`}
            </p>
            <Link href="/admin/products/new">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Product
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
