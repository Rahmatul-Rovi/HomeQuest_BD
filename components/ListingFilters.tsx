"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const CATEGORIES = [
  { label: "Full Flat", value: "FULL_FLAT" },
  { label: "Mess", value: "MESS" },
  { label: "Seat", value: "SEAT" },
  { label: "Sublet", value: "SUBLET" },
  { label: "Flat for Sale", value: "FLAT_SALE" },
];

export default function ListingFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [area, setArea] = useState(searchParams.get("area") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [bachelorOnly, setBachelorOnly] = useState(
    searchParams.get("bachelorAllowed") === "true"
  );

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    area ? params.set("area", area) : params.delete("area");
    minPrice ? params.set("minPrice", minPrice) : params.delete("minPrice");
    maxPrice ? params.set("maxPrice", maxPrice) : params.delete("maxPrice");
    category ? params.set("category", category) : params.delete("category");
    bachelorOnly
      ? params.set("bachelorAllowed", "true")
      : params.delete("bachelorAllowed");

    router.push(`/listings?${params.toString()}`);
  };

  const clearFilters = () => {
    setArea("");
    setMinPrice("");
    setMaxPrice("");
    setCategory("");
    setBachelorOnly(false);
    router.push("/listings");
  };

  return (
    <aside className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-5 h-fit sticky top-20">
      <h3 className="font-semibold text-gray-900">Filters</h3>

      {/* Area */}
      <div>
        <label className="text-sm text-gray-600 font-medium mb-1.5 block">
          Area
        </label>
        <input
          type="text"
          placeholder="e.g. Mirpur"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
        />
      </div>

      {/* Category */}
      <div>
        <label className="text-sm text-gray-600 font-medium mb-1.5 block">
          Category
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary bg-white"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="text-sm text-gray-600 font-medium mb-1.5 block">
          Price Range (৳)
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-1/2 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-1/2 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Bachelor Allowed */}
      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
        <input
          type="checkbox"
          checked={bachelorOnly}
          onChange={(e) => setBachelorOnly(e.target.checked)}
          className="accent-primary w-4 h-4"
        />
        Bachelor Allowed Only
      </label>

      <div className="flex flex-col gap-2 pt-2">
        <Button onClick={applyFilters} className="bg-primary hover:bg-primary-dark text-white w-full">
          Apply Filters
        </Button>
        <Button onClick={clearFilters} variant="ghost" className="w-full text-gray-500">
          Clear All
        </Button>
      </div>
    </aside>
  );
}