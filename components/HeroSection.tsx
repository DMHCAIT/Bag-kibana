"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function HeroSection() {
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    // Force video playback on mount with error handling
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
        setVideoError(true);
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
  const fallbackImage = "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/VISTARA%20TOTE%20(%20png%20)/VISTARA%20TOTE%20-%20Teal%20Blue/01.png";

  return (
    <section className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {videoError ? (
        // Fallback image if video fails
        <div className="absolute inset-0">
          <Image
            src={fallbackImage}
            alt="KIBANA Collection"
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      ) : (
        <>
          {/* Desktop Video - Hidden on mobile */}
          <video
            ref={desktopVideoRef}
            autoPlay
            loop
            muted
            playsInline
            className="hidden md:block absolute inset-0 w-full h-full object-cover"
            preload="auto"
            onError={() => setVideoError(true)}
          >
            <source src={videoUrl} type="video/mp4" />
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
            onError={() => setVideoError(true)}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        </>
      )}
    </section>
  );
}
