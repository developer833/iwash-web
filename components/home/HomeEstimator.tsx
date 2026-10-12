import type { PriceList } from "@/lib/pricing";
import { site } from "@/lib/site";
import { PriceEstimator } from "@/components/prices/PriceEstimator";
import { Reveal } from "@/components/motion/Reveal";

/** The price estimator on the home page, so cost is answered before anything else. Omitted if prices are unavailable. */
export function HomeEstimator({ priceList }: { priceList: PriceList | null }) {
  if (!priceList) return null;

  return (
    <section
      id="estimate"
      className="relative scroll-mt-16 overflow-hidden bg-linear-to-b from-white via-iwash-border/50 to-white py-20 md:py-32"
      aria-labelledby="estimate-heading"
    >
      <div aria-hidden="true" className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-iwash-tertiary/50 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 bottom-10 h-96 w-96 rounded-full bg-iwash-secondary/20 blur-3xl" />

      <div className="relative mx-auto max-w-[1680px] px-5 md:px-10">
        <Reveal className="grid gap-6 md:grid-cols-2 md:gap-10">
          <div>
            <p className="eyebrow">Know the cost first</p>
            <h2 id="estimate-heading" className="display display-lg mt-4 text-iwash-neutral">
              What will my laundry{" "}
              <span className="bg-linear-to-r from-iwash-primary to-iwash-secondary bg-clip-text text-transparent">
                cost?
              </span>
            </h2>
          </div>
          <p className="lede max-w-md md:justify-self-end md:self-end">
            Pick your items and see an estimate from our live price list. Every price includes GST, and
            your first order in the app is 50% off.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-10 md:mt-14">
          <PriceEstimator list={priceList} bookingHref={site.app.href} bookingLabel={site.app.label} />
        </Reveal>
      </div>
    </section>
  );
}
