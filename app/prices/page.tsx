import type { Metadata } from "next";
import { getPriceList } from "@/lib/pricing";
import { formatRupees } from "@/lib/format";
import { site } from "@/lib/site";
import { PriceCatalogue } from "@/components/prices/PriceCatalogue";
import { PriceEstimator } from "@/components/prices/PriceEstimator";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Laundry prices in Kerala",
  description:
    "Current iWash price list for wash and fold and ironing across Kerala. Prices are per item and include GST.",
  alternates: { canonical: "/prices" },
};

const link = "font-semibold text-iwash-primary underline-offset-4 hover:underline";
const rows = "mt-5 divide-y divide-iwash-border border-y border-iwash-border";

export default async function PricesPage() {
  const list = await getPriceList();
  const hasPerKg = list?.categories.some((c) => c.items.some((i) => i.perKg)) ?? false;

  return (
    <>
      {/* Introduction */}
      <section aria-labelledby="prices-heading" className="mx-auto max-w-[1680px] px-5 pb-12 pt-[calc(var(--header-h)+3rem)] md:px-10 md:pb-16 md:pt-[calc(var(--header-h)+5rem)]">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-12 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:items-end md:gap-16">
          <Reveal>
            <p className="eyebrow mb-5">Pricing</p>
            <h1 id="prices-heading" className="display display-lg text-iwash-neutral">
              Fresh clothes. Clear prices.
            </h1>
            <p className="lede mt-6 max-w-xl">
              Every item is priced on its own, and every price includes GST. Find what you are sending, compare
              wash and fold with ironing, and know the cost before we collect.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonLink href={site.app.href} size="lg">
                {site.app.label}
              </ButtonLink>
              {list ? (
                <ButtonLink href="#estimate" size="lg" variant="secondary">
                  Estimate your cost
                </ButtonLink>
              ) : null}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <dl className="divide-y divide-iwash-neutral/15 border-y border-iwash-neutral/15">
              <div className="grid gap-1 py-4 sm:grid-cols-[9rem_1fr] sm:gap-6">
                <dt className="text-sm font-semibold text-iwash-neutral">GST included</dt>
                <dd className="text-sm leading-relaxed text-iwash-ink-soft">Every price on this page already includes GST.</dd>
              </div>
              <div className="grid gap-1 py-4 sm:grid-cols-[9rem_1fr] sm:gap-6">
                <dt className="text-sm font-semibold text-iwash-neutral">Billed on receipt</dt>
                <dd className="text-sm leading-relaxed text-iwash-ink-soft">
                  Your bill is based on the items we actually receive and check.
                </dd>
              </div>
              {hasPerKg ? (
                <div className="grid gap-1 py-4 sm:grid-cols-[9rem_1fr] sm:gap-6">
                  <dt className="text-sm font-semibold text-iwash-neutral">Bulky items</dt>
                  <dd className="text-sm leading-relaxed text-iwash-ink-soft">
                    A few items, such as carpets and curtains, are priced per kilogram.
                  </dd>
                </div>
              ) : null}
              <div className="grid gap-1 py-4 sm:grid-cols-[9rem_1fr] sm:gap-6">
                <dt className="text-sm font-semibold text-iwash-neutral">Dry cleaning</dt>
                <dd className="text-sm leading-relaxed text-iwash-ink-soft">
                  For dry cleaning or anything not listed, call us for a quote on{" "}
                  <a href={site.contact.phoneHref} className={`${link} whitespace-nowrap`}>
                    {site.contact.phone}
                  </a>
                  .
                </dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </section>

      {list ? (
        <>
          <div className="mx-auto max-w-[1680px] px-5 md:px-10">
            <PriceCatalogue list={list} />
          </div>

          {/* Estimate, delivery and add-ons */}
          <section
            id="estimate"
            aria-labelledby="estimate-heading"
            className="mt-24 scroll-mt-24 bg-linear-to-b from-white via-iwash-border/50 to-white py-20 md:mt-32 md:py-28"
          >
            <div className="mx-auto max-w-[1680px] px-5 md:px-10">
              <div className="grid gap-6 md:grid-cols-2 md:gap-10">
                <p className="eyebrow">Estimate</p>
                <h2 id="estimate-heading" className="statement text-iwash-neutral">
                  Estimate your laundry cost.
                </h2>
              </div>
              <div className="mt-12 md:mt-16">
                <PriceEstimator list={list} bookingHref={site.app.href} bookingLabel={site.app.label} />
              </div>
            </div>
          </section>

          {list.delivery.length > 0 || list.addons.length > 0 ? (
            <section aria-label="Delivery and add-ons" className="mx-auto max-w-[1680px] px-5 py-20 md:px-10 md:py-28">
              <div className="grid gap-14 md:grid-cols-2 md:gap-10">
                {list.delivery.length > 0 ? (
                  <div>
                    <h2 className="display display-sm text-iwash-neutral">Delivery</h2>
                    <ul className={rows}>
                      {list.delivery.map((d) => (
                        <li key={d.name} className="flex items-baseline justify-between gap-6 py-4">
                          <span>
                            <span className="font-medium text-iwash-neutral">{d.name}</span>
                            <span className="ml-2 text-sm text-iwash-ink-soft">
                              {d.days === 0 ? "same day" : d.days === 1 ? "1 day" : `${d.days} days`}
                            </span>
                          </span>
                          <span className="font-semibold tabular-nums text-iwash-neutral">
                            {d.price === 0 ? "Free" : formatRupees(d.price)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {list.addons.length > 0 ? (
                  <div>
                    <h2 className="display display-sm text-iwash-neutral">Add-ons</h2>
                    <ul className={rows}>
                      {list.addons.map((addon) => (
                        <li key={addon.name} className="flex items-baseline justify-between gap-6 py-4">
                          <span className="font-medium text-iwash-neutral">{addon.name}</span>
                          <span className="tabular-nums">
                            <span className="font-semibold text-iwash-neutral">{formatRupees(addon.price)}</span>
                            <span className="text-sm text-iwash-ink-soft">{addon.perItem ? " per item" : " per order"}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </section>
          ) : null}
        </>
      ) : (
        <div className="mx-auto max-w-[1680px] px-5 pb-24 md:px-10">
          <div className="max-w-xl rounded-[4px] bg-white p-8 ring-1 ring-iwash-border">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-iwash-neutral">
              Ask us for the current price list
            </h2>
            <p className="mt-3 leading-relaxed text-iwash-ink-soft">
              Our online price list is not available right now. Call{" "}
              <a href={site.contact.phoneHref} className={link}>
                {site.contact.phone}
              </a>{" "}
              or email{" "}
              <a href={`mailto:${site.contact.email}`} className={link}>
                {site.contact.email}
              </a>{" "}
              and we will send it to you.
            </p>
          </div>
        </div>
      )}

      {/* Closing booking call to action */}
      <section aria-labelledby="prices-cta" className="bg-iwash-neutral py-20 text-white md:py-28">
        <div className="mx-auto grid max-w-[1680px] gap-8 px-5 md:grid-cols-2 md:items-end md:gap-10 md:px-10">
          <h2 id="prices-cta" className="display display-md">
            Ready when you are.
          </h2>
          <div>
            <p className="max-w-md text-lg leading-relaxed text-slate-300">
              Download the app, pick a time slot and we collect from your door. No counting needed before we arrive.
            </p>
            <div className="mt-7">
              <ButtonLink href={site.app.href} size="lg">
                {site.app.label}
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
