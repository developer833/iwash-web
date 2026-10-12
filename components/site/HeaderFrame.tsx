import type { ReactNode } from "react";

/** Header shell: a light, blurred bar fixed to the top of every page. */
export function HeaderFrame({ children }: { children: ReactNode }) {
  return (
    <header className="group/header fixed inset-x-0 top-0 z-50 h-[var(--header-h)] border-b border-iwash-border/70 bg-iwash-surface/85 text-iwash-neutral backdrop-blur-md">
      {children}
    </header>
  );
}
