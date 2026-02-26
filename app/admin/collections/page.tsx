"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Loader2, Check } from "lucide-react";
import Image from "next/image";

interface CollectionImage {
  id: string;
  title: string;
  currentUrl: string;
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState<CollectionImage[]>([
    { id: "tote", title: "TOTE BAG", currentUrl: "" },
    { id: "clutch", title: "CLUTCH", currentUrl: "" },
    { id: "sling", title: "SLING", currentUrl: "" },
  ]);
  const [uploading, setUploading] = useState<string | null>(null);
  const [uploadedUrls, setUploadedUrls] = useState<{ [key: string]: string }>({});
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleImageUpload = async (collectionId: string, file: File) => {
    try {
      setUploading(collectionId);
      setMessage(null);

      // Create a unique filename
      const timestamp = new Date().toISOString().split("T")[0];
      const fileName = `${collectionId}-${timestamp}-${file.name}`;
      const filePath = `collection-banners/${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from("product-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      setUploadedUrls((prev) => ({ ...prev, [collectionId]: publicUrl }));
      setMessage({ text: `${collectionId.toUpperCase()} image uploaded successfully!`, type: "success" });

      // Auto-dismiss success message
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Error uploading image:", error);
      setMessage({ text: "Failed to upload image", type: "error" });
    } finally {
      setUploading(null);
    }
  };

  const copyAllUrls = () => {
    const urlText = Object.entries(uploadedUrls)
      .map(([id, url]) => `${id.toUpperCase()}: ${url}`)
      .join("\n\n");
    
    navigator.clipboard.writeText(urlText);
    setMessage({ text: "All URLs copied to clipboard!", type: "success" });
    setTimeout(() => setMessage(null), 2000);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Collections in Focus Images</h1>
        <p className="text-muted-foreground">
          Upload images for the collection banners on the homepage
        </p>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {collections.map((collection) => (
          <Card key={collection.id}>
            <CardHeader>
              <CardTitle>{collection.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Upload Section */}
              <div>
                <Label htmlFor={`upload-${collection.id}`}>Upload Image</Label>
                <div className="mt-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    disabled={uploading === collection.id}
                    onClick={() => {
                      document.getElementById(`upload-${collection.id}`)?.click();
                    }}
                  >
                    {uploading === collection.id ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Choose Image
                      </>
                    )}
                  </Button>
                  <Input
                    id={`upload-${collection.id}`}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(collection.id, file);
                    }}
                  />
                </div>
              </div>

              {/* Preview */}
              {uploadedUrls[collection.id] && (
                <div className="space-y-2">
                  <Label>Preview</Label>
                  <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={uploadedUrls[collection.id]}
                      alt={collection.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Check className="w-4 h-4" />
                    Image uploaded successfully
                  </div>
                </div>
              )}

              {/* URL Display */}
              {uploadedUrls[collection.id] && (
                <div>
                  <Label>Image URL</Label>
                  <div className="mt-2">
                    <Input
                      value={uploadedUrls[collection.id]}
                      readOnly
                      className="font-mono text-xs"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => {
                        navigator.clipboard.writeText(uploadedUrls[collection.id]);
                        setMessage({ text: "URL copied!", type: "success" });
                        setTimeout(() => setMessage(null), 2000);
                      }}
                    >
                      Copy URL
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {Object.keys(uploadedUrls).length > 0 && (
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>All Uploaded URLs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(uploadedUrls).map(([id, url]) => (
                  <div key={id} className="font-mono text-sm p-2 bg-gray-50 rounded">
                    <span className="font-semibold">{id.toUpperCase()}:</span> {url}
                  </div>
                ))}
                <Button onClick={copyAllUrls} className="w-full mt-4">
                  Copy All URLs
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Instructions:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
          <li>Click "Choose Image" for each collection type</li>
          <li>Select an image from your computer</li>
          <li>Wait for the upload to complete</li>
          <li>Copy the generated URL</li>
          <li>Share the URLs with the developer to update the website</li>
        </ol>
      </div>
    </div>
  );
}
