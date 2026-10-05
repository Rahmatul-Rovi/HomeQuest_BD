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

        {/* Search Card */}
        <div className="bg-white rounded-2xl shadow-lg p-3 md:p-4 max-w-3xl mx-auto">
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setListingType("RENT")}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                listingType === "RENT"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              For Rent
            </button>
            <button
              onClick={() => setListingType("SALE")}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                listingType === "SALE"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              For Sale
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-2">
            <div className="flex items-center flex-1 border border-gray-200 rounded-lg px-3">
              <MapPin size={18} className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search by area (e.g. Mirpur, Dhanmondi)"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full py-3 text-sm outline-none"
              />
            </div>
            <Button
              onClick={handleSearch}
              className="bg-primary hover:bg-primary/90 text-white px-6 flex items-center gap-2"
            >
              <Search size={18} /> Search
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}