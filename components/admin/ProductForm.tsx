"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, X, Upload, ArrowUp, ArrowDown, GripVertical } from "lucide-react";
import Link from "next/link";

interface ProductFormProps {
  productId?: string;
}

interface Specifications {
  material: string;
  texture: string;
  closureType: string;
  hardware: string;
  compartments: string[];
  shoulderDrop: string;
  capacity: string;
  dimensions: string;
}

interface ProductData {
  name: string;
  category: string;
  price: string;
  description: string;
  color: string;
  images: string[];
  stock: string;
  rating: string;
  reviews: string;
  is_bestseller: boolean;
  is_new: boolean;
  features: string[];
  care_instructions: string[];
  specifications: Specifications;
}

export default function ProductForm({ productId }: ProductFormProps) {
  const router = useRouter();
  const isEditing = !!productId;

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<ProductData>({
    name: "",
    category: "TOTE",
    price: "",
    description: "",
    color: "",
    images: [],
    stock: "50",
    rating: "4.5",
    reviews: "10",
    is_bestseller: true,
    is_new: true,
    features: [],
    care_instructions: [],
    specifications: {
      material: "Vegan Leather",
      texture: "Textured",
      closureType: "Magnetic Snap",
      hardware: "Gold-toned",
      compartments: ["1 main compartment", "2 inner pockets"],
      shoulderDrop: "10 inches",
      capacity: "Fits essentials and more",
      dimensions: "12 x 8 x 4 inches (L x H x W)",
    },
  });

  const [newFeature, setNewFeature] = useState("");
  const [newCareInstruction, setNewCareInstruction] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [uploadingImages, setUploadingImages] = useState(false);
  const [newCompartment, setNewCompartment] = useState("");

  const fetchProduct = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`);
      const data = await response.json();
      
      // Handle both old and new API response formats
      const specs = data.specifications || {};
      const defaultSpecs = {
        material: "Vegan Leather",
        texture: "Textured",
        closureType: "Magnetic Snap",
        hardware: "Gold-toned",
        compartments: ["1 main compartment", "2 inner pockets"],
        shoulderDrop: "10 inches",
        capacity: "Fits essentials and more",
        dimensions: "12 x 8 x 4 inches (L x H x W)",
      };
      
      setFormData({
        name: data.name || "",
        category: data.category || "TOTE",
        price: (data.price || 0).toString(),
        description: data.description || "",
        color: data.color || "",
        images: Array.isArray(data.images) ? data.images : [],
        stock: (data.stock || 50).toString(),
        rating: (data.rating || 4.5).toString(),
        reviews: (data.reviews || 10).toString(),
        is_bestseller: data.is_bestseller || data.isBestseller || false,
        is_new: data.is_new || data.isNewArrival || false,
        features: Array.isArray(data.features) ? data.features : [],
        care_instructions: Array.isArray(data.care_instructions) 
          ? data.care_instructions 
          : Array.isArray(data.careInstructions) 
            ? data.careInstructions 
            : [],
        specifications: {
          material: specs.material || defaultSpecs.material,
          texture: specs.texture || defaultSpecs.texture,
          closureType: specs.closureType || defaultSpecs.closureType,
          hardware: specs.hardware || defaultSpecs.hardware,
          compartments: Array.isArray(specs.compartments) ? specs.compartments : defaultSpecs.compartments,
          shoulderDrop: specs.shoulderDrop || defaultSpecs.shoulderDrop,
          capacity: specs.capacity || defaultSpecs.capacity,
          dimensions: specs.dimensions || defaultSpecs.dimensions,
        },
      });
    } catch (error) {
      console.error("Failed to fetch product:", error);
      alert("Failed to load product");
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId, fetchProduct]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = isEditing
        ? `/api/admin/products/${productId}`
        : "/api/admin/products";

      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          rating: parseFloat(formData.rating),
          reviews: parseInt(formData.reviews),
        }),
      });

      if (response.ok) {
        alert(`Product ${isEditing ? "updated" : "created"} successfully!`);
        router.push("/admin/products");
      } else {
        const error = await response.json();
        alert(error.error || "Failed to save product");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()],
      });
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  const addCareInstruction = () => {
    if (newCareInstruction.trim()) {
      setFormData({
        ...formData,
        care_instructions: [
          ...formData.care_instructions,
          newCareInstruction.trim(),
        ],
      });
      setNewCareInstruction("");
    }
  };

  const removeCareInstruction = (index: number) => {
    setFormData({
      ...formData,
      care_instructions: formData.care_instructions.filter(
        (_, i) => i !== index
      ),
    });
  };

  const addImage = () => {
    if (newImageUrl.trim()) {
      setFormData({
        ...formData,
        images: [...formData.images, newImageUrl.trim()],
      });
      setNewImageUrl("");
    }
  };

  // Handle file upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploadingImages(true);
      
      // Validate file sizes before upload (100MB per file for better reliability)
      const maxSize = 100 * 1024 * 1024; // 100MB - more practical limit for web uploads
      const fileArray = Array.from(files);
      
      for (const file of fileArray) {
        if (file.size > maxSize) {
          alert(`File "${file.name}" is too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Maximum size is 100MB. Please compress the image or choose a smaller file.`);
          setUploadingImages(false);
          e.target.value = '';
          return;
        }
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          alert(`File "${file.name}" is not an image. Please select only image files.`);
          setUploadingImages(false);
          e.target.value = '';
          return;
        }
      }
      
      // Upload files in smaller batches to avoid timeouts
      const BATCH_SIZE = 3;
      const uploadedUrls: string[] = [];
      
      for (let i = 0; i < fileArray.length; i += BATCH_SIZE) {
        const batch = fileArray.slice(i, i + BATCH_SIZE);
        const formDataToSend = new FormData();
        
        batch.forEach(file => {
          formDataToSend.append('files', file);
        });

        const response = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formDataToSend
        });

        if (!response.ok) {
          // Handle different error status codes
          if (response.status === 413) {
            alert(`Batch ${Math.floor(i / BATCH_SIZE) + 1}: Files are too large. The maximum total size per batch is approximately 100MB. Please upload fewer or smaller files at a time.`);
            break;
          } else {
            const data = await response.json();
            alert(`Batch ${Math.floor(i / BATCH_SIZE) + 1} upload failed: ${data.error || 'Unknown error'}`);
            break;
          }
        } else {
          const data = await response.json();
          if (data.urls) {
            uploadedUrls.push(...data.urls);
          }
        }
      }

      if (uploadedUrls.length > 0) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...uploadedUrls]
        }));
        alert(`Successfully uploaded ${uploadedUrls.length} image(s)!`);
      } else {
        alert('No images were uploaded. Please try again with smaller files.');
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images. Please check your internet connection and try again.');
    } finally {
      setUploadingImages(false);
      // Reset file input
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const moveImageUp = (index: number) => {
    if (index === 0) return;
    const newImages = [...formData.images];
    [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
    setFormData({
      ...formData,
      images: newImages,
    });
  };

  const moveImageDown = (index: number) => {
    if (index === formData.images.length - 1) return;
    const newImages = [...formData.images];
    [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
    setFormData({
      ...formData,
      images: newImages,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading product...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? "Edit Product" : "Add New Product"}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditing
              ? "Update product information"
              : "Add a new product to your inventory"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Basic Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., PRIZMA SLING"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      <option value="TOTE">Tote Bag</option>
                      <option value="SLING">Sling Bag</option>
                      <option value="CLUTCH">Clutch</option>
                      <option value="LAPTOP BAG">Laptop Bag</option>
                      <option value="BACKPACK">Backpack</option>
                      <option value="WALLET">Wallet</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.color}
                      onChange={(e) =>
                        setFormData({ ...formData, color: e.target.value })
                      }
                      placeholder="e.g., Mint Green"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      placeholder="2499.00"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.stock}
                      onChange={(e) =>
                        setFormData({ ...formData, stock: e.target.value })
                      }
                      placeholder="25"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Describe the product..."
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>
            </div>

            {/* Rating & Reviews */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Rating & Reviews
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating (0-5) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={(e) =>
                      setFormData({ ...formData, rating: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Displayed as stars on product page
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Review Count *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.reviews}
                    onChange={(e) =>
                      setFormData({ ...formData, reviews: e.target.value })
                    }
                    placeholder="10"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Shows as &quot;X Reviews&quot; on product page
                  </p>
                </div>
              </div>
            </div>

            {/* Product Specifications */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Product Specifications
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Material *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.specifications.material}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specifications: {
                            ...formData.specifications,
                            material: e.target.value,
                          },
                        })
                      }
                      placeholder="e.g., Vegan Leather"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Texture *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.specifications.texture}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specifications: {
                            ...formData.specifications,
                            texture: e.target.value,
                          },
                        })
                      }
                      placeholder="e.g., Textured"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Closure Type *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.specifications.closureType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specifications: {
                            ...formData.specifications,
                            closureType: e.target.value,
                          },
                        })
                      }
                      placeholder="e.g., Magnetic Snap"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hardware *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.specifications.hardware}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specifications: {
                            ...formData.specifications,
                            hardware: e.target.value,
                          },
                        })
                      }
                      placeholder="e.g., Gold-toned"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Compartments
                  </label>
                  <div className="space-y-2">
                    {formData.specifications.compartments.map((comp, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg"
                      >
                        <span className="flex-1 text-gray-700">{comp}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const newComps = formData.specifications.compartments.filter(
                              (_, i) => i !== index
                            );
                            setFormData({
                              ...formData,
                              specifications: {
                                ...formData.specifications,
                                compartments: newComps,
                              },
                            });
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newCompartment}
                        onChange={(e) => setNewCompartment(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (newCompartment.trim()) {
                              setFormData({
                                ...formData,
                                specifications: {
                                  ...formData.specifications,
                                  compartments: [
                                    ...formData.specifications.compartments,
                                    newCompartment.trim(),
                                  ],
                                },
                              });
                              setNewCompartment("");
                            }
                          }
                        }}
                        placeholder="e.g., 1 main compartment"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newCompartment.trim()) {
                            setFormData({
                              ...formData,
                              specifications: {
                                ...formData.specifications,
                                compartments: [
                                  ...formData.specifications.compartments,
                                  newCompartment.trim(),
                                ],
                              },
                            });
                            setNewCompartment("");
                          }
                        }}
                        className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Shoulder Drop
                    </label>
                    <input
                      type="text"
                      value={formData.specifications.shoulderDrop}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specifications: {
                            ...formData.specifications,
                            shoulderDrop: e.target.value,
                          },
                        })
                      }
                      placeholder="e.g., 10 inches"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Capacity
                    </label>
                    <input
                      type="text"
                      value={formData.specifications.capacity}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specifications: {
                            ...formData.specifications,
                            capacity: e.target.value,
                          },
                        })
                      }
                      placeholder="e.g., Fits essentials and more"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dimensions (L x H x W) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.specifications.dimensions}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specifications: {
                          ...formData.specifications,
                          dimensions: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g., 12 x 8 x 4 inches"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Features
              </h2>

              <div className="space-y-3">
                {formData.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg"
                  >
                    <span className="flex-1 text-gray-700">{feature}</span>
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                    placeholder="Add a feature..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Care Instructions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Care Instructions
              </h2>

              <div className="space-y-3">
                {formData.care_instructions.map((instruction, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg"
                  >
                    <span className="flex-1 text-gray-700">{instruction}</span>
                    <button
                      type="button"
                      onClick={() => removeCareInstruction(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCareInstruction}
                    onChange={(e) => setNewCareInstruction(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addCareInstruction())
                    }
                    placeholder="Add care instruction..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <button
                    type="button"
                    onClick={addCareInstruction}
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Images */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Product Images
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                First image will be the primary product image. Drag to reorder.
              </p>

              <div className="space-y-3">
                {formData.images.map((image, index) => (
                  <div
                    key={index}
                    className="relative group bg-gray-50 p-2 rounded-lg border-2 border-transparent hover:border-gray-300 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      {/* Order indicator */}
                      <div className="flex flex-col items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => moveImageUp(index)}
                          disabled={index === 0}
                          className={`p-1 rounded hover:bg-gray-200 transition-colors ${
                            index === 0 ? "opacity-30 cursor-not-allowed" : ""
                          }`}
                          title="Move up"
                        >
                          <ArrowUp className="w-4 h-4 text-gray-600" />
                        </button>
                        <div className="flex items-center gap-1">
                          <GripVertical className="w-4 h-4 text-gray-400" />
                          <span className="text-xs font-semibold text-gray-600 bg-white px-2 py-1 rounded">
                            {index + 1}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => moveImageDown(index)}
                          disabled={index === formData.images.length - 1}
                          className={`p-1 rounded hover:bg-gray-200 transition-colors ${
                            index === formData.images.length - 1 ? "opacity-30 cursor-not-allowed" : ""
                          }`}
                          title="Move down"
                        >
                          <ArrowDown className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                      
                      {/* Image preview */}
                      <div className="flex-1 relative">
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="w-full h-32 object-cover rounded"
                    />
                        {index === 0 && (
                          <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded font-medium">
                            Primary
                          </div>
                        )}
                      </div>
                      
                      {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                        className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shrink-0"
                        title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    </div>
                  </div>
                ))}

                <div className="space-y-2">
                  {/* File Upload Button */}
                  <label className="w-full block">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImages}
                      className="hidden"
                      id="image-file-upload"
                    />
                    <div
                      className={`w-full px-4 py-3 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
                        uploadingImages
                          ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
                          : 'border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <Upload className={`w-5 h-5 mx-auto mb-1 ${uploadingImages ? 'text-gray-400' : 'text-gray-600'}`} />
                      <p className={`text-sm ${uploadingImages ? 'text-gray-400' : 'text-gray-600'}`}>
                        {uploadingImages ? 'Uploading...' : 'Click to upload images'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Or drag and drop images here
                      </p>
                    </div>
                  </label>

                  {/* URL Input (Alternative Method) */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-gray-50 px-2 text-gray-500">OR</span>
                    </div>
                  </div>

                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addImage())
                    }
                    placeholder="Paste image URL..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <button
                    type="button"
                    onClick={addImage}
                    disabled={!newImageUrl.trim()}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Add Image URL
                  </button>
                </div>
              </div>
            </div>

            {/* Product Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Product Status
              </h2>

              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_bestseller}
                    onChange={(e) =>
                      setFormData({ ...formData, is_bestseller: e.target.checked })
                    }
                    className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
                  />
                  <div>
                    <div className="font-medium text-gray-900">Bestseller</div>
                    <div className="text-xs text-gray-500">
                      Show in bestsellers section
                    </div>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_new}
                    onChange={(e) =>
                      setFormData({ ...formData, is_new: e.target.checked })
                    }
                    className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
                  />
                  <div>
                    <div className="font-medium text-gray-900">New Arrival</div>
                    <div className="text-xs text-gray-500">
                      Show &quot;New&quot; badge on product
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Stock Status Indicator */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Stock Status
              </h2>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Current Stock:</span>
                  <span className="font-semibold text-lg">{formData.stock || 0} units</span>
                </div>
                
                <div className="mt-4">
                  {parseInt(formData.stock) > 20 && (
                    <div className="flex items-center gap-2 text-green-600">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span className="text-sm">In Stock</span>
                    </div>
                  )}
                  {parseInt(formData.stock) > 0 && parseInt(formData.stock) <= 20 && (
                    <div className="flex items-center gap-2 text-yellow-600">
                      <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                      <span className="text-sm">Low Stock</span>
                    </div>
                  )}
                  {parseInt(formData.stock) === 0 && (
                    <div className="flex items-center gap-2 text-red-600">
                      <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                      <span className="text-sm">Out of Stock</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <button
                type="submit"
                disabled={saving}
                className="w-full px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 font-medium"
              >
                {saving
                  ? "Saving..."
                  : isEditing
                  ? "Update Product"
                  : "Create Product"}
              </button>

              <Link
                href="/admin/products"
                className="block w-full mt-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-center font-medium"
              >
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
