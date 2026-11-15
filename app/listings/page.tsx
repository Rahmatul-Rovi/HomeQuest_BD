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

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const { title, subtitle } = buildHeading(sp);

  
  const filterKey = JSON.stringify(sp);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Header Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-light/60 to-gray-50 border-b border-gray-100">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-primary-light rounded-full blur-3xl opacity-60 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-10">
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
            <Link href="/" className="hover:text-primary transition">
              Home
            </Link>
            <ChevronRight size={12} />
            <Link href="/listings" className="hover:text-primary transition">
              Listings
            </Link>
