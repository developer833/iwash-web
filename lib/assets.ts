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
    alt: "A blue iWash Laundry bag waiting on a doorstep in front of a white front door.",
    focal: "72% 78%",
    ratio: 1,
    brief:
      "Landscape 3:2. A packed iWash bag placed on a doorstep, front door slightly open, warm evening light.",
  },
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof photos;
