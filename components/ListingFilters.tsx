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