import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { site } from "@/lib/site";
import { locations } from "@/lib/locations";
import { photos } from "@/lib/assets";
import { kochiImages } from "@/lib/locationImages";
import { ButtonLink } from "@/components/ui/Button";
import { StoreBadges } from "@/components/ui/StoreBadges";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { Reveal } from "@/components/motion/Reveal";
import { AreaHero } from "@/components/areas/AreaHero";
import { Bubbles } from "@/components/areas/Bubbles";

/**
 * Kochi-wide service page, targeting "laundry service Kochi".
 *
 * Built from the SEO content package: every H2 is a question a person (or an AI
 * assistant) would ask, answered in two sentences directly beneath it, then
 * expanded. The same questions feed the FAQPage structured data, so the markup
 * and the visible copy cannot drift apart.
 */

const path = "/laundry-service-kochi";
const pageUrl = `${site.url}${path}`;
const title = "Laundry Service in Kochi | Pickup & Next-Day Return | iWash";
const description =
  "Wash, iron, dry clean and shoes in one app booking. iWash picks up across Kakkanad, Infopark, Palarivattom, Pukkattupady and Aluva. Next-day return.";

export const metadata: Metadata = {
  // Absolute so the root "| iWash Laundry" suffix is not appended a second time.
  title: { absolute: title },
  description,
  alternates: { canonical: path },
  openGraph: {
    type: "website",
    title,
    description,
    url: path,
    locale: "en_IN",
    images: [{ url: photos.facility.src ?? site.logo.src, alt: photos.facility.alt }],
  },
  twitter: { card: "summary_large_image", title, description },
};

const { phone, phoneHref, whatsapp } = site.contact;
const kakkanadLocalities = locations.kakkanad.localities;

const link = "font-semibold text-iwash-primary underline-offset-4 hover:underline";
const sectionHeading = "display display-sm text-iwash-neutral";
const body = "mt-4 max-w-2xl leading-relaxed text-iwash-ink-soft";

/** Services in one order. The only table on the page. Prices live on /prices, never copied here. */
const serviceRows = [
  { service: "Wash & fold", covers: "Everyday clothes, sorted, washed, dried and folded", priced: "Per item" },
  { service: "Ironing / steam press", covers: "Shirts, trousers, kurtas and sarees", priced: "Per item" },
  { service: "Dry cleaning", covers: "Suits and occasion wear", priced: "Quote by phone" },
  { service: "Bedsheets, blankets and bath linen", covers: "Bedsheets, pillow covers, comforters, towels", priced: "Per item" },
  { service: "Curtains", covers: "Washed, dust removed, returned ready to hang", priced: "See the price list" },
  { service: "Carpets and rugs", covers: "Deep cleaned and dried", priced: "Per kilogram" },
  { service: "Shoes", covers: "Shoes and sandals cleaned and freshened", priced: "See the price list" },
] as const;

/**
 * Answer capsules. `a` is exactly two sentences and is the text AI engines lift,
 * so it is also the FAQPage answer. Anything after it on the page is expansion.
 */
const capsules = {
  send: {
    q: "What can I send in one iWash order?",
    a: "You can send everyday clothes, ironing, dry cleaning, bedsheets, curtains and shoes together in a single booking. We sort the bag at our facility, so you do not need separate pickups for separate services.",
  },
  pickup: {
    q: "How does laundry pickup and delivery work in Kochi?",
    a: "You pick a time slot in the iWash app, our driver collects the bag from your door, and we bring it back finished the next day. You do not need to visit a shop or wait in for longer than your slot.",
  },
  areas: {
    q: "Which areas of Kochi do you pick up from?",
    a: "We pick up from Kakkanad, Infopark, Palarivattom, Pukkattupady and Aluva. If your area is not on this list, call or message us before you book and we will tell you whether we can reach you.",
  },
  facility: {
    q: "Where is the iWash laundry facility?",
    a: "Our laundry is our own facility inside the Cochin Special Economic Zone in Kakkanad, a few minutes from Infopark and the Civil Station. Your clothes are washed here, not sent across town to someone else.",
  },
  turnaround: {
    q: "How long does laundry take?",
    a: "Your order comes back the next day. That is our standard turnaround for orders picked up in our Kochi service area.",
  },
  ironing: {
    q: "Can I book only ironing near me?",
    a: "Yes, you can book ironing on its own, and our driver collects and returns it the same way as a laundry order. Shirts, trousers, kurtas and sarees are steam pressed, priced per item.",
  },
  dryClean: {
    q: "Do you do dry cleaning in Kochi?",
    a: `Yes, we dry clean suits and occasion wear, and we collect and return them from your door like any other order. Dry cleaning is priced by quote, so call ${phone} before you book.`,
  },
  missing: {
    q: "What happens if a piece of clothing goes missing?",
    a: "Missing or unreturned clothes is the worry most people have about any laundry service. We inspect every item before washing and bill only for the items we actually received, so what came in is on record from the start.",
  },
  cost: {
    q: "How much does laundry cost in Kochi with iWash?",
    a: "Laundry, ironing and linen are priced per item, with GST already included. Your first order in the app is 50% off.",
  },
  why: {
    q: "Why book iWash instead of a laundry shop?",
    a: "iWash brings everything to one app booking, collects it from your door and returns it the next day, so there is no shop to visit. The washing happens in our own facility in Kakkanad, and every price includes GST.",
  },
} as const;

type CapsuleKey = keyof typeof capsules;
const capsuleOrder = Object.keys(capsules) as CapsuleKey[];

/** Heading + two-sentence answer. Expansion content goes in `children`. */
function Capsule({ id, children }: { id: CapsuleKey; children?: ReactNode }) {
  const { q, a } = capsules[id];
  return (
    <section aria-labelledby={`k-${id}`}>
      <Reveal>
        <h2 id={`k-${id}`} className={sectionHeading}>
          {q}
        </h2>
        <p className={body}>{a}</p>
      </Reveal>
      {children}
    </section>
  );
}

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      { "@type": "ListItem", position: 2, name: "Laundry service in Kochi", item: pageUrl },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${pageUrl}#service`,
    name: "Laundry service in Kochi",
    serviceType: "Laundry, ironing and dry cleaning with pickup and delivery",
    description,
    url: pageUrl,
    // The business itself is declared once in the root layout.
    provider: { "@id": `${site.url}/#business` },
    areaServed: [
      { "@type": "City", name: site.city },
      ...site.areas.map((a) => ({ "@type": "Place", name: `${a.name}, ${site.city}` })),
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "iWash services",
      url: `${site.url}/prices`,
      itemListElement: serviceRows.map((r) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: r.service, description: r.covers },
      })),
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: capsuleOrder.map((k) => ({
      "@type": "Question",
      name: capsules[k].q,
      acceptedAnswer: { "@type": "Answer", text: capsules[k].a },
    })),
  },
];

export default function LaundryServiceKochiPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />

      <AreaHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Laundry service in Kochi" }]}
        eyebrow="Laundry service in Kochi"
        title="Laundry service in Kochi: one app for washing, ironing and dry cleaning"
        placeChip="Collecting across Kochi"
        factChip="Priced per item · GST included"
        images={kochiImages}
      >
        <p>
          iWash is a laundry service in Kochi that collects from your door, washes, irons or dry cleans everything
          in one order, and brings it back the next day. Book a pickup slot in the app, hand the bag over, and that
          is the whole job.
        </p>
        <p className="mt-3 font-semibold text-iwash-neutral">New in the app: 50% off your first order.</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <ButtonLink href={site.app.href} size="lg">
            {site.app.label}
          </ButtonLink>
          {whatsapp ? (
            <ButtonLink href={`https://wa.me/${whatsapp}`} variant="secondary" size="lg">
              WhatsApp us
            </ButtonLink>
          ) : null}
          <ButtonLink href={phoneHref} variant="ghost" size="lg">
            Call {phone}
          </ButtonLink>
        </div>
      </AreaHero>

      <div className="mx-auto max-w-[1680px] space-y-20 px-5 pb-24 pt-8 md:space-y-28 md:px-10 md:pb-32">
        <Capsule id="send">
          <div className="mt-8 overflow-x-auto rounded-sm ring-1 ring-iwash-border">
            <table className="w-full min-w-136 border-collapse text-left text-sm">
              <caption className="sr-only">iWash services and how each is priced</caption>
              <thead className="bg-iwash-border/60 text-xs uppercase tracking-[0.12em] text-iwash-ink-soft">
                <tr>
                  <th scope="col" className="px-5 py-3.5 font-semibold">Service</th>
                  <th scope="col" className="px-5 py-3.5 font-semibold">What it covers</th>
                  <th scope="col" className="px-5 py-3.5 font-semibold">How it is priced</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-iwash-border">
                {serviceRows.map((r) => (
                  <tr key={r.service}>
                    <th scope="row" className="px-5 py-4 font-bold text-iwash-neutral">{r.service}</th>
                    <td className="px-5 py-4 text-iwash-ink-soft">{r.covers}</td>
                    <td className="px-5 py-4 font-semibold text-iwash-neutral">{r.priced}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-iwash-ink-soft">
            Every per-item price already includes GST, and your bill is based on the items we actually receive and
            check. The current list is on our{" "}
            <Link href="/prices" className={link}>
              laundry prices page
            </Link>
            .
          </p>
        </Capsule>

        <Capsule id="pickup">
          <ol className="mt-8 grid gap-6 border-t border-iwash-border pt-6 sm:grid-cols-2 md:grid-cols-4">
            {[
              ["Book", "Choose your services and a pickup slot in the app."],
              ["Hand over", "Give the bag to the iWash driver at your door."],
              ["Care", "We inspect every item before washing, then wash, iron or dry clean it."],
              ["Delivered", "Your order comes back to your door the next day."],
            ].map(([t, text], i) => (
              <li key={t}>
                <span className="text-sm font-bold tabular-nums text-iwash-primary">0{i + 1}</span>
                <p className="mt-1 text-lg font-extrabold tracking-tight text-iwash-neutral">{t}</p>
                <p className="mt-1 text-sm leading-relaxed text-iwash-ink-soft">{text}</p>
              </li>
            ))}
          </ol>
        </Capsule>

        <Capsule id="areas">
          <p className={body}>
            In Kakkanad, that includes {kakkanadLocalities.slice(0, -1).join(", ")} and{" "}
            {kakkanadLocalities.at(-1)}. Pick your area for the details:
          </p>
          <ul className="mt-6 flex flex-wrap gap-3">
            {site.areas.map((a) => (
              <li key={a.slug}>
                <Link
                  href={`/locations/${a.slug}`}
                  className="inline-flex rounded-full bg-iwash-border px-5 py-2.5 text-sm font-bold text-iwash-neutral transition-colors duration-300 hover:bg-iwash-primary hover:text-white"
                >
                  {a.slug === "kakkanad" ? "Laundry in Kakkanad" : a.name}
                </Link>
              </li>
            ))}
          </ul>
        </Capsule>

        <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-16">
          <ParallaxImage photo={photos.facility} aspect="aspect-[3/2]" sizes="(min-width: 768px) 50vw, 92vw" />
          <div>
            <p className="eyebrow">Our own facility</p>
            <div className="mt-5">
              <Capsule id="facility">
                <address className="mt-6 text-sm not-italic leading-relaxed text-iwash-ink-soft">
                  <strong className="font-semibold text-iwash-neutral">{site.name}</strong>
                  <br />
                  {site.address.street}
                  <br />
                  {site.address.locality} {site.address.postalCode}, {site.address.region}
                </address>
              </Capsule>
            </div>
          </div>
        </div>

        <Capsule id="turnaround">
          <p className={body}>
            It is built for busy professionals at Infopark and the SEZ who need office clothes back for the next
            working day.
          </p>
        </Capsule>

        <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-16">
          <div>
            <Capsule id="ironing">
              <p className={body}>
                You can book ironing as often as you need it, without waiting until you have a full laundry bag.
              </p>
            </Capsule>
          </div>
          <ParallaxImage photo={photos.finishing} aspect="aspect-[3/2]" sizes="(min-width: 768px) 50vw, 92vw" />
        </div>

        <Capsule id="dryClean" />

        <Capsule id="missing">
          <p className={body}>
            If something looks wrong with your order, call us on{" "}
            <a href={phoneHref} className={link}>
              {phone}
            </a>{" "}
            and we will look into it with you.
          </p>
        </Capsule>

        <Capsule id="cost">
          <p className={body}>
            Carpets are priced per kilogram, and dry cleaning or anything not on the list is quoted by phone. You are
            billed for what we receive and check, not on an estimate made at your door.{" "}
            <Link href="/prices" className={link}>
              See the full price list
            </Link>
            .
          </p>
        </Capsule>

        <Capsule id="why">
          <p className={body}>
            If something needs a word, one call to us is all it takes:{" "}
            <a href={phoneHref} className={link}>
              {phone}
            </a>
            .
          </p>
        </Capsule>

        <section
          aria-labelledby="kochi-cta"
          className="relative overflow-hidden rounded-[28px] bg-linear-to-br from-iwash-neutral via-[#0b2a4a] to-iwash-primary px-6 py-14 text-white md:px-14 md:py-20"
        >
          <Bubbles tone="dark" />
          <div className="relative z-10 grid gap-8 md:grid-cols-2 md:items-end md:gap-10">
            <h2 id="kochi-cta" className="display display-md">
              Book your first pickup: 50% off in the app.
            </h2>
            <div>
              <p className="max-w-md text-lg leading-relaxed text-slate-300">
                Download the iWash app, choose a time slot and we collect from your door.
              </p>
              <StoreBadges className="mt-6" />
              <p className="mt-6 text-sm text-slate-300">
                Prefer to talk first? Call{" "}
                <a href={phoneHref} className="font-semibold text-white underline-offset-4 hover:underline">
                  {phone}
                </a>
                {whatsapp ? (
                  <>
                    {" "}or{" "}
                    <a
                      href={`https://wa.me/${whatsapp}`}
                      className="font-semibold text-white underline-offset-4 hover:underline"
                    >
                      message us on WhatsApp
                    </a>
                  </>
                ) : null}
                .
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
