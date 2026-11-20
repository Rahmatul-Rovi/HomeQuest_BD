import { divIcon } from "leaflet";

export function formatShortPrice(n: number) {
  if (n >= 10000000) return `${+(n / 10000000).toFixed(2)}Cr`;
  if (n >= 100000) return `${+(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `${+(n / 1000).toFixed(1)}k`;
  return String(n);
}

export const pinIcon = divIcon({
  className: "",
  html: `<svg width="34" height="44" viewBox="0 0 34 44" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter:drop-shadow(0 3px 4px rgba(0,0,0,.3))"><path d="M17 0C7.6 0 0 7.6 0 17c0 12.6 17 27 17 27s17-14.4 17-27C34 7.6 26.4 0 17 0z" fill="#16A34A"/><circle cx="17" cy="17" r="8" fill="#fff"/><path d="M17 11l-6 5v6h4v-4h4v4h4v-6l-6-5z" fill="#16A34A"/></svg>`,
  iconSize: [34, 44],
  iconAnchor: [17, 44],
});