import { divIcon } from "leaflet";

export function formatShortPrice(n: number) {
  if (n >= 10000000) return `${+(n / 10000000).toFixed(2)}Cr`;
  if (n >= 100000) return `${+(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `${+(n / 1000).toFixed(1)}k`;
  return String(n);
}

// Green house pin: location picker details page
export const pinIcon = divIcon({
  className: "",
  html: `<svg width="34" height="44" viewBox="0 0 34 44" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter:drop-shadow(0 3px 4px rgba(0,0,0,.3))"><path d="M17 0C7.6 0 0 7.6 0 17c0 12.6 17 27 17 27s17-14.4 17-27C34 7.6 26.4 0 17 0z" fill="#16A34A"/><circle cx="17" cy="17" r="8" fill="#fff"/><path d="M17 11l-6 5v6h4v-4h4v4h4v-6l-6-5z" fill="#16A34A"/></svg>`,
  iconSize: [34, 44],
  iconAnchor: [17, 44],
});

// Price bubble pin: listings map (Rent = green, Sale = dark green)
export function createPriceIcon(price: number, type: "RENT" | "SALE") {
  const bg = type === "RENT" ? "#16A34A" : "#065F46";
  return divIcon({
    className: "",
    html: `<div style="transform:translate(-50%,-100%);display:inline-block;background:${bg};color:#fff;font:700 12px/1 system-ui,sans-serif;padding:7px 10px;border-radius:999px;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.3);white-space:nowrap;">৳${formatShortPrice(price)}</div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}