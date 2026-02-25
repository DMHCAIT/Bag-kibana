import { MetadataRoute } from "next";
import { supabaseAdmin } from "@/lib/supabase";

export const revalidate = 3600; // regenerate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://kibanalife.com";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/shop`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/women`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/men`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/all-products`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/our-story`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/shipping-policy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/returns`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/terms`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/corporate-gifting`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/collections/handbags`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/collections/tote-bag`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/collections/sling`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/collections/clutch`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/collections/backpack`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
  ];

  // Product pages from database
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const { data: products } = await supabaseAdmin
      .from("products")
      .select("slug, updated_at")
      .not("slug", "is", null);

    if (products) {
      productPages = products.map((p) => ({
        url: `${base}/products/${p.slug}`,
        lastModified: new Date(p.updated_at || new Date()),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
    }
  } catch {
    // silently skip product pages if DB fails
  }

  return [...staticPages, ...productPages];
}
