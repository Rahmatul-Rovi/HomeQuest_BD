"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { BadgeCheck, Trash2 } from "lucide-react";

type AdminListing = {
  id: string;
  title: string;
  address: string;
  status: string;
  images: string[];
  owner: { name: string; verified: boolean };
};

export default function AdminListingsPage() {
  const [listings, setListings] = useState<AdminListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/listings")
      .then((res) => res.json())
      .then((data) => {
        setListings(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

   const removeListing = async (listingId: string) => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "Remove this listing?",
      text: "This action cannot be undone.",
      showCancelButton: true,
      confirmButtonText: "Yes, remove",
      confirmButtonColor: "#DC2626",
      cancelButtonColor: "#9CA3AF",
    });

    if (!confirm.isConfirmed) return;

    const res = await fetch(`/api/admin/listings/${listingId}`, {
      method: "DELETE",
    });

      if (res.ok) {
      setListings((prev) => prev.filter((l) => l.id !== listingId));
      Swal.fire({ icon: "success", title: "Listing Removed", timer: 1000, showConfirmButton: false });
    }
  };

  if (loading) {
    return <div className="p-6 md:p-10 animate-pulse h-64 bg-gray-100 rounded-2xl m-6" />;
  }

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Listings</h1>
      <p className="text-gray-500 text-sm mb-8">
        Monitor and moderate all property listings.
      </p>

 <div className="space-y-3">
        {listings.map((listing) => (
          <div
            key={listing.id}
            className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl p-4"
          >
            <div className="relative w-16 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
              {listing.images[0] && (
                <Image src={listing.images[0]} alt={listing.title} fill sizes="64px" className="object-cover" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 text-sm truncate">{listing.title}</p>
              <p className="text-xs text-gray-400 truncate">{listing.address}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Owner: {listing.owner.name}{" "}
                {listing.owner.verified && (
                  <BadgeCheck size={12} className="inline text-primary ml-0.5" />
                )}
              </p>
            </div>