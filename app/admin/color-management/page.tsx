"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Upload, Save, X, Check, AlertCircle, Palette, Image as ImageIcon } from "lucide-react";

interface Product {
  id: string;
  dbId?: number;
  name: string;
  category: string;
  color: string;
  colorImage?: string;
  price: number;
  images: string[];
}

interface GroupedProducts {
  [productName: string]: Product[];
}

export default function ColorManagementPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [groupedProducts, setGroupedProducts] = useState<GroupedProducts>({});
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      groupProducts();
    }
  }, [products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/products");
      const data = await response.json();

      if (data.products) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      showMessage("Error loading products", "error");
    } finally {
      setLoading(false);
    }
  };

  const groupProducts = () => {
    const grouped: GroupedProducts = {};

    products.forEach((product) => {
      const name = product.name;

      if (!grouped[name]) {
        grouped[name] = [];
      }

      grouped[name].push(product);
    });

    setGroupedProducts(grouped);
  };

  const showMessage = (msg: string, type: "success" | "error" = "success") => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    productId: string
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      showMessage("Please upload an image file", "error");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showMessage("Image size should be less than 5MB", "error");
      return;
    }

    setUploadingFor(productId);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "color-swatches");

      const uploadResponse = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Upload failed");
      }

      const { url } = await uploadResponse.json();

      // Update product with color image
      const updateResponse = await fetch(`/api/admin/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          colorImage: url,
        }),
      });

      if (updateResponse.ok) {
        showMessage("Color image uploaded successfully!", "success");
        fetchProducts(); // Refresh
      } else {
        throw new Error("Failed to update product");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      showMessage("Error uploading image", "error");
    } finally {
      setUploadingFor(null);
    }
  };

  const removeColorImage = async (productId: string) => {
    if (!confirm("Remove color image?")) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          colorImage: null,
        }),
      });

      if (response.ok) {
        showMessage("Color image removed", "success");
        fetchProducts();
      } else {
        throw new Error("Failed to remove image");
      }
    } catch (error) {
      console.error("Error:", error);
      showMessage("Error removing image", "error");
    } finally {
      setSaving(false);
    }
  };

  const productNames = Object.keys(groupedProducts).sort();
  const filteredProducts = selectedProduct === "all" || !selectedProduct
    ? products
    : groupedProducts[selectedProduct] || [];

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Color Image Management</h1>
        <p className="text-gray-600">
          Upload circular color swatch images for each product variant. These will be displayed on the frontend instead of color circles.
        </p>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.includes("Error") || message.includes("error")
              ? "bg-red-100 text-red-800 border border-red-200"
              : "bg-green-100 text-green-800 border border-green-200"
          }`}
        >
          {message}
        </div>
      )}

      {/* Instructions */}
      <Card className="mb-6 border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-blue-900">
            <AlertCircle className="w-5 h-5" />
            Image Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-blue-900">
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 mt-0.5 shrink-0" />
              <span><strong>Circular images:</strong> Upload square images that show the product in a circular crop</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 mt-0.5 shrink-0" />
              <span><strong>Size:</strong> Recommended 200x200px to 400x400px (max 5MB)</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 mt-0.5 shrink-0" />
              <span><strong>Format:</strong> PNG, JPG, or WEBP with transparent background preferred</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 mt-0.5 shrink-0" />
              <span><strong>Content:</strong> Show the product clearly in the main color variant</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Filter */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">Filter Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Label className="text-sm font-medium">Product Name:</Label>
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger className="w-full max-w-md">
                <SelectValue placeholder="Select product to filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                {productNames.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name} ({groupedProducts[name].length} variants)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                {/* Product Info */}
                <div className="mb-4">
                  <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Badge variant="outline">{product.category}</Badge>
                    <span>•</span>
                    <span className="font-medium">{product.color}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">₹{product.price.toLocaleString()}</p>
                </div>

                {/* Color Image Display */}
                <div className="mb-4">
                  <Label className="text-sm font-medium mb-2 block">Color Swatch Image</Label>
                  <div className="flex items-center gap-4">
                    {/* Current main product image (reference) */}
                    <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 shrink-0">
                      <Image
                        src={product.images[0]}
                        alt={product.color}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 border-2 border-gray-300 rounded-full" />
                    </div>

                    {/* Arrow */}
                    <div className="text-2xl text-gray-400">→</div>

                    {/* Color swatch image */}
                    {product.colorImage ? (
                      <div className="relative">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-white shadow-md">
                          <Image
                            src={product.colorImage}
                            alt={`${product.color} swatch`}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 border-2 border-green-500 rounded-full" />
                        </div>
                        <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                        <ImageIcon className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Upload Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Input
                      id={`color-image-${product.id}`}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, product.dbId?.toString() || product.id)}
                      className="hidden"
                      disabled={uploadingFor === product.id}
                    />
                    <label
                      htmlFor={`color-image-${product.id}`}
                      className="flex-1"
                    >
                      <Button
                        type="button"
                        variant={product.colorImage ? "outline" : "default"}
                        className="w-full"
                        disabled={uploadingFor === product.id}
                        onClick={() =>
                          document.getElementById(`color-image-${product.id}`)?.click()
                        }
                      >
                        {uploadingFor === product.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            {product.colorImage ? "Replace" : "Upload"} Image
                          </>
                        )}
                      </Button>
                    </label>

                    {product.colorImage && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeColorImage(product.dbId?.toString() || product.id)}
                        disabled={saving}
                        className="shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  {product.colorImage && (
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Color swatch uploaded
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredProducts.length === 0 && !loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <Palette className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No products found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
