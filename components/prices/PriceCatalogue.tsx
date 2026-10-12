"use client";

import { useMemo, useRef, useState } from "react";
import { site } from "@/lib/site";
import type { PriceList } from "@/lib/pricing";
import { CategoryGlyph } from "@/components/prices/CategoryGlyph";
import { PriceCarousel } from "@/components/prices/PriceCarousel";

const chipBase =
  "inline-flex shrink-0 items-center gap-1.5 rounded-[3px] px-3 py-2.5 text-[13px] font-semibold ring-1 ring-inset transition-colors duration-300";
const chipOn = "bg-iwash-neutral text-white ring-iwash-neutral";
const chipOff = "bg-white text-iwash-neutral ring-slate-300 hover:ring-iwash-primary";
const textButton =
  "inline-flex items-center gap-2 text-sm font-semibold text-iwash-primary underline-offset-4 hover:underline";

/**
 * Searchable, filterable price catalogue.
 *
 * Every item and price is in the server-rendered HTML. Each category is a
 * horizontal carousel of image cards, so the page stays short without
 * hiding anything from crawlers. Search and category chips only change
 * which cards are shown.
 */
export function PriceCatalogue({ list }: { list: PriceList }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const topRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const q = query.trim().toLowerCase();
  const searching = q.length > 0;
  const services = list.serviceTypes;

  // Items matching the search, per category (all categories, regardless of the active chip).
  const matched = useMemo(
    () =>
      list.categories.map((c) => ({
        ...c,
        items: searching ? c.items.filter((i) => i.name.toLowerCase().includes(q)) : c.items,
      })),
    [list.categories, q, searching],
  );

  const visibleSections = matched.filter((c) => (category === "all" || c.id === category) && c.items.length > 0);
  const shownCount = visibleSections.reduce((n, c) => n + c.items.length, 0);
  const matchesElsewhere = matched
    .filter((c) => category !== "all" && c.id !== category)
    .reduce((n, c) => n + c.items.length, 0);
  const activeName = list.categories.find((c) => c.id === category)?.name;
  const filtered = searching || category !== "all";

  function chooseCategory(id: string) {
    setCategory(id);
    // If the page has scrolled past the top of the catalogue, bring it back into view.
    const top = topRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) topRef.current?.scrollIntoView({ block: "start" });
  }

  function clearAll() {
    setQuery("");
    setCategory("all");
    searchRef.current?.focus();
  }

  const summary = searching
    ? `${shownCount} ${shownCount === 1 ? "item matches" : "items match"} “${query.trim()}”${
        category !== "all" && activeName ? ` in ${activeName}` : ""
      }`
    : category === "all"
      ? `${list.itemCount} items in ${list.categories.length} categories`
      : `${shownCount} ${shownCount === 1 ? "item" : "items"} in ${activeName}`;

  return (
    <div>
      {/* Controls stay in reach while the list scrolls */}
      <div
        ref={topRef}
        className="sticky top-[var(--header-h)] z-30 -mx-5 border-y border-iwash-neutral/10 bg-iwash-surface/95 px-5 py-4 backdrop-blur-md md:-mx-10 md:px-10"
      >
        <div className="grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] md:items-center md:gap-6">
          <div className="relative">
            <label htmlFor="price-search" className="sr-only">
              Search the price list by item name
            </label>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-iwash-ink-soft"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="6.5" />
              <path d="m16 16 4 4" />
            </svg>
            <input
              id="price-search"
              ref={searchRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") setQuery("");
              }}
              placeholder="Search items, e.g. shirt"
              autoComplete="off"
              enterKeyHint="search"
              className="h-12 w-full rounded-[3px] border border-slate-300 bg-white pl-11 pr-11 text-base text-iwash-neutral placeholder:text-slate-400 focus:border-iwash-primary focus:outline-none focus:ring-2 focus:ring-iwash-primary/25 [&::-webkit-search-cancel-button]:hidden"
            />
            {query ? (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  searchRef.current?.focus();
                }}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-[3px] text-iwash-ink-soft hover:bg-iwash-border hover:text-iwash-neutral"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4" aria-hidden="true">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            ) : null}
          </div>

          <div
            role="group"
            aria-label="Filter by category"
            className="-mx-5 flex gap-1.5 overflow-x-auto px-5 pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden"
          >
            <button
              type="button"
              aria-pressed={category === "all"}
              onClick={() => chooseCategory("all")}
              className={`${chipBase} ${category === "all" ? chipOn : chipOff}`}
            >
              All items
            </button>
            {matched.map((c) => {
              const on = category === c.id;
              const none = searching && c.items.length === 0;
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => chooseCategory(c.id)}
                  className={`${chipBase} ${on ? chipOn : chipOff} ${none && !on ? "opacity-45" : ""}`}
                >
                  <CategoryGlyph name={c.name} className="h-4 w-4" />
                  {c.name}
                  <span className={`text-xs font-medium tabular-nums ${on ? "text-white/70" : "text-iwash-ink-soft"}`}>
                    {c.items.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 flex min-h-8 flex-wrap items-center justify-between gap-x-6 gap-y-2" aria-live="polite">
        <p className="text-sm text-iwash-ink-soft">{summary}</p>
        {filtered ? (
          <button type="button" onClick={clearAll} className={textButton}>
            Clear filters
          </button>
        ) : null}
      </div>

      {shownCount === 0 ? (
        <div className="mt-6 max-w-xl border-t border-iwash-neutral/15 py-12" role="status">
          <p className="display display-sm text-iwash-neutral">
            {searching ? `Nothing matches “${query.trim()}”.` : "Nothing to show here yet."}
          </p>
          <p className="lede mt-4">
            Check the spelling, try a shorter word, or call us on{" "}
            <a href={site.contact.phoneHref} className="font-semibold text-iwash-primary underline-offset-4 hover:underline">
              {site.contact.phone}
            </a>{" "}
            for anything not listed.
          </p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
            {searching ? (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  searchRef.current?.focus();
                }}
                className={textButton}
              >
                Clear search
              </button>
            ) : null}
            {searching && category !== "all" && matchesElsewhere > 0 ? (
              <button type="button" onClick={() => setCategory("all")} className={textButton}>
                Show {matchesElsewhere} {matchesElsewhere === 1 ? "match" : "matches"} in other categories
              </button>
            ) : null}
            {category !== "all" ? (
              <button type="button" onClick={() => chooseCategory("all")} className={textButton}>
                Show all categories
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="space-y-4 md:space-y-8">
        {matched.map((c, index) => {
          const show = (category === "all" || c.id === category) && c.items.length > 0;

          return (
            <section
              key={c.id}
              hidden={!show}
              aria-labelledby={`cat-${c.id}`}
              className="scroll-mt-[calc(var(--header-h)+9rem)] pt-10 first:pt-8"
            >
              <header className="flex items-end justify-between gap-6 border-b border-iwash-neutral/20 pb-5">
                <div className="flex items-center gap-4 md:gap-5">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[3px] bg-white text-iwash-primary ring-1 ring-inset ring-iwash-primary/25 md:h-14 md:w-14">
                    <CategoryGlyph name={c.name} className="h-6 w-6 md:h-7 md:w-7" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold tabular-nums tracking-[0.14em] text-iwash-primary">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h2 id={`cat-${c.id}`} className="display display-sm text-iwash-neutral">
                      {c.name}
                    </h2>
                  </div>
                </div>
                <p className="shrink-0 pb-1 text-sm text-iwash-ink-soft">
                  {c.items.length} {c.items.length === 1 ? "item" : "items"}
                </p>
              </header>

              <PriceCarousel categoryName={c.name} items={c.items} services={services} />
            </section>
          );
        })}
      </div>
    </div>
  );
}
