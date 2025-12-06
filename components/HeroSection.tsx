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
        preload="auto"
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
        preload="auto"
      >
        <source
          src="https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/HERO%20SECTION/homepage%20hero%20section.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* Subtle overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />
    </section>
  );
}
