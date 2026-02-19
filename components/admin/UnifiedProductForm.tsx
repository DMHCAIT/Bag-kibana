"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  X,
  Upload,
  Save,
  Eye,
  ArrowUp,
  ArrowDown,
  GripVertical,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";

/**
 * Unified Product Form Component
 * - Consolidated from EnhancedProductForm, ProductForm, and FormComponent
 * - Supports both create and edit modes
 * - Features: Image management, dynamic arrays, specifications, SEO
 * - File validation, error handling with retry logic
 */

interface Specifications {
  material?: string;
  texture?: string;
  closureType?: string;
  hardware?: string;
  compartments?: string[];
  shoulderDrop?: string;
  capacity?: string;
  dimensions?: string;
  [key: string]: any;
}

interface Color {
  name: string;
  value?: string;
  image?: string;
  available?: boolean;
}

interface ProductFormData {
  // Basic Info
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  
  // Classification
  category: string;
  section?: string;
  
  // Pricing & Stock
  price: string;
  salePrice?: string;
  stock: string;
  sku?: string;
  
  // Product Content
  images: string[];
  colors: (string | Color)[];
  features: string[];
  careInstructions: string[];
  specifications: Specifications;
  
  // Publishing & Flags
  status: 'draft' | 'published' | 'archived';
  isBestseller?: boolean;
  isNewArrival?: boolean;
  isFeatured?: boolean;
  
  // SEO
  metaTitle?: string;
  metaDescription?: string;
  tags?: string[];
  
  // Display
  displayOrder: string;
  
  // Legacy field support
  is_bestseller?: boolean;
  is_new?: boolean;
  rating?: string;
  reviews?: string;
  [key: string]: any;
}

interface UnifiedProductFormProps {
  productId?: string;
  initialData?: any;
  mode?: 'create' | 'edit';
  onSave?: (data: any) => void;
}

const PRODUCT_CATEGORIES = [
  { value: 'TOTE', label: 'Tote Bags' },
  { value: 'SLING', label: 'Sling Bags' },
  { value: 'SHOULDER', label: 'Shoulder Bags' },
  { value: 'CLUTCH', label: 'Clutches' },
  { value: 'BACKPACK', label: 'Backpacks' },
  { value: 'WALLET', label: 'Wallets' },
  { value: 'CROSSBODY', label: 'Crossbody Bags' },
];

const PRODUCT_SECTIONS = [
  { value: 'bestsellers', label: 'Bestsellers' },
  { value: 'new-arrivals', label: 'New Arrivals' },
  { value: 'featured', label: 'Featured' },
  { value: 'sale', label: 'Sale' },
];

const DEFAULT_SPECIFICATIONS: Specifications = {
  material: 'Vegan Leather',
  texture: 'Textured',
  closureType: 'Magnetic Snap',
  hardware: 'Gold-toned',
  compartments: ['1 main compartment', '2 inner pockets'],
  shoulderDrop: '10 inches',
  capacity: 'Fits essentials and more',
  dimensions: '12 x 8 x 4 inches',
};

export default function UnifiedProductForm({
  productId,
  initialData,
  mode = 'create',
  onSave,
}: UnifiedProductFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditing = !!productId || mode === 'edit';

  // ===== STATE =====
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [categories, setCategories] = useState<Array<{value: string; label: string}>>([]);
  const [slugValidation, setSlugValidation] = useState<{
    isValid: boolean;
    available: boolean;
    message?: string;
  } | null>(null);
  const slugValidationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [formData, setFormData] = useState<ProductFormData>({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    shortDescription: initialData?.shortDescription || initialData?.short_description || '',
    category: initialData?.category || 'TOTE',
    section: initialData?.section || '',
    price: String(initialData?.price || ''),
    salePrice: initialData?.salePrice || initialData?.sale_price ? String(initialData.salePrice || initialData.sale_price) : '',
    stock: String(initialData?.stock || '0'),
    sku: initialData?.sku || '',
    status: initialData?.status || 'draft',
    images: Array.isArray(initialData?.images) ? initialData.images : [],
    colors: Array.isArray(initialData?.colors) ? initialData.colors : [],
    features: Array.isArray(initialData?.features) ? initialData.features : [],
    careInstructions: Array.isArray(initialData?.careInstructions || initialData?.care_instructions) 
      ? (initialData.careInstructions || initialData.care_instructions) 
      : [],
    specifications: {
      ...DEFAULT_SPECIFICATIONS,
      ...(initialData?.specifications || {}),
    },
    metaTitle: initialData?.metaTitle || initialData?.meta_title || '',
    metaDescription: initialData?.metaDescription || initialData?.meta_description || '',
    tags: Array.isArray(initialData?.tags) ? initialData.tags : [],
    displayOrder: String(initialData?.displayOrder || initialData?.display_order || '0'),
    isBestseller: initialData?.isBestseller ?? initialData?.is_bestseller ?? false,
    isNewArrival: initialData?.isNewArrival ?? initialData?.is_new ?? false,
    isFeatured: initialData?.isFeatured ?? false,
    rating: String(initialData?.rating || '4.5'),
    reviews: String(initialData?.reviews || '0'),
  });

  const [dynamicInputs, setDynamicInputs] = useState({
    newColor: '',
    newFeature: '',
    newCareInstruction: '',
    newTag: '',
    newCompartment: '',
  });

  // ===== FETCH PRODUCT (EDIT MODE) =====
  const fetchProduct = useCallback(async () => {
    if (!productId) return;
    try {
      const response = await fetch(`/api/admin/products/${productId}`);
      if (!response.ok) throw new Error('Failed to fetch');
      
      const data = await response.json();
      const product = data.product || data;

      setFormData({
        name: product.name || '',
        slug: product.slug || '',
        description: product.description || '',
        shortDescription: product.shortDescription || product.short_description || '',
        category: product.category || 'TOTE',
        section: product.section || '',
        price: String(product.price || ''),
        salePrice: product.salePrice || product.sale_price ? String(product.salePrice || product.sale_price) : '',
        stock: String(product.stock || '0'),
        sku: product.sku || '',
        status: product.status || 'draft',
        images: Array.isArray(product.images) ? product.images : [],
        colors: Array.isArray(product.colors) ? product.colors : [],
        features: Array.isArray(product.features) ? product.features : [],
        careInstructions: Array.isArray(product.careInstructions || product.care_instructions)
          ? (product.careInstructions || product.care_instructions)
          : [],
        specifications: {
          ...DEFAULT_SPECIFICATIONS,
          ...(product.specifications || {}),
        },
        metaTitle: product.metaTitle || product.meta_title || '',
        metaDescription: product.metaDescription || product.meta_description || '',
        tags: Array.isArray(product.tags) ? product.tags : [],
        displayOrder: String(product.displayOrder || product.display_order || '0'),
        isBestseller: product.isBestseller ?? product.is_bestseller ?? false,
        isNewArrival: product.isNewArrival ?? product.is_new ?? false,
        isFeatured: product.isFeatured ?? false,
        rating: String(product.rating || '4.5'),
        reviews: String(product.reviews || '0'),
      });
    } catch (error) {
      console.error('Failed to fetch product:', error);
      alert('Failed to load product');
    } finally {
      setLoading(false);
    }
  }, [productId]);

  // ===== FETCH CATEGORIES =====
  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/categories?active=true');
      const data = await response.json();
      if (data.categories) {
        const categoryOptions = data.categories.map((cat: any) => ({
          value: cat.value,
          label: cat.name,
        }));
        setCategories(categoryOptions);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      // Fallback to hardcoded categories if API fails
      setCategories(PRODUCT_CATEGORIES);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId, fetchProduct]);

  // ===== SLUG VALIDATION =====
  const validateSlug = useCallback(async (slugValue: string) => {
    if (!slugValue) {
      setSlugValidation(null);
      return;
    }

    try {
      const params = new URLSearchParams({
        slug: slugValue,
        ...(isEditing && productId && { excludeId: productId }),
      });
      
      const response = await fetch(`/api/admin/products/validate-slug?${params}`);
      const data = await response.json();
      setSlugValidation(data);
    } catch (error) {
      console.error('Slug validation error:', error);
      setSlugValidation({
        isValid: false,
        available: false,
        message: 'Failed to validate slug',
      });
    }
  }, [isEditing, productId]);

  const handleSlugChange = (value: string) => {
    setFormData(prev => ({ ...prev, slug: value }));
    
    if (slugValidationTimeoutRef.current) {
      clearTimeout(slugValidationTimeoutRef.current);
    }

    slugValidationTimeoutRef.current = setTimeout(() => {
      validateSlug(value);
    }, 500);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (slugValidationTimeoutRef.current) {
        clearTimeout(slugValidationTimeoutRef.current);
      }
    };
  }, []);

  // ===== HANDLERS =====
  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Auto-regenerate slug from name whenever name changes
    if (field === 'name') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData((prev) => ({ ...prev, slug }));
      // Validate the new slug
      validateSlug(slug);
    }

    // Validate slug when manually edited
    if (field === 'slug') {
      handleSlugChange(value);
    }
  };

  const handleDynamicInputChange = (field: string, value: string) => {
    setDynamicInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addToArray = (field: string, value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    // Check for duplicates
    const arrayField = formData[field];
    if (Array.isArray(arrayField)) {
      const isDuplicate = arrayField.some((item) => {
        if (typeof item === 'string') return item.toLowerCase() === trimmed.toLowerCase();
        if (typeof item === 'object' && item.name) return item.name.toLowerCase() === trimmed.toLowerCase();
        return false;
      });
      if (isDuplicate) return;
    }

    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), trimmed],
    }));

    // Clear input
    const inputField = field === 'careInstructions' ? 'newCareInstruction' : `new${field.charAt(0).toUpperCase() + field.slice(1)}`;
    setDynamicInputs((prev) => ({
      ...prev,
      [inputField]: '',
    }));
  };

  const removeFromArray = (field: string, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_: any, i: number) => i !== index),
    }));
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    try {
      setUploadingImages(true);
      const maxSize = 50 * 1024 * 1024; // 50MB per file (Supabase limit)
      const fileArray = Array.from(files);

      // Validation
      for (const file of fileArray) {
        if (file.size > maxSize) {
          alert(
            `File "${file.name}" is too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Maximum size is 50MB.`
          );
          return;
        }
        if (!file.type.startsWith('image/')) {
          alert(`File "${file.name}" is not an image. Please select only image files.`);
          return;
        }
      }

      // Upload via API with auth
      const uploadedUrls: string[] = [];
      const failedFiles: Array<{name: string; error: string}> = [];

      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        const formDataObj = new FormData();
        formDataObj.append('file', file);

        try {
          const response = await fetch('/api/admin/upload', {
            method: 'POST',
            body: formDataObj,
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
            },
          });

          const result = await response.json();

          if (!response.ok || !result.url) {
            failedFiles.push({
              name: file.name,
              error: result.error || 'Upload failed',
            });
            continue;
          }

          uploadedUrls.push(result.url);
          setUploadProgress(Math.round(((i + 1) / fileArray.length) * 100));
        } catch (err: any) {
          console.error(`Error uploading ${file.name}:`, err);
          failedFiles.push({
            name: file.name,
            error: err.message || 'Network error',
          });
        }
      }

      if (uploadedUrls.length > 0) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...uploadedUrls],
        }));
      }

      if (failedFiles.length > 0) {
        const failureMessage = failedFiles
          .map((f) => `${f.name}: ${f.error}`)
          .join('\n');
        alert(`Upload completed with errors:\n\n${failureMessage}`);
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      alert('Failed to upload images: ' + (error.message || 'Unknown error'));
    } finally {
      setUploadingImages(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSave = async (status: 'draft' | 'published' | 'archived' = formData.status) => {
    if (!formData.name.trim()) {
      alert('Product name is required');
      return;
    }
    if (!formData.price) {
      alert('Product price is required');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: formData.name.trim(),
        slug: formData.slug.trim() || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: formData.description.trim(),
        shortDescription: formData.shortDescription?.trim(),
        category: formData.category,
        section: formData.section,
        price: parseFloat(formData.price),
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
        stock: parseInt(formData.stock) || 0,
        sku: formData.sku?.trim(),
        status,
        images: formData.images,
        colors: formData.colors,
        features: formData.features,
        careInstructions: formData.careInstructions,
        specifications: formData.specifications,
        metaTitle: formData.metaTitle?.trim(),
        metaDescription: formData.metaDescription?.trim(),
        tags: formData.tags,
        displayOrder: parseInt(formData.displayOrder) || 0,
        isBestseller: formData.isBestseller,
        isNewArrival: formData.isNewArrival,
        isFeatured: formData.isFeatured,
        rating: parseFloat(formData.rating || '4.5'),
        reviews: parseInt(formData.reviews || '0'),
      };

      const url = isEditing
        ? `/api/admin/products/${productId || initialData?.id}`
        : '/api/admin/products';

      const method = isEditing ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save product');
      }

      const result = await response.json();
      
      if (onSave) {
        onSave(result);
      } else {
        alert(`Product ${isEditing ? 'updated' : 'created'} successfully!`);
        router.push('/admin/products');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert(error instanceof Error ? error.message : 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...formData.images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const handleDeleteImage = async (imageUrl: string, index: number) => {
    try {
      // Extract filename from URL
      const urlObj = new URL(imageUrl);
      const pathParts = urlObj.pathname.split('product-images/');
      const filePath = pathParts.length > 1 ? pathParts[1] : '';
      
      if (!filePath) {
        console.warn('Could not extract filename from URL');
        removeFromArray('images', index);
        return;
      }

      // Call delete API
      const response = await fetch(`/api/admin/images/${encodeURIComponent(filePath)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
        },
      });

      if (response.ok) {
        removeFromArray('images', index);
        console.log('Image deleted successfully');
      } else {
        const error = await response.json();
        console.error('Delete error:', error);
        alert('Failed to delete image');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      // Still remove from form even if storage delete fails
      removeFromArray('images', index);
    }
  };

  const handleSpecificationChange = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [key]: value,
      },
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Loading product...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-gray-600 mt-1">
            Create and manage product content for your online store
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => handleSave('draft')}
            disabled={saving}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          <Button onClick={() => handleSave('published')} disabled={saving}>
            <Eye className="w-4 h-4 mr-2" />
            {saving ? 'Publishing...' : 'Publish'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  placeholder="product-url-slug"
                  className={slugValidation ? (slugValidation.available ? 'border-green-500' : 'border-red-500') : ''}
                />
                {slugValidation && (
                  <div className={`text-sm mt-1 ${slugValidation.available ? 'text-green-600' : 'text-red-600'}`}>
                    {slugValidation.available ? '✓ Slug is available' : '✗ ' + (slugValidation.message || 'Slug is not available')}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Detailed product description"
                  rows={6}
                />
              </div>

              <div>
                <Label htmlFor="shortDescription">Short Description</Label>
                <Textarea
                  id="shortDescription"
                  value={formData.shortDescription}
                  onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                  placeholder="Brief product summary (for listings)"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Product Images */}
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleImageUpload(e.target.files)}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImages}
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploadingImages
                    ? `Uploading... ${uploadProgress}%`
                    : 'Upload Images (Max 50MB each)'}
                </Button>
                {uploadingImages && (
                  <div className="mt-2 bg-gray-100 rounded h-2">
                    <div
                      className="bg-blue-500 h-full rounded transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}
              </div>

              {formData.images.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {formData.images.map((image, index) => (
                    <div
                      key={index}
                      className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden"
                    >
                      <Image
                        src={image}
                        alt={`Product image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => moveImage(index, index - 1)}
                            className="bg-white text-black p-1 rounded hover:bg-gray-200"
                            title="Move up"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                        )}
                        {index < formData.images.length - 1 && (
                          <button
                            type="button"
                            onClick={() => moveImage(index, index + 1)}
                            className="bg-white text-black p-1 rounded hover:bg-gray-200"
                            title="Move down"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(image, index)}
                          className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                          title="Delete"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      {index === 0 && (
                        <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold">
                          Featured
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Product Attributes */}
          <Card>
            <CardHeader>
              <CardTitle>Product Attributes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Colors */}
              <div>
                <Label>Available Colors</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={dynamicInputs.newColor}
                    onChange={(e) => handleDynamicInputChange('newColor', e.target.value)}
                    placeholder="Add color (e.g., Navy Blue)"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addToArray('colors', dynamicInputs.newColor);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => addToArray('colors', dynamicInputs.newColor)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.colors.map((color, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer hover:bg-red-500 hover:text-white"
                      onClick={() => removeFromArray('colors', index)}
                    >
                      {typeof color === 'string' ? color : color.name}
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <Label>Features</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={dynamicInputs.newFeature}
                    onChange={(e) => handleDynamicInputChange('newFeature', e.target.value)}
                    placeholder="Add feature"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addToArray('features', dynamicInputs.newFeature);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => addToArray('features', dynamicInputs.newFeature)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-1 mt-2">
                  {formData.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 p-2 rounded"
                    >
                      <span className="text-sm">{feature}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromArray('features', index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Care Instructions */}
              <div>
                <Label>Care Instructions</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={dynamicInputs.newCareInstruction}
                    onChange={(e) =>
                      handleDynamicInputChange('newCareInstruction', e.target.value)
                    }
                    placeholder="Add care instruction"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addToArray('careInstructions', dynamicInputs.newCareInstruction);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={() =>
                      addToArray('careInstructions', dynamicInputs.newCareInstruction)
                    }
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-1 mt-2">
                  {formData.careInstructions.map((instruction, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 p-2 rounded"
                    >
                      <span className="text-sm">{instruction}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromArray('careInstructions', index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Specifications */}
          <Card>
            <CardHeader>
              <CardTitle>Product Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="material">Material</Label>
                  <Input
                    id="material"
                    value={formData.specifications.material || ''}
                    onChange={(e) => handleSpecificationChange('material', e.target.value)}
                    placeholder="e.g., Vegan Leather"
                  />
                </div>
                <div>
                  <Label htmlFor="texture">Texture</Label>
                  <Input
                    id="texture"
                    value={formData.specifications.texture || ''}
                    onChange={(e) => handleSpecificationChange('texture', e.target.value)}
                    placeholder="e.g., Textured"
                  />
                </div>
                <div>
                  <Label htmlFor="closureType">Closure Type</Label>
                  <Input
                    id="closureType"
                    value={formData.specifications.closureType || ''}
                    onChange={(e) => handleSpecificationChange('closureType', e.target.value)}
                    placeholder="e.g., Magnetic Snap"
                  />
                </div>
                <div>
                  <Label htmlFor="hardware">Hardware</Label>
                  <Input
                    id="hardware"
                    value={formData.specifications.hardware || ''}
                    onChange={(e) => handleSpecificationChange('hardware', e.target.value)}
                    placeholder="e.g., Gold-toned"
                  />
                </div>
                <div>
                  <Label htmlFor="shoulderDrop">Shoulder Drop</Label>
                  <Input
                    id="shoulderDrop"
                    value={formData.specifications.shoulderDrop || ''}
                    onChange={(e) => handleSpecificationChange('shoulderDrop', e.target.value)}
                    placeholder="e.g., 10 inches"
                  />
                </div>
                <div>
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    value={formData.specifications.capacity || ''}
                    onChange={(e) => handleSpecificationChange('capacity', e.target.value)}
                    placeholder="e.g., Fits essentials and more"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="dimensions">Dimensions</Label>
                  <Input
                    id="dimensions"
                    value={formData.specifications.dimensions || ''}
                    onChange={(e) => handleSpecificationChange('dimensions', e.target.value)}
                    placeholder="e.g., 12 x 8 x 4 inches (L x H x W)"
                  />
                </div>
              </div>

              {/* Compartments */}
              <div>
                <Label>Compartments</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={dynamicInputs.newCompartment}
                    onChange={(e) => handleDynamicInputChange('newCompartment', e.target.value)}
                    placeholder="Add compartment description"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const compartments = formData.specifications.compartments || [];
                        if (!Array.isArray(compartments)) {
                          handleSpecificationChange('compartments', JSON.stringify([dynamicInputs.newCompartment]));
                        } else {
                          handleSpecificationChange('compartments', JSON.stringify([...compartments, dynamicInputs.newCompartment]));
                        }
                        handleDynamicInputChange('newCompartment', '');
                      }
                    }}
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      const compartments = formData.specifications.compartments || [];
                      if (!Array.isArray(compartments)) {
                        handleSpecificationChange('compartments', JSON.stringify([dynamicInputs.newCompartment]));
                      } else {
                        handleSpecificationChange('compartments', JSON.stringify([...compartments, dynamicInputs.newCompartment]));
                      }
                      handleDynamicInputChange('newCompartment', '');
                    }}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {Array.isArray(formData.specifications.compartments) && (
                  <div className="space-y-1 mt-2">
                    {formData.specifications.compartments.map((comp, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-2 rounded"
                      >
                        <span className="text-sm">{comp}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const compartments = formData.specifications.compartments || [];
                            handleSpecificationChange('compartments', JSON.stringify(compartments.filter((_: any, i: number) => i !== index)));
                          }}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publishing */}
          <Card>
            <CardHeader>
              <CardTitle>Publishing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    handleInputChange('status', value as any)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isBestseller}
                    onChange={(e) =>
                      handleInputChange('isBestseller', e.target.checked)
                    }
                  />
                  <span className="text-sm">Mark as Bestseller</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isNewArrival}
                    onChange={(e) =>
                      handleInputChange('isNewArrival', e.target.checked)
                    }
                  />
                  <span className="text-sm">Mark as New Arrival</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) =>
                      handleInputChange('isFeatured', e.target.checked)
                    }
                  />
                  <span className="text-sm">Mark as Featured</span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Product Details */}
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    handleInputChange('category', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.length > 0 ? (
                      categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))
                    ) : (
                      PRODUCT_CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="section">Section</Label>
                <Select
                  value={formData.section}
                  onValueChange={(value) =>
                    handleInputChange('section', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Optional" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {PRODUCT_SECTIONS.map((section) => (
                      <SelectItem key={section.value} value={section.value}>
                        {section.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="0"
                  />
                </div>

                <div>
                  <Label htmlFor="salePrice">Sale Price</Label>
                  <Input
                    id="salePrice"
                    type="number"
                    step="0.01"
                    value={formData.salePrice}
                    onChange={(e) => handleInputChange('salePrice', e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => handleInputChange('stock', e.target.value)}
                    placeholder="0"
                  />
                </div>

                <div>
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => handleInputChange('sku', e.target.value)}
                    placeholder="SKU-001"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="displayOrder">Display Order</Label>
                <Input
                  id="displayOrder"
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => handleInputChange('displayOrder', e.target.value)}
                  placeholder="0"
                />
              </div>
            </CardContent>
          </Card>

          {/* SEO */}
          <Card>
            <CardHeader>
              <CardTitle>SEO & Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={formData.metaTitle}
                  onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                  placeholder="SEO title (50-60 chars)"
                />
              </div>

              <div>
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={formData.metaDescription}
                  onChange={(e) =>
                    handleInputChange('metaDescription', e.target.value)
                  }
                  placeholder="SEO description (150-160 chars)"
                  rows={3}
                />
              </div>

              <div>
                <Label>Tags</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={dynamicInputs.newTag}
                    onChange={(e) =>
                      handleDynamicInputChange('newTag', e.target.value)
                    }
                    placeholder="Add tag"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addToArray('tags', dynamicInputs.newTag);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => addToArray('tags', dynamicInputs.newTag)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(formData.tags || []).map((tag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => removeFromArray('tags', index)}
                    >
                      {tag}
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
