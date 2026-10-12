"use client";

import { useEffect, useId, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { formatRupees } from "@/lib/format";
import { easeOut } from "@/lib/motion";
import type { PriceItem, PriceList } from "@/lib/pricing";
import { site } from "@/lib/site";
import { CategoryGlyph } from "@/components/prices/CategoryGlyph";

type Line = { key: number; item: PriceItem; serviceType: string; label: string; unit: number; quantity: number };

const round2 = (n: number) => Math.round(n * 100) / 100;

const select =
  "block h-14 w-full appearance-none rounded-2xl border border-iwash-neutral/15 bg-white pl-4 pr-11 text-base font-medium text-iwash-neutral shadow-sm transition-[border-color,box-shadow] focus:border-iwash-primary focus:outline-none focus:ring-4 focus:ring-iwash-primary/15";

function StepLabel({ n, children, htmlFor }: { n: number; children: React.ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="flex items-center gap-2.5 text-sm font-bold text-iwash-neutral">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-iwash-primary text-xs font-extrabold text-white">
        {n}
      </span>
      {children}
    </label>
  );
}

/** A number that counts up or down to its new value. */
function AnimatedTotal({ value }: { value: number }) {
  const mv = useMotionValue(value);
  const spring = useSpring(mv, { stiffness: 110, damping: 20, mass: 0.8 });
  const text = useTransform(spring, (v) => formatRupees(round2(v)));
  useEffect(() => {
    mv.set(value);
  }, [value, mv]);
  return <motion.span>{text}</motion.span>;
}

/**
 * Itemised estimate from the live price list.
 *
 * The maths is the ERP's own: each line is quantity x the item's price for
 * the chosen service (kilograms for per-kg items), and prices already
 * include GST. Add-ons and delivery vary by order and are not included, and
 * the result is labelled an estimate because the bill is based on what is
 * actually received.
 */
export function PriceEstimator({ list, bookingHref, bookingLabel }: { list: PriceList; bookingHref: string; bookingLabel: string }) {
  const uid = useId();
  const items = useMemo(() => list.categories.flatMap((c) => c.items).filter((i) => i.prices.length > 0), [list]);
  const byId = useMemo(() => new Map(items.map((i) => [i.id, i])), [items]);
  // One quick pick per category, so the common things are a tap away.
  const quick = useMemo(
    () =>
      list.categories
        .map((c) => ({ category: c.name, item: c.items.find((i) => i.prices.length > 0) }))
        .filter((q): q is { category: string; item: PriceItem } => Boolean(q.item))
        .slice(0, 6),
    [list],
  );

  const [itemId, setItemId] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [qty, setQty] = useState("1");
  const [lines, setLines] = useState<Line[]>([]);
  const [nextKey, setNextKey] = useState(1);

  const item = byId.get(itemId);
  const price = item?.prices.find((p) => p.serviceType === serviceType);
  const perKg = item?.perKg ?? false;
  const step = perKg ? 0.5 : 1;
  const min = perKg ? 0.5 : 1;
  const max = perKg ? 100 : 200;
  const amount = Number(qty);
  const validQty = Number.isFinite(amount) && amount >= min && amount <= max;
  const total = round2(lines.reduce((sum, l) => sum + l.unit * l.quantity, 0));
  const pieces = lines.length;
  const afterOffer = round2(total / 2);

  function chooseItem(id: string) {
    const next = byId.get(id);
    setItemId(id);
    setServiceType(next?.prices[0]?.serviceType ?? "");
    setQty("1");
  }

  function bump(delta: number) {
    const current = Number.isFinite(amount) ? amount : min;
    setQty(String(Math.min(max, Math.max(min, round2(current + delta * step)))));
  }

  function add() {
    if (!item || !price || !validQty) return;
    setLines((prev) => [
      ...prev,
      { key: nextKey, item, serviceType: price.serviceType, label: price.label, unit: price.price, quantity: amount },
    ]);
    setNextKey((k) => k + 1);
    setItemId("");
    setServiceType("");
    setQty("1");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-8">
      {/* Builder */}
      <div className="rounded-[2rem] bg-white p-6 shadow-[0_40px_90px_-50px_rgba(2,132,199,0.55)] ring-1 ring-iwash-neutral/10 md:p-9">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-iwash-primary to-iwash-secondary text-white shadow-lg shadow-iwash-primary/30">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="5" y="3" width="14" height="18" rx="2.5" />
              <path d="M9 7.5h6M9 12h.01M12 12h.01M15 12h.01M9 16h.01M12 16h.01M15 16h.01" />
            </svg>
          </span>
          <div>
            <h3 className="font-display text-xl font-extrabold tracking-tight text-iwash-neutral">Build your estimate</h3>
            <p className="text-sm text-iwash-ink-soft">Three quick steps, live prices.</p>
          </div>
        </div>

        {/* Quick picks */}
        {quick.length > 0 ? (
          <div className="mt-6">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-iwash-ink-soft">Quick pick</p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {quick.map((q) => {
                const on = itemId === q.item.id;
                return (
                  <button
                    key={q.item.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => chooseItem(q.item.id)}
                    className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold ring-1 transition-[background-color,color,box-shadow,transform] duration-300 hover:-translate-y-0.5 ${
                      on
                        ? "bg-iwash-primary text-white ring-iwash-primary shadow-lg shadow-iwash-primary/30"
                        : "bg-iwash-border/50 text-iwash-neutral ring-transparent hover:bg-iwash-border hover:ring-iwash-primary/30"
                    }`}
                  >
                    <CategoryGlyph name={q.category} className="h-4 w-4" />
                    {q.item.name}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        <div className="mt-7 space-y-6">
          {/* 1. Item */}
          <div>
            <StepLabel n={1} htmlFor={`${uid}-item`}>
              Choose an item
            </StepLabel>
            <div className="relative mt-2.5">
              <select id={`${uid}-item`} value={itemId} onChange={(e) => chooseItem(e.target.value)} className={select}>
                <option value="">Search or pick from the list…</option>
                {list.categories.map((c) => (
                  <optgroup key={c.id} label={c.name}>
                    {c.items
                      .filter((i) => i.prices.length > 0)
                      .map((i) => (
                        <option key={i.id} value={i.id}>
                          {i.name}
                        </option>
                      ))}
                  </optgroup>
                ))}
              </select>
              <svg viewBox="0 0 24 24" className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-iwash-ink-soft" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </div>

          {/* 2. Service */}
          <div>
            <StepLabel n={2}>Pick a service</StepLabel>
            <div role="radiogroup" aria-label="Service" className="mt-2.5 flex flex-wrap gap-2.5">
              {item ? (
                item.prices.map((p) => {
                  const on = serviceType === p.serviceType;
                  return (
                    <button
                      key={p.serviceType}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      onClick={() => setServiceType(p.serviceType)}
                      className={`flex flex-col items-start rounded-2xl px-4 py-2.5 text-left ring-1 transition-[background-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 ${
                        on
                          ? "bg-iwash-neutral text-white ring-iwash-neutral shadow-lg shadow-iwash-neutral/25"
                          : "bg-white text-iwash-neutral ring-iwash-neutral/15 hover:ring-iwash-primary/50"
                      }`}
                    >
                      <span className="text-sm font-bold">{p.label}</span>
                      <span className={`text-sm font-semibold tabular-nums ${on ? "text-[#7dd3fc]" : "text-iwash-primary"}`}>
                        {formatRupees(p.price)}
                        {item.perKg ? " / kg" : ""}
                      </span>
                    </button>
                  );
                })
              ) : (
                <p className="rounded-2xl border border-dashed border-iwash-neutral/20 px-4 py-3 text-sm text-iwash-ink-soft">
                  Choose an item first to see its services.
                </p>
              )}
            </div>
          </div>

          {/* 3. Quantity */}
          <div>
            <StepLabel n={3} htmlFor={`${uid}-qty`}>
              {perKg ? "Weight in kg" : "How many?"}
            </StepLabel>
            <div className="mt-2.5 flex flex-wrap items-center gap-4">
              <div className="inline-flex h-14 items-center rounded-full bg-iwash-border/50 p-1.5 ring-1 ring-iwash-neutral/10">
                <button
                  type="button"
                  onClick={() => bump(-1)}
                  disabled={!item || amount <= min}
                  aria-label={perKg ? "Decrease weight" : "Decrease quantity"}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl font-bold text-iwash-neutral shadow-sm transition-[transform,background-color,color] hover:bg-iwash-primary hover:text-white active:scale-90 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-iwash-neutral"
                >
                  &minus;
                </button>
                <input
                  id={`${uid}-qty`}
                  type="number"
                  inputMode="decimal"
                  min={min}
                  max={max}
                  step={step}
                  value={qty}
                  disabled={!item}
                  onChange={(e) => setQty(e.target.value)}
                  className="h-11 w-20 bg-transparent text-center font-display text-xl font-extrabold tabular-nums text-iwash-neutral focus:outline-none disabled:text-slate-400 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <button
                  type="button"
                  onClick={() => bump(1)}
                  disabled={!item || amount >= max}
                  aria-label={perKg ? "Increase weight" : "Increase quantity"}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl font-bold text-iwash-neutral shadow-sm transition-[transform,background-color,color] hover:bg-iwash-primary hover:text-white active:scale-90 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-iwash-neutral"
                >
                  +
                </button>
              </div>

              <AnimatePresence mode="wait" initial={false}>
                {item && price ? (
                  <motion.p
                    key={validQty ? "ok" : "bad"}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="text-sm font-semibold text-iwash-ink-soft"
                    aria-live="polite"
                  >
                    {validQty ? (
                      <>
                        {amount} {perKg ? "kg" : amount === 1 ? "piece" : "pieces"} × {formatRupees(price.price)} ={" "}
                        <strong className="rounded-full bg-iwash-primary/10 px-3 py-1 font-display text-base font-extrabold text-iwash-primary">
                          {formatRupees(round2(price.price * amount))}
                        </strong>
                      </>
                    ) : (
                      `Enter ${perKg ? "a weight" : "a quantity"} between ${min} and ${max}.`
                    )}
                  </motion.p>
                ) : null}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={add}
          disabled={!item || !price || !validQty}
          className="group mt-8 inline-flex h-14 w-full items-center justify-center gap-3 rounded-full bg-linear-to-r from-iwash-primary to-iwash-secondary text-base font-bold text-white shadow-[0_20px_40px_-18px_rgba(2,132,199,0.9)] transition-[transform,box-shadow,opacity] duration-300 hover:-translate-y-0.5 hover:shadow-[0_26px_50px_-18px_rgba(2,132,199,1)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:hover:translate-y-0 sm:w-auto sm:px-10"
        >
          Add to estimate
          <span aria-hidden="true" className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-lg leading-none transition-transform duration-300 group-hover:rotate-90">
            +
          </span>
        </button>
      </div>

      {/* Receipt */}
      <div className="relative overflow-hidden rounded-[2rem] bg-linear-to-b from-iwash-neutral via-[#0b2540] to-[#0c3b66] p-6 text-white shadow-[0_40px_90px_-40px_rgba(2,40,80,0.8)] md:p-9">
        <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-iwash-secondary/30 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-iwash-primary/30 blur-3xl" />

        <div className="relative flex items-center justify-between">
          <h3 className="font-display text-xl font-extrabold tracking-tight">Your estimate</h3>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold ring-1 ring-white/20">
            {pieces} {pieces === 1 ? "line" : "lines"}
          </span>
        </div>

        <div className="relative mt-5 min-h-[9rem]">
          {lines.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/25 px-6 py-9 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-[#7dd3fc]">
                <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5.5 8h13l-1 12.5h-11z" />
                  <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
                </svg>
              </span>
              <p className="mt-4 max-w-[16rem] text-sm leading-relaxed text-white/70">
                Add the items you plan to send and your total appears here.
              </p>
            </div>
          ) : (
            <ul className="max-h-72 space-y-2 overflow-y-auto pr-1 [scrollbar-width:thin]">
              <AnimatePresence initial={false}>
                {lines.map((l) => (
                  <motion.li
                    key={l.key}
                    layout
                    initial={{ opacity: 0, y: 12, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 24, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.4, ease: easeOut }}
                    className="motion-reset flex items-center justify-between gap-3 rounded-2xl bg-white/[0.07] px-4 py-3 ring-1 ring-white/10"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{l.item.name}</p>
                      <p className="text-xs text-white/60">
                        {l.quantity} {l.item.perKg ? "kg" : l.quantity === 1 ? "piece" : "pieces"} · {l.label}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="font-display text-lg font-extrabold tabular-nums">
                        {formatRupees(round2(l.unit * l.quantity))}
                      </span>
                      <button
                        type="button"
                        onClick={() => setLines((prev) => prev.filter((x) => x.key !== l.key))}
                        aria-label={`Remove ${l.item.name}, ${l.label}`}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/15 hover:text-white"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4" aria-hidden="true">
                          <path d="M6 6l12 12M18 6 6 18" />
                        </svg>
                      </button>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>

        {/* Total */}
        <div className="relative mt-6 border-t border-dashed border-white/25 pt-6">
          <div className="flex items-end justify-between gap-4">
            <span className="text-sm font-semibold text-white/70">Estimated total</span>
            <span className="font-display text-5xl font-extrabold tracking-tight tabular-nums md:text-6xl" aria-hidden="true">
              <AnimatedTotal value={total} />
            </span>
            <span className="sr-only" aria-live="polite">
              Estimated total {formatRupees(total)}
            </span>
          </div>

          {total > 0 ? (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl bg-iwash-primary/25 px-4 py-3 text-sm ring-1 ring-iwash-secondary/40"
            >
              <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-extrabold text-iwash-primary">{site.offer.badge}</span>
              <span className="text-white/90">
                New customers: about <strong className="font-extrabold text-white">{formatRupees(afterOffer)}</strong> on your first order in the app.
              </span>
            </motion.p>
          ) : null}

          <p className="mt-4 text-xs leading-relaxed text-white/55">
            An estimate for the items above, GST included. Add-ons and delivery are not included, and your final
            bill is based on the items we actually receive and check.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link
              href={bookingHref}
              className="group inline-flex h-13 items-center gap-2 rounded-full bg-white px-7 text-sm font-bold text-iwash-neutral shadow-[0_18px_40px_-14px_rgba(0,0,0,0.6)] transition-[transform,background-color,color] duration-300 hover:-translate-y-0.5 hover:bg-iwash-secondary hover:text-white"
            >
              {bookingLabel}
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                &rarr;
              </span>
            </Link>
            {lines.length > 0 ? (
              <button
                type="button"
                onClick={() => setLines([])}
                className="text-sm font-semibold text-[#7dd3fc] underline-offset-4 hover:underline"
              >
                Clear estimate
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
