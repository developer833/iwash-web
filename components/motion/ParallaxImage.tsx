"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import type { Photo } from "@/lib/assets";
import { easeOut } from "@/lib/motion";
import { AssetSlot } from "@/components/ui/AssetSlot";

type Props = {
  photo: Photo;
  sizes: string;
  /** Tailwind aspect class for the frame, e.g. "aspect-[4/5]". */
  aspect: string;
  className?: string;
  decorative?: boolean;
  /** How far the photo drifts inside its frame, as a percentage of its height. */
  drift?: number;
};

/**
 * A photograph in a fixed frame. The frame wipes open the first time it
 * enters the viewport, and the photo drifts slowly inside it as the page
 * scrolls, which gives still images a sense of depth.
 *
 * The outer element is never clipped: it is the one observed for
 * visibility, because a fully clipped element reports no visible area and
 * would never trigger its own reveal.
 */
export function ParallaxImage({ photo, sizes, aspect, className = "", decorative, drift = 7 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, (p) => `${(p - 0.5) * 2 * drift}%`);

  return (
    <motion.div
      ref={ref}
      className={`relative ${aspect} ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
    >
      <motion.div
        className="motion-reset absolute inset-0 overflow-hidden"
        variants={{
          hidden: { clipPath: "inset(100% 0% 0% 0%)" },
          visible: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 1.25, ease: easeOut } },
        }}
      >
        <motion.div className="motion-reset absolute inset-x-0 -inset-y-[9%]" style={{ y }}>
          <AssetSlot photo={photo} fill sizes={sizes} decorative={decorative} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
