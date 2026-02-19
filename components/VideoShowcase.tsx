"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, ChevronLeft, ChevronRight } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

interface Video {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  thumbnail_url: string | null;
  display_order: number;
}

export default function VideoShowcase() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<Record<string, boolean>>({});
  const [isMuted, setIsMuted] = useState<Record<string, boolean>>({});
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { getValue } = useSiteContent(["video_showcase"]);

  const sectionTitle = getValue("video_showcase", "title", "WATCH & EXPLORE");
  const sectionSubtitle = getValue("video_showcase", "subtitle", "Discover our craftsmanship in motion");

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch("/api/videos");
      if (response.ok) {
        const data = await response.json();
        setVideos(data.videos || []);
        // Initialize muted state (default muted)
        const mutedState: Record<string, boolean> = {};
        (data.videos || []).forEach((v: Video) => {
          mutedState[v.id] = true;
        });
        setIsMuted(mutedState);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  const togglePlay = (videoId: string) => {
    const video = videoRefs.current[videoId];
    if (!video) return;

    if (video.paused) {
      // Pause all other videos first
      Object.entries(videoRefs.current).forEach(([id, v]) => {
        if (id !== videoId && v && !v.paused) {
          v.pause();
          setIsPlaying((prev) => ({ ...prev, [id]: false }));
        }
      });
      video.play();
      setIsPlaying((prev) => ({ ...prev, [videoId]: true }));
    } else {
      video.pause();
      setIsPlaying((prev) => ({ ...prev, [videoId]: false }));
    }
  };

  const toggleMute = (videoId: string) => {
    const video = videoRefs.current[videoId];
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted((prev) => ({ ...prev, [videoId]: !prev[videoId] }));
  };

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const scrollAmount = container.offsetWidth * 0.8;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-10 w-64 bg-gray-200 animate-pulse mx-auto rounded" />
            <div className="h-5 w-48 bg-gray-200 animate-pulse mx-auto rounded mt-4" />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-9/16 bg-gray-200 animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (videos.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2
            className="text-4xl md:text-5xl tracking-[0.15em] mb-4"
            style={{ fontFamily: "var(--font-abhaya)" }}
          >
            {sectionTitle}
          </h2>
          <p
            className="text-sm md:text-base text-[#111111] tracking-wide"
            style={{ fontFamily: "var(--font-abhaya)" }}
          >
            {sectionSubtitle}
          </p>
        </div>

        {/* Desktop: Grid Layout / Mobile: Horizontal Scroll */}
        <div className="relative">
          {/* Navigation Arrows (visible when more than 3 videos) */}
          {videos.length > 3 && (
            <>
              <button
                onClick={() => scroll("left")}
                className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 rounded-full items-center justify-center shadow-lg hover:bg-white transition-colors"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 rounded-full items-center justify-center shadow-lg hover:bg-white transition-colors"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Video Container */}
          <div
            ref={scrollContainerRef}
            className={`
              flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide
              ${videos.length <= 3 ? "md:grid md:grid-cols-3 md:overflow-visible" : ""}
            `}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {videos.map((video) => (
              <div
                key={video.id}
                className="shrink-0 w-[75vw] sm:w-[60vw] md:w-auto snap-center"
              >
                <div className="relative aspect-9/16 rounded-lg overflow-hidden bg-black group">
                  <video
                    ref={(el) => {
                      videoRefs.current[video.id] = el;
                    }}
                    src={video.video_url}
                    poster={video.thumbnail_url || undefined}
                    className="w-full h-full object-cover"
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    onPlay={() => setIsPlaying((prev) => ({ ...prev, [video.id]: true }))}
                    onPause={() => setIsPlaying((prev) => ({ ...prev, [video.id]: false }))}
                  />

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Play/Pause button - center */}
                  <button
                    onClick={() => togglePlay(video.id)}
                    className="absolute inset-0 flex items-center justify-center z-10"
                    aria-label={isPlaying[video.id] ? "Pause" : "Play"}
                  >
                    <div
                      className={`w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300 ${
                        isPlaying[video.id]
                          ? "opacity-0 group-hover:opacity-100"
                          : "opacity-100"
                      }`}
                    >
                      {isPlaying[video.id] ? (
                        <Pause className="w-6 h-6 text-white" />
                      ) : (
                        <Play className="w-6 h-6 text-white ml-1" />
                      )}
                    </div>
                  </button>

                  {/* Mute button - bottom right */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMute(video.id);
                    }}
                    className="absolute bottom-4 right-4 z-20 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    aria-label={isMuted[video.id] ? "Unmute" : "Mute"}
                  >
                    {isMuted[video.id] ? (
                      <VolumeX className="w-4 h-4 text-white" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-white" />
                    )}
                  </button>

                  {/* Video title - bottom left */}
                  {video.title && (
                    <div className="absolute bottom-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <h3
                        className="text-white text-lg font-medium tracking-wide drop-shadow-lg"
                        style={{ fontFamily: "var(--font-abhaya)" }}
                      >
                        {video.title}
                      </h3>
                      {video.description && (
                        <p className="text-white/80 text-sm mt-1 line-clamp-2">
                          {video.description}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dot indicators on mobile */}
        {videos.length > 1 && (
          <div className="flex justify-center gap-2 mt-6 md:hidden">
            {videos.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === activeVideo ? "bg-black" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
