import type { ReactNode } from "react";
import { site } from "@/lib/site";
import { Reveal, RevealItem } from "@/components/motion/Reveal";

const icon = "h-6 w-6 text-iwash-primary";
const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" } as const;

const facts: { title: string; text: string; icon: ReactNode }[] = [
  {
    title: "Our own laundry",
    text: "Washed and finished at our facility in Cochin SEZ.",
    icon: (
      <svg viewBox="0 0 24 24" className={icon} aria-hidden="true" {...stroke}>
        <path d="M3 21V9l6 3V9l6 3V5h6v16z" />
        <path d="M8 21v-4h3v4" />
      </svg>
    ),
  },
  {
    title: "Clear prices",
    text: "Priced per item, GST included, bill based on what we receive.",
    icon: (
      <svg viewBox="0 0 24 24" className={icon} aria-hidden="true" {...stroke}>
        <path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" />
        <path d="M9 8h6M9 12h6" />
      </svg>
    ),
  },
  {
    title: "Door to door",
    text: "Pick a time slot. We collect and bring it back.",
    icon: (
      <svg viewBox="0 0 24 24" className={icon} aria-hidden="true" {...stroke}>
        <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" />
        <circle cx="7" cy="18" r="1.6" />
        <circle cx="17" cy="18" r="1.6" />
      </svg>
    ),
  },
  {
    title: `All over ${site.region}`,
    text: "From Kakkanad and Infopark to the rest of the state.",
    icon: (
      <svg viewBox="0 0 24 24" className={icon} aria-hidden="true" {...stroke}>
        <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" />
        <circle cx="12" cy="9.5" r="2.5" />
      </svg>
    ),
  },
];

/** Four verifiable facts, directly under the hero. No ratings or counts until they are real. */
export function TrustStrip() {
  return (
    <section aria-label="Why customers choose iWash" className="border-y border-iwash-border bg-white">
      <Reveal stagger className="mx-auto grid max-w-[1680px] gap-6 px-5 py-8 sm:grid-cols-2 md:grid-cols-4 md:gap-8 md:px-10 md:py-10">
        {facts.map((f) => (
          <RevealItem key={f.title} className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-iwash-border/70">
              {f.icon}
            </span>
            <div>
              <p className="font-display text-lg font-extrabold tracking-tight text-iwash-neutral">{f.title}</p>
              <p className="mt-0.5 text-sm leading-relaxed text-iwash-ink-soft">{f.text}</p>
            </div>
          </RevealItem>
        ))}
      </Reveal>
    </section>
  );
}
