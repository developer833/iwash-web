/**
 * Single source of truth for business facts used on the site.
 *
 * Everything here is verified: contact details, address and the legal
 * entity come from the live iwashlaundry.com site, service areas were
 * supplied by the business. Fields set to null are not known yet and are
 * simply not rendered. Opening hours are left out on purpose: the live
 * site lists three different sets, so confirm them before adding.
 */

export type HoursRow = {
  /** Shown to visitors, e.g. "Monday to Friday". */
  label: string;
  /** Shown to visitors, e.g. "8 AM to 11 AM and 6:30 PM to 9 PM". */
  time: string;
  /** schema.org day names, e.g. ["Monday", "Tuesday"]. Used for structured data. */
  days: string[];
  /** 24-hour "HH:MM" ranges, e.g. [["08:00", "11:00"]]. Used for structured data. */
  ranges: [string, string][];
};

/**
 * Opening hours. null until the business confirms them: the live site lists
 * three different sets, so nothing is shown or marked up until this is filled in.
 */
export type SiteHours = { pickupDelivery: HoursRow[]; store: HoursRow[] };

export const site = {
  name: "iWash Laundry",
  shortName: "iWash",
  legalName: "CLEARNEST PRIVATE LIMITED",
  url: "https://iwashlaundry.com",
  /** Home base. Used by the individual location pages. */
  city: "Kochi",
  /** Service coverage shown on the generic pages: the whole state, not a short list of towns. */
  region: "Kerala",
  tagline: "Laundry and dry cleaning, picked up and delivered all over Kerala",
  description:
    "iWash picks up your laundry and dry cleaning from your door anywhere in Kerala, cleans and finishes every garment with care, and delivers it back. New customers get 50% off their first order in the app.",
  logo: { src: "/logo.png", width: 375, height: 208 },

  /** Launch offer, shown in the hero, the offer band and the download section. */
  offer: {
    badge: "50% OFF",
    headline: "50% off your first order",
    detail: "New customers get 50% off their first order when they book in the iWash app.",
  },

  /** Ordering happens in the mobile app, so every "book" call to action points to the download section. */
  app: {
    href: "/download",
    label: "Get the App",
    stores: {
      android: {
        name: "Google Play",
        href: "https://play.google.com/store/apps/details?id=iwash.laundry",
      },
      ios: {
        name: "App Store",
        href: "https://apps.apple.com/in/app/iwash-laundry/id6759111745",
      },
    },
  },

  contact: {
    phone: "+91 95445 00084",
    phoneHref: "tel:+919544500084",
    email: "info@iwashlaundry.com",
    /** Digits only with country code, e.g. "919876543210". Enables the WhatsApp button. */
    whatsapp: "919544500084" as string | null,
  },

  hours: null as SiteHours | null,

  address: {
    street: "No 24/1701, 2nd Floor, KC Arcade, Near TV Center, Cochin Special Economic Zone",
    locality: "Ernakulam",
    region: "Kerala",
    postalCode: "682037",
    country: "IN",
  },

  areas: [
    {
      slug: "kakkanad",
      name: "Kakkanad",
      blurb: "Doorstep laundry and dry cleaning pickup for homes and apartments across Kakkanad.",
    },
    {
      slug: "infopark",
      name: "Infopark",
      blurb: "Laundry pickup for people who live or work around Infopark, with delivery back to your door.",
    },
    {
      slug: "palarivattom",
      name: "Palarivattom",
      blurb: "Laundry and dry cleaning collected from and delivered to addresses in Palarivattom.",
    },
    {
      slug: "aluva",
      name: "Aluva",
      blurb: "Pickup and delivery laundry service for households in Aluva.",
    },
    {
      slug: "pukkattupady",
      name: "Pukkattupady",
      blurb: "Laundry pickup and delivery for homes in and around Pukkattupady.",
    },
  ],

  /** Extra footer links: real destinations that help crawlers and visitors find the key pages. */
  footerLinks: [
    { href: "/#how-it-works", label: "How it works" },
    { href: "/prices", label: "Affordable prices" },
    { href: "/#faq", label: "FAQ" },
    { href: "/download", label: "Schedule a pickup" },
    { href: "/download#download", label: "Download the app" },
  ],

  nav: [
    { href: "/#how-it-works", label: "How it works" },
    { href: "/#services", label: "Services" },
    { href: "/prices", label: "Prices" },
    { href: "/#areas", label: "Locations" },
  ],

  /** Services as the ERP records them: wash and fold, ironing, with pickup and delivery. */
  services: [
    {
      id: "wash-fold",
      name: "Wash & Fold",
      summary:
        "Everyday clothes, linen and towels sorted, washed, dried and folded, ready to put away.",
      photo: "facility",
    },
    {
      id: "ironing-only",
      name: "Ironing",
      summary:
        "Shirts, trousers, sarees and more pressed and finished, for clothes that are clean but not ready to wear.",
      photo: "finishing",
    },
    {
      id: "pickup-delivery",
      name: "Pickup & Delivery",
      summary:
        "Choose a time slot, hand your laundry over at the door, and get it back at your doorstep when it is done.",
      photo: "delivery",
    },
  ],

  steps: [
    { id: "book", title: "Book", text: "Tell us what you need and when to collect it." },
    { id: "pickup", title: "Pickup", text: "We collect your laundry from your door." },
    { id: "care", title: "Care", text: "Each garment is sorted, inspected, washed and dried." },
    { id: "finish", title: "Finish", text: "Steamed, pressed or folded, then packed." },
    { id: "deliver", title: "Deliver", text: "Back to your doorstep, ready to put away." },
  ],

  faqs: [
    {
      q: "Which areas do you cover?",
      a: "We serve all over Kerala, including Kakkanad, Infopark, Palarivattom, Aluva and Pukkattupady in Kochi. Download the app or call us and we will arrange a pickup from your door.",
    },
    {
      q: "How do I book a pickup?",
      a: "Download the iWash app from Google Play or the App Store, choose your service and a pickup time slot, and we collect from your door. You can also call us.",
    },
    {
      q: "How does the 50% off my first order work?",
      a: "New customers get 50% off their first order when they book in the iWash app. Download the app from Google Play or the App Store, create your account and book your first pickup.",
    },
    {
      q: "What services do you offer?",
      a: "Wash and fold, and ironing, with pickup from and delivery to your door. For dry cleaning, call us for a quote.",
    },
    {
      q: "How is the price worked out?",
      a: "Pricing is per item and depends on the service, and a few bulky items are priced per kilogram. The price list shows current rates, and all prices include GST. Your bill is based on the items we actually receive.",
    },
    {
      q: "Do you take bulk or business laundry?",
      a: "Yes. Call or email us with what you need and we will arrange it.",
    },
  ],
} as const;

export type SiteConfig = typeof site;
export type Area = (typeof site.areas)[number];

export const areaNames = site.areas.map((a) => a.name);

/** "Kakkanad, Infopark, Palarivattom, Aluva and Pukkattupady". For location-specific copy only. */
export const areaSentence = `${areaNames.slice(0, -1).join(", ")} and ${areaNames.at(-1)}`;
