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
