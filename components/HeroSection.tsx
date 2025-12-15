"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const SPLINE_URL =
  process.env.NEXT_PUBLIC_SPLINE_HERO_URL ||
  "https://prod.spline.design/kibana-hero-3d-bag/scene.splinecode";

const MOBILE_FALLBACK =
  "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/VISTARA%20TOTE%20(%20png%20)/VISTARA%20TOTE%20-%20Milky%20Blue/09-10-2025--livia00521.jpg";

export default function HeroSection() {
  const [shouldShowSpline, setShouldShowSpline] = useState(false);
  const [splineScriptReady, setSplineScriptReady] = useState(false);
  const [splineReady, setSplineReady] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  // Only show Spline on desktop and when user does not prefer reduced motion
  useEffect(() => {
    const update = () => {
      const desktop = window.innerWidth > 940;
      const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setShouldShowSpline(desktop && !prefersReduce);
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Lazy-load Spline viewer script only when needed
  useEffect(() => {
    if (!shouldShowSpline) return;

    const existing = document.querySelector("script[data-spline-viewer]");
    if (existing) {
      setSplineScriptReady(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://unpkg.com/@splinetool/viewer@1.9.50/build/spline-viewer.js";
    script.async = true;
    script.dataset.splineViewer = "true";
    script.onload = () => setSplineScriptReady(true);
    script.onerror = () => setShowFallback(true);
    document.head.appendChild(script);

    return () => {
      script.onload = null;
      script.onerror = null;
    };
  }, [shouldShowSpline]);

  const showSpline = useMemo(
    () => shouldShowSpline && splineScriptReady && !showFallback,
    [shouldShowSpline, splineScriptReady, showFallback]
  );

  return (
    <section className="relative min-h-screen overflow-hidden bg-white">
      {/* Background: Spline or static fallback */}
      {showSpline ? (
        <div className="absolute inset-0">
          {/* Spline Viewer (desktop only) */}
          {React.createElement('spline-viewer', {
            url: SPLINE_URL,
            loading: 'lazy',
            style: { width: '100%', height: '100%', minHeight: '100vh' },
            'aria-label': 'Kibana luxury bag 3D',
            onLoad: () => setSplineReady(true),
            onError: () => setShowFallback(true)
          })}
          {/* Soft gradient overlay to keep text readable */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/30 via-white/20 to-white" />
        </div>
      ) : (
        <div className="absolute inset-0">
          <Image
            src={MOBILE_FALLBACK}
            alt="Kibana luxury handbag hero"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/45 to-white" />
        </div>
      )}

      {/* Overlay content */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 md:px-8 lg:px-12 min-h-screen flex items-center">
          <div className="w-full max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="space-y-6 md:space-y-8"
            >
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-black/5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs tracking-[0.2em] uppercase">New Collection</span>
              </div>

              <div className="space-y-4">
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.35 }}
                  className="text-sm md:text-base tracking-[0.28em] text-gray-800 uppercase"
                >
                  KibanaLife
                </motion.p>

                <motion.h1
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-semibold leading-tight tracking-tight text-gray-900"
                  style={{ fontFamily: "var(--font-abhaya)" }}
                >
                  Luxury that defines you.
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.55 }}
                  className="text-base md:text-lg text-gray-700 max-w-2xl"
                >
                  Handcrafted silhouettes, premium leather finishes, and a modern 3D showcase so your next signature piece is seen in every dimension.
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.65 }}
                className="flex flex-wrap items-center gap-4"
              >
                <Link href="/shop">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 md:px-8 py-3.5 md:py-3.5 bg-black text-white rounded-full text-sm tracking-[0.18em] uppercase shadow-lg shadow-black/10 touch-manipulation min-h-[44px]"
                  >
                    Shop Now
                  </motion.button>
                </Link>
                <Link href="/collections/tote">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 md:px-8 py-3 md:py-3.5 bg-white/80 text-black border border-black/10 rounded-full text-sm tracking-[0.18em] uppercase shadow-sm"
                  >
                    Explore Bags
                  </motion.button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.75 }}
                className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-xl pt-2"
              >
                {["Premium leather", "Hand finished", "Made in India"].map((item, idx) => (
                  <motion.div
                    key={item}
                    whileHover={{ y: -2 }}
                    className="px-4 py-3 rounded-xl bg-white/80 backdrop-blur-sm border border-black/5 shadow-sm text-sm text-gray-700"
                  >
                    {item}
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Subtle status badge for Spline readiness */}
      {showSpline && (
        <div className="pointer-events-none absolute top-6 right-6 flex items-center gap-2 text-xs text-gray-600 bg-white/70 backdrop-blur-sm px-3 py-1.5 rounded-full border border-black/5 shadow-sm">
          <span className={`w-2 h-2 rounded-full ${splineReady ? "bg-green-500" : "bg-amber-400"}`} />
          <span>{splineReady ? "3D live" : "Loading 3D"}</span>
        </div>
      )}
    </section>
  );
}

