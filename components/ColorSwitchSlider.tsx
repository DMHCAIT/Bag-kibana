"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Link from "next/link";

const PRODUCT_NAME = "Cordia Bag ";
const LEFT_COLOR = "Light Purple";
const RIGHT_COLOR = "Black";
const LEFT_IMAGE =
  "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/Cordia%20Bag/Cordia%20Bag%20-%20Purple/04-02-2026-product%20shoot0167.jpg";
const RIGHT_IMAGE =
  "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/Cordia%20Bag/Cordia%20Bag%20-%20Black/04-02-2026-product%20shoot0139.jpg";
const LEFT_HREF = "/products/vistara-tote-mint-green";
const RIGHT_HREF = "/products/vistara-tote-mocha-tan";

export default function ColorSwitchSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderX, setSliderX] = useState(50);
  const isDragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const percent = Math.min(Math.max(((clientX - rect.left) / rect.width) * 100, 1), 99);
    setSliderX(percent);
  }, []);

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging.current) return;
      updatePosition(e.clientX);
    },
    [updatePosition]
  );

  const onTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging.current) return;
      updatePosition(e.touches[0].clientX);
    },
    [updatePosition]
  );

  const stopDrag = useCallback(() => {
    isDragging.current = false;
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", stopDrag);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", stopDrag);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", stopDrag);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", stopDrag);
    };
  }, [onMouseMove, onTouchMove, stopDrag]);

  return (
    <section className="w-full bg-white py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <p className="text-xs font-semibold tracking-[0.25em] uppercase text-black mb-4 md:mb-6">
          Slide to Switch
        </p>

        {/* Slider container */}
        <div
          ref={containerRef}
          className="relative w-full overflow-hidden select-none cursor-col-resize"
          style={{ aspectRatio: "16 / 7" }}
          onMouseDown={(e) => {
            isDragging.current = true;
            updatePosition(e.clientX);
          }}
          onTouchStart={(e) => {
            isDragging.current = true;
            updatePosition(e.touches[0].clientX);
          }}
        >
          {/* Shared off-white background */}
          <div className="absolute inset-0" style={{ backgroundColor: "#f5f3f0" }} />

          {/* RIGHT image — full area, no clip */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={RIGHT_IMAGE}
            alt={`${PRODUCT_NAME} – ${RIGHT_COLOR}`}
            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            draggable={false}
          />

          {/* LEFT image — clipped from the right using clip-path */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={LEFT_IMAGE}
            alt={`${PRODUCT_NAME} – ${LEFT_COLOR}`}
            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            style={{ clipPath: `inset(0 ${100 - sliderX}% 0 0)` }}
            draggable={false}
          />

          {/* Divider line */}
          <div
            className="absolute top-0 bottom-0 z-20 pointer-events-none"
            style={{
              left: `${sliderX}%`,
              width: "2px",
              background: "#222",
              transform: "translateX(-50%)",
            }}
          />

          {/* Drag handle */}
          <div
            className="absolute top-1/2 z-30 -translate-y-1/2 -translate-x-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-lg pointer-events-none"
            style={{ left: `${sliderX}%` }}
          >
            <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
              <path d="M5 1L1 6L5 11" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M13 1L17 6L13 11" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Left label */}
          <div className="absolute bottom-5 left-5 z-20 pointer-events-none">
            <p className="text-sm font-semibold text-black leading-tight">{LEFT_COLOR}</p>
            <Link
              href={LEFT_HREF}
              className="text-xs tracking-widest uppercase underline underline-offset-2 text-black pointer-events-auto hover:opacity-60 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              Shop Now
            </Link>
          </div>

          {/* Right label */}
          <div className="absolute bottom-5 right-5 z-20 text-right pointer-events-none">
            <p className="text-sm font-semibold text-black leading-tight">{RIGHT_COLOR}</p>
            <Link
              href={RIGHT_HREF}
              className="text-xs tracking-widest uppercase underline underline-offset-2 text-black pointer-events-auto hover:opacity-60 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
