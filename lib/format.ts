/** Shared constants and formatters that are safe to import from Client Components. */

export function formatRupees(amount: number) {
  return `₹${amount.toLocaleString("en-IN", {
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

/** Normalises an Indian mobile number to +91XXXXXXXXXX, or null if it is not one. */
export function normalisePhone(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  const local = digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits.replace(/^0/, "");
  return /^[6-9]\d{9}$/.test(local) ? `+91${local}` : null;
}

/** Order-level service types, exactly as the ERP stores them. */
export const SERVICE_LABELS = {
  "wash-fold": "Wash & Fold",
  "ironing-only": "Ironing",
} as const;
export type ServiceType = keyof typeof SERVICE_LABELS;
export const serviceTypes = Object.keys(SERVICE_LABELS) as ServiceType[];

/** Pickup time slots, exactly as the ERP stores them, with the IST start hour. */
export const pickupSlots = [
  { id: "9AM-12PM", label: "9 am to 12 pm", startHour: 9 },
  { id: "12PM-3PM", label: "12 pm to 3 pm", startHour: 12 },
  { id: "3PM-6PM", label: "3 pm to 6 pm", startHour: 15 },
  { id: "6PM-9PM", label: "6 pm to 9 pm", startHour: 18 },
] as const;
export type PickupSlotId = (typeof pickupSlots)[number]["id"];

/** Customer-facing stages of an order, in sequence. */
export const orderStages = ["Pickup requested", "Received", "Being cleaned", "Packed", "Out for delivery", "Delivered"] as const;
