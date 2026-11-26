/**
 * Photography used by the story scenes.
 *
 * `src: null` marks a slot for which no suitable asset exists in /public yet.
 * The AssetSlot component renders a clearly labelled, art-directed frame in
 * that case, so nothing points at a missing file. Drop the photo into /public
 * and set `src` to make the scene live. Keep lighting and colour temperature
 * consistent with /public/hero-bg.jpg (soft daylight, cool whites, sky blue).
 */
export type Photo = {
  id: string;
  src: string | null;
  alt: string;
  /** CSS object-position for the focal point, e.g. "50% 70%". */
  focal: string;
  /** Aspect ratio as width / height. Used to reserve layout space. */
  ratio: number;
  /** Art direction brief for the missing photograph. */
  brief: string;
};

export const photos = {
  heroPerson: {
    id: "01",
    src: "/hero-bg.webp",
    alt: "A man relaxing on his sofa beside a pile of laundry while an iWash delivery person carries a laundry bag in through the front door.",
    focal: "30% 50%",
    ratio: 2103 / 748,
    brief:
      "Wide panorama. A relaxed customer on the sofa with the laundry pile beside him, the iWash team member arriving at the door. Soft daylight, cool whites and blues.",
  },
  facility: {
    id: "03",
    src: "/facility.webp",
    alt: "The iWash laundry floor: staff loading commercial washers, steaming shirts on a pressing table and folding fresh linen.",
    focal: "50% 50%",
    ratio: 1672 / 941,
    brief: "Existing asset.",
  },
  finishing: {
    id: "04",
    src: "/ironing.webp",
    alt: "A white shirt being steamed on a pressing board, with a stack of folded shirts beside it.",
    focal: "50% 50%",
    ratio: 1518 / 1036,
    brief:
      "Portrait 4:5. Close-up of a crisp white shirt being steamed, folded stack of cotton in soft focus behind. Bright, cool daylight.",
  },
  delivery: {
    id: "06",
    src: "/doorstep-delivery.webp",
    alt: "An iWash team member in a blue cap handing a white iWash laundry bag to a smiling customer at her front door.",
    focal: "72% 78%",
    ratio: 2 / 3,
    brief:
      "Landscape 3:2. A packed iWash bag placed on a doorstep, front door slightly open, warm evening light.",
  },

  // Extra photography so every location page can have its own set (see lib/locationImages.ts).
  pickupVan: {
    id: "07",
    src: "/pickup-van.jpg",
    alt: "An iWash van parked on a quiet residential street while a team member carries a laundry bag to a front door.",
    focal: "50% 50%",
    ratio: 1519 / 1035,
    brief: "Existing asset.",
  },
  doorstepBag: {
    id: "08",
    src: "/delivery.jpg",
    alt: "A white drawstring laundry bag waiting on a doorstep beside an open front door in warm evening light.",
    focal: "50% 50%",
    ratio: 1518 / 1036,
    brief: "Existing asset.",
  },
  packing: {
    id: "09",
    src: "/packaging-cart.jpg",
    alt: "A team member packing freshly folded shirts into a white drawstring laundry bag.",
    focal: "50% 50%",
    ratio: 1518 / 1036,
    brief: "Existing asset.",
  },
  steamPress: {
    id: "10",
    src: "/finishing-folded.jpg",
    alt: "Steam rising as a white shirt is pressed, with a stack of folded shirts behind it.",
    focal: "50% 50%",
    ratio: 1518 / 1036,
    brief: "Existing asset.",
  },
  foldedStack: {
    id: "11",
    src: "/folded.png",
    alt: "A neat stack of folded, pressed shirts held in two hands.",
    focal: "50% 50%",
    ratio: 1920 / 826,
    brief: "Existing asset.",
  },
  foldingTowels: {
    id: "12",
    src: "/wash.webp",
    alt: "An iWash team member folding fresh towels in the laundry while a colleague loads a washing machine behind her.",
    focal: "50% 50%",
    ratio: 2 / 3,
    brief: "Existing asset.",
  },
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof photos;
