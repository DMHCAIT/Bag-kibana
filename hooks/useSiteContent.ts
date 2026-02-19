"use client";

import { useState, useEffect } from "react";

interface ContentValue {
  value: any;
  type: string;
  metadata: any;
  id: number;
}

type SiteContent = Record<string, Record<string, ContentValue>>;

// Cache content in memory to avoid repeated fetches
let contentCache: SiteContent | null = null;
let cacheTime = 0;
const CACHE_DURATION = 60000; // 1 minute

export function useSiteContent(sections?: string[]) {
  const [content, setContent] = useState<SiteContent>(contentCache || {});
  const [loading, setLoading] = useState(!contentCache);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const now = Date.now();
    if (contentCache && now - cacheTime < CACHE_DURATION) {
      setContent(contentCache);
      setLoading(false);
      return;
    }

    const fetchContent = async () => {
      try {
        const params = sections ? `?section=${sections.join(",")}` : "";
        const response = await fetch(`/api/site-content${params}`);
        if (response.ok) {
          const data = await response.json();
          contentCache = data.content;
          cacheTime = Date.now();
          setContent(data.content || {});
        } else {
          setError("Failed to load content");
        }
      } catch (err) {
        console.error("Error fetching site content:", err);
        setError("Error loading content");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  // Helper to get a value with fallback
  const getValue = (section: string, key: string, fallback: string = ""): string => {
    return content?.[section]?.[key]?.value ?? fallback;
  };

  const getNumber = (section: string, key: string, fallback: number = 0): number => {
    const val = content?.[section]?.[key]?.value;
    if (val === undefined || val === null) return fallback;
    return typeof val === "number" ? val : Number(val) || fallback;
  };

  const getJson = (section: string, key: string, fallback: any = []): any => {
    const val = content?.[section]?.[key]?.value;
    if (!val) return fallback;
    if (typeof val === "object") return val;
    try {
      return JSON.parse(val);
    } catch {
      return fallback;
    }
  };

  const getMetadata = (section: string, key: string): any => {
    return content?.[section]?.[key]?.metadata || {};
  };

  return { content, loading, error, getValue, getNumber, getJson, getMetadata };
}

// Invalidate cache (call after admin saves)
export function invalidateSiteContentCache() {
  contentCache = null;
  cacheTime = 0;
}
