import type { CSSProperties } from "react";

type Bubble = { size: number; left: string; top: string; dur: number; delay: number; dx: number; dy: number };

/** Fixed layout so server and client render identically. Sizes are in px. */
const field: Bubble[] = [
  { size: 120, left: "4%", top: "14%", dur: 15, delay: 0, dx: 18, dy: -40 },
  { size: 54, left: "17%", top: "62%", dur: 11, delay: -3, dx: -10, dy: -30 },
  { size: 84, left: "36%", top: "8%", dur: 17, delay: -6, dx: 22, dy: 26 },
  { size: 38, left: "48%", top: "78%", dur: 10, delay: -2, dx: 12, dy: -36 },
  { size: 150, left: "63%", top: "52%", dur: 19, delay: -8, dx: -24, dy: -30 },
  { size: 64, left: "78%", top: "10%", dur: 13, delay: -4, dx: 16, dy: 30 },
  { size: 30, left: "88%", top: "70%", dur: 9, delay: -1, dx: -8, dy: -28 },
  { size: 96, left: "94%", top: "30%", dur: 16, delay: -7, dx: -18, dy: 34 },
];

/**
 * Decorative layer of soft glass bubbles and blurred blobs. Place inside a
 * `relative overflow-hidden` parent and keep real content above it with z-10.
 * Pure CSS motion, hidden from assistive tech, switched off by reduced motion.
 */
export function Bubbles({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <span
        className="blob -left-24 -top-24 h-[26rem] w-[26rem]"
        style={{ "--dur": "24s", "--dx": "60px", "--dy": "40px", opacity: dark ? 0.28 : 0.5 } as CSSProperties}
      />
      <span
        className="blob -bottom-32 right-[-6rem] h-[30rem] w-[30rem]"
        style={
          {
            "--dur": "28s",
            "--delay": "-9s",
            "--dx": "-50px",
            "--dy": "-30px",
            opacity: dark ? 0.22 : 0.4,
          } as CSSProperties
        }
      />
      {field.map((b, i) => (
        <span
          key={i}
          className={`bubble ${dark ? "bubble-dark" : ""} ${i % 3 === 0 ? "hidden sm:block" : ""}`}
          style={
            {
              width: b.size,
              height: b.size,
              left: b.left,
              top: b.top,
              "--dur": `${b.dur}s`,
              "--delay": `${b.delay}s`,
              "--dx": `${b.dx}px`,
              "--dy": `${b.dy}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
