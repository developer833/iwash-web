"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getYear = () => String(new Date().getFullYear());

/**
 * Current year rendered on the client only. Keeps the page statically
 * prerenderable under Cache Components (no Date access during prerender).
 */
export function Year() {
  const year = useSyncExternalStore(subscribe, getYear, () => "");
  return <>{year}</>;
}
