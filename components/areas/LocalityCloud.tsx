"use client";

import { motion } from "motion/react";
import { revealVariants, revealViewport } from "@/lib/motion";

/** Locality names as pills that pop in one after another and lift on hover. */
export function LocalityCloud({ names }: { names: string[] }) {
  return (
    <motion.ul
      className="motion-reset mt-6 flex flex-wrap gap-2.5"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
    >
      {names.map((name) => (
        <motion.li
          key={name}
          variants={revealVariants}
          whileHover={{ y: -4 }}
          className="motion-reset cursor-default rounded-full bg-white px-4 py-2 text-sm font-semibold text-iwash-neutral shadow-sm ring-1 ring-inset ring-iwash-primary/20 transition-colors hover:bg-iwash-primary hover:text-white"
        >
          {name}
        </motion.li>
      ))}
    </motion.ul>
  );
}
