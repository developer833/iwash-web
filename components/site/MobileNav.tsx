"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { site } from "@/lib/site";
import { StoreBadges } from "@/components/ui/StoreBadges";

/** Small disclosure menu for narrow viewports. */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full text-current transition-colors duration-300 hover:bg-iwash-border/60 active:scale-95"
      >
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        <span aria-hidden="true" className="relative block h-3.5 w-5">
          <span
            className={`absolute left-0 h-0.5 w-5 rounded-full bg-current transition-[top,transform] duration-300 ease-[var(--ease-brand)] motion-reduce:transition-none ${
              open ? "top-1.5 rotate-45" : "top-0 rotate-0"
            }`}
          />
          <span
            className={`absolute left-0 top-1.5 h-0.5 w-5 rounded-full bg-current transition-[opacity,transform] duration-200 ease-[var(--ease-brand)] motion-reduce:transition-none ${
              open ? "scale-x-0 opacity-0" : "scale-x-100 opacity-100"
            }`}
          />
          <span
            className={`absolute left-0 h-0.5 w-5 rounded-full bg-current transition-[top,transform] duration-300 ease-[var(--ease-brand)] motion-reduce:transition-none ${
              open ? "top-1.5 -rotate-45" : "top-3 rotate-0"
            }`}
          />
        </span>
      </button>
      <div
        id={id}
        inert={!open}
        className={`absolute inset-x-0 top-full grid transition-[grid-template-rows,opacity] duration-500 ease-[var(--ease-brand)] motion-reduce:transition-none ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div
            className={`border-b border-iwash-border bg-white/95 px-5 pb-5 pt-2 text-iwash-neutral backdrop-blur transition-shadow duration-500 ${
              open ? "shadow-[0_20px_40px_-24px_rgba(15,23,42,0.3)]" : "shadow-none"
            }`}
          >
            <ul className="flex flex-col">
              {site.nav.map((item, i) => (
                <li
                  key={item.href}
                  style={{ transitionDelay: open ? `${120 + i * 60}ms` : "0ms" }}
                  className={`transition-[opacity,transform] duration-500 ease-[var(--ease-brand)] motion-reduce:transition-none ${
                    open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
                  }`}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block py-3 text-base font-semibold text-iwash-neutral"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li
                style={{ transitionDelay: open ? `${120 + site.nav.length * 60}ms` : "0ms" }}
                className={`pt-3 transition-[opacity,transform] duration-500 ease-[var(--ease-brand)] motion-reduce:transition-none ${
                  open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
                }`}
              >
                <StoreBadges compact />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
