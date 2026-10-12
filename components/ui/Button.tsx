import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "light" | "ghost";
type Size = "md" | "lg";

type ButtonLinkProps = Omit<ComponentProps<typeof Link>, "className"> & {
  variant?: Variant;
  size?: Size;
  className?: string;
};

const base =
  "group/btn inline-flex items-center justify-center gap-3 rounded-[3px] font-semibold tracking-tight whitespace-nowrap transition-[background-color,color,box-shadow] duration-500 ease-[var(--ease-brand)]";

const variants: Record<Variant, string> = {
  primary: "bg-iwash-primary text-white hover:bg-iwash-neutral",
  secondary:
    "bg-transparent text-iwash-neutral ring-1 ring-inset ring-iwash-neutral/25 hover:bg-iwash-neutral hover:text-white",
  light: "bg-white text-iwash-neutral hover:bg-iwash-tertiary",
  ghost: "text-iwash-primary underline-offset-4 hover:underline",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-14 px-7 text-base",
};

/** Anchor styled as a button. Used for every CTA so links stay crawlable. */
export function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...rest}>
      {children}
      {variant !== "ghost" ? (
        <span
          aria-hidden="true"
          className="inline-block transition-transform duration-500 ease-[var(--ease-brand)] group-hover/btn:translate-x-1"
        >
          &rarr;
        </span>
      ) : null}
    </Link>
  );
}
