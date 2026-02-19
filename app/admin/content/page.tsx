"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Image,
  Layout,
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye,
  Save,
  X,
  Upload,
} from "lucide-react";
import NextImage from "next/image";

interface ContentItem {
  id: string;
  type: 'hero' | 'banner' | 'collection' | 'page' | 'announcement';
  title: string;
  content: string;
  image?: string;
  link?: string;
  status: 'published' | 'draft' | 'archived';
  position: number;
  metadata: any;
  createdAt: string;
  updatedAt: string;
}

export default function ContentManagementSystem() {
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    type: 'banner' as ContentItem['type'],
    title: '',
    content: '',
    image: '',
    link: '',
    status: 'draft' as ContentItem['status'],
    position: 0,
    metadata: {},
  });

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const response = await fetch('/api/admin/content');
      if (response.ok) {
        const data = await response.json();
        setContents(data.contents || []);
      }
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = isEditing 
        ? `/api/admin/content/${selectedContent?.id}`
        : '/api/admin/content';
      
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await loadContent();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving content:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this content?')) {
      try {
        await fetch(`/api/admin/content/${id}`, { method: 'DELETE' });
        await loadContent();
      } catch (error) {
        console.error('Error deleting content:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'banner',
      title: '',
      content: '',
      image: '',
      link: '',
      status: 'draft',
      position: 0,
      metadata: {},
    });
    setSelectedContent(null);
    setIsEditing(false);
  };

  const startEdit = (content: ContentItem) => {
    setSelectedContent(content);
    setFormData({
      type: content.type,
      title: content.title,
      content: content.content,
      image: content.image || '',
      link: content.link || '',
      status: content.status,
      position: content.position,
      metadata: content.metadata,
    });
    setIsEditing(true);
  };

  const contentTypes = [
    { value: 'hero', label: 'Hero Section', icon: Layout },
    { value: 'banner', label: 'Banner', icon: Image },
    { value: 'collection', label: 'Collection Feature', icon: FileText },
    { value: 'page', label: 'Page Content', icon: FileText },
    { value: 'announcement', label: 'Announcement', icon: Settings },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Content Management</h1>
          <p className="text-gray-600 mt-1">
            Manage your website content, banners, and collections
          </p>
        </div>
        <Button onClick={() => setIsEditing(false)} className="mb-4">
          <Plus className="w-4 h-4 mr-2" />
          Add New Content
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="banner">Banners</TabsTrigger>
          <TabsTrigger value="collection">Collections</TabsTrigger>
          <TabsTrigger value="page">Pages</TabsTrigger>
          <TabsTrigger value="announcement">Announcements</TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Content Form */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>
                  {isEditing ? 'Edit Content' : 'Add New Content'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="type">Content Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {contentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Content title"
                  />
                </div>

                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Content description"
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="Image URL"
                  />
                </div>

                <div>
                  <Label htmlFor="link">Link URL</Label>
                  <Input
                    id="link"
                    value={formData.link}
                    onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                    placeholder="Link URL"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}
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

                  <div>
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      type="number"
                      value={formData.position}
                      onChange={(e) => setFormData(prev => ({ ...prev, position: parseInt(e.target.value) }))}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                  {isEditing && (
                    <Button
                      variant="outline"
                      onClick={resetForm}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Content List */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {contents.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No content found. Create your first content item.</p>
                  </CardContent>
                </Card>
              ) : (
                contents.map((content) => (
                  <TabsContent key={content.id} value="all" className="mt-0">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold">{content.title}</h3>
                              <Badge className={getStatusColor(content.status)}>
                                {content.status}
                              </Badge>
                              <Badge variant="outline">
                                {contentTypes.find(t => t.value === content.type)?.label}
                              </Badge>
                            </div>
                            <p className="text-gray-600 text-sm mb-3">
                              {content.content.length > 100 
                                ? content.content.substring(0, 100) + '...'
                                : content.content
                              }
                            </p>
                            {content.image && (
                              <div className="mb-3">
                                <div className="relative w-20 h-16 bg-gray-100 rounded overflow-hidden">
                                  <NextImage
                                    src={content.image}
                                    alt={content.title}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              </div>
                            )}
                            <div className="text-xs text-gray-500">
                              Created: {new Date(content.createdAt).toLocaleDateString()}
                              {content.link && (
                                <span className="ml-4">
                                  Link: <a href={content.link} target="_blank" className="text-blue-600 underline">{content.link}</a>
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => startEdit(content)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(content.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                ))
              )}
            </div>
          </div>
        </div>
      </Tabs>
    </div>
  );
}