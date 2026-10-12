"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { formatRupees } from "@/lib/format";
import type { PriceItem, PriceList } from "@/lib/pricing";
import { CategoryGlyph } from "@/components/prices/CategoryGlyph";

type Services = PriceList["serviceTypes"];

const arrow =
  "flex h-11 w-11 items-center justify-center rounded-full bg-white text-iwash-neutral shadow-md ring-1 ring-iwash-neutral/15 transition-[opacity,background-color,color] duration-300 hover:bg-iwash-primary hover:text-white disabled:pointer-events-none disabled:opacity-30";

/**
 * One category as a horizontal carousel of image-led cards. Native scroll
 * with snap, so touch, trackpad and keyboard scrolling all work; the arrow
 * buttons are a convenience on top. Every card is real markup, so nothing
 * is hidden from crawlers.
 */
export function PriceCarousel({ categoryName, items, services }: { categoryName: string; items: PriceItem[]; services: Services }) {
  const track = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
  }, []);

  useEffect(() => {
    measure();
    const el = track.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure, items.length]);

  function page(dir: 1 | -1) {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  }

  return (
    <div className="relative mt-6">
      <ul
        ref={track}
        onScroll={measure}
        tabIndex={0}
        aria-label={`${categoryName} prices, scroll sideways`}
        className="relative -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto scroll-smooth px-5 pb-6 pt-2 md:scroll-px-10 outline-none [scrollbar-width:none] focus-visible:ring-2 focus-visible:ring-iwash-primary/40 md:-mx-10 md:gap-5 md:px-10 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => (
          <ItemCard key={item.id} item={item} services={services} category={categoryName} />
        ))}
      </ul>

      {items.length > 2 ? (
        <div className="mt-1 hidden items-center justify-end gap-2 md:flex">
          <button type="button" onClick={() => page(-1)} disabled={edge.start} aria-label={`Previous ${categoryName}`} className={arrow}>
            <span aria-hidden="true" className="rotate-180">
              &rarr;
            </span>
          </button>
          <button type="button" onClick={() => page(1)} disabled={edge.end} aria-label={`Next ${categoryName}`} className={arrow}>
            <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}

function ItemCard({ item, services, category }: { item: PriceItem; services: Services; category: string }) {
  const [failed, setFailed] = useState(false);
  const priced = services
    .map((s) => ({ s, p: item.prices.find((x) => x.serviceType === s.id) }))
    .filter((x): x is { s: Services[number]; p: NonNullable<typeof x.p> } => Boolean(x.p));
  const lowest = priced.length ? Math.min(...priced.map((x) => x.p.price)) : null;
  const unit = item.perKg ? " / kg" : "";

  return (
    <li className="group w-[15.5rem] shrink-0 snap-start md:w-[17.5rem]">
      <article className="flex h-full flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-iwash-neutral/10 transition-[transform,box-shadow] duration-500 ease-[var(--ease-brand)] group-hover:-translate-y-1.5 group-hover:shadow-[0_26px_60px_-30px_rgba(2,132,199,0.6)]">
        {/* Image-led: the photograph is the card */}
        <div className="relative aspect-square bg-gradient-to-br from-iwash-border/60 via-white to-iwash-border/40">
          {item.image && !failed ? (
            <Image
              src={item.image}
              alt=""
              fill
              sizes="(min-width: 768px) 280px, 248px"
              loading="lazy"
              onError={() => setFailed(true)}
              className="object-contain p-6 transition-transform duration-700 ease-[var(--ease-brand)] group-hover:scale-105"
            />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-iwash-primary/60">
              <CategoryGlyph name={category} className="h-20 w-20" />
            </span>
          )}

          {/* The price, highlighted */}
          {lowest !== null ? (
            <span className="absolute bottom-3 left-3 rounded-2xl bg-iwash-primary px-3.5 py-1.5 text-white shadow-lg">
              {priced.length > 1 ? <span className="block text-[10px] font-bold uppercase leading-none tracking-wider text-white/80">From</span> : null}
              <span className="font-display text-2xl font-extrabold tabular-nums leading-tight">
                {formatRupees(lowest)}
              </span>
              {unit ? <span className="text-xs font-semibold text-white/80">{unit}</span> : null}
            </span>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-display text-lg font-extrabold leading-snug tracking-tight text-iwash-neutral">{item.name}</h3>

          {priced.length === 0 ? (
            <p className="mt-3 text-sm text-iwash-ink-soft">Price on request</p>
          ) : (
            <dl className="mt-3 divide-y divide-iwash-border text-sm">
              {priced.map(({ s, p }) => (
                <div key={s.id} className="flex items-baseline justify-between gap-3 py-2">
                  <dt className="text-iwash-ink-soft">{s.label}</dt>
                  <dd className="font-bold tabular-nums text-iwash-neutral">
                    {p.was ? (
                      <s className="mr-1.5 text-xs font-normal text-iwash-ink-soft">
                        <span className="sr-only">Was </span>
                        {formatRupees(p.was)}
                      </s>
                    ) : null}
                    <span className="text-iwash-primary">
                      <span className="sr-only">{p.was ? "Now " : ""}</span>
                      {formatRupees(p.price)}
                    </span>
                    {unit ? <span className="text-xs font-normal text-iwash-ink-soft">{unit}</span> : null}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </article>
    </li>
  );
}
