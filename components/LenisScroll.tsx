"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Global smooth scrolling with Lenis.
 * - Respects prefers-reduced-motion.
 * - Runs only on the client.
 */
export default function LenisScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduce) return;

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      easing: (t) => 1 - Math.pow(1 - t, 2), // ease-out quad
    });

    let frame: number;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };

    frame = requestAnimationFrame(raf);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}

