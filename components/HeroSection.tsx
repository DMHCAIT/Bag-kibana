"use client";

import { useEffect, useRef } from "react";

export default function HeroSection() {
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Force video playback on mount
    const playVideos = () => {
      if (desktopVideoRef.current) {
        desktopVideoRef.current.play().catch(err => console.log('Desktop video play failed:', err));
      }
      if (mobileVideoRef.current) {
        mobileVideoRef.current.play().catch(err => console.log('Mobile video play failed:', err));
      }
    };

    playVideos();

    // Add event listeners to retry playback
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        playVideos();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-gray-900">
      {/* Desktop Video - Hidden on mobile */}
      <video
        ref={desktopVideoRef}
        autoPlay
        loop
        muted
        playsInline
        className="hidden md:block absolute inset-0 w-full h-full object-cover"
        preload="metadata"
      >
        <source
          src="https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/HERO%20SECTION/homepage%20hero%20section.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* Mobile Video - Hidden on desktop, optimized for mobile */}
      <video
        ref={mobileVideoRef}
        autoPlay
        loop
        muted
        playsInline
        className="md:hidden absolute inset-0 w-full h-full object-cover object-center"
        preload="metadata"
      >
        <source
          src="https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/HERO%20SECTION/homepage%20hero%20section.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* Overlay with content */}
      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
        <div className="text-center text-white z-10 px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-2xl">
            Timeless Elegance
          </h1>
          <p className="text-xl md:text-2xl mb-8 drop-shadow-lg">
            Discover Our Premium Collection
          </p>
          <button className="bg-white text-black px-8 py-4 text-lg font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 shadow-xl">
            Shop Now
          </button>
        </div>
      </div>
    </section>
  );
}
