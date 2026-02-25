"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

interface SearchResult {
  id: string;
  slug: string;
  name: string;
  color: string;
  price: number;
  images: string[];
  category: string;
}

export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const debounceRef = useRef<NodeJS.Timeout>();

  const search = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/products?search=${encodeURIComponent(q)}&limit=8`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.products || []);
      }
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(query), 300);
    return () => clearTimeout(debounceRef.current);
  }, [query, search]);

  // Open on icon click
  const handleOpen = () => {
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleClose = () => {
    setOpen(false);
    setQuery("");
    setResults([]);
  };

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        handleClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        open ? handleClose() : handleOpen();
      }
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  const handleResultClick = () => handleClose();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
      handleClose();
    }
  };

  return (
    <>
      {/* Search Icon Trigger */}
      <button
        onClick={handleOpen}
        className="hover:opacity-60 transition-opacity"
        aria-label="Search products"
      >
        <Search className="w-5 h-5" />
      </button>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center pt-20 px-4">
          <div
            ref={panelRef}
            className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden"
          >
            {/* Input Row */}
            <form onSubmit={handleSubmit} className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
              {loading ? (
                <Loader2 className="w-5 h-5 text-gray-400 animate-spin shrink-0" />
              ) : (
                <Search className="w-5 h-5 text-gray-400 shrink-0" />
              )}
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search bags, totes, slings…"
                className="flex-1 text-base outline-none bg-transparent placeholder-gray-400"
              />
              {query && (
                <button type="button" onClick={() => { setQuery(""); setResults([]); inputRef.current?.focus(); }}>
                  <X className="w-4 h-4 text-gray-400 hover:text-gray-700" />
                </button>
              )}
              <button type="button" onClick={handleClose} className="text-xs text-gray-400 hover:text-gray-600 ml-2 hidden sm:block">
                ESC
              </button>
            </form>

            {/* Results */}
            {query.length >= 2 && (
              <div className="max-h-[60vh] overflow-y-auto">
                {results.length === 0 && !loading ? (
                  <div className="py-10 text-center text-gray-400 text-sm">
                    No products found for &quot;{query}&quot;
                  </div>
                ) : (
                  <>
                    <div className="px-5 py-2 text-xs text-gray-400 uppercase tracking-wider border-b border-gray-50">
                      {results.length} result{results.length !== 1 ? "s" : ""}
                    </div>
                    <ul>
                      {results.map((r) => (
                        <li key={r.slug || r.id}>
                          <Link
                            href={`/products/${r.slug || r.id}`}
                            onClick={handleResultClick}
                            className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition-colors"
                          >
                            {/* Thumbnail */}
                            <div className="w-14 h-14 bg-[#F5F4F0] rounded-md overflow-hidden shrink-0">
                              {r.images?.[0] && (
                                <img
                                  src={r.images[0]}
                                  alt={r.name}
                                  className="w-full h-full object-contain p-1"
                                  loading="lazy"
                                />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{r.name}</p>
                              <p className="text-xs text-gray-500 truncate">{r.color} · {r.category}</p>
                            </div>
                            <p className="text-sm font-semibold text-gray-900 shrink-0">
                              {formatPrice(r.price)}
                            </p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    {results.length > 0 && (
                      <div className="border-t border-gray-100">
                        <button
                          onClick={handleSubmit as any}
                          className="w-full py-3 text-sm text-center text-[#8B7355] hover:bg-gray-50 transition-colors"
                        >
                          See all results for &quot;{query}&quot; →
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Empty state */}
            {query.length < 2 && (
              <div className="py-8 px-5 text-center text-sm text-gray-400">
                Start typing to search products…
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
