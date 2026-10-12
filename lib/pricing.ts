import "server-only";
import { cacheLife } from "next/cache";
import { api, apiConfigured, asList, isObject, num, str, type Json } from "@/lib/iwash-api";
import { SERVICE_LABELS, type ServiceType } from "@/lib/format";

/**
 * Price list for the public site, read from the iWash ERP.
 *
 * The mapping below was verified against real billed orders:
 *   - "wash-fold" orders bill each item at its `basePrice`
 *   - "ironing-only" orders bill each item at its `ironingPrice`
 *   - `regularPrice`, when set, is the higher list price shown struck through
 *   - `priceByWeight` items are billed per kilogram, not per piece
 * The ERP also stores a dry-cleaning multiplier, but no dry-cleaning orders
 * exist to confirm how it is applied, so no dry-cleaning price is published.
 *
 * Items and categories that are inactive or flagged `hideOnMobile` (the
 * ERP's "not customer-facing" flag) are left out.
 */

export type ServicePrice = { serviceType: ServiceType; label: string; price: number; was?: number };

export type PriceItem = {
  id: string;
  name: string;
  categoryId: string;
  perKg: boolean;
  /** Absolute URL of the ERP's own photo for this item, when it has one. */
  image?: string;
  prices: ServicePrice[];
};

export type PriceCategory = { id: string; name: string; items: PriceItem[] };

export type Addon = { name: string; price: number; perItem: boolean };
export type DeliveryOption = { name: string; price: number; days: number };

export type PriceList = {
  categories: PriceCategory[];
  serviceTypes: { id: ServiceType; label: string }[];
  addons: Addon[];
  delivery: DeliveryOption[];
  itemCount: number;
};

/**
 * Item photos are served by the ERP from /api/icons/ (public, no key). Only
 * that path on the configured ERP host is accepted, which is also the only
 * location next.config.ts allows the image optimiser to fetch from.
 */
function imageUrl(path: string | undefined): string | undefined {
  const base = (process.env.NEXT_PUBLIC_BASE_URL ?? "").trim().replace(/\/+$/, "");
  if (!path || !base || !path.startsWith("/api/icons/") || path.includes("..")) return undefined;
  return `${base}${path}`;
}

const visible = (row: Json) => row.isActive !== false && row.hideOnMobile !== true;
const order = (row: Json) => num(row.sortOrder) ?? 999;

async function loadPriceList(): Promise<PriceList | null> {
  const customerTypeId = process.env.IWASH_RETAIL_CUSTOMER_TYPE_ID;

  const [rawItems, rawCategories, rawAddons, rawOverrides] = await Promise.all([
    api("/api/item-types"),
    api("/api/item-categories").catch(() => []),
    api("/api/addons").catch(() => []),
    customerTypeId
      ? api(`/api/customer-type-pricing/${encodeURIComponent(customerTypeId)}`).catch(() => [])
      : Promise.resolve([]),
  ]);

  // Categories, in the ERP's own order.
  const categoryRows = asList(rawCategories).filter(visible).sort((a, b) => order(a) - order(b));
  const categoryNames = new Map<string, string>();
  for (const c of categoryRows) {
    const id = str(c, "id");
    const name = str(c, "name");
    if (id && name) categoryNames.set(id, name);
  }

  // Retail price overrides for the configured customer type, keyed "itemId|serviceType".
  const overrides = new Map<string, number>();
  for (const row of asList(rawOverrides)) {
    const itemId = str(row, "itemTypeId");
    const service = str(row, "serviceType");
    const price = num(row.price);
    if (itemId && service && price !== undefined && price > 0) overrides.set(`${itemId}|${service}`, price);
  }

  const grouped = new Map<string, { item: PriceItem; sort: number }[]>();
  let itemCount = 0;

  for (const raw of asList(rawItems)) {
    if (!visible(raw)) continue;
    const id = str(raw, "id");
    const name = str(raw, "name");
    const categoryId =
      str(raw, "categoryId") ?? (isObject(raw.category) ? str(raw.category as Json, "id") : undefined);
    // An item only shows if its category is customer-facing too.
    if (!id || !name || !categoryId || !categoryNames.has(categoryId)) continue;

    const prices: ServicePrice[] = [];
    const wash = overrides.get(`${id}|wash-fold`) ?? num(raw.basePrice);
    const regular = num(raw.regularPrice);
    if (wash !== undefined && wash > 0) {
      prices.push({
        serviceType: "wash-fold",
        label: SERVICE_LABELS["wash-fold"],
        price: wash,
        ...(regular !== undefined && regular > wash ? { was: regular } : {}),
      });
    }
    const ironing = overrides.get(`${id}|ironing-only`) ?? num(raw.ironingPrice);
    if (ironing !== undefined && ironing > 0) {
      prices.push({ serviceType: "ironing-only", label: SERVICE_LABELS["ironing-only"], price: ironing });
    }
    // Items with no usable price stay listed and show "Price on request" rather than vanishing.

    const image = imageUrl(str(raw, "iconUrl"));
    const list = grouped.get(categoryId) ?? [];
    list.push({
      item: { id, name, categoryId, perKg: raw.priceByWeight === true, prices, ...(image ? { image } : {}) },
      sort: order(raw),
    });
    grouped.set(categoryId, list);
    itemCount += 1;
  }
  if (itemCount === 0) return null;

  const categories: PriceCategory[] = [...categoryNames]
    .filter(([id]) => grouped.has(id))
    .map(([id, name]) => ({
      id,
      name,
      items: grouped
        .get(id)!
        .sort((a, b) => a.sort - b.sort || a.item.name.localeCompare(b.item.name))
        .map((x) => x.item),
    }));

  const addons: Addon[] = [];
  const delivery: DeliveryOption[] = [];
  const addonRows = asList(rawAddons)
    .filter((r) => r.isActive !== false)
    .sort((a, b) => order(a) - order(b));
  for (const row of addonRows) {
    const name = str(row, "name");
    const price = num(row.price);
    if (!name || price === undefined) continue;
    if (row.isDeliveryAddon === true) delivery.push({ name, price, days: num(row.deliveryDays) ?? 0 });
    else if (price > 0) addons.push({ name, price, perItem: str(row, "scope") === "item" });
  }

  const used = new Set(categories.flatMap((c) => c.items).flatMap((i) => i.prices.map((p) => p.serviceType)));
  const serviceTypes = (Object.keys(SERVICE_LABELS) as ServiceType[])
    .filter((id) => used.has(id))
    .map((id) => ({ id, label: SERVICE_LABELS[id] }));

  return { categories, serviceTypes, addons, delivery, itemCount };
}

/**
 * Cached price list. Returns null when the API is not configured, is
 * unreachable, or returns nothing usable; price UI is then not rendered.
 */
export async function getPriceList(): Promise<PriceList | null> {
  "use cache";

  if (!apiConfigured()) {
    cacheLife("minutes");
    return null;
  }
  try {
    const list = await loadPriceList();
    if (list) cacheLife("hours");
    else cacheLife("minutes");
    return list;
  } catch (error) {
    cacheLife("minutes");
    console.error("[iwash] price list unavailable:", error instanceof Error ? error.message : error);
    return null;
  }
}
