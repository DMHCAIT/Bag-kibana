"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Save,
  RefreshCw,
  Image as ImageIcon,
  Type,
  Link2,
  Globe,
  Layout,
  Smartphone,
  Monitor,
  Check,
  AlertCircle,
  Eye,
  Upload,
  ChevronDown,
  ChevronUp,
  Settings,
  Home,
  ShoppingBag,
  Users,
  FileText,
  Phone,
  Mail,
  Instagram,
  Facebook,
} from "lucide-react";
import NextImage from "next/image";

interface ContentItem {
  id: number;
  section: string;
  content_key: string;
  content_value: string;
  content_type: string;
  display_order: number;
  is_active: boolean;
  metadata: any;
  created_at: string;
  updated_at: string;
}

interface SectionConfig {
  title: string;
  description: string;
  icon: React.ReactNode;
  fields: FieldConfig[];
}

interface FieldConfig {
  key: string;
  label: string;
  type: "text" | "textarea" | "image" | "url" | "json" | "number";
  placeholder?: string;
  help?: string;
}

const SECTION_CONFIGS: Record<string, SectionConfig> = {
  hero_home: {
    title: "Homepage Hero",
    description: "Main hero banner on the homepage",
    icon: <Home className="w-5 h-5" />,
    fields: [
      { key: "image_url", label: "Hero Image", type: "image", help: "Recommended: 1920x800px" },
      { key: "title", label: "Title (optional)", type: "text", placeholder: "Leave empty for image-only hero" },
      { key: "subtitle", label: "Subtitle (optional)", type: "text" },
      { key: "cta_text", label: "Button Text", type: "text", placeholder: "Shop Now" },
      { key: "cta_link", label: "Button Link", type: "url", placeholder: "/shop" },
    ],
  },
  hero_men: {
    title: "Men's Page Hero",
    description: "Hero banner on the Men's collection page",
    icon: <ShoppingBag className="w-5 h-5" />,
    fields: [
      { key: "image_url", label: "Hero Image", type: "image", help: "Recommended: 1916x420px" },
      { key: "title", label: "Page Title", type: "text", placeholder: "MEN'S COLLECTION" },
      { key: "subtitle", label: "Page Description", type: "textarea" },
    ],
  },
  hero_women: {
    title: "Women's Page Hero",
    description: "Hero banner on the Women's collection page",
    icon: <ShoppingBag className="w-5 h-5" />,
    fields: [
      { key: "image_url", label: "Hero Image", type: "image", help: "Recommended: 1916x420px" },
      { key: "title", label: "Page Title", type: "text", placeholder: "WOMEN'S COLLECTION" },
      { key: "subtitle", label: "Page Description", type: "textarea" },
    ],
  },
  bestsellers: {
    title: "Bestsellers Section",
    description: "Bestsellers section on the homepage",
    icon: <Layout className="w-5 h-5" />,
    fields: [
      { key: "title", label: "Section Title", type: "text", placeholder: "BESTSELLERS" },
      { key: "subtitle", label: "Section Subtitle", type: "text", placeholder: "Our most loved bags" },
      { key: "discount_percent", label: "Discount Percentage", type: "number", placeholder: "30" },
      { key: "view_all_link", label: "View All Link", type: "url", placeholder: "/shop" },
    ],
  },
  new_collection: {
    title: "New Collection Section",
    description: "New Collection carousel on the homepage",
    icon: <Layout className="w-5 h-5" />,
    fields: [
      { key: "title", label: "Section Title", type: "text", placeholder: "NEW COLLECTION" },
      { key: "subtitle", label: "Section Subtitle", type: "text", placeholder: "Discover our latest exclusive designs" },
      { key: "discount_percent", label: "Discount Percentage", type: "number", placeholder: "30" },
      { key: "view_all_link", label: "View All Link", type: "url", placeholder: "/shop" },
    ],
  },
  collections_focus: {
    title: "Collections in Focus",
    description: "Featured collections with images on the homepage",
    icon: <Layout className="w-5 h-5" />,
    fields: [
      { key: "title", label: "Section Title", type: "text", placeholder: "COLLECTIONS IN FOCUS" },
      { key: "subtitle", label: "Section Subtitle", type: "text" },
      { key: "collection_1_title", label: "Collection 1 - Title", type: "text" },
      { key: "collection_1_subtitle", label: "Collection 1 - Subtitle", type: "text" },
      { key: "collection_1_image", label: "Collection 1 - Image", type: "image" },
      { key: "collection_1_link", label: "Collection 1 - Link", type: "url" },
      { key: "collection_2_title", label: "Collection 2 - Title", type: "text" },
      { key: "collection_2_subtitle", label: "Collection 2 - Subtitle", type: "text" },
      { key: "collection_2_image", label: "Collection 2 - Image", type: "image" },
      { key: "collection_2_link", label: "Collection 2 - Link", type: "url" },
      { key: "collection_3_title", label: "Collection 3 - Title", type: "text" },
      { key: "collection_3_subtitle", label: "Collection 3 - Subtitle", type: "text" },
      { key: "collection_3_image", label: "Collection 3 - Image", type: "image" },
      { key: "collection_3_link", label: "Collection 3 - Link", type: "url" },
    ],
  },
  split_banner: {
    title: "Split Banner",
    description: "Women/Men split banner on the homepage",
    icon: <Layout className="w-5 h-5" />,
    fields: [
      { key: "women_image", label: "Women Banner Image", type: "image" },
      { key: "women_title", label: "Women Title", type: "text", placeholder: "WOMEN" },
      { key: "women_cta", label: "Women CTA Text", type: "text", placeholder: "Shop All Women" },
      { key: "women_link", label: "Women Link", type: "url", placeholder: "/women" },
      { key: "men_image", label: "Men Banner Image", type: "image" },
      { key: "men_title", label: "Men Title", type: "text", placeholder: "MEN" },
      { key: "men_cta", label: "Men CTA Text", type: "text", placeholder: "Shop All Men" },
      { key: "men_link", label: "Men Link", type: "url", placeholder: "/men" },
    ],
  },
  video_showcase: {
    title: "Video Showcase",
    description: "Video showcase section on the homepage",
    icon: <Monitor className="w-5 h-5" />,
    fields: [
      { key: "title", label: "Section Title", type: "text", placeholder: "VIDEO SHOWCASE" },
      { key: "subtitle", label: "Section Subtitle", type: "text" },
    ],
  },
  header: {
    title: "Header / Navigation",
    description: "Site header, logo, and navigation links",
    icon: <Monitor className="w-5 h-5" />,
    fields: [
      { key: "logo_url", label: "Logo Image", type: "image", help: "Transparent PNG recommended" },
      { key: "nav_links", label: "Navigation Links (JSON)", type: "json", help: 'Format: [{"label":"Shop","url":"/shop"}]' },
    ],
  },
  footer: {
    title: "Footer",
    description: "Site footer content, links, and contact info",
    icon: <FileText className="w-5 h-5" />,
    fields: [
      { key: "newsletter_title", label: "Newsletter Title", type: "text" },
      { key: "newsletter_subtitle", label: "Newsletter Subtitle", type: "text" },
      { key: "phone", label: "Phone Number", type: "text" },
      { key: "email", label: "Email Address", type: "text" },
      { key: "copyright", label: "Copyright Text", type: "text", help: "Use {year} for dynamic year" },
      { key: "shop_links", label: "Shop Links (JSON)", type: "json" },
      { key: "about_links", label: "About Links (JSON)", type: "json" },
      { key: "support_links", label: "Support Links (JSON)", type: "json" },
      { key: "social_facebook", label: "Facebook URL", type: "url" },
      { key: "social_instagram", label: "Instagram URL", type: "url" },
      { key: "social_threads", label: "Threads URL", type: "url" },
      { key: "features", label: "Feature Badges (JSON)", type: "json", help: '["Premium Quality","Easy Returns","COD Available"]' },
      { key: "policy_links", label: "Policy Links (JSON)", type: "json" },
    ],
  },
  global: {
    title: "Global Settings",
    description: "Site-wide settings and defaults",
    icon: <Settings className="w-5 h-5" />,
    fields: [
      { key: "brand_name", label: "Brand Name", type: "text", placeholder: "KIBANA" },
      { key: "default_discount_percent", label: "Default Discount %", type: "number" },
      { key: "currency_symbol", label: "Currency Symbol", type: "text", placeholder: "₹" },
      { key: "whatsapp_number", label: "WhatsApp Number", type: "text" },
    ],
  },
};

export default function SiteSettingsPage() {
  const [allContent, setAllContent] = useState<ContentItem[]>([]);
  const [editedValues, setEditedValues] = useState<Record<number, string>>({});
  const [editedMetadata, setEditedMetadata] = useState<Record<number, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [activeTab, setActiveTab] = useState("hero_home");
  const [expandedSections, setExpandedSections] = useState<string[]>(["hero_home"]);
  const [imageUploading, setImageUploading] = useState<string | null>(null);

  const loadContent = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/site-content");
      if (response.ok) {
        const data = await response.json();
        setAllContent(data);
      } else {
        showMessage("Failed to load content", "error");
      }
    } catch (error) {
      console.error("Error loading content:", error);
      showMessage("Error connecting to server", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const getContentForSection = (section: string): ContentItem[] => {
    return allContent.filter((item) => item.section === section);
  };

  const getContentValue = (section: string, key: string): string => {
    const item = allContent.find(
      (c) => c.section === section && c.content_key === key
    );
    if (!item) return "";
    // Check if there's an edited value
    if (editedValues[item.id] !== undefined) return editedValues[item.id];
    return item.content_value || "";
  };

  const getContentItem = (section: string, key: string): ContentItem | undefined => {
    return allContent.find(
      (c) => c.section === section && c.content_key === key
    );
  };

  const handleValueChange = (section: string, key: string, value: string) => {
    const item = getContentItem(section, key);
    if (item) {
      setEditedValues((prev) => ({ ...prev, [item.id]: value }));
    }
  };

  const handleImageUpload = async (section: string, key: string, file: File) => {
    const uploadKey = `${section}_${key}`;
    setImageUploading(uploadKey);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bucket", "product-images");
      formData.append("folder", section.includes("hero") ? "" : "");

      const response = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        handleValueChange(section, key, data.file.url);
        showMessage("Image uploaded successfully", "success");
      } else {
        showMessage("Failed to upload image", "error");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      showMessage("Error uploading image", "error");
    } finally {
      setImageUploading(null);
    }
  };

  const saveSection = async (section: string) => {
    setSaving(true);
    try {
      const sectionContent = getContentForSection(section);
      const updates = sectionContent
        .filter((item) => editedValues[item.id] !== undefined)
        .map((item) => ({
          id: item.id,
          content_value: editedValues[item.id],
        }));

      if (updates.length === 0) {
        showMessage("No changes to save", "error");
        setSaving(false);
        return;
      }

      const response = await fetch("/api/admin/site-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates }),
      });

      if (response.ok) {
        const result = await response.json();
        showMessage(`Saved ${result.updated.length} changes successfully!`, "success");
        // Clear edited values for this section
        const clearedEdits = { ...editedValues };
        sectionContent.forEach((item) => {
          delete clearedEdits[item.id];
        });
        setEditedValues(clearedEdits);
        // Reload content
        await loadContent();
      } else {
        showMessage("Failed to save changes", "error");
      }
    } catch (error) {
      console.error("Error saving:", error);
      showMessage("Error saving changes", "error");
    } finally {
      setSaving(false);
    }
  };

  const saveAllChanges = async () => {
    setSaving(true);
    try {
      const updates = Object.entries(editedValues).map(([id, value]) => ({
        id: parseInt(id),
        content_value: value,
      }));

      if (updates.length === 0) {
        showMessage("No changes to save", "error");
        setSaving(false);
        return;
      }

      const response = await fetch("/api/admin/site-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates }),
      });

      if (response.ok) {
        const result = await response.json();
        showMessage(`Saved ${result.updated.length} changes across all sections!`, "success");
        setEditedValues({});
        await loadContent();
      } else {
        showMessage("Failed to save changes", "error");
      }
    } catch (error) {
      console.error("Error saving:", error);
      showMessage("Error saving changes", "error");
    } finally {
      setSaving(false);
    }
  };

  const createMissingContent = async (section: string, key: string, defaultValue: string, contentType: string) => {
    try {
      const response = await fetch("/api/admin/site-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section,
          content_key: key,
          content_value: defaultValue,
          content_type: contentType,
        }),
      });

      if (response.ok) {
        await loadContent();
        showMessage("Content entry created", "success");
      }
    } catch (error) {
      console.error("Error creating content:", error);
    }
  };

  const hasUnsavedChanges = (section: string): boolean => {
    const sectionContent = getContentForSection(section);
    return sectionContent.some((item) => editedValues[item.id] !== undefined);
  };

  const totalUnsavedChanges = Object.keys(editedValues).length;

  const renderField = (section: string, field: FieldConfig) => {
    const value = getContentValue(section, field.key);
    const item = getContentItem(section, field.key);
    const uploadKey = `${section}_${field.key}`;
    const isUploading = imageUploading === uploadKey;
    const hasChange = item && editedValues[item.id] !== undefined;

    if (!item) {
      return (
        <div key={field.key} className="space-y-2 p-3 border border-dashed border-amber-300 rounded-lg bg-amber-50">
          <Label className="text-sm font-medium text-amber-700">
            {field.label} <Badge variant="outline" className="ml-2 text-xs">Not configured</Badge>
          </Label>
          <Button
            size="sm"
            variant="outline"
            onClick={() => createMissingContent(section, field.key, field.placeholder || "", field.type === "image" ? "image" : field.type === "url" ? "url" : field.type === "json" ? "json" : field.type === "number" ? "number" : "text")}
          >
            + Create Entry
          </Button>
        </div>
      );
    }

    return (
      <div key={field.key} className={`space-y-2 p-3 rounded-lg ${hasChange ? "bg-blue-50 border border-blue-200" : "bg-white border border-gray-200"}`}>
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium flex items-center gap-2">
            {field.type === "image" && <ImageIcon className="w-4 h-4 text-purple-500" />}
            {field.type === "url" && <Link2 className="w-4 h-4 text-blue-500" />}
            {field.type === "text" && <Type className="w-4 h-4 text-gray-500" />}
            {field.type === "json" && <FileText className="w-4 h-4 text-green-500" />}
            {field.type === "number" && <Settings className="w-4 h-4 text-orange-500" />}
            {field.label}
          </Label>
          {hasChange && (
            <Badge className="bg-blue-100 text-blue-700 text-xs">Modified</Badge>
          )}
        </div>

        {field.help && (
          <p className="text-xs text-gray-500">{field.help}</p>
        )}

        {field.type === "image" ? (
          <div className="space-y-3">
            <Input
              value={value}
              onChange={(e) => handleValueChange(section, field.key, e.target.value)}
              placeholder="Enter image URL or upload below"
              className="text-sm"
            />
            <div className="flex items-center gap-3">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(section, field.key, file);
                  }}
                />
                <span className="inline-flex items-center gap-2 px-3 py-2 text-sm border rounded-md hover:bg-gray-50 transition-colors">
                  <Upload className="w-4 h-4" />
                  {isUploading ? "Uploading..." : "Upload Image"}
                </span>
              </label>
              {value && (
                <div className="relative w-24 h-24 border rounded-md overflow-hidden bg-gray-100">
                  <NextImage
                    src={value}
                    alt={field.label}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}
            </div>
          </div>
        ) : field.type === "textarea" ? (
          <Textarea
            value={value}
            onChange={(e) => handleValueChange(section, field.key, e.target.value)}
            placeholder={field.placeholder}
            rows={3}
            className="text-sm"
          />
        ) : field.type === "json" ? (
          <Textarea
            value={value}
            onChange={(e) => handleValueChange(section, field.key, e.target.value)}
            placeholder={field.placeholder || field.help}
            rows={4}
            className="text-sm font-mono"
          />
        ) : (
          <Input
            type={field.type === "number" ? "number" : "text"}
            value={value}
            onChange={(e) => handleValueChange(section, field.key, e.target.value)}
            placeholder={field.placeholder}
            className="text-sm"
          />
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
          <span className="ml-3 text-gray-500">Loading site content...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Site Settings</h1>
          <p className="text-gray-600 mt-1">
            Manage all website content, images, and settings from one place
          </p>
        </div>
        <div className="flex items-center gap-3">
          {totalUnsavedChanges > 0 && (
            <Badge className="bg-amber-100 text-amber-700 px-3 py-1">
              {totalUnsavedChanges} unsaved changes
            </Badge>
          )}
          <Button
            onClick={saveAllChanges}
            disabled={saving || totalUnsavedChanges === 0}
            className="gap-2"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save All Changes
          </Button>
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
          {message.type === "success" ? (
            <Check className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          {message.text}
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="text-2xl font-bold">{allContent.length}</div>
          <div className="text-sm text-gray-500">Total Content Items</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold">
            {new Set(allContent.map((c) => c.section)).size}
          </div>
          <div className="text-sm text-gray-500">Sections Configured</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold">
            {allContent.filter((c) => c.content_type === "image").length}
          </div>
          <div className="text-sm text-gray-500">Images</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-amber-600">{totalUnsavedChanges}</div>
          <div className="text-sm text-gray-500">Pending Changes</div>
        </Card>
      </div>

      {/* Section Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="mb-4 overflow-x-auto">
          <TabsList className="inline-flex h-auto flex-wrap gap-1 bg-gray-100 p-1 rounded-lg">
            {Object.entries(SECTION_CONFIGS).map(([key, config]) => (
              <TabsTrigger
                key={key}
                value={key}
                className="flex items-center gap-1.5 text-xs px-3 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm whitespace-nowrap"
              >
                {config.icon}
                {config.title}
                {hasUnsavedChanges(key) && (
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {Object.entries(SECTION_CONFIGS).map(([sectionKey, config]) => (
          <TabsContent key={sectionKey} value={sectionKey}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">{config.icon}</div>
                    <div>
                      <CardTitle>{config.title}</CardTitle>
                      <p className="text-sm text-gray-500 mt-1">{config.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={loadContent}
                      className="gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Refresh
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => saveSection(sectionKey)}
                      disabled={saving || !hasUnsavedChanges(sectionKey)}
                      className="gap-1"
                    >
                      <Save className="w-3 h-3" />
                      Save Section
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {config.fields.map((field) => renderField(sectionKey, field))}
                </div>

                {/* Preview hint */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Eye className="w-4 h-4" />
                    <span>Changes will appear on the website after saving. Refresh the page to see updates.</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Help Card */}
      <Card className="mt-6 bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="w-5 h-5" />
            How Site Settings Work
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>• <strong>Edit any field</strong> - Modified fields are highlighted in blue</p>
          <p>• <strong>Upload images</strong> - Click &quot;Upload Image&quot; or paste a URL directly</p>
          <p>• <strong>JSON fields</strong> - For navigation links and lists, use JSON array format</p>
          <p>• <strong>Save</strong> - Click &quot;Save Section&quot; for one section or &quot;Save All&quot; for everything</p>
          <p>• <strong>{"{year}"} placeholder</strong> - Use in copyright text for auto-updating year</p>
          <p>• <strong>Missing entries</strong> - Click &quot;Create Entry&quot; to add any missing content to the database</p>
        </CardContent>
      </Card>
    </div>
  );
}
