"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { HangingCard } from "@/lib/hangingCard";
import { site } from "@/lib/site";

const W = 204;
const H = 238;
const BOX = 300;

/** House shape: a pentagon with a sharp peak. */
const HOUSE = "polygon(50% 0%, 100% 25%, 100% 100%, 0% 100%, 0% 25%)";

/**
 * The offer card, hanging from the header on a stretchy string.
 *
 * Press and hold to pull it: the string stretches. Let go and it snaps back,
 * swings and settles. Quick taps open the download page. The simulation
 * lives in lib/hangingCard.ts; this component only draws it, straight to the
 * DOM from a rAF loop so React never re-renders while it moves.
 */
export function HangingOffer() {
  const router = useRouter();
  const boxRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const ropeRef = useRef<SVGPathElement>(null);
  const coreRef = useRef<SVGPathElement>(null);
  const simRef = useRef<HangingCard | null>(null);
  const press = useRef<{ x: number; y: number; t: number; offX: number; offY: number; moved: number } | null>(null);
  const [touched, setTouched] = useState(false);
  const [grabbing, setGrabbing] = useState(false);

  useEffect(() => {
    const box = boxRef.current;
    const card = cardRef.current;
    const rope = ropeRef.current;
    const core = coreRef.current;
    if (!box || !card || !rope || !core) return;

    const sim = new HangingCard({ anchorX: BOX / 2, anchorY: -6, cardHeight: H, segments: 8, segmentLength: 15 });
    sim.breeze = 0; // only moves when pulled (apart from the one-off swing in on load)
    simRef.current = sim;

    let raf = 0;
    let last = performance.now();
    let visible = true;

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      last = performance.now();
    });
    io.observe(box);

    const draw = () => {
      const n = sim.peak;
      let d = `M${sim.x[0].toFixed(1)} ${sim.y[0].toFixed(1)}`;
      for (let i = 1; i < n; i++) {
        const mx = (sim.x[i] + sim.x[i + 1]) / 2;
        const my = (sim.y[i] + sim.y[i + 1]) / 2;
        d += ` Q${sim.x[i].toFixed(1)} ${sim.y[i].toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`;
      }
      d += ` L${sim.x[n].toFixed(1)} ${sim.y[n].toFixed(1)}`;
      rope.setAttribute("d", d);
      core.setAttribute("d", d);

      const stretch = sim.stretch;
      rope.setAttribute("stroke-width", String(Math.max(1.8, 4 - stretch * 4)));
      core.setAttribute("stroke-opacity", String(0.55 + Math.min(0.4, stretch)));

      const a = sim.angle;
      card.style.transform = `translate3d(${(sim.x[sim.peak] - W / 2).toFixed(2)}px, ${sim.y[sim.peak].toFixed(2)}px, 0) rotate(${a.toFixed(4)}rad)`;
      card.style.setProperty("--shine", `${Math.round(50 + a * 140)}%`);
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible || box.offsetParent === null) {
        last = now;
        return;
      }
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (dt <= 0) return;

      sim.advance(dt);
      draw();
    };

    draw();
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  const toLocal = (e: React.PointerEvent) => {
    // The box is CSS-scaled on small screens; convert back to the simulation's own pixels.
    const r = boxRef.current!.getBoundingClientRect();
    const k = r.width / BOX || 1;
    return { x: (e.clientX - r.left) / k, y: (e.clientY - r.top) / k };
  };

  function onPointerDown(e: React.PointerEvent) {
    const sim = simRef.current;
    if (!sim) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const p = toLocal(e);
    press.current = {
      x: e.clientX,
      y: e.clientY,
      t: performance.now(),
      offX: p.x - sim.x[sim.mid],
      offY: p.y - sim.y[sim.mid],
      moved: 0,
    };
    sim.holdAt(p.x - press.current.offX, p.y - press.current.offY);
    setGrabbing(true);
    setTouched(true);
  }

  function onPointerMove(e: React.PointerEvent) {
    const sim = simRef.current;
    if (!sim) return;
    const pr = press.current;
    if (pr) {
      pr.moved = Math.max(pr.moved, Math.hypot(e.clientX - pr.x, e.clientY - pr.y));
      const p = toLocal(e);
      sim.holdAt(p.x - pr.offX, p.y - pr.offY);
    }
    // Moving the pointer over the card without pressing does nothing.
  }

  function endPress(e: React.PointerEvent, cancelled = false) {
    const sim = simRef.current;
    const pr = press.current;
    if (!sim || !pr) return;
    press.current = null;
    sim.release();
    setGrabbing(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    const quick = performance.now() - pr.t < 350;
    if (!cancelled && pr.moved < 8 && quick) router.push(site.app.href);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      router.push(site.app.href);
    }
  }

  return (
    <div
      ref={boxRef}
      className="pointer-events-none absolute right-[1%] top-[calc(var(--header-h)-2px)] z-30 h-0 origin-top-right scale-[0.58] sm:scale-[0.75] md:scale-100 lg:right-[6%] xl:right-[11%]"
      style={{ width: BOX }}
    >
      {/* String */}
      <svg className="absolute left-0 top-0 overflow-visible" width={BOX} height={BOX} aria-hidden="true">
        <path ref={ropeRef} d="" fill="none" stroke="#0c4a6e" strokeWidth="4" strokeLinecap="round" />
        <path
          ref={coreRef}
          d=""
          fill="none"
          stroke="#e0f2fe"
          strokeWidth="1.4"
          strokeDasharray="2.5 5"
          strokeLinecap="round"
        />
      </svg>

      {/* Hint */}
      {/* <p
        aria-hidden="true"
        className={`absolute -left-24 top-24 w-36 -rotate-6 whitespace-nowrap text-right font-display text-base font-bold leading-tight text-white/90 transition-opacity duration-500 ${
          touched ? "opacity-0" : "opacity-100"
        }`}
      >
        Hold &amp; pull
        <span className="mt-1 block text-xl motion-safe:animate-bounce">&darr;</span>
      </p> */}

      {/* The card */}
      <div
        ref={cardRef}
        role="button"
        tabIndex={0}
        aria-label={`${site.offer.headline} in the iWash app. Press to open the download page, or hold and drag to pull the string.`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={(e) => endPress(e)}
        onPointerCancel={(e) => endPress(e, true)}
        onKeyDown={onKeyDown}
        className={`pointer-events-auto absolute left-0 top-0 select-none outline-none touch-none focus-visible:drop-shadow-[0_0_0_#fff] ${
          grabbing ? "cursor-grabbing" : "cursor-grab"
        }`}
        style={{
          width: W,
          height: H,
          transformOrigin: "50% 0",
          willChange: "transform",
          filter: "drop-shadow(0 26px 28px rgba(2,60,110,0.45))",
        }}
      >
        {/* Blue house */}
        <div
          className="absolute inset-0"
          style={{
            clipPath: HOUSE,
            background: "linear-gradient(165deg,#7dd3fc 0%,#0ea5e9 32%,#0369a1 78%,#0c4a6e 100%)",
          }}
        />
        {/* White house, inset */}
        <div
          className="absolute inset-1.75 overflow-hidden"
          style={{ clipPath: HOUSE, background: "linear-gradient(180deg,#ffffff 0%,#f0f9ff 100%)" }}
        >
          {/* Roof band */}
          <div
            className="absolute inset-x-0 top-0 h-[27%]"
            style={{ background: "linear-gradient(180deg,#e0f2fe,#ffffff)" }}
            aria-hidden="true"
          />
          {/* Sheen that follows the tilt */}
          <div
            aria-hidden="true"
            className="absolute inset-y-0 w-1/3 -skew-x-12 bg-linear-to-r from-transparent via-white to-transparent opacity-80 mix-blend-soft-light"
            style={{ left: "var(--shine, 50%)", transform: "translateX(-50%) skewX(-12deg)" }}
          />

          <div className="relative flex h-full flex-col items-center justify-end px-4 pb-4">
            <span className="rounded-full bg-iwash-primary px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.16em] text-white">
              New customers
            </span>
            <p className="mt-1 bg-linear-to-b from-iwash-secondary to-[#075985] bg-clip-text font-display text-[3.6rem] font-extrabold leading-[0.95] tracking-tight text-transparent">
              50%
            </p>
            <p className="-mt-0.5 text-center font-display text-[11px] font-extrabold uppercase leading-tight tracking-[0.14em] text-iwash-neutral">
              off your first order
            </p>
            <span className="mt-3 inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-full bg-linear-to-r from-iwash-primary to-iwash-secondary text-xs font-bold text-white shadow-[0_10px_20px_-8px_rgba(2,132,199,0.9)]">
              Get the app <span aria-hidden="true">&rarr;</span>
            </span>
          </div>
        </div>

        {/* The knot where the string ties on */}
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-1.75 h-3 w-3 -translate-x-1/2 rounded-full bg-white shadow-[inset_0_0_0_2.5px_#0c4a6e]"
        />
      </div>
    </div>
  );
}
