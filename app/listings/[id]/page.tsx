"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Swal from "sweetalert2";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

import {
  MapPin,
  BedDouble,
  Bath,
  Ruler,
  BadgeCheck,
  Heart,
  MessageCircleMore,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useWishlistStore } from "@/src/store/wishlistStore";

type ListingDetail = {
  id: string;
  title: string;
  description: string;
  price: number;
  listingType: "RENT" | "SALE";
  category: string;
  bedroom: number | null;
  bathroom: number | null;
  areaSize: number | null;
  bachelorAllowed: boolean;
  address: string;
  images: string[];
  owner: { id: string; name: string; verified: boolean; email: string };
};

const CATEGORY_LABELS: Record<string, string> = {
  FULL_FLAT: "Full Flat",
  MESS: "Mess",
  SEAT: "Seat",
  SUBLET: "Sublet",
  FLAT_SALE: "Flat for Sale",
  LAND_SALE: "Land for Sale",
};

export default function ListingDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  const { isWishlisted, toggleWishlist } = useWishlistStore();

  useEffect(() => {
    fetch(`/api/listings/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setListing(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Not Found",
          text: "This listing could not be found.",
          confirmButtonColor: "#16A34A",
        });
      });
  }, [id]);


  const handleProtectedAction = (actionLabel: string) => {
    const isLoggedIn = false;

    if (!isLoggedIn) {
      Swal.fire({
        icon: "info",
        title: "Login Required",
        text: `Please log in to ${actionLabel}.`,
        showCancelButton: true,
        confirmButtonText: "Log In",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#16A34A",
        cancelButtonColor: "#9CA3AF",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = `/login?redirect=/listings/${id}`;
        }
      });
      return;
    }

    // Logged in hole actual booking/chat logic eikhane hobe
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-10 animate-pulse space-y-6">
          <div className="h-96 bg-gray-100 rounded-2xl" />
          <div className="h-6 w-2/3 bg-gray-100 rounded" />
          <div className="h-4 w-1/3 bg-gray-100 rounded" />
        </div>
        <Footer />
      </main>
    );
  }

  if (!listing) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-xl mx-auto px-4 py-24 text-center">
          <p className="text-gray-500">Listing not found.</p>
          <Link href="/listings" className="text-primary text-sm font-medium hover:underline">
            ← Back to listings
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const images = listing.images.length > 0 ? listing.images : [];
  const wishlisted = isWishlisted(listing.id);

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        {/* Image Gallery */}
        <div className="relative h-72 sm:h-[420px] rounded-2xl overflow-hidden bg-gray-100 mb-6">
          {images.length > 0 ? (
            <>
              <Image
                src={images[activeImage]}
                alt={listing.title}
                fill
                className="object-cover"
                priority
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setActiveImage((p) => (p === 0 ? images.length - 1 : p - 1))
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() =>
                      setActiveImage((p) => (p === images.length - 1 ? 0 : p + 1))
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow"
                  >
                    <ChevronRight size={20} />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, i) => (
                      <span
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i === activeImage ? "bg-white" : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image Available
            </div>
          )}

          <button
            onClick={() => toggleWishlist(listing.id)}
            className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2.5 rounded-full shadow"
          >
            <Heart
              size={20}
              className={wishlisted ? "fill-primary text-primary" : "text-gray-500"}
            />
          </button>

          <span className="absolute top-4 left-4 bg-primary text-white text-xs font-semibold px-3 py-1.5 rounded-full">
            {listing.listingType === "RENT" ? "For Rent" : "For Sale"}
          </span>
        </div>

        <div className="grid lg:grid-cols-[1fr_340px] gap-8">
          {/* Left: Details */}
          <div>
            <span className="text-primary text-xs font-semibold uppercase tracking-wide">
              {CATEGORY_LABELS[listing.category] || listing.category}
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1 mb-2">
              {listing.title}
            </h1>
            <p className="text-gray-500 flex items-center gap-1.5 mb-4">
              <MapPin size={16} /> {listing.address}
            </p>

            <p className="text-primary text-2xl font-bold mb-6">
              ৳{listing.price.toLocaleString()}
              {listing.listingType === "RENT" && (
                <span className="text-gray-400 text-sm font-normal"> /month</span>
              )}
            </p>

            {/* Quick Specs */}
            <div className="flex flex-wrap gap-4 mb-6 border-y border-gray-200 py-4">
              {listing.bedroom && (
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <BedDouble size={18} className="text-primary" /> {listing.bedroom} Bedrooms
                </div>
              )}
              {listing.bathroom && (
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Bath size={18} className="text-primary" /> {listing.bathroom} Bathrooms
                </div>
              )}
              {listing.areaSize && (
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Ruler size={18} className="text-primary" /> {listing.areaSize} sq ft
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <BadgeCheck size={18} className="text-primary" />
                {listing.bachelorAllowed ? "Bachelor Allowed" : "Family Only"}
              </div>
            </div>

            <h2 className="font-semibold text-gray-900 mb-2">Description</h2>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
              {listing.description}
            </p>
          </div>

          {/* Right: Owner Card + Actions */}
          <aside className="h-fit bg-white border border-gray-100 rounded-2xl shadow-sm p-5 sticky top-20">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
              <div className="w-11 h-11 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold">
                {listing.owner.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{listing.owner.name}</p>
                {listing.owner.verified ? (
                  <span className="flex items-center gap-1 text-xs text-primary">
                    <BadgeCheck size={13} /> Verified Owner
                  </span>
                ) : (
                  <span className="text-xs text-gray-400">Not Verified</span>
                )}
              </div>
            </div>

            <div className="space-y-2.5">
              <Button
                onClick={() => handleProtectedAction("book a visit")}
                className="w-full bg-primary hover:bg-primary-dark text-white flex items-center justify-center gap-2"
              >
                <CalendarCheck size={18} /> Book a Visit
              </Button>
              <Button
                onClick={() => handleProtectedAction("message the owner")}
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary-light flex items-center justify-center gap-2"
              >
                <MessageCircleMore size={18} /> Message Owner
              </Button>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </main>
  );
}