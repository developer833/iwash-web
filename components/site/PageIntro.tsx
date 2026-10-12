import type { ReactNode } from "react";

/** Standard heading block for inner pages. Clears the fixed header. */
export function PageIntro({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[1680px] px-5 pb-10 pt-[calc(var(--header-h)+3rem)] md:px-10 md:pb-14 md:pt-[calc(var(--header-h)+5rem)]">
      <p className="eyebrow mb-4">{eyebrow}</p>
      <h1 className="display display-md max-w-4xl text-iwash-neutral">{title}</h1>
      {children ? <div className="lede mt-5 max-w-2xl">{children}</div> : null}
    </div>
  );
}
