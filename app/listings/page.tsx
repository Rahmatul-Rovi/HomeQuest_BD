import { Suspense } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ListingFilters from "@/components/ListingFilters";
import ListingGrid from "@/components/ListingGrid";

type SearchParams = { [key: string]: string | string[] | undefined };

const CATEGORY_LABELS: Record<string, string> = {
  FULL_FLAT: "Full Flat",
  MESS: "Mess",
  SEAT: "Seat",
  SUBLET: "Sublet",
  FLAT_SALE: "Flat for Sale",
};

const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

function buildHeading(sp: SearchParams) {
  const type = first(sp.type);
  const category = first(sp.category);
  const area = first(sp.area);

  let title = "Browse Properties";
  if (category && CATEGORY_LABELS[category]) {
    title = CATEGORY_LABELS[category];
  } else if (type === "RENT") {
    title = "Properties for Rent";
  } else if (type === "SALE") {
    title = "Properties for Sale";
  }

   let subtitle = "Find verified flats, mess, seats and more across Bangladesh.";
  if (area) {
    subtitle = `Showing results in "${area}".`;
  } else if (type === "RENT") {
    subtitle = "Verified rental properties, directly from owners. No brokers.";
  } else if (type === "SALE") {
    subtitle = "Properties for sale from verified owners.";
  }

  return { title, subtitle };
}