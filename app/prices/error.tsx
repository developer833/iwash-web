"use client";

import { site } from "@/lib/site";

/** Shown if the prices page fails to render. Offers a retry and the phone fallback. */
export default function PricesError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-[1680px] px-5 pb-24 pt-[calc(var(--header-h)+5rem)] md:px-10">
      <div className="max-w-xl rounded-[4px] bg-white p-8 ring-1 ring-iwash-border" role="alert">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-iwash-neutral">
          We could not load the price list
        </h1>
        <p className="mt-3 leading-relaxed text-iwash-ink-soft">
          Please try again, or call us on{" "}
          <a href={site.contact.phoneHref} className="font-semibold text-iwash-primary underline-offset-4 hover:underline">
            {site.contact.phone}
          </a>{" "}
          for current prices.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 inline-flex h-12 items-center rounded-[3px] bg-iwash-primary px-6 text-sm font-semibold text-white hover:bg-iwash-neutral"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
