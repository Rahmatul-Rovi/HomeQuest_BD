"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ListingCard from "@/components/ListingCard";
import { Button } from "@/components/ui/button";
import { HeartOff } from "lucide-react";
import { useWishlistStore } from "@/src/store/wishlistStore";

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

export default function WishlistPage() {
  const { wishlist } = useWishlistStore();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (wishlist.length === 0) {
      setListings([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    // Shob wishlist listing ekshathe fetch kora (ID diye)
    fetch(`/api/listings?ids=${wishlist.join(",")}`)
      .then((res) => res.json())
      .then((data) => {
        setListings(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [wishlist]);