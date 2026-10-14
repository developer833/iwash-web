import type { Metadata } from "next";
import { site } from "@/lib/site";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Preloader } from "@/components/site/Preloader";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { CallButton } from "@/components/site/CallButton";
import "./globals.css";

const title = `${site.name} | Laundry & dry cleaning pickup all over ${site.region}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: `%s | ${site.name}` },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title,
    description: site.description,
    url: "/",
    locale: "en_IN",
    images: [
      {
        url: "/hero-bg.webp",
        width: 2103,
        height: 748,
        alt: "A customer relaxing at home while an iWash team member collects the laundry",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: site.description,
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "DryCleaningOrLaundry",
  "@id": `${site.url}/#business`,
  name: site.name,
  legalName: site.legalName,
  url: site.url,
  description: site.description,
  image: `${site.url}/wash.webp`,
  logo: `${site.url}${site.logo.src}`,
  telephone: "+91-95445-00084",
  email: site.contact.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.locality,
    addressRegion: site.address.region,
    postalCode: site.address.postalCode,
    addressCountry: site.address.country,
  },
  ...(site.hours
    ? {
        openingHoursSpecification: site.hours.store.flatMap((row) =>
          row.ranges.map(([opens, closes]) => ({
            "@type": "OpeningHoursSpecification",
            dayOfWeek: row.days,
            opens,
            closes,
          })),
        ),
      }
    : {}),
  areaServed: [
    { "@type": "State", name: site.region },
    ...site.areas.map((a) => ({
      "@type": "Place",
      name: `${a.name}, ${site.city}`,
    })),
  ],
  makesOffer: site.services.map((s) => ({
    "@type": "Offer",
    itemOffered: { "@type": "Service", name: s.name, description: s.summary },
  })),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className="h-full antialiased" suppressHydrationWarning>
      <body className="flex min-h-full flex-col">
        <Preloader />
        <SmoothScroll />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
        <MotionProvider>
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <CallButton />
          <WhatsAppButton />
        </MotionProvider>
      </body>
    </html>
  );
}
