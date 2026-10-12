import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { site } from "@/lib/site";
import { getLocation } from "@/lib/locations";
import { photos } from "@/lib/assets";
import { ButtonLink } from "@/components/ui/Button";
import { StoreBadges } from "@/components/ui/StoreBadges";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { Reveal } from "@/components/motion/Reveal";
import { AreaHero } from "@/components/areas/AreaHero";
import { Bubbles } from "@/components/areas/Bubbles";
import { LocalityCloud } from "@/components/areas/LocalityCloud";

export function generateStaticParams() {
  return site.areas.map((area) => ({ slug: area.slug }));
}

export async function generateMetadata({ params }: PageProps<"/areas/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const area = site.areas.find((a) => a.slug === slug);
  if (!area) return {};
  const content = getLocation(slug);
  const title = content?.title ?? `Laundry pickup and delivery in ${area.name}`;
  const description =
    content?.description ??
    `${area.blurb} Laundry and dry cleaning by iWash, collected from and returned to your door in ${area.name}, ${site.city}, ${site.region}.`;
  const path = `/areas/${area.slug}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      title: `${title} | ${site.name}`,
      description,
      url: path,
      locale: "en_IN",
      images: [{ url: photos.facility.src ?? site.logo.src, alt: photos.facility.alt }],
    },
    twitter: { card: "summary_large_image", title: `${title} | ${site.name}`, description },
  };
}

const link = "font-semibold text-iwash-primary underline-offset-4 hover:underline";
/** Search questions every location page should answer, phrased as people type them. */
function searchFaqs(name: string) {
  return [
    {
      q: `Which is the best laundry service in ${name}?`,
      a: `The right laundry service is the one that washes in its own facility, inspects every item, shows its prices with GST and collects and delivers to your door. iWash does all of this in ${name}. Compare our price list and decide for yourself.`,
    },
    {
      q: `Is there a laundry service near me in ${name}?`,
      a: `Yes. iWash collects from your door in ${name}, so there is no laundry shop to travel to. Book a pickup slot in the app.`,
    },
    {
      q: `Do you offer ironing service and dry cleaning in ${name}?`,
      a: `We offer ironing as a service on its own and wash and fold for everyday clothes. For dry cleaning in ${name}, call us with your garments and we will give you a quote before pickup.`,
    },
  ];
}

const sectionHeading = "display display-sm text-iwash-neutral";

export default async function AreaPage({ params }: PageProps<"/areas/[slug]">) {
  const { slug } = await params;
  const area = site.areas.find((a) => a.slug === slug);
  if (!area) notFound();
  const content = getLocation(slug);
  const others = site.areas.filter((a) => a.slug !== area.slug);
  const faqs = content ? [...content.faqs, ...searchFaqs(area.name)] : [];
  const pageUrl = `${site.url}/areas/${area.slug}`;
  const placeName = `${area.name}, ${site.city}, ${site.region}`;

  /**
   * Location page entities. The business itself is declared once in the root
   * layout; this page references it as the provider rather than redeclaring it.
   */
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: site.url },
        { "@type": "ListItem", position: 2, name: "Locations", item: `${site.url}/#areas` },
        { "@type": "ListItem", position: 3, name: area.name, item: pageUrl },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${pageUrl}#service`,
      name: `Laundry pickup and delivery in ${area.name}`,
      serviceType: "Laundry and dry cleaning pickup and delivery",
      description: content?.intro ?? area.blurb,
      url: pageUrl,
      provider: { "@id": `${site.url}/#business` },
      areaServed: {
        "@type": "Place",
        name: placeName,
        containedInPlace: { "@type": "City", name: site.city },
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "iWash services",
        url: `${site.url}/prices`,
        itemListElement: site.services.map((s) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: s.name, description: s.summary },
          areaServed: { "@type": "Place", name: placeName },
        })),
      },
    },
    ...(content
      ? [
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
        ]
      : []),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />

      <AreaHero
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Locations", href: "/#areas" },
          { label: area.name },
        ]}
        eyebrow={`Laundry service in ${area.name}, ${site.city}`}
        title={content?.heading ?? `Laundry pickup and delivery in ${area.name}`}
        placeChip={`Collecting in ${area.name}`}
        factChip="Priced per item · GST included"
      >
        <p>{content?.intro ?? area.blurb}</p>
        {!content ? (
          <p className="mt-3">
            iWash serves all over {site.region}, and {area.name} is one of the places we collect from every day.
          </p>
        ) : null}
        <div className="mt-7 flex flex-wrap gap-3">
          <ButtonLink href={site.app.href} size="lg">
            {site.app.label}
          </ButtonLink>
          <ButtonLink href="/prices" variant="secondary" size="lg">
            See prices
          </ButtonLink>
        </div>
      </AreaHero>

      <div className="mx-auto max-w-[1680px] space-y-20 px-5 pb-24 pt-8 md:space-y-28 md:px-10 md:pb-32">
        {content ? (
          <section aria-labelledby="area-localities">
            <Reveal>
              <h2 id="area-localities" className={sectionHeading}>
                Where we pick up in {area.name}
              </h2>
              <p className="mt-4 max-w-xl leading-relaxed text-iwash-ink-soft">
                Doorstep collection and delivery across {area.name}, including:
              </p>
            </Reveal>
            <LocalityCloud names={content.localities} />
          </section>
        ) : null}

        {content ? (
          <section aria-labelledby="area-experience" className="grid gap-10 md:grid-cols-2 md:items-center md:gap-16">
            <ParallaxImage
              photo={photos.finishing}
              aspect="aspect-[3/2]"
              sizes="(min-width: 768px) 50vw, 92vw"
            />
            <div>
              <p className="eyebrow">About our facility</p>
              <h2 id="area-experience" className={`${sectionHeading} mt-5`}>
                {content.experience.heading}
              </h2>
              {content.experience.paragraphs.map((text) => (
                <p key={text} className="mt-5 max-w-xl leading-relaxed text-iwash-ink-soft">
                  {text}
                </p>
              ))}
              <address className="mt-6 text-sm not-italic leading-relaxed text-iwash-ink-soft">
                <strong className="font-semibold text-iwash-neutral">{site.name}</strong>
                <br />
                {site.address.street}
                <br />
                {site.address.locality} {site.address.postalCode}, {site.address.region}
              </address>
            </div>
          </section>
        ) : null}

        <section aria-labelledby="area-how">
          <h2 id="area-how" className={sectionHeading}>
            How it works in {area.name}
          </h2>
          <ol className="mt-6 grid gap-6 border-t border-iwash-border pt-6 sm:grid-cols-2 md:grid-cols-5">
            {site.steps.map((step, i) => (
              <li key={step.id}>
                <span className="text-sm font-bold tabular-nums text-iwash-primary">0{i + 1}</span>
                <p className="mt-1 text-lg font-extrabold tracking-tight text-iwash-neutral">{step.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-iwash-ink-soft">{step.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="area-services">
          <h2 id="area-services" className={sectionHeading}>
            Laundry service in {area.name}: wash &amp; fold, ironing and dry cleaning
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-iwash-ink-soft">
            Looking for a reliable laundry service in {area.name}? iWash collects from your door, washes and
            finishes at our own facility, and delivers back. Choose wash and fold for everyday clothes, an
            ironing service for shirts and trousers, or ask us about dry cleaning in {area.name}.
          </p>
          <ul className="mt-6 grid gap-8 md:grid-cols-3">
            {site.services.map((service) => (
              <li key={service.id}>
                <h3 className="text-xl font-extrabold tracking-tight text-iwash-neutral">{service.name} in {area.name}</h3>
                <p className="mt-2 leading-relaxed text-iwash-ink-soft">{service.summary}</p>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm text-iwash-ink-soft">
            Every item is priced on its own and every price includes GST.{" "}
            <Link href="/prices" className={link}>
              See the full price list
            </Link>
            .
          </p>
        </section>

        {content ? (
          <section aria-labelledby="area-audiences">
            <h2 id="area-audiences" className={sectionHeading}>
              Who uses iWash in {area.name}
            </h2>
            <ul className="mt-6 grid gap-8 border-t border-iwash-border pt-6 sm:grid-cols-2 lg:grid-cols-4">
              {content.audiences.map((a) => (
                <li key={a.title}>
                  <h3 className="text-lg font-extrabold tracking-tight text-iwash-neutral">{a.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-iwash-ink-soft">{a.text}</p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {content ? (
          <section aria-labelledby="area-faq" className="grid gap-8 md:grid-cols-[1fr_1.5fr] md:gap-16">
            <h2 id="area-faq" className={sectionHeading}>
              Laundry in {area.name}: common questions
            </h2>
            <div className="divide-y divide-iwash-border border-y border-iwash-border">
              {faqs.map((faq) => (
                <details key={faq.q} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-bold tracking-tight text-iwash-neutral [&::-webkit-details-marker]:hidden">
                    {faq.q}
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-iwash-border text-iwash-primary transition-transform group-open:rotate-45"
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 max-w-2xl leading-relaxed text-iwash-ink-soft">{faq.a}</p>
                </details>
              ))}
            </div>
          </section>
        ) : null}

        <section
          aria-labelledby="area-cta"
          className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-iwash-neutral via-[#0b2a4a] to-iwash-primary px-6 py-14 text-white md:px-14 md:py-20"
        >
          <Bubbles tone="dark" />
          <div className="relative z-10 grid gap-8 md:grid-cols-2 md:items-end md:gap-10">
            <h2 id="area-cta" className="display display-md">
              Book a pickup in {area.name}.
            </h2>
            <div>
              <p className="max-w-md text-lg leading-relaxed text-slate-300">
                Download the iWash app, choose a time slot and we collect from your door.
              </p>
              <StoreBadges className="mt-6" />
            </div>
          </div>
        </section>

        <section aria-labelledby="area-contact">
          <h2 id="area-contact" className={sectionHeading}>
            Questions about pickup in {area.name}?
          </h2>
          <p className="mt-4 max-w-xl leading-relaxed text-iwash-ink-soft">
            Call{" "}
            <a href={site.contact.phoneHref} className={link}>
              {site.contact.phone}
            </a>{" "}
            or email{" "}
            <a href={`mailto:${site.contact.email}`} className={link}>
              {site.contact.email}
            </a>
            .
          </p>
          <p className="mt-6 text-sm text-iwash-ink-soft">
            More locations:{" "}
            {others.map((o, i) => (
              <span key={o.slug}>
                <Link
                  href={`/areas/${o.slug}`}
                  className="font-semibold text-iwash-neutral underline-offset-4 hover:underline"
                >
                  Laundry service in {o.name}
                </Link>
                {i < others.length - 1 ? ", " : "."}
              </span>
            ))}
            {" "}We serve the rest of {site.region} too.
          </p>
        </section>
      </div>
    </>
  );
}
