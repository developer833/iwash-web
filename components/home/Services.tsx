import { resolveServiceCards } from "@/lib/services";
import { Reveal } from "@/components/motion/Reveal";
import { ServicesCarousel } from "@/components/home/ServicesCarousel";

/** Services: every generic service on the price list, as a slow, endless card carousel. */
export function Services() {
  const cards = resolveServiceCards();

  return (
    <section id="services" className="scroll-mt-16 overflow-hidden py-20 md:py-32" aria-labelledby="services-heading">
      <div className="mx-auto max-w-[1680px] px-5 md:px-10">
        <Reveal className="grid items-end gap-5 md:grid-cols-2 md:gap-10">
          <div>
            <p className="eyebrow">What we clean</p>
            <h2 id="services-heading" className="display display-md mt-3 text-iwash-neutral">
              Our{" "}
              <span className="bg-linear-to-r from-iwash-primary to-iwash-secondary bg-clip-text text-transparent">
                Services
              </span>
            </h2>
          </div>
          <p className="max-w-xl text-lg leading-relaxed text-iwash-ink-soft md:justify-self-end">
            Everything you would send to the laundry, washed, ironed and brought back to your door. Priced per
            item, with nothing to count before we arrive.
          </p>
        </Reveal>
      </div>

      <div className="mx-auto mt-10 max-w-[1680px] px-2 md:mt-14 md:px-6">
        <ServicesCarousel cards={cards} />
      </div>
    </section>
  );
}
