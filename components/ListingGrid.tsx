"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import { SearchX, X, ArrowUpDown } from "lucide-react";
import ListingCard from "@/components/ListingCard";
import { Button } from "@/components/ui/button";

type Listing = {
  id: string;
  title: string;
  price: number;
  address: string;
  bedroom: number | null;
  bathroom: number | null;
  listingType: "RENT" | "SALE";
  category: string;
  images: string[];
  owner: { name: string; verified: boolean };
};

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

const CATEGORY_LABELS: Record<string, string> = {
  FULL_FLAT: "Full Flat",
  MESS: "Mess",
  SEAT: "Seat",
  SUBLET: "Sublet",
  FLAT_SALE: "Flat for Sale",
};

export default function ListingGrid() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetch(`/api/listings?${queryString}`)
      .then((res) => {
        if (!res.ok) throw new Error("Request failed");
        return res.json();
      })
      .then((data: unknown) => {
        if (cancelled) return;
        setListings(Array.isArray(data) ? (data as Listing[]) : []);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Could not load listings. Please try again.",
          confirmButtonColor: "#16A34A",
        });
      });

       return () => {
      cancelled = true;
    };
  }, [queryString]);

  const sortedListings = useMemo(() => {
    const copy = [...listings];
    if (sort === "price-asc") copy.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") copy.sort((a, b) => b.price - a.price);
    return copy;
  }, [listings, sort]);

   const chips: { label: string; keys: string[] }[] = [];
  const typeParam = searchParams.get("type");
  const categoryParam = searchParams.get("category");
  const areaParam = searchParams.get("area");
  const minParam = searchParams.get("minPrice");
  const maxParam = searchParams.get("maxPrice");

  if (typeParam) {
    chips.push({
      label: typeParam === "RENT" ? "For Rent" : "For Sale",
      keys: ["type"],
    });
  }
  if (categoryParam) {
    chips.push({
      label: CATEGORY_LABELS[categoryParam] || categoryParam,
      keys: ["category"],
    });
  }

  if (areaParam) {
    chips.push({ label: `Area: ${areaParam}`, keys: ["area"] });
  }
  if (minParam || maxParam) {
    const min = minParam ? `৳${Number(minParam).toLocaleString()}` : "Any";
    const max = maxParam ? `৳${Number(maxParam).toLocaleString()}` : "Any";
    chips.push({ label: `${min} – ${max}`, keys: ["minPrice", "maxPrice"] });
  }
  if (searchParams.get("bachelorAllowed") === "true") {
    chips.push({ label: "Bachelor Allowed", keys: ["bachelorAllowed"] });
  }

  const removeFilter = (keys: string[]) => {
    const params = new URLSearchParams(queryString);
    keys.forEach((key) => params.delete(key));
    const query = params.toString();
    router.push(query ? `/listings?${query}` : "/listings");
  };

  const clearAll = () => router.push("/listings");

  // Loading skeleton
  if (loading) {
    return (
      <div>
        <div className="h-10 w-48 bg-gray-200 rounded-lg animate-pulse mb-5" />
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white border border-gray-100 rounded-xl overflow-hidden animate-pulse"
            >
              <div className="h-48 bg-gray-100" />
              <div className="p-4 space-y-3">
                <div className="h-4 w-3/4 bg-gray-100 rounded" />
                <div className="h-3 w-1/2 bg-gray-100 rounded" />
                <div className="h-4 w-1/3 bg-gray-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Results Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <p className="text-sm text-gray-600">
          <span className="font-bold text-gray-900">{sortedListings.length}</span>{" "}
          propert{sortedListings.length === 1 ? "y" : "ies"} found
        </p>

        <div className="flex items-center gap-2">
          <ArrowUpDown size={15} className="text-gray-400" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-gray-200 bg-white rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-primary cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filter Chips */}
      {chips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-5">
          {chips.map((chip) => (
            <span
              key={chip.label}
              className="inline-flex items-center gap-1.5 bg-primary-light text-primary text-xs font-medium pl-3 pr-1.5 py-1.5 rounded-full"
            >
              {chip.label}
              <button
                type="button"
                onClick={() => removeFilter(chip.keys)}
                aria-label={`Remove ${chip.label} filter`}
                className="w-4 h-4 rounded-full hover:bg-primary hover:text-white flex items-center justify-center transition"
              >
                <X size={11} />
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={clearAll}
            className="text-xs text-gray-500 hover:text-primary underline underline-offset-2 ml-1"
          >
            Clear all
          </button>
        </div>
      )}

        {/* Results */}
      {sortedListings.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <SearchX size={28} className="text-gray-300" />
          </div>
          <p className="text-gray-700 font-semibold text-lg">No properties found</p>
          <p className="text-gray-400 text-sm mt-1 mb-6 max-w-xs mx-auto">
            We couldn&apos;t find anything matching your filters. Try changing or
            removing some of them.
          </p>
          {chips.length > 0 && (
            <Button
              onClick={clearAll}
              className="bg-primary hover:bg-primary-dark text-white"
            >
              Clear All Filters
            </Button>
          )}
        </div>