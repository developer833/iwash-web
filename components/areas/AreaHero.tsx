"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { photos } from "@/lib/assets";
import { easeOut } from "@/lib/motion";
import { Bubbles } from "@/components/areas/Bubbles";
import { AssetSlot } from "@/components/ui/AssetSlot";

type Props = {
  crumbs: { label: string; href?: string }[];
  eyebrow: string;
  title: string;
  /** Pill on the main photo, e.g. "Collecting in Kakkanad". */
  placeChip: string;
  /** Pill under the collage. */
  factChip: string;
  children: ReactNode;
};

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: easeOut, delay },
});

/**
 * Location page hero: copy on the left, a layered photo collage on the right,
 * drifting bubbles behind. The collage parallaxes gently with scroll.
 */
export function AreaHero({ crumbs, eyebrow, title, placeChip, factChip, children }: Props) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const mainY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const subY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-b from-iwash-border/70 via-white to-white"
      aria-labelledby="area-heading"
    >
      <Bubbles />

      <div className="relative z-10 mx-auto grid max-w-[1680px] gap-14 px-5 pb-20 pt-[calc(var(--header-h)+1.5rem)] md:grid-cols-[1.05fr_0.95fr] md:items-center md:gap-10 md:px-10 md:pb-28">
        <div>
          <motion.nav {...rise(0)} aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-iwash-ink-soft">
              {crumbs.map((c, i) => (
                <li key={c.label} className="flex items-center gap-2">
                  {i > 0 ? <span aria-hidden="true">/</span> : null}
                  {c.href ? (
                    <Link href={c.href} className="hover:text-iwash-primary">
                      {c.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-iwash-neutral">
                      {c.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </motion.nav>

          <motion.p {...rise(0.08)} className="eyebrow mb-4 mt-10">
            {eyebrow}
          </motion.p>
          <motion.h1 {...rise(0.16)} id="area-heading" className="display display-md max-w-3xl text-iwash-neutral">
            {title}
          </motion.h1>
          <motion.div {...rise(0.28)} className="lede mt-5 max-w-2xl">
            {children}
          </motion.div>
        </div>

        {/* Photo collage */}
        <div className="relative mx-auto w-full max-w-xl md:max-w-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.94, clipPath: "inset(8% 8% 8% 8% round 28px)" }}
            animate={{ opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0% round 28px)" }}
            transition={{ duration: 1.1, ease: easeOut, delay: 0.2 }}
            style={{ y: mainY }}
            className="relative aspect-[4/3] overflow-hidden rounded-[28px] shadow-[0_30px_80px_-30px_rgba(2,132,199,0.55)] ring-1 ring-iwash-neutral/10"
          >
            <AssetSlot photo={photos.facility} fill sizes="(min-width: 768px) 45vw, 92vw" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: easeOut, delay: 0.6 }}
            style={{ y: subY }}
            className="absolute -bottom-8 -left-3 w-[40%] md:-left-10"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] border-4 border-white shadow-[0_24px_60px_-24px_rgba(15,23,42,0.5)]">
              <AssetSlot photo={photos.delivery} fill sizes="(min-width: 768px) 20vw, 40vw" decorative />
            </div>
          </motion.div>

          <span
            className="chip-bob absolute -right-1 top-5 inline-flex items-center gap-2 rounded-full bg-white/90 px-3.5 py-2 text-xs font-bold text-iwash-neutral shadow-lg ring-1 ring-iwash-neutral/10 backdrop-blur md:-right-5"
            style={{ "--dur": "5.5s" } as CSSProperties}
          >
            <span className="h-2 w-2 rounded-full bg-iwash-primary" aria-hidden="true" />
            {placeChip}
          </span>
          <span
            className="chip-bob absolute -bottom-10 right-2 inline-flex items-center gap-2 rounded-full bg-iwash-neutral px-3.5 py-2 text-xs font-bold text-white shadow-lg md:right-6"
            style={{ "--dur": "7s", "--delay": "-2s" } as CSSProperties}
          >
            {factChip}
          </span>
        </div>
      </div>
    </section>
  );
}
