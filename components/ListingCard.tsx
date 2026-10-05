"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, BedDouble, Bath, MapPin, BadgeCheck } from "lucide-react";
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

        <span className="absolute top-3 left-3 bg-primary text-white text-xs font-semibold px-2 py-1 rounded-full">
          {listing.listingType === "RENT" ? "For Rent" : "For Sale"}
        </span>
      </div>

      <Link href={`/listings/${listing.id}`} className="block p-4">
        <h3 className="font-semibold text-gray-900 truncate">{listing.title}</h3>
        <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
          <MapPin size={14} /> {listing.address}
        </p>

        <div className="flex items-center gap-4 text-gray-500 text-sm mt-3">
          {listing.bedroom && (
            <span className="flex items-center gap-1">
              <BedDouble size={14} /> {listing.bedroom}
            </span>
          )}
          {listing.bathroom && (
            <span className="flex items-center gap-1">
              <Bath size={14} /> {listing.bathroom}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mt-4">
          <p className="text-primary font-bold">
            ৳{listing.price.toLocaleString()}
            {listing.listingType === "RENT" && <span className="text-gray-400 text-xs font-normal"> /month</span>}
          </p>
          {listing.owner?.verified && (
            <span className="flex items-center gap-1 text-xs text-primary">
              <BadgeCheck size={14} /> Verified
            </span>
          )}
        </div>
      </Link>
    </div>
  );
}