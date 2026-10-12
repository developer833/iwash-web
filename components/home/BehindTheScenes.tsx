import { photos } from "@/lib/assets";
import { site } from "@/lib/site";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { Reveal, RevealItem } from "@/components/motion/Reveal";

const facts = [
  {
    title: "Checked piece by piece",
    text: "Every load is sorted and inspected on the table before it is washed, so nothing is treated as an afterthought.",
  },
  {
    title: "Finished properly",
    text: "Shirts are steamed and pressed, everything else folded flat. Clothes come back ready to wear, not just clean.",
  },
  {
    title: "Accountable to you",
    text: `We are ${site.legalName}, working from our own laundry in Cochin SEZ. If something needs a word, call ${site.contact.phone}.`,
  },
];

/** The one place the home page shows the facility: a photograph pair beside three plain facts. */
export function BehindTheScenes() {
  return (
    <section id="why-iwash" className="scroll-mt-16 bg-white py-24 md:py-36" aria-labelledby="why-heading">
      <div className="mx-auto grid max-w-[1680px] gap-14 px-5 md:grid-cols-2 md:items-center md:gap-20 md:px-10">
        <div className="relative pb-16 md:pb-24">
          <ParallaxImage photo={photos.facility} aspect="aspect-[4/3]" sizes="(min-width: 768px) 50vw, 92vw" />
          <div className="absolute bottom-0 right-0 w-[46%] md:right-[-4%]">
            <div className="overflow-hidden rounded-2xl border-4 border-white shadow-[0_24px_60px_-24px_rgba(15,23,42,0.5)]">
              <ParallaxImage photo={photos.finishing} aspect="aspect-[4/5]" sizes="(min-width: 768px) 22vw, 42vw" decorative />
            </div>
          </div>
        </div>

        <div>
          <p className="eyebrow">Behind the scenes</p>
          <h2 id="why-heading" className="display display-md mt-4 text-iwash-neutral">
            Handled the way you would do it yourself.
          </h2>
          <Reveal stagger className="mt-10 divide-y divide-iwash-border border-y border-iwash-border">
            {facts.map((f, i) => (
              <RevealItem key={f.title} className="grid grid-cols-[auto_1fr] gap-5 py-6">
                <span className="font-display text-2xl font-extrabold tabular-nums text-iwash-primary">0{i + 1}</span>
                <div>
                  <h3 className="font-display text-xl font-extrabold tracking-tight text-iwash-neutral">{f.title}</h3>
                  <p className="mt-1.5 max-w-lg leading-relaxed text-iwash-ink-soft">{f.text}</p>
                </div>
              </RevealItem>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
