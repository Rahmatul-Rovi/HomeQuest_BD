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