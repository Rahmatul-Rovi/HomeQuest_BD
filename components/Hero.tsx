"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const router = useRouter();
  const [listingType, setListingType] = useState<"RENT" | "SALE">("RENT");
  const [area, setArea] = useState("");

  const handleSearch = () => {
    const query = new URLSearchParams({ type: listingType, area });
    router.push(`/listings?${query.toString()}`);
  };

  return (
    <section className="bg-gradient-to-b from-primary-light to-white py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
          Find Your Next <span className="text-primary">Home</span>, Instantly
        </h1>
        <p className="text-gray-600 text-base md:text-lg mb-10 max-w-2xl mx-auto">
          Verified flats, mess, sublets, and properties for sale — all across Bangladesh.
          No brokers, no hassle.
        </p>
