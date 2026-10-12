import type { Transition, Variants } from "motion/react";

/** Shared easing so every reveal on the page moves the same way. */
export const easeOut = [0.22, 1, 0.36, 1] as const;

export const revealTransition: Transition = {
  duration: 0.8,
  ease: easeOut,
};

export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: revealTransition },
};

export const staggerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

/** Viewport settings shared by whileInView reveals. */
export const revealViewport = { once: true, amount: 0.3 } as const;
