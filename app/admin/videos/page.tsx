"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import NextImage from "next/image";
import {
  Video,
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
  Play,
} from "lucide-react";

interface VideoItem {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  thumbnail_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    video_url: "",
    thumbnail_url: "",
    is_active: true,
  });

  useEffect(() => {
    loadVideos();
  }, []);

  // Auto-dismiss messages
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const loadVideos = async () => {
    try {
      const response = await fetch("/api/admin/videos");
      if (response.ok) {
        const data = await response.json();
        setVideos(data.videos || []);
      } else {
        setError("Failed to load videos");
      }
    } catch {
      setError("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  const handleVideoUpload = async (file: File) => {
    if (!file.type.startsWith("video/")) {
      setError("Please select a video file (MP4, WebM, etc.)");
      return;
    }

    // 100MB limit
    if (file.size > 100 * 1024 * 1024) {
      setError("Video file must be under 100MB");
      return;
    }

    setUploading(true);
    setUploadProgress(10);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      uploadFormData.append("type", "video");

      setUploadProgress(30);

      const response = await fetch("/api/admin/videos/upload", {
        method: "POST",
        body: uploadFormData,
      });

      setUploadProgress(80);

      if (response.ok) {
        const data = await response.json();
        setFormData((prev) => ({ ...prev, video_url: data.url }));
        setUploadProgress(100);
        setSuccess("Video uploaded successfully!");
      } else {
        const data = await response.json();
        setError(data.error || "Upload failed");
      }
    } catch {
      setError("Error uploading video");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleThumbnailUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (response.ok) {
        const data = await response.json();
        const url = data.urls?.[0] || data.url;
        if (url) {
          setFormData((prev) => ({ ...prev, thumbnail_url: url }));
          setSuccess("Thumbnail uploaded!");
        }
      } else {
        setError("Thumbnail upload failed");
      }
    } catch {
      setError("Error uploading thumbnail");
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }
    if (!formData.video_url.trim()) {
      setError("Video URL is required. Upload a video or paste a URL.");
      return;
    }

    setSaving(true);
    try {
      const url = editingId
        ? `/api/admin/videos/${editingId}`
        : "/api/admin/videos";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(editingId ? "Video updated!" : "Video added!");
        resetForm();
        loadVideos();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to save");
      }
    } catch {
      setError("Error saving video");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this video?")) return;

    try {
      const response = await fetch(`/api/admin/videos/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSuccess("Video deleted");
        loadVideos();
      } else {
        setError("Failed to delete video");
      }
    } catch {
      setError("Error deleting video");
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/videos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !currentActive }),
      });

      if (response.ok) {
        loadVideos();
      }
    } catch {
      setError("Error updating video");
    }
  };

  const handleReorder = async (id: string, direction: "up" | "down") => {
    const index = videos.findIndex((v) => v.id === id);
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === videos.length - 1)
    )
      return;

    const swapIndex = direction === "up" ? index - 1 : index + 1;
    const currentVideo = videos[index];
    const swapVideo = videos[swapIndex];

    try {
      // Swap display_order values
      await Promise.all([
        fetch(`/api/admin/videos/${currentVideo.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ display_order: swapVideo.display_order }),
        }),
        fetch(`/api/admin/videos/${swapVideo.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ display_order: currentVideo.display_order }),
        }),
      ]);
      loadVideos();
    } catch {
      setError("Error reordering videos");
    }
  };

  const handleEdit = (video: VideoItem) => {
    setEditingId(video.id);
    setFormData({
      title: video.title,
      description: video.description || "",
      video_url: video.video_url,
      thumbnail_url: video.thumbnail_url || "",
      is_active: video.is_active,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      video_url: "",
      thumbnail_url: "",
      is_active: true,
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Video Management</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage videos shown below &quot;Collections in Focus&quot; on the homepage
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-black hover:bg-gray-800 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Video
        </Button>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center justify-between">
          <span>{success}</span>
          <button onClick={() => setSuccess(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{editingId ? "Edit Video" : "Add New Video"}</span>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Title */}
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="e.g., Craftsmanship Behind KIBANA"
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Brief description of the video"
                rows={2}
              />
            </div>

            {/* Video Upload */}
            <div>
              <Label>Video *</Label>
              <div className="mt-1 space-y-2">
                {formData.video_url ? (
                  <div className="relative rounded-lg overflow-hidden bg-black aspect-video max-w-md">
                    <video
                      src={formData.video_url}
                      className="w-full h-full object-cover"
                      controls
                      muted
                    />
                    <button
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, video_url: "" }))
                      }
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => videoInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                  >
                    {uploading ? (
                      <div className="space-y-2">
                        <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto" />
                        <p className="text-sm text-gray-500">
                          Uploading... {uploadProgress}%
                        </p>
                        <div className="w-48 mx-auto bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-black h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          Click to upload video
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          MP4, WebM • Max 100MB
                        </p>
                      </>
                    )}
                  </div>
                )}
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleVideoUpload(file);
                  }}
                />

                {/* Or paste URL */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400">or paste URL</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>
                <Input
                  value={formData.video_url}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, video_url: e.target.value }))
                  }
                  placeholder="https://example.com/video.mp4"
                />
              </div>
            </div>

            {/* Thumbnail Upload */}
            <div>
              <Label>Thumbnail (optional)</Label>
              <div className="mt-1 space-y-2">
                {formData.thumbnail_url ? (
                  <div className="relative w-32 h-48 rounded-lg overflow-hidden bg-gray-100">
                    <NextImage
                      src={formData.thumbnail_url}
                      alt="Thumbnail"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <button
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, thumbnail_url: "" }))
                      }
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => thumbnailInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 transition-colors w-fit"
                  >
                    <Upload className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">Upload thumbnail</p>
                  </div>
                )}
                <input
                  ref={thumbnailInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleThumbnailUpload(file);
                  }}
                />
              </div>
            </div>

            {/* Active toggle */}
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      is_active: e.target.checked,
                    }))
                  }
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black" />
              </label>
              <span className="text-sm text-gray-600">
                Show on homepage
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-black hover:bg-gray-800 text-white"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {editingId ? "Update Video" : "Add Video"}
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Videos List */}
      {videos.length === 0 && !showForm ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Video className="w-12 h-12 text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg mb-2">No videos yet</p>
            <p className="text-gray-400 text-sm mb-6">
              Add videos to showcase below Collections in Focus
            </p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-black hover:bg-gray-800 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Video
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {videos.map((video, index) => (
            <Card
              key={video.id}
              className={`${!video.is_active ? "opacity-60" : ""}`}
            >
              <CardContent className="flex items-center gap-4 py-4">
                {/* Reorder */}
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => handleReorder(video.id, "up")}
                    disabled={index === 0}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleReorder(video.id, "down")}
                    disabled={index === videos.length - 1}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>

                {/* Video Preview */}
                <div className="relative w-24 h-36 rounded-lg overflow-hidden bg-black shrink-0">
                  {video.thumbnail_url ? (
                    <NextImage
                      src={video.thumbnail_url}
                      alt={video.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <video
                      src={video.video_url}
                      className="w-full h-full object-cover"
                      muted
                      preload="metadata"
                    />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Play className="w-6 h-6 text-white/80" />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900 truncate">
                      {video.title}
                    </h3>
                    <Badge
                      variant={video.is_active ? "default" : "secondary"}
                      className={
                        video.is_active
                          ? "bg-green-100 text-green-700 hover:bg-green-100"
                          : ""
                      }
                    >
                      {video.is_active ? "Active" : "Hidden"}
                    </Badge>
                  </div>
                  {video.description && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                      {video.description}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    Order: {video.display_order} • Added{" "}
                    {new Date(video.created_at).toLocaleDateString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() =>
                      handleToggleActive(video.id, video.is_active)
                    }
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                    title={video.is_active ? "Hide from homepage" : "Show on homepage"}
                  >
                    {video.is_active ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleEdit(video)}
                    className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(video.id)}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
