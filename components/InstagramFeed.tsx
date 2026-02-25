"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Instagram } from "lucide-react";

interface InstagramPost {
  id: string;
  image_url: string;
  post_url: string;
  caption: string | null;
  display_order: number;
}

export default function InstagramFeed() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/instagram");
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
      }
    } catch (e) {
      console.error("Error fetching instagram posts:", e);
    } finally {
      setLoading(false);
    }
  };

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [posts]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  // Don't render if no posts and not loading
  if (!loading && posts.length === 0) return null;

  return (
    <section className="py-14 bg-white">
      {/* Heading */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Instagram className="w-5 h-5 text-[#8B7355]" strokeWidth={1.5} />
          <h2
            className="text-sm tracking-[0.25em] font-medium text-[#2C2C2C] uppercase"
            style={{ fontFamily: "var(--font-abhaya, serif)" }}
          >
            Instagram
          </h2>
        </div>
        <a
          href="https://www.instagram.com/kibanalifeofficial/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs tracking-widest text-[#8B7355] hover:underline uppercase"
        >
          @kibanalifeofficial
        </a>
      </div>

      {/* Carousel wrapper */}
      <div className="relative group">
        {/* Left arrow */}
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
          >
            <ChevronLeft className="w-5 h-5 text-[#2C2C2C]" />
          </button>
        )}

        {/* Right arrow */}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
          >
            <ChevronRight className="w-5 h-5 text-[#2C2C2C]" />
          </button>
        )}

        {/* Scrollable row */}
        <div
          ref={scrollRef}
          className="flex gap-1 overflow-x-auto scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {loading
            ? // Skeleton placeholders
              Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-none w-[45vw] sm:w-[30vw] md:w-[22vw] lg:w-[16.66vw] aspect-square bg-gray-100 animate-pulse"
                />
              ))
            : posts.map((post) => (
                <a
                  key={post.id}
                  href={post.post_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-none w-[45vw] sm:w-[30vw] md:w-[22vw] lg:w-[16.66vw] aspect-square relative overflow-hidden group/tile"
                >
                  {/* Image */}
                  <img
                    src={post.image_url}
                    alt={post.caption || "KIBANA on Instagram"}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/tile:scale-105"
                    loading="lazy"
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover/tile:bg-black/30 transition-colors duration-300 flex flex-col items-center justify-center">
                    <Instagram
                      className="w-7 h-7 text-white opacity-0 group-hover/tile:opacity-100 transition-opacity duration-300"
                      strokeWidth={1.5}
                    />
                    {post.caption && (
                      <p className="text-white text-xs text-center mt-2 px-4 opacity-0 group-hover/tile:opacity-100 transition-opacity duration-300 line-clamp-3">
                        {post.caption}
                      </p>
                    )}
                  </div>
                </a>
              ))}
        </div>
      </div>

      {/* Follow link below */}
      <div className="text-center mt-8">
        <a
          href="https://www.instagram.com/kibanalifeofficial/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase border border-[#2C2C2C] text-[#2C2C2C] px-7 py-3 hover:bg-[#2C2C2C] hover:text-white transition-colors duration-200"
        >
          <Instagram className="w-4 h-4" strokeWidth={1.5} />
          Follow Us On Instagram
        </a>
      </div>
    </section>
  );
}
