"use client";

import { useEffect, useState } from "react";
import ListingCard from "@/components/ListingCard";
import Swal from "sweetalert2";

export default function FeaturedListings() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/listings")
      .then((res) => res.json())
      .then((data) => {
        setListings(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Could not load listings. Please try again.",
          confirmButtonColor: "#16A34A",
        });
      });
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          Featured Properties
        </h2>
        <a href="/listings" className="text-primary text-sm font-medium hover:underline">
          View All →
        </a>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-72 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          No listings available yet. Check back soon!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </section>
  );
}