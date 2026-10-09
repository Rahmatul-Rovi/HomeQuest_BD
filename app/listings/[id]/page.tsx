"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Swal from "sweetalert2";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useWishlistStore } from "@/store/wishlistStore";
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

    // If Logged then actual booking/chat logic 
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
                  ></button>