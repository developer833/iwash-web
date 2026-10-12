"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { easeOut } from "@/lib/motion";
import { site } from "@/lib/site";
import { HangingOffer } from "@/components/home/HangingOffer";

const rotating = ["shirts", "sarees", "bed linen", "uniforms", "towels"] as const;
const ticker = ["Wash", "Iron", "Fold", "Deliver"] as const;

const wordIn = (i: number) => ({
  initial: { opacity: 0, y: 40, filter: "blur(16px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 1, ease: easeOut, delay: 0.15 + i * 0.12 },
});

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: easeOut, delay },
});

/**
 * Home hero: a full-screen photograph that reacts to scroll velocity, a
 * headline that leans into the scroll, a ticker that speeds up and reverses
 * with it, and an offer card dangling from the header on a stretchy string (smaller on phones).
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [wordIndex, setWordIndex] = useState(0);

  const { scrollY } = useScroll();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 300 });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "9%"]);
  const baseScale = useTransform(scrollYProgress, [0, 1], [1.06, 1.2]);
  const pulse = useTransform(velocity, [-2500, 0, 2500], [0.05, 0, 0.05]);
  const bgScale = useTransform([baseScale, pulse], ([b, p]: number[]) => b + p);
  const lean = useTransform(velocity, [-2500, 0, 2500], [7, 0, -7]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    if (reduce || window.matchMedia("(max-width: 767px)").matches) return;
    const id = window.setInterval(() => setWordIndex((i) => (i + 1) % rotating.length), 2300);
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <section
      ref={ref}
      className="relative isolate min-h-[100svh] overflow-hidden bg-iwash-neutral text-white"
      aria-labelledby="hero-heading"
    >
      {/* Photograph */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 -top-[12%] h-[124%]"
        style={reduce ? undefined : { y: bgY, scale: bgScale }}
      >
        <Image
          src="/pickup-van.jpg"
          alt=""
          fill
          preload
          sizes="100vw"
          className="object-cover object-[60%_55%]"
        />
      </motion.div>

      {/* Scrims: dark on the left for the text, soft vignette top and bottom */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-r from-iwash-neutral/90 via-iwash-neutral/55 to-iwash-neutral/5 md:via-iwash-neutral/45 md:to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-b from-iwash-neutral/45 via-transparent to-iwash-neutral/80"
      />
      <div
        aria-hidden="true"
        className="absolute -left-40 top-1/3 h-[34rem] w-[34rem] rounded-full bg-iwash-primary/30 blur-[120px]"
      />

      <HangingOffer />

      {/* Content */}
      <motion.div
        style={reduce ? undefined : { opacity: fade }}
        className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1680px] flex-col justify-center px-5 pb-36 pt-[calc(var(--header-h)+13rem)] sm:pt-[calc(var(--header-h)+16rem)] md:px-10 md:pb-44 md:pt-[calc(var(--header-h)+2.5rem)]"
      >
        <div className="max-w-[46rem]">
          <motion.p
            {...rise(0)}
            className="fx-shimmer relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-white/95 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-iwash-primary shadow-lg ring-1 ring-white/60"
          >
            <span className="relative flex h-2 w-2">
              <span className="fx-ping absolute inline-flex h-full w-full rounded-full bg-iwash-primary/60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-iwash-primary" />
            </span>
            {site.offer.headline} in the app
          </motion.p>

          <motion.h1
            id="hero-heading"
            style={reduce ? undefined : { skewX: lean, transformOrigin: "0% 100%" }}
            className="display mt-6 text-[clamp(3rem,7.2vw,7.4rem)] leading-[0.92] text-white [text-shadow:0_6px_40px_rgba(2,20,40,0.45)]"
          >
            <span className="block">
              {["Laundry,", "done."].map((w, i) => (
                <motion.span key={w} {...wordIn(i)} className="mr-[0.22em] inline-block">
                  {w}
                </motion.span>
              ))}
            </span>
            <motion.span
              {...wordIn(2)}
              className="fx-gradient-text block bg-linear-to-r from-[#7dd3fc] via-white to-[#38bdf8] bg-[length:200%_100%] bg-clip-text text-transparent [text-shadow:none]"
            >
              Delivered.
            </motion.span>
          </motion.h1>

          <motion.p
            {...rise(0.55)}
            className="mt-7 flex flex-wrap items-center gap-x-2 text-xl font-semibold text-white md:text-2xl"
          >
            <span>We take care of your</span>
            <span className="relative block h-[1.4em] min-w-[9ch] overflow-hidden leading-[1.4em] text-[#7dd3fc]" aria-live="off">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={rotating[wordIndex]}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.45, ease: easeOut }}
                  className="absolute left-0 top-0"
                >
                  {rotating[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.p>

          <motion.p {...rise(0.65)} className="mt-4 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
            Collected from your door anywhere in {site.region}, washed and finished with care, and brought
            back to you. Per-item prices, GST included.
          </motion.p>

          <motion.div {...rise(0.78)} className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/prices"
              className="group inline-flex h-13 items-center gap-2 rounded-full bg-white px-7 text-sm font-bold text-iwash-neutral shadow-[0_18px_40px_-14px_rgba(0,0,0,0.6)] transition-[transform,background-color,color] duration-300 hover:-translate-y-0.5 hover:bg-iwash-primary hover:text-white"
            >
              See prices
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                &rarr;
              </span>
            </Link>
            <Link
              href="/#how-it-works"
              className="inline-flex h-13 items-center rounded-full bg-white/10 px-7 text-sm font-bold text-white ring-1 ring-white/40 backdrop-blur-md transition-colors duration-300 hover:bg-white/20"
            >
              How it works
            </Link>
          </motion.div>
        </div>
      </motion.div>

      <VelocityTicker reduce={Boolean(reduce)} />
    </section>
  );
}

/**
 * Big words sliding along the bottom. They drift on their own and speed up
 * (or reverse) with the page's scroll velocity.
 */
function VelocityTicker({ reduce }: { reduce: boolean }) {
  const track = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const pos = useRef(0);
  const dir = useRef(1);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });

  useAnimationFrame((_, delta) => {
    const el = track.current;
    const one = copy.current?.offsetWidth ?? 0;
    if (!el || !one || reduce) return;
    const v = velocity.get();
    if (v < -20) dir.current = -1;
    else if (v > 20) dir.current = 1;
    const boost = 1 + Math.min(Math.abs(v) / 260, 14);
    pos.current += dir.current * 70 * boost * (delta / 1000);
    pos.current = ((pos.current % one) + one) % one;
    el.style.transform = `translate3d(${-pos.current}px,0,0)`;
  });

  const run = (key: string, ariaHidden?: boolean) => (
    <div key={key} ref={key === "a" ? copy : undefined} className="flex shrink-0 items-center" aria-hidden={ariaHidden}>
      {[0, 1].flatMap((r) =>
        ticker.map((word, i) => (
          <span key={`${r}-${word}`} className="flex items-center">
            <span
              className={`px-5 font-display text-[clamp(3rem,7vw,6.5rem)] font-extrabold uppercase leading-none tracking-tight md:px-8 ${
                i % 2 === 0 ? "text-white" : "text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.9)]"
              }`}
            >
              {word}
            </span>
            <span aria-hidden="true" className="text-2xl text-[#7dd3fc] md:text-4xl">
              &#10022;
            </span>
          </span>
        )),
      )}
    </div>
  );

  return (
    <div className="absolute inset-x-0 bottom-0 z-10 overflow-hidden pb-4 pt-10" aria-label="Wash, iron, fold, deliver" role="img">
      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-iwash-neutral/70 to-transparent" aria-hidden="true" />
      <div ref={track} className="relative flex w-max will-change-transform">
        {run("a")}
        {run("b", true)}
        {run("c", true)}
      </div>
    </div>
  );
}
