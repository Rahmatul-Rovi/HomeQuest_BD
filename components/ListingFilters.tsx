"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, ChevronDown, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const TYPES = [
  { label: "All", value: "" },
  { label: "Rent", value: "RENT" },
  { label: "Sale", value: "SALE" },
];

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

   const [open, setOpen] = useState(false); // mobile e panel khola/bondho
  const [type, setType] = useState(searchParams.get("type") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [area, setArea] = useState(searchParams.get("area") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [bachelorOnly, setBachelorOnly] = useState(
    searchParams.get("bachelorAllowed") === "true"
  );

   const activeCount = [
    searchParams.get("type"),
    searchParams.get("category"),
    searchParams.get("area"),
    searchParams.get("minPrice") || searchParams.get("maxPrice"),
    searchParams.get("bachelorAllowed"),
  ].filter(Boolean).length;

  const applyFilters = (e?: React.FormEvent) => {
    e?.preventDefault();

     const params = new URLSearchParams();
    if (type) params.set("type", type);
    if (category) params.set("category", category);
    if (area.trim()) params.set("area", area.trim());
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (bachelorOnly) params.set("bachelorAllowed", "true");

    const query = params.toString();
    router.push(query ? `/listings?${query}` : "/listings");
    setOpen(false);
  };

   const clearFilters = () => {
    setType("");
    setCategory("");
    setArea("");
    setMinPrice("");
    setMaxPrice("");
    setBachelorOnly(false);
    router.push("/listings");
    setOpen(false);
  };

  return (
    <div>
      {/* Mobile Toggle Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="lg:hidden w-full flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 mb-3"
      >
        <span className="flex items-center gap-2">
          <SlidersHorizontal size={16} /> Filters
          {activeCount > 0 && (
            <span className="bg-primary text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">
              {activeCount}
            </span>
          )}
        </span>
        <ChevronDown
          size={16}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <aside
        className={`${
          open ? "block" : "hidden"
        } lg:block bg-white border border-gray-100 rounded-2xl shadow-sm p-5 lg:sticky lg:top-32`}
      >
        <div className="hidden lg:flex items-center justify-between mb-5">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-primary" /> Filters
          </h3>

           {activeCount > 0 && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs text-primary font-medium hover:underline"
            >
              Reset
            </button>
          )}
        </div>

        <form onSubmit={applyFilters} className="space-y-6">
          {/* Listing Type */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
              Listing Type
            </label>
            <div className="grid grid-cols-3 gap-1.5 bg-gray-100 p-1 rounded-xl">
              {TYPES.map((t) => (
                <button
                  key={t.label}
                  type="button"
                  onClick={() => setType(t.value)}
                  className={`py-2 text-sm font-semibold rounded-lg transition ${
                    type === t.value
                      ? "bg-white text-primary shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}

                   >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Area */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
              Area
            </label>
            <div className="flex items-center border border-gray-200 rounded-lg px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition">
              <MapPin size={16} className="text-gray-400 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="e.g. Mirpur, Dhanmondi"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full py-2.5 text-sm outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Category Chips */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setCategory(category === c.value ? "" : c.value)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full border transition ${
                    category === c.value
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary"
                  }`}
                ></button>

                {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
              Price Range (৳)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
              />
              <span className="text-gray-300">–</span>
              <input
                type="number"
                min={0}
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
              />
            </div>
          </div>

  {/* Bachelor Switch */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Bachelor Allowed
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={bachelorOnly}
              onClick={() => setBachelorOnly(!bachelorOnly)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                bachelorOnly ? "bg-primary" : "bg-gray-200"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  bachelorOnly ? "translate-x-5" : ""
                }`}
              />
            </button>
          </div>

          <div className="flex flex-col gap-2 pt-1">
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white flex items-center justify-center gap-2"
            >
              <Search size={16} /> Apply Filters
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={clearFilters}
              className="w-full text-gray-500 lg:hidden"
            ></Button>