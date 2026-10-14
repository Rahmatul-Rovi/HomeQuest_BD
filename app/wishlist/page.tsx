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
    // All wishlist listing  fetch with ID
    fetch(`/api/listings?ids=${wishlist.join(",")}`)
      .then((res) => res.json())
      .then((data) => {
        setListings(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [wishlist]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-8 py-10 w-full">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
          My Wishlist
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          Properties you&apos;ve saved for later.
        </p>

        {loading ? (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-72 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <HeartOff size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Your wishlist is empty</p>
            <p className="text-gray-400 text-sm mt-1 mb-5">
              Save properties you like by tapping the heart icon.
            </p>
            <Link href="/listings">
              <Button className="bg-primary hover:bg-primary-dark text-white">
                Browse Properties
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}