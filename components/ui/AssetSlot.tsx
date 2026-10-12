import Image from "next/image";
import type { Photo } from "@/lib/assets";

type AssetSlotProps = {
  photo: Photo;
  /** Responsive sizes hint for next/image. */
  sizes: string;
  /** Load eagerly and preload (above-the-fold hero only). */
  preload?: boolean;
  /** Load at page load with low priority, so a scroll-revealed scene never flashes empty. */
  eager?: boolean;
  /** Treat as decorative: empty alt. */
  decorative?: boolean;
  /** Fill the parent instead of reserving the photo's own aspect ratio. */
  fill?: boolean;
  className?: string;
};

/**
 * Renders a photograph with a reserved aspect ratio, or, when the asset
 * does not exist yet, a labelled art-direction frame in its place.
 * The frame shows the intended focal point so scroll motion is still
 * visible while the photo is pending.
 */
export function AssetSlot({
  photo,
  sizes,
  preload,
  eager,
  decorative,
  fill,
  className = "",
}: AssetSlotProps) {
  const box = fill ? "absolute inset-0" : "relative";
  const style = fill ? undefined : { aspectRatio: photo.ratio };

  if (photo.src) {
    return (
      <div className={`${box} overflow-hidden ${className}`} style={style}>
        <Image
          src={photo.src}
          alt={decorative ? "" : photo.alt}
          fill
          sizes={sizes}
          preload={preload}
          loading={preload || eager ? "eager" : undefined}
          fetchPriority={preload ? "high" : eager ? "low" : undefined}
          className="object-cover"
          style={{ objectPosition: photo.focal }}
        />
      </div>
    );
  }

  const [fx, fy] = photo.focal.split(" ");

  return (
    <div
      className={`asset-slot ${box} overflow-hidden ${className}`}
      style={style}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : photo.alt}
    >
      <span className="asset-slot-focal" style={{ left: fx, top: fy }} aria-hidden="true" />
      <span
        className="absolute left-3 top-3 rounded-md bg-white/85 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-iwash-primary"
        aria-hidden="true"
      >
        Photo {photo.id}
      </span>
      <span
        className="absolute inset-x-3 bottom-3 line-clamp-3 text-[11px] leading-snug text-slate-600"
        aria-hidden="true"
      >
        {photo.brief}
      </span>
    </div>
  );
}
