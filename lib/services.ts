import { existsSync } from "node:fs";
import { join } from "node:path";

/**
 * Cards for the home page services carousel: the generic services iWash
 * offers, matching the categories on the price list.
 *
 * Every image on the home page is used once, so each card here has its own
 * file. `image` is a path under /public. A card with no `image` looks for
 * /public/services/<slug>.(webp|jpg|jpeg|png|avif) and otherwise shows a
 * branded placeholder, so dropping a file in is enough to fill it.
 */
export type ServiceCard = {
  slug: string;
  name: string;
  text: string;
  /** Matches CategoryGlyph's name patterns, used for the placeholder icon. */
  glyph: string;
  /** Where the card's link goes. */
  href: string;
  image?: string;
};

export const serviceCards: ServiceCard[] = [
  {
    slug: "wash-and-fold",
    name: "Wash & Fold",
    text: "Everyday clothes sorted, washed, dried and folded, ready to put away.",
    glyph: "apparel",
    href: "/prices",
    image: "/wash.webp",
  },
  {
    slug: "ironing",
    name: "Ironing",
    text: "Shirts, trousers and sarees steam pressed and finished so they stay sharp.",
    glyph: "apparel",
    href: "/prices",
    image: "/services/ironing.png",
  },
  {
    slug: "dry-cleaning",
    name: "Dry Cleaning",
    text: "Suits and occasion wear, handled with care. Call us for a quote.",
    glyph: "suit",
    href: "tel:+919544500084",
    image: "/services/drycleaning.png",
  },
  {
    slug: "inner-wear",
    name: "Inner Wear",
    text: "Gentle, hygienic washing for innerwear and everyday basics.",
    glyph: "inner",
    href: "/prices",
    image: "/services/innerwear.png",
  },
  {
    slug: "apparel",
    name: "Apparel",
    text: "Shirts, trousers, kurtas, sarees and kidswear, priced per item.",
    glyph: "apparel",
    href: "/prices",
    image: "/folded.png",
  },
  {
    slug: "carpet-cleaning",
    name: "Carpet Cleaning",
    text: "Carpets and rugs deep cleaned and dried, priced per kilogram.",
    glyph: "blanket",
    href: "/prices",
    image: "/services/carpetcleaning.png",
  },
  {
    slug: "bedsheets-and-covers",
    name: "Bedsheets & Covers",
    text: "Bedsheets, pillow covers and cushion covers, crisp and clean.",
    glyph: "bed",
    href: "/prices",
    image: "/services/bedsheet.png",
  },
  {
    slug: "curtain-cleaning",
    name: "Curtain Cleaning",
    text: "Curtains washed gently, with dust removed, and returned ready to hang.",
    glyph: "blanket",
    href: "/prices",
    image: "/services/curtaincleaning.png",
  },
  {
    slug: "bath-linen",
    name: "Bath Linen",
    text: "Towels and bath linen washed fresh, fluffy and folded.",
    glyph: "bath",
    href: "/prices",
    image: "/services/laundry.png",
  },
  {
    slug: "blankets",
    name: "Blankets",
    text: "Blankets and comforters deep cleaned, dried and returned soft.",
    glyph: "blanket",
    href: "/prices",
    image: "/services/blanket.png",
  },
  {
    slug: "shoe-cleaning",
    name: "Shoe Cleaning",
    text: "Shoes and sandals cleaned and freshened, ready to wear again.",
    glyph: "shoe",
    href: "/prices",
    image: "/services/shoecleaning.png",
  },
  {
    slug: "pickup-delivery",
    name: "Pickup & Delivery",
    text: "Pick a time slot, hand over at the door and get it back finished.",
    glyph: "bag",
    href: "/download",
    image: "/delivery.jpg",
  },
];

const exts = ["webp", "jpg", "jpeg", "png", "avif"] as const;

/** Resolve each card's image on the server: its explicit file, else public/services/<slug>.*, else null. */
export function resolveServiceCards() {
  return serviceCards.map((c) => {
    if (c.image) return { ...c, image: c.image };
    const ext = exts.find((e) => existsSync(join(process.cwd(), "public", "services", `${c.slug}.${e}`)));
    return { ...c, image: ext ? `/services/${c.slug}.${ext}` : null };
  });
}
