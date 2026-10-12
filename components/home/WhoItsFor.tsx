import type { ReactNode } from "react";
import Image from "next/image";
import { site } from "@/lib/site";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { WhatsAppIcon, whatsappHref } from "@/components/site/WhatsAppButton";

const s = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" } as const;

type Tone = "sky" | "white" | "dark";

const cards: {
  title: string;
  text: string;
  tags: string[];
  icon: ReactNode;
  tone: Tone;
  business?: boolean;
}[] = [
  {
    title: "Busy professionals",
    text: "Shirts, trousers and sarees pressed and returned ready to wear. Book around your shift.",
    tags: ["Steam pressed", "Shift-friendly slots", "Next-day return"],
    tone: "sky",
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true" {...s}>
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      </svg>
    ),
  },
  {
    title: "Families",
    text: "Everyday clothes, towels and bed linen washed, dried and folded, priced per item.",
    tags: ["Wash + fold", "Towels", "Bed linen"],
    tone: "white",
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true" {...s}>
        <path d="M3 11l9-7 9 7v9H3z" />
        <path d="M9 20v-6h6v6" />
      </svg>
    ),
  },
  {
    title: "PGs, hostels and shared homes",
    text: "No machines to queue for. Per-item pricing makes a shared bill easy to split.",
    tags: ["Per-item bills", "Easy to split", "No queues"],
    tone: "white",
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true" {...s}>
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="9" r="2.4" />
        <path d="M3 19c0-3.3 2.7-6 6-6s6 2.7 6 6M15.5 14.2c3 .1 5.5 2 5.5 4.8" />
      </svg>
    ),
  },
  {
    title: "Businesses",
    text: "Clinics, salons, guest houses and hostels: regular pickup for linen and uniforms.",
    tags: ["Clinics", "Salons", "Guest houses", "Hostels"],
    tone: "dark",
    business: true,
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true" {...s}>
        <path d="M4 21V8l8-5 8 5v13" />
        <path d="M9 21v-5h6v5M9 11h.01M15 11h.01" />
      </svg>
    ),
  },
];

const toneStyles: Record<Tone, { card: string; icon: string; text: string; tag: string; num: string }> = {
  sky: {
    card: "bg-linear-to-br from-iwash-primary via-iwash-primary to-iwash-secondary text-white shadow-[0_30px_70px_-35px_rgba(2,132,199,0.9)]",
    icon: "bg-white/20 text-white ring-1 ring-white/30",
    text: "text-white/85",
    tag: "bg-white/15 text-white ring-1 ring-white/25",
    num: "text-white/15",
  },
  white: {
    card: "bg-white ring-1 ring-iwash-neutral/10 hover:shadow-[0_26px_60px_-30px_rgba(2,132,199,0.6)]",
    icon: "bg-iwash-border/70 text-iwash-primary group-hover:bg-iwash-primary group-hover:text-white",
    text: "text-iwash-ink-soft",
    tag: "bg-iwash-border/60 text-iwash-primary",
    num: "text-iwash-primary/10",
  },
  dark: {
    card: "bg-iwash-neutral text-white sm:col-span-2",
    icon: "bg-white/10 text-iwash-tertiary ring-1 ring-white/20",
    text: "text-white/75",
    tag: "bg-white/10 text-iwash-tertiary ring-1 ring-white/15",
    num: "text-white/10",
  },
};

/** Four audiences in a bento layout, one of them a business enquiry. */
export function WhoItsFor() {
  const enquiry = whatsappHref("Hi iWash, I would like to enquire about laundry for my business.");

  return (
    <section className="relative overflow-hidden py-24 md:py-36" aria-labelledby="who-heading">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-20 h-[28rem] w-[28rem] rounded-full bg-iwash-tertiary/40 blur-3xl"
      />
      <div className="relative mx-auto max-w-[1680px] px-5 md:px-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <p className="eyebrow">Who it is for</p>
              <h2 id="who-heading" className="display display-lg mt-4 text-iwash-neutral">
                Laundry for the way you{" "}
                <span className="bg-linear-to-r from-iwash-primary to-iwash-secondary bg-clip-text text-transparent">
                  live.
                </span>
              </h2>
              <p className="mt-6 max-w-sm text-base leading-relaxed text-iwash-ink-soft">
                One doorstep service, shaped around your routine. Pick the one that sounds like you.
              </p>
              <ul className="mt-8 flex flex-wrap gap-2 text-sm font-semibold text-iwash-neutral">
                {["Free pickup", "Per-item pricing", "Doorstep delivery"].map((t) => (
                  <li key={t} className="rounded-full bg-white px-4 py-2 ring-1 ring-iwash-neutral/10">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal stagger className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
            {cards.map((c, i) => {
              const t = toneStyles[c.tone];
              return (
                <RevealItem
                  key={c.title}
                  className={`group relative flex min-h-[19rem] flex-col overflow-hidden rounded-[2rem] p-7 transition-[transform,box-shadow] duration-500 ease-[var(--ease-brand)] hover:-translate-y-1.5 ${t.card}`}
                >
                  {c.business ? (
                    <>
                      <Image
                        src="/packaging-cart.jpg"
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 55vw, 100vw"
                        className="object-cover opacity-30 transition-transform duration-700 ease-[var(--ease-brand)] group-hover:scale-105"
                      />
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-linear-to-r from-iwash-neutral via-iwash-neutral/85 to-iwash-neutral/30"
                      />
                    </>
                  ) : (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-current opacity-[0.06] transition-transform duration-700 group-hover:scale-125"
                    />
                  )}

                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute bottom-2 right-5 select-none font-display text-[7rem] font-extrabold leading-none ${t.num}`}
                  >
                    0{i + 1}
                  </span>

                  <div className="relative flex flex-1 flex-col">
                    <span
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-colors duration-500 ${t.icon}`}
                    >
                      {c.icon}
                    </span>
                    <h3 className="mt-6 font-display text-2xl font-extrabold tracking-tight">{c.title}</h3>
                    <p className={`mt-2 max-w-md text-sm leading-relaxed ${t.text}`}>{c.text}</p>

                    <ul className="mt-5 flex flex-wrap gap-2">
                      {c.tags.map((tag) => (
                        <li key={tag} className={`rounded-full px-3 py-1 text-xs font-semibold ${t.tag}`}>
                          {tag}
                        </li>
                      ))}
                    </ul>

                    {c.business ? (
                      <div className="mt-auto flex flex-wrap gap-3 pt-6 text-sm font-semibold">
                        {enquiry ? (
                          <a
                            href={enquiry}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-iwash-neutral transition-transform hover:scale-[1.03]"
                          >
                            <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
                            WhatsApp us
                          </a>
                        ) : null}
                        <a
                          href={site.contact.phoneHref}
                          className="inline-flex items-center rounded-full px-5 py-2.5 text-white ring-1 ring-white/40 transition-colors hover:bg-white/10"
                        >
                          Call {site.contact.phone}
                        </a>
                      </div>
                    ) : null}
                  </div>
                </RevealItem>
              );
            })}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
