"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, X, Upload, Save } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { PRODUCT_CATEGORIES, PRODUCT_SECTIONS, PRODUCT_STATUS } from "@/lib/types/product";
import type { ProductFormData } from "@/lib/types/product";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Form data
  const [formData, setFormData] = useState<Partial<ProductFormData>>({
    name: "",
    category: "Tote Bag",
    color: "",
    price: 0,
    salePrice: undefined,
    stock: 100,
    rating: 4.5,
    reviews: 0,
    images: [],
    description: "",
    specifications: {
      material: "100% PU Leather",
      texture: "Smooth, Fine-Grained",
      closureType: "",
      hardware: "Gold-Tone Accents",
      compartments: [],
      shoulderDrop: "",
      capacity: "",
      dimensions: "",
      idealFor: ""
    },
    features: [],
    colors: [],
    sections: [],
    slug: "",
    metaTitle: "",
    metaDescription: "",
    tags: [],
    status: "draft",
    isFeatured: false,
    isNewArrival: false,
    publishedAt: undefined
  });

  // Temporary inputs
  const [newFeature, setNewFeature] = useState("");
  const [newCompartment, setNewCompartment] = useState("");
  const [newTag, setNewTag] = useState("");
  const [newColorName, setNewColorName] = useState("");
  const [newColorValue, setNewColorValue] = useState("#000000");

  // Handle input change
  const handleChange = (field: string, value: string | number | boolean | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle specification change
  const handleSpecChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications!,
        [field]: value
      }
    }));
  };

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploadingImages(true);
      const formDataToSend = new FormData();
      
      Array.from(files).forEach(file => {
        formDataToSend.append('files', file);
      });

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formDataToSend
      });

      const data = await response.json();

      if (response.ok && data.urls) {
        setFormData(prev => ({
          ...prev,
          images: [...(prev.images || []), ...data.urls]
        }));
      } else {
        alert(`Upload failed: ${data.error}`);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images');
    } finally {
      setUploadingImages(false);
    }
  };

  // Remove image
  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index)
    }));
  };

  // Add feature
  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...(prev.features || []), newFeature.trim()]
      }));
      setNewFeature("");
    }
  };

  // Remove feature
  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index)
    }));
  };

  // Add compartment
  const addCompartment = () => {
    if (newCompartment.trim()) {
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications!,
          compartments: [...(prev.specifications?.compartments || []), newCompartment.trim()]
        }
      }));
      setNewCompartment("");
    }
  };

  // Remove compartment
  const removeCompartment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications!,
        compartments: prev.specifications?.compartments?.filter((_, i) => i !== index) || []
      }
    }));
  };

  // Add tag
  const addTag = () => {
    if (newTag.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag("");
    }
  };

  // Remove tag
  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter((_, i) => i !== index)
    }));
  };

  // Add color
  const addColor = () => {
    if (newColorName.trim()) {
      setFormData(prev => ({
        ...prev,
        colors: [
          ...(prev.colors || []),
          { name: newColorName.trim(), value: newColorValue, available: true }
        ]
      }));
      setNewColorName("");
      setNewColorValue("#000000");
    }
  };

  // Remove color
  const removeColor = (index: number) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors?.filter((_, i) => i !== index)
    }));
  };

  // Toggle section
  const toggleSection = (sectionId: string) => {
    setFormData(prev => {
      const sections = prev.sections || [];
      if (sections.includes(sectionId)) {
        return { ...prev, sections: sections.filter(s => s !== sectionId) };
      } else {
        return { ...prev, sections: [...sections, sectionId] };
      }
    });
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name || !formData.category || !formData.color || !formData.price) {
      alert('Please fill in all required fields (Name, Category, Color, Price)');
      return;
    }

    if (!formData.images || formData.images.length === 0) {
      alert('Please upload at least one image');
      return;
    }

    try {
      setLoading(true);

      // Generate slug if not provided
      if (!formData.slug) {
        formData.slug = `${formData.name}-${formData.color}`.toLowerCase().replace(/\s+/g, '-');
      }

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        alert('Product created successfully!');
        router.push('/admin/products');
      } else {
        alert(`Failed to create product: ${data.error}`);
      }
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  // Save as draft
  const saveAsDraft = () => {
    setFormData(prev => ({ ...prev, status: 'draft' }));
    setTimeout(() => {
      document.querySelector<HTMLFormElement>('form')?.requestSubmit();
    }, 100);
  };

  // Publish
  const publish = () => {
    setFormData(prev => ({ ...prev, status: 'published' }));
    setTimeout(() => {
      document.querySelector<HTMLFormElement>('form')?.requestSubmit();
    }, 100);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/products">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-serif tracking-wide">Create New Product</h1>
            <p className="text-gray-600 mt-1">Add a new product to your catalog</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={saveAsDraft}
            disabled={loading}
          >
            Save as Draft
          </Button>
          <Button
            type="button"
            onClick={publish}
            disabled={loading}
            className="bg-black text-white hover:bg-gray-800"
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Publishing...' : 'Publish'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="name">
                    Product Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="e.g., VISTARA TOTE"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category">
                    Category <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-gray-300"
                    required
                  >
                    {PRODUCT_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="color">
                    Color <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="color"
                    type="text"
                    value={formData.color}
                    onChange={(e) => handleChange('color', e.target.value)}
                    placeholder="e.g., Mint Green"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="price">
                    Price (₹) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleChange('price', parseFloat(e.target.value))}
                    placeholder="4999"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="salePrice">Sale Price (₹)</Label>
                  <Input
                    id="salePrice"
                    type="number"
                    value={formData.salePrice || ''}
                    onChange={(e) => handleChange('salePrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                    placeholder="3999"
                  />
                </div>

                <div>
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => handleChange('stock', parseInt(e.target.value))}
                    placeholder="100"
                  />
                </div>

                <div>
                  <Label htmlFor="rating">Rating (out of 5)</Label>
                  <Input
                    id="rating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => handleChange('rating', parseFloat(e.target.value))}
                    placeholder="4.5"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Enter detailed product description..."
                  rows={6}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Product Images <span className="text-red-500">*</span></CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="images">Upload Images (drag to reorder)</Label>
                <div className="flex items-center gap-4 mt-2">
                  <label htmlFor="images" className="cursor-pointer">
                    <div className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition">
                      <Upload className="w-5 h-5" />
                      <span>{uploadingImages ? 'Uploading...' : 'Upload Images'}</span>
                    </div>
                    <input
                      id="images"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploadingImages}
                    />
                  </label>
                </div>
              </div>

              {formData.images && formData.images.length > 0 && (
                <div className="grid grid-cols-4 gap-4">
                  {formData.images.map((url, index) => (
                    <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
                      <Image
                        src={url}
                        alt={`Product image ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="200px"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      {index === 0 && (
                        <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                          Primary
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Specifications */}
          <Card>
            <CardHeader>
              <CardTitle>Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="material">Material</Label>
                  <Input
                    id="material"
                    value={formData.specifications?.material}
                    onChange={(e) => handleSpecChange('material', e.target.value)}
                    placeholder="100% PU Leather"
                  />
                </div>
                <div>
                  <Label htmlFor="texture">Texture</Label>
                  <Input
                    id="texture"
                    value={formData.specifications?.texture}
                    onChange={(e) => handleSpecChange('texture', e.target.value)}
                    placeholder="Smooth, Fine-Grained"
                  />
                </div>
                <div>
                  <Label htmlFor="closureType">Closure Type</Label>
                  <Input
                    id="closureType"
                    value={formData.specifications?.closureType}
                    onChange={(e) => handleSpecChange('closureType', e.target.value)}
                    placeholder="Zipper closure"
                  />
                </div>
                <div>
                  <Label htmlFor="hardware">Hardware</Label>
                  <Input
                    id="hardware"
                    value={formData.specifications?.hardware}
                    onChange={(e) => handleSpecChange('hardware', e.target.value)}
                    placeholder="Gold-Tone Accents"
                  />
                </div>
                <div>
                  <Label htmlFor="shoulderDrop">Shoulder Drop</Label>
                  <Input
                    id="shoulderDrop"
                    value={formData.specifications?.shoulderDrop}
                    onChange={(e) => handleSpecChange('shoulderDrop', e.target.value)}
                    placeholder="26 cm"
                  />
                </div>
                <div>
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    value={formData.specifications?.capacity}
                    onChange={(e) => handleSpecChange('capacity', e.target.value)}
                    placeholder="Approx. 10-12 Liters"
                  />
                </div>
                <div>
                  <Label htmlFor="dimensions">Dimensions</Label>
                  <Input
                    id="dimensions"
                    value={formData.specifications?.dimensions}
                    onChange={(e) => handleSpecChange('dimensions', e.target.value)}
                    placeholder="Height: 28 cm"
                  />
                </div>
                <div>
                  <Label htmlFor="idealFor">Ideal For</Label>
                  <Input
                    id="idealFor"
                    value={formData.specifications?.idealFor}
                    onChange={(e) => handleSpecChange('idealFor', e.target.value)}
                    placeholder="Daily use, work, travel"
                  />
                </div>
              </div>

              {/* Compartments */}
              <div>
                <Label>Compartments</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newCompartment}
                    onChange={(e) => setNewCompartment(e.target.value)}
                    placeholder="e.g., 1 main compartment"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCompartment())}
                  />
                  <Button type="button" onClick={addCompartment} variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {formData.specifications?.compartments && formData.specifications.compartments.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.specifications.compartments.map((comp, index) => (
                      <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2">
                        <span className="text-sm">{comp}</span>
                        <button type="button" onClick={() => removeCompartment(index)}>
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="e.g., Water-resistant material"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                />
                <Button type="button" onClick={addFeature} variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {formData.features && formData.features.length > 0 && (
                <ul className="space-y-2">
                  {formData.features.map((feature, index) => (
                    <li key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                      <span>{feature}</span>
                      <button type="button" onClick={() => removeFeature(index)}>
                        <X className="w-4 h-4 text-red-500" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Color Variants */}
          <Card>
            <CardHeader>
              <CardTitle>Color Variants</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newColorName}
                  onChange={(e) => setNewColorName(e.target.value)}
                  placeholder="Color name (e.g., Mint Green)"
                  className="flex-1"
                />
                <Input
                  type="color"
                  value={newColorValue}
                  onChange={(e) => setNewColorValue(e.target.value)}
                  className="w-20"
                />
                <Button type="button" onClick={addColor} variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {formData.colors && formData.colors.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.colors.map((color, index) => (
                    <div key={index} className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
                      <div
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: color.value }}
                      />
                      <span className="text-sm">{color.name}</span>
                      <button type="button" onClick={() => removeColor(index)}>
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Settings */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status">Publication Status</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-gray-300"
                >
                  {PRODUCT_STATUS.map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) => handleChange('isFeatured', e.target.checked)}
                  className="w-4 h-4"
                />
                <Label htmlFor="isFeatured">Featured Product</Label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isNewArrival"
                  checked={formData.isNewArrival}
                  onChange={(e) => handleChange('isNewArrival', e.target.checked)}
                  className="w-4 h-4"
                />
                <Label htmlFor="isNewArrival">New Arrival</Label>
              </div>
            </CardContent>
          </Card>

          {/* Sections */}
          <Card>
            <CardHeader>
              <CardTitle>Display Sections</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Select where this product should appear on the website
              </p>
              <div className="space-y-2">
                {PRODUCT_SECTIONS.map(section => (
                  <div key={section.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`section-${section.id}`}
                      checked={formData.sections?.includes(section.id)}
                      onChange={() => toggleSection(section.id)}
                      className="w-4 h-4"
                    />
                    <Label htmlFor={`section-${section.id}`} className="cursor-pointer">
                      {section.name}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* SEO */}
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleChange('slug', e.target.value)}
                  placeholder="product-name-color"
                />
              </div>

              <div>
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={formData.metaTitle}
                  onChange={(e) => handleChange('metaTitle', e.target.value)}
                  placeholder="Product Name | Kibana"
                />
              </div>

              <div>
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={formData.metaDescription}
                  onChange={(e) => handleChange('metaDescription', e.target.value)}
                  placeholder="SEO description..."
                  rows={3}
                />
              </div>

              <div>
                <Label>Tags</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {formData.tags && formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag, index) => (
                      <div key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center gap-1 text-sm">
                        <span>{tag}</span>
                        <button type="button" onClick={() => removeTag(index)}>
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
