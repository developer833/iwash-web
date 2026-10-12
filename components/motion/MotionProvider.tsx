"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/** Honours the OS reduced-motion setting for every Motion animation. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
