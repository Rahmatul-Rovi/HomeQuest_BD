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