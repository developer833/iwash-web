import { site } from "@/lib/site";
import { Bubbles } from "@/components/areas/Bubbles";
import { StoreBadges } from "@/components/ui/StoreBadges";
import { Reveal } from "@/components/motion/Reveal";

/** The launch offer, given its own moment right after the process is explained. */
export function OfferBand() {
  return (
    <section aria-labelledby="offer-heading" className="px-5 py-6 md:px-10 md:py-10">
      <div className="relative mx-auto max-w-[1680px] overflow-hidden rounded-[32px] bg-gradient-to-br from-iwash-neutral via-[#0b2a4a] to-iwash-primary px-6 py-14 text-white md:px-16 md:py-20">
        <Bubbles tone="dark" />
        <Reveal className="relative z-10 grid gap-10 md:grid-cols-[auto_1fr] md:items-center md:gap-16">
          <p
            className="font-display text-[clamp(5rem,16vw,12rem)] font-extrabold leading-[0.85] tracking-tighter"
            aria-hidden="true"
          >
            50<span className="text-iwash-tertiary">%</span>
          </p>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-iwash-tertiary">New customer offer</p>
            <h2 id="offer-heading" className="display display-md mt-3">
              {site.offer.headline} in the app.
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-slate-300">{site.offer.detail}</p>
            <StoreBadges className="mt-7" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
