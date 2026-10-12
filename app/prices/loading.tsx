/** Shown while the price list loads. Mirrors the page layout so nothing jumps. */
export default function Loading() {
  const bar = "animate-pulse rounded-[3px] bg-iwash-border";
  return (
    <div className="mx-auto max-w-[1680px] px-5 pt-[calc(var(--header-h)+5rem)] md:px-10" role="status" aria-label="Loading prices">
      <div className={`${bar} h-3 w-24`} />
      <div className={`${bar} mt-6 h-16 w-full max-w-xl`} />
      <div className={`${bar} mt-4 h-4 w-full max-w-md`} />
      <div className={`${bar} mt-12 h-12 w-full max-w-sm`} />
      <div className="mt-10 space-y-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className={`${bar} h-10 w-full`} />
        ))}
      </div>
      <span className="sr-only">Loading the price list</span>
    </div>
  );
}
