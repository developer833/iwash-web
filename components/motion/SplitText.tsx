"use client";

import { motion } from "motion/react";
import { easeOut } from "@/lib/motion";

type Props = {
  text: string;
  className?: string;
  /** Seconds between words. */
  stagger?: number;
  delay?: number;
};

/**
 * Heading text that rises into place word by word from behind a mask the
 * first time it scrolls into view. The words are real text in the HTML,
 * so it reads normally to crawlers and screen readers.
 */
export function SplitText({ text, className = "", stagger = 0.045, delay = 0 }: Props) {
  const words = text.split(" ");

  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
    >
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden pb-[0.12em] align-bottom [margin-bottom:-0.12em]">
          <motion.span
            className="motion-reset inline-block"
            variants={{
              hidden: { y: "112%" },
              visible: { y: 0, transition: { duration: 0.95, ease: easeOut } },
            }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
