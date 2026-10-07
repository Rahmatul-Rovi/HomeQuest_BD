"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ListingCard from "@/components/ListingCard";
import Swal from "sweetalert2";

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

export default function ListingGrid() {
  const searchParams = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);