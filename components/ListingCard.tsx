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
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition overflow-hidden group">
      <div className="relative h-48 bg-gray-100">
        {listing.images?.[0] ? (
          <Image
            src={listing.images[0]}
            alt={listing.title}
            fill
            className="object-cover group-hover:scale-105 transition"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            No Image
          </div>
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(listing.id);
          }}
          className="absolute top-3 right-3 bg-white/90 p-2 rounded-full shadow"
        >
          <Heart
            size={18}
            className={wishlisted ? "fill-primary text-primary" : "text-gray-500"}
          />
        </button>
