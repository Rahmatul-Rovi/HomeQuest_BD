"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, BedDouble, Bath, MapPin, BadgeCheck } from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";

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

export default function ListingCard({ listing }: { listing: Listing }) {
  const { isWishlisted, toggleWishlist } = useWishlistStore();
  const wishlisted = isWishlisted(listing.id);
