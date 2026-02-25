"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Instagram,
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  Upload,
  Eye,
  EyeOff,
  Loader2,
  ArrowUp,
  ArrowDown,
  ExternalLink,
} from "lucide-react";

interface InstagramPost {
  id: string;
  image_url: string;
  post_url: string;
  caption: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export default function AdminInstagramPage() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    image_url: "",
    post_url: "https://www.instagram.com/kibanalifeofficial/",
    caption: "",
    is_active: true,
  });

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    if (success) {
      const t = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(t);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const t = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(t);
    }
  }, [error]);

  const loadPosts = async () => {
    try {
      // Fetch all posts including inactive ones via the admin-style call
      const res = await fetch("/api/instagram?all=true");
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
      } else {
        setError("Failed to load posts");
      }
    } catch {
      setError("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (JPG, PNG, WebP)");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be under 10MB");
      return;
    }

    setUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (res.ok) {
        const data = await res.json();
        const url = data.urls?.[0] || data.url;
        if (url) {
          setFormData((prev) => ({ ...prev, image_url: url }));
          setSuccess("Image uploaded!");
        }
      } else {
        setError("Image upload failed");
      }
    } catch {
      setError("Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.image_url.trim()) {
      setError("Please upload an image or paste an image URL");
      return;
    }

    setSaving(true);
    try {
      const body = editingId
        ? { id: editingId, ...formData }
        : formData;

      const res = await fetch("/api/instagram", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setSuccess(editingId ? "Post updated!" : "Post added!");
        resetForm();
        loadPosts();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to save");
      }
    } catch {
      setError("Error saving post");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (post: InstagramPost) => {
    setEditingId(post.id);
    setFormData({
      image_url: post.image_url,
      post_url: post.post_url,
      caption: post.caption || "",
      is_active: post.is_active,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this Instagram post?")) return;
    try {
      const res = await fetch(`/api/instagram?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setSuccess("Post deleted");
        loadPosts();
      } else {
        setError("Failed to delete");
      }
    } catch {
      setError("Error deleting post");
    }
  };

  const handleToggleActive = async (post: InstagramPost) => {
    try {
      const res = await fetch("/api/instagram", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: post.id, is_active: !post.is_active }),
      });
      if (res.ok) {
        loadPosts();
      }
    } catch {
      setError("Error updating post");
    }
  };

  const handleReorder = async (id: string, dir: "up" | "down") => {
    const idx = posts.findIndex((p) => p.id === id);
    if ((dir === "up" && idx === 0) || (dir === "down" && idx === posts.length - 1)) return;

    const swapIdx = dir === "up" ? idx - 1 : idx + 1;
    const updated = [...posts];
    [updated[idx], updated[swapIdx]] = [updated[swapIdx], updated[idx]];

    // Update display_order for both
    try {
      await Promise.all([
        fetch("/api/instagram", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: updated[idx].id, display_order: idx }),
        }),
        fetch("/api/instagram", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: updated[swapIdx].id, display_order: swapIdx }),
        }),
      ]);
      loadPosts();
    } catch {
      setError("Error reordering");
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      image_url: "",
      post_url: "https://www.instagram.com/kibanalifeofficial/",
      caption: "",
      is_active: true,
    });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Instagram className="w-7 h-7 text-pink-500" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Instagram Feed</h1>
            <p className="text-sm text-gray-500">Manage photos shown in the Instagram section on the homepage</p>
          </div>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Photo
          </Button>
        )}
      </div>

      {/* Messages */}
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
          {success}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Add / Edit Form */}
      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{editingId ? "Edit Post" : "Add Instagram Photo"}</span>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Image upload */}
            <div>
              <Label>Photo *</Label>
              <div className="mt-1 flex gap-3 items-start">
                {formData.image_url && (
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-lg border"
                  />
                )}
                <div className="flex-1 space-y-2">
                  <Input
                    placeholder="Paste image URL or upload below"
                    value={formData.image_url}
                    onChange={(e) => setFormData((p) => ({ ...p, image_url: e.target.value }))}
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => imageInputRef.current?.click()}
                      disabled={uploading}
                    >
                      {uploading ? (
                        <><Loader2 className="w-4 h-4 mr-1 animate-spin" /> Uploading…</>
                      ) : (
                        <><Upload className="w-4 h-4 mr-1" /> Upload Image</>
                      )}
                    </Button>
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file);
                        e.target.value = "";
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Instagram Post URL */}
            <div>
              <Label>Instagram Post URL</Label>
              <Input
                className="mt-1"
                placeholder="https://www.instagram.com/p/XXXXXX/"
                value={formData.post_url}
                onChange={(e) => setFormData((p) => ({ ...p, post_url: e.target.value }))}
              />
              <p className="text-xs text-gray-400 mt-1">
                Visitors will be taken here when they click the photo. Paste the direct IG post link, or leave as profile URL.
              </p>
            </div>

            {/* Caption */}
            <div>
              <Label>Caption (optional)</Label>
              <Textarea
                className="mt-1"
                rows={2}
                placeholder="Add a caption that shows on hover…"
                value={formData.caption}
                onChange={(e) => setFormData((p) => ({ ...p, caption: e.target.value }))}
              />
            </div>

            {/* Active toggle */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData((p) => ({ ...p, is_active: e.target.checked }))}
                className="w-4 h-4"
              />
              <Label htmlFor="is_active" className="cursor-pointer">Show on homepage</Label>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button onClick={handleSave} disabled={saving || uploading}>
                {saving ? <><Loader2 className="w-4 h-4 mr-1 animate-spin" /> Saving…</> : <><Save className="w-4 h-4 mr-1" /> Save</>}
              </Button>
              <Button variant="outline" onClick={resetForm}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Posts grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : posts.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Instagram className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">No Instagram photos yet.</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-1" /> Add First Photo
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {posts.map((post, idx) => (
            <Card key={post.id} className="overflow-hidden group">
              <div className="relative aspect-square bg-gray-100">
                <img
                  src={post.image_url}
                  alt={post.caption || "Instagram post"}
                  className="w-full h-full object-cover"
                />
                {/* Active badge */}
                <div className="absolute top-2 left-2">
                  <Badge variant={post.is_active ? "default" : "secondary"} className="text-xs">
                    {post.is_active ? "Active" : "Hidden"}
                  </Badge>
                </div>
                {/* Order badge */}
                <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded">
                  #{idx + 1}
                </div>
              </div>
              <CardContent className="p-2 space-y-1.5">
                {post.caption && (
                  <p className="text-xs text-gray-500 line-clamp-2">{post.caption}</p>
                )}
                <div className="flex items-center justify-between gap-1">
                  {/* Reorder */}
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleReorder(post.id, "up")}
                      disabled={idx === 0}
                      className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                      title="Move up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleReorder(post.id, "down")}
                      disabled={idx === posts.length - 1}
                      className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                      title="Move down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {/* Actions */}
                  <div className="flex gap-1">
                    <a
                      href={post.post_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-gray-400 hover:text-blue-500"
                      title="Open on Instagram"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => handleToggleActive(post)}
                      className="p-1 text-gray-400 hover:text-yellow-600"
                      title={post.is_active ? "Hide" : "Show"}
                    >
                      {post.is_active ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleEdit(post)}
                      className="p-1 text-gray-400 hover:text-blue-600"
                      title="Edit"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-1 text-gray-400 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
