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