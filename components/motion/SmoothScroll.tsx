"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Inertial smooth scrolling. Lenis eases the native scroll position, so
 * sticky scenes, anchor links, keyboard scrolling and Motion's scroll
 * hooks keep working. It is switched off entirely for visitors who ask
 * for reduced motion, and never runs on touch devices' native momentum.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      autoRaf: true,
      anchors: true,
      lerp: 0.1,
      wheelMultiplier: 1,
      syncTouch: false,
    });
    return () => lenis.destroy();
  }, []);

  return null;
}
