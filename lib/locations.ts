/**
 * Location-specific content for the /areas pages.
 *
 * Every area in `site.areas` gets a page from the shared template. An entry
 * here adds the location-specific sections that make a page worth ranking:
 * the localities it covers, why iWash knows the place, who uses it there and
 * questions people from that area actually ask. Only verified facts belong
 * here. No turnaround promises, ratings, review counts or opening hours.
 */

import { site } from "@/lib/site";

export type LocationContent = {
  slug: string;
  /** Title tag, before the "| iWash Laundry" suffix. Keep under 60 characters. */
  title: string;
  /** Meta description. Keep under 160 characters. */
  description: string;
  /** H1. */
  heading: string;
  /** Lede under the H1, two or three sentences. */
  intro: string;
  /** Neighbourhoods and landmarks within the area that people search for. */
  localities: string[];
  /** Why iWash knows this place: a heading and two paragraphs of first-hand detail. */
  experience: { heading: string; paragraphs: string[] };
  /** Who the service fits here. Descriptive, not testimonials. */
  audiences: { title: string; text: string }[];
  /** Location-specific questions. Rendered on the page and as FAQPage structured data. */
  faqs: { q: string; a: string }[];
};

const { phone } = site.contact;

export const locations: Record<string, LocationContent> = {
  kakkanad: {
    slug: "kakkanad",
    title: "Laundry Pickup & Delivery in Kakkanad, Kochi",
    description:
      "Laundry service in Kakkanad with doorstep pickup and delivery. Wash & fold, ironing and dry cleaning from our Cochin SEZ facility, priced per item with GST.",
    heading: "Laundry pickup and delivery in Kakkanad",
    intro:
      "iWash collects laundry from homes, apartments and offices across Kakkanad, washes and finishes it at our own facility inside the Cochin Special Economic Zone, and brings it back to your door. Book a pickup slot in the app, hand the bag over, and that is the whole job.",
    localities: [
      "Infopark",
      "Cochin Special Economic Zone",
      "Kakkanad Civil Station",
      "Thrikkakara",
      "Vazhakkala",
      "Padamugal",
      "Kangarappady",
      "Thengode",
      "Chittethukara",
      "Kakkanad Junction",
    ],
    experience: {
      heading: "Our laundry is in Kakkanad, not across town",
      paragraphs: [
        `iWash is run by ${site.legalName} from ${site.address.street}. The washing, pressing and folding for every Kakkanad order happens here, a few minutes from Infopark and the Civil Station, so your clothes are not trucked across Kochi and back.`,
        "Every load is sorted and inspected on the table before it is washed, shirts are steamed and pressed, and everything else is folded flat and packed. If something needs a word, one call to us is all it takes.",
      ],
    },
    audiences: [
      {
        title: "Working at Infopark or SEZ",
        text: "Pick a slot that fits the commute, hand over the week's shirts and trousers, and get them back pressed and ready for Monday.",
      },
      {
        title: "Apartment living",
        text: "No lugging bags to a shared machine or waiting on a dryer. We collect at your door and return to the same door.",
      },
      {
        title: "Families and shared homes",
        text: "Everyday clothes, bed linen and towels washed, dried and folded, priced per item so the bill matches what you actually sent.",
      },
      {
        title: "Offices, PGs and hostels",
        text: "Regular bulk pickup for uniforms, linen and resident laundry. Call or email us and we will set up a routine.",
      },
    ],
    faqs: [
      {
        q: "Which parts of Kakkanad do you pick up from?",
        a: "All of Kakkanad, including Infopark, the SEZ, Civil Station, Thrikkakara, Vazhakkala, Padamugal, Kangarappady, Thengode and Chittethukara. If you are just outside and not sure, call " +
          phone +
          " and we will tell you.",
      },
      {
        q: "How do I book a laundry pickup in Kakkanad?",
        a: "Download the iWash app from Google Play or the App Store, choose wash & fold or ironing, pick a pickup time slot and confirm your address. You can also call us to book.",
      },
      {
        q: "Where is my laundry actually washed?",
        a: `At the iWash facility at ${site.address.street}, Kakkanad. Nothing is sent out to a third party.`,
      },
      {
        q: "How much does laundry cost in Kakkanad?",
        a: "Pricing is per item and depends on the service. A few bulky items are priced per kilogram. Every price includes GST, and the current list is on our prices page. Your bill is based on the items we actually receive.",
      },
      {
        q: "Do you do dry cleaning in Kakkanad?",
        a: "Yes. Call us with the garments you have and we will give you a quote before pickup.",
      },
      {
        q: "Do you take bulk or business laundry from Kakkanad offices?",
        a: "Yes. Email or call us with what you need and how often, and we will arrange a regular pickup.",
      },
    ],
  },

  infopark: {
    slug: "infopark",
    title: "Laundry Pickup & Delivery near Infopark, Kochi",
    description:
      "Laundry service near Infopark with doorstep pickup and delivery. Wash & fold, ironing and dry cleaning from our Cochin SEZ facility, priced per item with GST.",
    heading: "Laundry pickup and delivery near Infopark",
    intro:
      "Whether you work at Infopark or live nearby, iWash collects your laundry from your door, washes and finishes it at our own facility in the Cochin Special Economic Zone, and brings it back. Book a slot in the app that fits around your shift and let the week's laundry take care of itself.",
    localities: [
      "Infopark Phase 1",
      "Infopark Phase 2",
      "Kakkanad",
      "Cochin Special Economic Zone",
      "Chittethukara",
      "Kusumagiri",
      "Thrikkakara",
      "Vazhakkala",
      "Kangarappady",
    ],
    experience: {
      heading: "A laundry facility on the Infopark side of Kochi",
      paragraphs: [
        `iWash is run by ${site.legalName} from ${site.address.street}. The facility is in the Cochin SEZ at Kakkanad, so Infopark orders are washed, pressed and folded close to where they are collected rather than being sent across the city.`,
        "Every load is sorted and inspected on the table before it is washed, shirts are steamed and pressed, and everything else is folded flat and packed. The team that handles the laundry also handles the pickup and delivery runs, so a question about your order is one call to people who have actually seen your clothes.",
      ],
    },
    audiences: [
      {
        title: "Shift workers",
        text: "Book a pickup slot around your hours, hand the bag over at the door, and skip the weekend chore.",
      },
      {
        title: "Shared flats and PGs near Infopark",
        text: "Wash and fold for everyday clothes and linen without queuing for a machine. Priced per item so a shared bill is easy to split.",
      },
      {
        title: "Formal wear and shirts",
        text: "Shirts and trousers steamed and pressed so they come back ready to wear on Monday morning.",
      },
      {
        title: "Teams and housing groups",
        text: "Regular bulk pickup for uniforms, linen or resident laundry. Call or email us and we will set up a routine.",
      },
    ],
    faqs: [
      {
        q: "Do you pick up laundry at Infopark?",
        a: "We collect from homes, apartments and PGs around Infopark and across Kakkanad. For pickup from a workplace address, call us on " +
          phone +
          " so we can arrange the right slot.",
      },
      {
        q: "How do I book a laundry pickup near Infopark?",
        a: "Download the iWash app from Google Play or the App Store, choose wash & fold or ironing, pick a time slot and confirm your address. You can also call us to book.",
      },
      {
        q: "Where is my laundry washed?",
        a: `At the iWash facility at ${site.address.street}. Nothing is sent out to a third party.`,
      },
      {
        q: "How is laundry priced?",
        a: "Per item, depending on the service, with a few bulky items priced per kilogram. Every price includes GST and the current list is on our prices page. Your bill is based on the items we actually receive.",
      },
      {
        q: "Can you iron shirts and work clothes only?",
        a: "Yes. Ironing is a service on its own, so clothes that are already clean can be pressed and returned without a wash.",
      },
    ],
  },

  palarivattom: {
    slug: "palarivattom",
    title: "Laundry Pickup & Delivery in Palarivattom, Kochi",
    description:
      "Laundry service in Palarivattom with doorstep pickup and delivery. Wash & fold, ironing and dry cleaning, priced per item with GST. Book in the iWash app.",
    heading: "Laundry pickup and delivery in Palarivattom",
    intro:
      "iWash collects laundry from homes and apartments in Palarivattom and the neighbourhoods around it, cleans and finishes it at our own facility in the Cochin SEZ, and delivers it back to your door. Choose a slot in the app and skip the trip to the laundromat.",
    localities: [
      "Palarivattom Junction",
      "Edappally",
      "Kaloor",
      "Kadavanthra",
      "Vennala",
      "Thammanam",
      "Chakkaraparambu",
      "Ponekkara",
      "Elamakkara",
    ],
    experience: {
      heading: "Washed and finished in our own facility",
      paragraphs: [
        `iWash is run by ${site.legalName} from ${site.address.street}. Palarivattom orders are collected by our own pickup runs and taken to the Cochin SEZ facility, where every load is washed, finished and packed.`,
        "Each load is sorted and inspected on the table before it is washed, shirts are steamed and pressed, and everything else is folded flat. When it is ready, it is delivered back to the door it came from.",
      ],
    },
    audiences: [
      {
        title: "Busy households",
        text: "Everyday clothes, towels and bed linen washed, dried and folded, so the weekend is yours.",
      },
      {
        title: "Apartment residents",
        text: "Hand the bag over at your door at the time you picked. No shared machines and no waiting for a dryer.",
      },
      {
        title: "Professionals",
        text: "Shirts, trousers and sarees pressed and finished, returned ready to wear.",
      },
      {
        title: "Small businesses",
        text: "Linen and uniforms for salons, clinics, guest houses and shops. Call or email us and we will arrange a routine pickup.",
      },
    ],
    faqs: [
      {
        q: "Which parts of Palarivattom do you serve?",
        a: "We collect across Palarivattom and the neighbourhoods around it, including Edappally, Kaloor, Kadavanthra, Vennala and Thammanam. If your address is nearby and you are not sure, call " +
          phone +
          " and we will tell you.",
      },
      {
        q: "How do I book a laundry pickup in Palarivattom?",
        a: "Download the iWash app from Google Play or the App Store, choose your service, pick a time slot and confirm your address. You can also call us to book.",
      },
      {
        q: "Where is my laundry washed?",
        a: `At the iWash facility at ${site.address.street}, Kakkanad. Nothing is sent out to a third party.`,
      },
      {
        q: "How much does laundry cost?",
        a: "Pricing is per item and depends on the service. A few bulky items are priced per kilogram. Every price includes GST, and the current list is on our prices page.",
      },
      {
        q: "Do you do dry cleaning in Palarivattom?",
        a: "Yes. Call us with the garments you have and we will give you a quote before pickup.",
      },
    ],
  },

  aluva: {
    slug: "aluva",
    title: "Laundry Pickup & Delivery in Aluva, Kochi",
    description:
      "Laundry service in Aluva with doorstep pickup and delivery. Wash & fold, ironing and dry cleaning, priced per item with GST. Book in the iWash app.",
    heading: "Laundry pickup and delivery in Aluva",
    intro:
      "iWash collects laundry from households in Aluva, cleans and finishes it at our own facility in the Cochin SEZ, and delivers it back to your door. Book a pickup slot in the app, hand the bag over, and get it back finished.",
    localities: [
      "Aluva Town",
      "Aluva Bus Stand",
      "Edathala",
      "Choornikkara",
      "Kombara",
      "Thottakkattukara",
      "Kadungalloor",
      "Chunangamvely",
      "Thaikkattukara",
    ],
    experience: {
      heading: "Your laundry is cleaned at our own facility",
      paragraphs: [
        `iWash is run by ${site.legalName} from ${site.address.street}. Aluva orders are collected by our pickup runs and taken to the Cochin SEZ facility, where every load is washed, finished and packed.`,
        "Each load is sorted and inspected on the table before it is washed. Shirts are steamed and pressed, and everything else is folded flat and packed. It is then brought back to your doorstep.",
      ],
    },
    audiences: [
      {
        title: "Families",
        text: "Everyday clothes, bed linen and towels washed, dried and folded, priced per item so the bill matches what you sent.",
      },
      {
        title: "People who commute to work",
        text: "Hand over the week's laundry before you leave and have it back finished, without a Sunday spent at the machine.",
      },
      {
        title: "Elderly and busy households",
        text: "No carrying heavy bags. We collect at the door and return to the same door.",
      },
      {
        title: "Hostels, PGs and small businesses",
        text: "Regular bulk pickup for linen and uniforms. Call or email us and we will set up a routine.",
      },
    ],
    faqs: [
      {
        q: "Which parts of Aluva do you pick up from?",
        a: "We serve Aluva and the areas around it, including Edathala, Choornikkara, Kombara and Kadungalloor. If you are on the edge and not sure, call " +
          phone +
          " and we will tell you.",
      },
      {
        q: "How do I book a laundry pickup in Aluva?",
        a: "Download the iWash app from Google Play or the App Store, choose your service, pick a time slot and confirm your address. You can also call us to book.",
      },
      {
        q: "Where is my laundry actually washed?",
        a: `At the iWash facility at ${site.address.street}, Kakkanad. Nothing is sent out to a third party.`,
      },
      {
        q: "How much does laundry cost?",
        a: "Pricing is per item and depends on the service, with a few bulky items priced per kilogram. Every price includes GST. The current list is on our prices page.",
      },
      {
        q: "Do you take bulk laundry from Aluva?",
        a: "Yes. Email or call us with what you need and how often, and we will arrange a regular pickup.",
      },
    ],
  },

  pukkattupady: {
    slug: "pukkattupady",
    title: "Laundry Pickup & Delivery in Pukkattupady, Kochi",
    description:
      "Laundry service in Pukkattupady with doorstep pickup and delivery. Wash & fold, ironing and dry cleaning, priced per item with GST. Book in the iWash app.",
    heading: "Laundry pickup and delivery in Pukkattupady",
    intro:
      "iWash collects laundry from homes in Pukkattupady and the villages around it, cleans and finishes it at our own facility in the Cochin SEZ, and brings it back to your door. Pick a time slot in the app and we do the rest.",
    localities: [
      "Pukkattupady",
      "Kizhakkambalam",
      "Kunnumpuram",
      "Mavelipuram",
      "Edachira",
      "Thengode",
      "Kakkanad",
    ],
    experience: {
      heading: "Close to the facility, cleaned at our own laundry",
      paragraphs: [
        `iWash is run by ${site.legalName} from ${site.address.street}. Pukkattupady is on the Kakkanad side of Kochi, so orders are collected by our own pickup runs and washed, finished and packed at the Cochin SEZ facility.`,
        "Each load is sorted and inspected on the table before it is washed. Shirts are steamed and pressed, and everything else is folded flat and packed. It is then delivered back to your door.",
      ],
    },
    audiences: [
      {
        title: "Homes and families",
        text: "Everyday clothes, towels and bed linen washed, dried and folded, without trips into town.",
      },
      {
        title: "Workers at Infopark and the SEZ",
        text: "Live in Pukkattupady, work nearby? Book a slot around your shift and have your laundry back pressed and ready.",
      },
      {
        title: "Rented rooms and shared homes",
        text: "Priced per item so a shared bill is easy to split, with no machines to queue for.",
      },
      {
        title: "Small businesses",
        text: "Linen and uniforms for guest houses, clinics and shops. Call or email us and we will arrange a routine pickup.",
      },
    ],
    faqs: [
      {
        q: "Do you pick up laundry in Pukkattupady?",
        a: "Yes. We collect from Pukkattupady and nearby areas such as Kizhakkambalam, Kunnumpuram and Mavelipuram. If your address is on the edge, call " +
          phone +
          " and we will confirm.",
      },
      {
        q: "How do I book a laundry pickup in Pukkattupady?",
        a: "Download the iWash app from Google Play or the App Store, choose your service, pick a time slot and confirm your address. You can also call us to book.",
      },
      {
        q: "Where is my laundry washed?",
        a: `At the iWash facility at ${site.address.street}, Kakkanad. Nothing is sent out to a third party.`,
      },
      {
        q: "How much does laundry cost?",
        a: "Pricing is per item and depends on the service, with a few bulky items priced per kilogram. Every price includes GST. The current list is on our prices page.",
      },
      {
        q: "Do you do dry cleaning?",
        a: "Yes. Call us with the garments you have and we will give you a quote before pickup.",
      },
    ],
  },
};

export function getLocation(slug: string): LocationContent | null {
  return locations[slug] ?? null;
}
