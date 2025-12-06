"use client";

import { useEffect, useRef } from "react";

export default function HeroSection() {
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Force video playback on mount
    const playVideos = async () => {
      try {
        if (desktopVideoRef.current) {
          await desktopVideoRef.current.play();
        }
        if (mobileVideoRef.current) {
          await mobileVideoRef.current.play();
        }
      } catch (err) {
        console.error('Video play failed:', err);
      }
    };

    // Small delay to ensure video is loaded
    const timer = setTimeout(() => {
      playVideos();
    }, 100);

    // Add event listeners to retry playback
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        playVideos();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const videoUrl = "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/HERO%20SECTION/homepage%20hero%20section.mp4";

  return (
    <section className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Desktop Video - Hidden on mobile */}
      <video
        ref={desktopVideoRef}
        autoPlay
        loop
        muted
        playsInline
        className="hidden md:block absolute inset-0 w-full h-full object-cover"
        preload="auto"
        onLoadedData={() => console.log('Desktop video loaded successfully')}
        onError={(e) => console.error('Desktop video error:', e)}
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Mobile Video - Hidden on desktop */}
      <video
        ref={mobileVideoRef}
        autoPlay
        loop
        muted
        playsInline
        className="md:hidden absolute inset-0 w-full h-full object-cover"
        preload="auto"
        onLoadedData={() => console.log('Mobile video loaded successfully')}
        onError={(e) => console.error('Mobile video error:', e)}
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </section>
  );
}
