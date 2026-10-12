import { site } from "@/lib/site";

/** Tap-to-call button fixed above the WhatsApp button on every page. */
export function CallButton() {
  const { phone, phoneHref } = site.contact;
  if (!phoneHref) return null;

  return (
    <a
      href={phoneHref}
      aria-label={`Call iWash on ${phone}`}
      className="fixed bottom-[5.25rem] right-4 z-40 flex items-center gap-2 rounded-full bg-iwash-primary p-3.5 text-white shadow-[0_10px_30px_-8px_rgba(2,132,199,0.8)] transition-transform duration-300 ease-[var(--ease-brand)] hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iwash-neutral md:bottom-[6.5rem] md:right-6 md:px-5"
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-7 w-7"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
      </svg>
      <span className="hidden text-sm font-bold md:inline">Call now</span>
    </a>
  );
}
