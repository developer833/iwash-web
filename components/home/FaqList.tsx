"use client";

import { useId, useState } from "react";
import { motion } from "motion/react";
import { revealVariants, staggerVariants } from "@/lib/motion";

type Item = { q: string; a: string };

/**
 * One-at-a-time accordion. Every answer stays in the DOM (the panel is only
 * collapsed with a grid-rows transition), so the text remains indexable.
 */
export function FaqList({ items }: { items: readonly Item[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();

  return (
    <motion.ul
      className="space-y-3"
      variants={staggerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
    >
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `${base}-panel-${i}`;
        const buttonId = `${base}-button-${i}`;

        return (
          <motion.li
            key={item.q}
            variants={revealVariants}
            className={`group relative overflow-hidden rounded-3xl ring-1 transition-[background-color,box-shadow,transform] duration-500 ease-[var(--ease-brand)] ${
              isOpen
                ? "bg-white shadow-[0_28px_60px_-34px_rgba(2,132,199,0.7)] ring-iwash-primary/30"
                : "bg-iwash-surface ring-iwash-neutral/10 hover:-translate-y-0.5 hover:bg-white hover:ring-iwash-primary/25"
            }`}
          >
            <span
              aria-hidden="true"
              className={`absolute inset-y-0 left-0 w-1 origin-top bg-linear-to-b from-iwash-primary to-iwash-secondary transition-transform duration-500 ease-[var(--ease-brand)] motion-reduce:transition-none ${
                isOpen ? "scale-y-100" : "scale-y-0"
              }`}
            />
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center gap-4 px-5 py-5 text-left md:gap-6 md:px-7 md:py-6"
              >
                <span
                  aria-hidden="true"
                  className={`font-display text-sm font-extrabold tabular-nums transition-colors duration-300 ${
                    isOpen ? "text-iwash-primary" : "text-iwash-neutral/30"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 text-lg font-bold tracking-tight text-iwash-neutral md:text-xl">{item.q}</span>
                <span
                  aria-hidden="true"
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-[transform,background-color,color] duration-500 ease-[var(--ease-brand)] motion-reduce:transition-none ${
                    isOpen
                      ? "rotate-45 bg-iwash-primary text-white"
                      : "bg-iwash-border text-iwash-primary group-hover:bg-iwash-primary/15"
                  }`}
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              inert={!isOpen}
              className={`grid transition-[grid-template-rows] duration-500 ease-[var(--ease-brand)] motion-reduce:transition-none ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <p
                  className={`max-w-2xl px-5 pb-6 pl-[3.25rem] leading-relaxed text-iwash-ink-soft transition-[opacity,transform] duration-500 ease-[var(--ease-brand)] motion-reduce:transition-none md:pb-7 md:pl-[4.75rem] md:pr-7 ${
                    isOpen ? "translate-y-0 opacity-100 delay-100" : "-translate-y-2 opacity-0"
                  }`}
                >
                  {item.a}
                </p>
              </div>
            </div>
          </motion.li>
        );
      })}
    </motion.ul>
  );
}
