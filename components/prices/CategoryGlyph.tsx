import type { ReactNode } from "react";

/**
 * Small line glyphs that give each catalogue category a quiet visual
 * identity. They are matched by category name, so a category added in the
 * ERP later still renders (with the generic tag glyph) and nothing is
 * renamed or dropped. Drawn on one 24px grid with one stroke weight.
 */
const glyphs: Record<string, ReactNode> = {
  hanger: (
    <>
      <path d="M12 9.5V8.6a2.1 2.1 0 1 0-2.1-2.1" />
      <path d="M12 9.5 3.6 15.4a1 1 0 0 0 .6 1.8h15.6a1 1 0 0 0 .6-1.8z" />
    </>
  ),
  towel: (
    <>
      <path d="M6 3.5h12v17H6z" />
      <path d="M6 8h12M6 16h12" />
    </>
  ),
  bed: (
    <>
      <path d="M3 18.5V6.5M3 14.5h18v4M21 14.5v-2a3 3 0 0 0-3-3h-7v5" />
      <circle cx="7" cy="11" r="1.7" />
    </>
  ),
  blanket: <path d="M4 7.5c3-2 5 2 8 0s5 2 8 0v10c-3 2-5-2-8 0s-5 2-8 0z" />,
  shoe: <path d="M3 16.5v-5l4 1 3-3.5 2.3 2.3H16a5 5 0 0 1 5 5v.7z" />,
  bag: (
    <>
      <path d="M5.5 8h13l-1 12.5h-11z" />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
    </>
  ),
  stack: <path d="M4 8.5h16v4H4zM6 12.5h12v4H6z" />,
  tag: (
    <>
      <path d="M3.5 12V4.5H11l9.5 9.5-7.5 7.5z" />
      <circle cx="7.6" cy="8.6" r="1.2" />
    </>
  ),
};

function glyphFor(name: string): keyof typeof glyphs {
  const n = name.toLowerCase();
  if (/inner|under/.test(n)) return "stack";
  if (/bath|towel/.test(n)) return "towel";
  if (/bed|sheet|cover|linen|pillow/.test(n)) return "bed";
  if (/blanket|comforter|quilt/.test(n)) return "blanket";
  if (/foot|shoe|sandal/.test(n)) return "shoe";
  if (/other|bag|misc/.test(n)) return "bag";
  if (/apparel|cloth|garment|dress|wear|suit|kid/.test(n)) return "hanger";
  return "tag";
}

export function CategoryGlyph({ name, className = "h-5 w-5" }: { name: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {glyphs[glyphFor(name)]}
    </svg>
  );
}
