/**
 * Photography for each location page, so no two area pages look alike.
 *
 * Every area gets its own hero photo, its own small accent photo and its own
 * "about our facility" photo. No two areas share a hero, an accent or a
 * facility photo, and none repeats a photo within its own page. The project
 * has ten real photographs for fifteen slots, so a photo can appear on another
 * page in a different slot, always cropped to a different focal point.
 * To add more variety, drop a file in /public, add it to lib/assets.ts and
 * point a slot here.
 */

import { photos, type Photo } from "@/lib/assets";

export type AreaImages = {
  /** Large photo in the hero collage (4:3). Also the social share image. */
  hero: Photo;
  /** Small portrait photo overlapping the hero collage (4:5). */
  accent: Photo;
  /** Photo beside the "about our facility" section (3:2). */
  experience: Photo;
};

const crop = (photo: Photo, focal: string): Photo => ({ ...photo, focal });

const byArea: Record<string, AreaImages> = {
  kakkanad: {
    hero: photos.facility,
    accent: crop(photos.delivery, "50% 40%"),
    experience: crop(photos.packing, "70% 50%"),
  },
  infopark: {
    hero: crop(photos.steamPress, "55% 50%"),
    accent: crop(photos.finishing, "50% 40%"),
    experience: photos.foldedStack,
  },
  palarivattom: {
    hero: crop(photos.pickupVan, "60% 55%"),
    accent: crop(photos.foldingTowels, "55% 40%"),
    experience: crop(photos.heroPerson, "30% 50%"),
  },
  aluva: {
    hero: crop(photos.doorstepBag, "40% 55%"),
    accent: crop(photos.facility, "22% 45%"),
    experience: crop(photos.delivery, "60% 45%"),
  },
  pukkattupady: {
    hero: crop(photos.packing, "60% 50%"),
    accent: crop(photos.doorstepBag, "38% 60%"),
    experience: crop(photos.finishing, "50% 45%"),
  },
};

/** Used by the Kochi-wide service page, and as the fallback for any area added without its own set. */
export const kochiImages: AreaImages = {
  hero: crop(photos.heroPerson, "30% 50%"),
  accent: crop(photos.delivery, "50% 40%"),
  experience: photos.facility,
};

export function getAreaImages(slug: string): AreaImages {
  return byArea[slug] ?? kochiImages;
}
