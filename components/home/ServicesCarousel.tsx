"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { CategoryGlyph } from "@/components/prices/CategoryGlyph";

export type CarouselCard = {
  slug: string;
  name: string;
  text: string;
  glyph: string;
  href: string;
  image: string | null;
};

/** Pixels per second. Slow on purpose. */
const SPEED = 28;

const arrow =
  "absolute top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-iwash-neutral shadow-lg ring-1 ring-iwash-neutral/15 transition-[background-color,color,transform] duration-300 hover:scale-105 hover:bg-iwash-primary hover:text-white md:flex";

/**
 * Slowly self-moving, endless card carousel. It is a native scroller (so
 * touch drag, trackpad and keyboard all work) that a rAF loop nudges along.
 * The list is rendered twice; scrolling wraps by half the width so the loop
 * is seamless. Auto-movement pauses on hover, focus and touch, and is off
 * for users who prefer reduced motion.
 */
export function ServicesCarousel({ cards }: { cards: CarouselCard[] }) {
  const track = useRef<HTMLDivElement>(null);
  const paused = useRef(false);
  const holdUntil = useRef(0);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let last = performance.now();
    let pos = el.scrollLeft;

    const tick = (now: number) => {
      const dt = Math.min(now - last, 64);
      last = now;
      const half = el.scrollWidth / 2;
      if (paused.current || now < holdUntil.current) {
        pos = el.scrollLeft;
      } else if (half > 0) {
        pos += (SPEED * dt) / 1000;
        if (pos >= half) pos -= half;
        el.scrollLeft = pos;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const page = useCallback((dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const half = el.scrollWidth / 2;
    if (dir === -1 && el.scrollLeft < el.clientWidth) el.scrollLeft += half;
    holdUntil.current = performance.now() + 1100;
    el.scrollBy({ left: dir * el.clientWidth * 0.7, behavior: "smooth" });
  }, []);

  const pause = () => {
    paused.current = true;
  };
  const resume = () => {
    paused.current = false;
  };

  return (
    <div
      className="relative"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={resume}
      onTouchStart={pause}
      onTouchEnd={() => window.setTimeout(resume, 1800)}
    >
      <button type="button" onClick={() => page(-1)} aria-label="Previous services" className={`${arrow} left-1`}>
        <span aria-hidden="true" className="rotate-180">
          &rarr;
        </span>
      </button>
      <button type="button" onClick={() => page(1)} aria-label="Next services" className={`${arrow} right-1`}>
        <span aria-hidden="true">&rarr;</span>
      </button>

      <div ref={track} className="reel-mask flex overflow-x-auto py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            className="flex shrink-0 gap-4 pr-4 md:gap-5 md:pr-5"
            aria-hidden={copy === 1 || undefined}
            {...(copy === 1 ? { inert: true } : {})}
          >
            {cards.map((c) => (
              <Card key={c.slug} card={c} />
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

function Card({ card }: { card: CarouselCard }) {
  const isCall = card.href.startsWith("tel:");
  const cta = isCall ? "Call for a quote" : card.href === "/download" ? "Get the app" : "See prices";
  const linkClass = "mt-4 text-sm font-bold text-iwash-primary underline-offset-4 hover:underline";

  return (
    <li className="group w-[17.5rem] shrink-0 md:w-[22rem]">
      <article className="flex h-full flex-col rounded-[2rem] bg-white p-3.5 ring-1 ring-iwash-neutral/10 transition-[transform,box-shadow] duration-500 ease-[var(--ease-brand)] hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-32px_rgba(2,132,199,0.6)] md:p-4">
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-linear-to-br from-iwash-border via-white to-iwash-tertiary/60">
          {card.image ? (
            <Image
              src={card.image}
              alt=""
              fill
              sizes="(min-width: 768px) 352px, 280px"
              className="object-cover transition-transform duration-700 ease-[var(--ease-brand)] group-hover:scale-105"
            />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-iwash-primary/70">
              <CategoryGlyph name={card.glyph} className="h-20 w-20" />
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col px-2 pb-2 pt-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-display text-xl font-extrabold tracking-tight text-iwash-neutral md:text-2xl">{card.name}</h3>
            <span
              aria-hidden="true"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-iwash-border text-iwash-primary transition-colors duration-300 group-hover:bg-iwash-primary group-hover:text-white"
            >
              &rarr;
            </span>
          </div>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-iwash-ink-soft">{card.text}</p>
          {isCall ? (
            <a href={card.href} className={linkClass}>
              {cta} &rarr;
            </a>
          ) : (
            <Link href={card.href} className={linkClass}>
              {cta} &rarr;
            </Link>
          )}
        </div>
      </article>
    </li>
  );
}
