import Image from "next/image";
import Link from "next/link";
import { site, type HoursRow } from "@/lib/site";
import { Year } from "@/components/site/Year";
import { whatsappHref } from "@/components/site/WhatsAppButton";

const heading = "font-display text-lg font-extrabold tracking-tight text-iwash-neutral";
const item = "text-sm font-semibold text-iwash-neutral underline-offset-4 hover:text-iwash-primary hover:underline";

function Hours({ title, rows }: { title: string; rows: HoursRow[] }) {
  return (
    <div>
      <h2 className={heading}>{title}</h2>
      <dl className="mt-4 space-y-4">
        {rows.map((r) => (
          <div key={r.label}>
            <dt className="text-sm font-bold text-iwash-primary">{r.label}</dt>
            <dd className="mt-0.5 text-sm leading-relaxed text-iwash-ink-soft">{r.time}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function Footer() {
  const { address, contact, hours } = site;
  const chat = whatsappHref();

  return (
    <footer className="border-t border-iwash-border bg-white">
      <div className="mx-auto grid max-w-[1680px] gap-10 px-5 py-14 sm:grid-cols-2 md:px-10 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1.2fr]">
        <div>
          <Image
            src={site.logo.src}
            alt={site.name}
            width={site.logo.width}
            height={site.logo.height}
            className="h-12 w-auto"
          />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-iwash-ink-soft">{site.tagline}.</p>
        </div>

        <nav aria-label="Site">
          <h2 className={heading}>{site.shortName}</h2>
          <ul className="mt-4 space-y-2.5">
            {site.footerLinks.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className={item}>
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Services">
          <h2 className={heading}>Services</h2>
          <ul className="mt-4 space-y-2.5">
            {site.services.map((s) => (
              <li key={s.id}>
                <Link href="/#services" className={item}>
                  {s.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/prices" className={item}>
                Price list
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Popular locations">
          <h2 className={heading}>Service areas</h2>
          <ul className="mt-4 space-y-2.5">
            {site.areas.map((a) => (
              <li key={a.slug}>
                <Link href={`/locations/${a.slug}`} className={item}>
                  Laundry service in {a.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {hours ? (
          <div className="grid gap-8 sm:col-span-2 sm:grid-cols-2 lg:col-span-1 lg:grid-cols-1">
            <Hours title="Pickup & delivery hours" rows={hours.pickupDelivery} />
            <Hours title="Store hours" rows={hours.store} />
          </div>
        ) : null}

        <div>
          <h2 className={heading}>Contact</h2>
          <ul className="mt-4 space-y-3">
            <li>
              <a href={contact.phoneHref} className={item}>
                {contact.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${contact.email}`} className={item}>
                {contact.email}
              </a>
            </li>
            <li>
              <address className="text-sm not-italic leading-relaxed text-iwash-ink-soft">
                {address.street}, {address.locality}, {address.region} {address.postalCode}
              </address>
            </li>
            {chat ? (
              <li>
                <a href={chat} target="_blank" rel="noopener noreferrer" className={item}>
                  WhatsApp us
                </a>
              </li>
            ) : null}
            <li>
              <a href={`mailto:${contact.email}?subject=${encodeURIComponent("Enquiry from the iWash website")}`} className={item}>
                Send a message
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-iwash-border">
        <p className="mx-auto max-w-[1680px] px-5 py-5 text-xs text-iwash-ink-soft md:px-10">
          © <Year /> {site.name}, owned by {site.legalName}.
        </p>
      </div>
    </footer>
  );
}
