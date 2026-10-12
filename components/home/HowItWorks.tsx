"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { easeOut } from "@/lib/motion";
import { Bubbles } from "@/components/areas/Bubbles";

type Step = {
  id: string;
  title: string;
  text: string;
  src: string;
  alt: string;
};

const steps: Step[] = [
  {
    id: "pile",
    title: "The pile grows",
    text: "After a long week the basket is full, and the weekend is too short to deal with it.",
    src: "/steps/dirty-clothes.jpg",
    alt: "A heap of colourful unwashed clothes.",
  },
  {
    id: "book",
    title: "Book in the app",
    text: "Choose wash and fold or ironing, pick a pickup slot that suits you, confirm.",
    src: "/steps/booking.jpg",
    alt: "A phone showing a booking confirmed screen.",
  },
  {
    id: "pickup",
    title: "We pick up",
    text: "Our team collects the bag from your door at the time you picked. Nothing to carry anywhere.",
    src: "/steps/pickup.jpg",
    alt: "A delivery person carrying a laundry bag from a van to a front door.",
  },
  {
    id: "care",
    title: "Washed and finished",
    text: "Sorted and inspected, washed and dried, then pressed or folded at our own facility.",
    src: "/steps/washing.jpg",
    alt: "A laundry room with a washing machine, an ironing board and stacks of folded clothes.",
  },
  {
    id: "deliver",
    title: "Delivered back",
    text: "Back at your doorstep, clean and ready to put away.",
    src: "/steps/delivery.webp",
    alt: "A blue iWash Laundry bag waiting on a doorstep in front of a white front door.",
  },
];

const count = steps.length;

/**
 * How it works, as a zig-zag timeline. A spine runs down the centre of the
 * page on desktop (down the left edge on phones); steps alternate either
 * side of it, each with a small illustration. The spine draws itself as
 * the section scrolls through, and each step's marker fills when the line
 * reaches it.
 */
export function HowItWorks() {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 0.7", "end 0.6"] });

  return (
    <section
      id="how-it-works"
      className="relative scroll-mt-16 overflow-hidden bg-gradient-to-b from-iwash-surface via-white to-iwash-surface py-24 md:py-36"
      aria-labelledby="how-heading"
    >
      <Bubbles />

      <div className="relative z-10 mx-auto max-w-5xl px-5 md:px-10">
        <div className="text-center">
          <p className="eyebrow">How it works</p>
          <h2 id="how-heading" className="display display-lg mt-4 text-iwash-neutral">
            Five steps. Only one is yours.
          </h2>
          <p className="lede mx-auto mt-5 max-w-md">
            Book a slot, hand the bag over, and the rest happens at our end.
          </p>
        </div>

        <ol ref={listRef} className="relative mt-16 md:mt-24">
          {/* Spine: faint track plus the drawn line */}
          <span
            className="absolute bottom-0 left-[17px] top-0 w-0.5 rounded-full bg-iwash-neutral/10 md:left-1/2 md:-translate-x-1/2"
            aria-hidden="true"
          />
          <motion.span
            className="motion-reset absolute bottom-0 left-[17px] top-0 w-0.5 origin-top rounded-full bg-iwash-primary md:left-1/2 md:-translate-x-1/2"
            style={{ scaleY: scrollYProgress }}
            aria-hidden="true"
          />

          {steps.map((step, i) => (
            <StepItem key={step.id} step={step} index={i} progress={scrollYProgress} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function StepItem({ step, index, progress }: { step: Step; index: number; progress: MotionValue<number> }) {
  const left = index % 2 === 0;
  // The marker fills when the drawn line reaches this step's share of the spine.
  const reach = (index + 0.5) / count;
  const lit = (p: number) => p >= reach - 0.06;
  const markerScale = useTransform(progress, (p) => (lit(p) ? 1.15 : 0.9));
  const markerBg = useTransform(progress, (p) => (lit(p) ? "#0284c7" : "#ffffff"));
  const markerColor = useTransform(progress, (p) => (lit(p) ? "#ffffff" : "#0284c7"));

  return (
    <li className="relative grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-4 pb-10 last:pb-0 md:grid-cols-2 md:gap-x-0 md:pb-16">
      {/* Marker on the spine */}
      <motion.span
        className="motion-reset relative z-10 flex h-9 w-9 items-center justify-center rounded-full text-sm font-extrabold tabular-nums ring-2 ring-iwash-primary md:absolute md:left-1/2 md:top-6 md:-translate-x-1/2"
        style={{ scale: markerScale, backgroundColor: markerBg, color: markerColor }}
        aria-hidden="true"
      >
        {index + 1}
      </motion.span>

      {/* Card */}
      <motion.div
        className={`motion-reset ${
          left ? "md:col-start-1 md:pr-14 md:justify-self-end" : "md:col-start-2 md:pl-14"
        } md:row-start-1`}
        initial={{ opacity: 0, x: left ? -36 : 36, y: 12 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.8, ease: easeOut }}
      >
        <div
          className={`relative flex items-center gap-4 rounded-2xl bg-white/85 p-3.5 shadow-[0_18px_50px_-28px_rgba(2,132,199,0.55)] ring-1 ring-iwash-neutral/10 backdrop-blur md:max-w-md md:gap-5 md:p-4 ${
            left ? "md:flex-row-reverse md:text-right" : ""
          } ${index % 2 === 1 ? "flex-row-reverse text-right md:flex-row md:text-left" : ""}`}
        >
          <span className="relative block h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white ring-1 ring-iwash-neutral/10 md:h-28 md:w-28">
            <Image src={step.src} alt={step.alt} fill sizes="112px" className="object-contain p-1" />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-iwash-primary">
              Step {index + 1}
            </p>
            <h3 className="mt-1 font-display text-lg font-extrabold tracking-tight text-iwash-neutral md:text-xl">
              {step.title}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-iwash-ink-soft">{step.text}</p>
          </div>
        </div>
      </motion.div>
    </li>
  );
}
