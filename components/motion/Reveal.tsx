"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { revealVariants, revealViewport, staggerVariants } from "@/lib/motion";

type RevealProps = HTMLMotionProps<"div"> & {
  /** Stagger direct motion children instead of revealing as one block. */
  stagger?: boolean;
  delay?: number;
};

/**
 * Fades and lifts content into place the first time it scrolls into view.
 * Content is in the HTML from the start; only opacity/transform change.
 */
export function Reveal({ stagger = false, delay = 0, children, ...rest }: RevealProps) {
  return (
    <motion.div
      className="motion-reset"
      variants={stagger ? staggerVariants : revealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
      transition={delay ? { delay } : undefined}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** A child of a staggered Reveal. */
export function RevealItem({ children, ...rest }: HTMLMotionProps<"div">) {
  return (
    <motion.div className="motion-reset" variants={revealVariants} {...rest}>
      {children}
    </motion.div>
  );
}
