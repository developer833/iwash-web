import { site } from "@/lib/site";

function GooglePlayMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path fill="#00A0FF" d="M4 2 12.5 12 4 22Z" />
      <path fill="#00E176" d="M4 2 16.5 9.35 12.5 12Z" />
      <path fill="#FF3A44" d="M4 22 16.5 14.65 12.5 12Z" />
      <path fill="#FFD500" d="M12.5 12 16.5 9.35 21 12 16.5 14.65Z" />
    </svg>
  );
}

function AppleMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  );
}

const badge =
  "inline-flex items-center rounded-lg bg-black text-white ring-1 ring-inset ring-white/35 transition-[transform,box-shadow] duration-300 ease-[var(--ease-brand)] hover:-translate-y-0.5 hover:ring-white/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";
const sizes = {
  default: "h-14 min-w-[11.5rem] gap-3 px-4",
  compact: "h-11 gap-2 px-3",
} as const;

/** Download buttons for both stores. Opens in a new tab. */
export function StoreBadges({
  className = "",
  compact = false,
}: {
  className?: string;
  /** Smaller buttons for the header. */
  compact?: boolean;
}) {
  const { android, ios } = site.app.stores;
  const badgeClass = `${badge} ${compact ? sizes.compact : sizes.default}`;
  const icon = compact ? "h-5 w-5 shrink-0" : "h-7 w-7 shrink-0";
  const label = compact ? "text-sm" : "text-xl";
  const gap = compact ? "gap-2" : "gap-3";

  return (
    <div className={`flex flex-wrap items-center ${gap} ${className}`}>
      <a
        href={ios.href}
        target="_blank"
        rel="noopener noreferrer"
        className={badgeClass}
        aria-label={`Download ${site.name} on the ${ios.name} (opens in a new tab)`}
      >
        <AppleMark className={icon} />
        <span className="flex flex-col leading-none">
          <span className="text-[10px] font-medium tracking-wide">Download on the</span>
          <span className={`${compact ? "mt-0.5" : "mt-1"} ${label} font-semibold tracking-tight`}>{ios.name}</span>
        </span>
      </a>
      <a
        href={android.href}
        target="_blank"
        rel="noopener noreferrer"
        className={badgeClass}
        aria-label={`Get ${site.name} on ${android.name} (opens in a new tab)`}
      >
        <GooglePlayMark className={icon} />
        <span className="flex flex-col leading-none">
          <span className="text-[10px] font-medium uppercase tracking-wide">Get it on</span>
          <span className={`${compact ? "mt-0.5" : "mt-1"} ${label} font-semibold tracking-tight`}>{android.name}</span>
        </span>
      </a>
    </div>
  );
}
