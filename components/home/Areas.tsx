import Link from "next/link";
import { site } from "@/lib/site";
import { Reveal, RevealItem } from "@/components/motion/Reveal";

/** Popular locations as a large typographic index; the service itself covers all of Kerala. Each row is a link to that area's page. */
export function Areas() {
  return (
    <section id="areas" className="scroll-mt-16 py-24 md:py-40" aria-labelledby="areas-heading">
      <div className="mx-auto max-w-[1680px] px-5 md:px-10">
        <div className="grid gap-6 md:grid-cols-2 md:gap-10">
          <h2 id="areas-heading" className="eyebrow">
            Laundry pickup all over {site.region}
          </h2>
          <p className="lede max-w-md">
            We serve the whole of {site.region}. These are some of the places we collect from most. Not
            listed? Call{" "}
            <a href={site.contact.phoneHref} className="font-semibold text-iwash-primary underline-offset-4 hover:underline">
              {site.contact.phone}
            </a>{" "}
            or download the app and we will arrange it.
          </p>
        </div>

        <Reveal stagger className="mt-10 border-t border-iwash-neutral/15 md:mt-16">
          {site.areas.map((area, i) => (
            <RevealItem key={area.slug}>
              <Link
                href={`/areas/${area.slug}`}
                className="group flex items-baseline justify-between gap-6 border-b border-iwash-neutral/15 py-5 transition-colors duration-500 hover:text-iwash-primary md:py-7"
              >
                <span className="flex items-baseline gap-5 md:gap-10">
                  <span className="text-sm font-semibold tabular-nums text-iwash-primary">0{i + 1}</span>
                  <span className="display display-lg transition-transform duration-700 ease-[var(--ease-brand)] group-hover:translate-x-3">
                    {area.name}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="text-2xl opacity-0 transition-[opacity,transform] duration-500 group-hover:translate-x-1 group-hover:opacity-100 md:text-4xl"
                >
                  &rarr;
                </span>
              </Link>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
