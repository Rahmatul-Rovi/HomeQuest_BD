"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, MapPin, ShieldCheck, Home, Users } from "lucide-react";
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
    <section className="relative overflow-hidden bg-gradient-to-b from-primary-light/100 to-white">
      {/* Decorative background blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-light rounded-full blur-3xl opacity-50 -translate-y-1/3 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary-light rounded-full blur-3xl opacity-30 translate-y-1/3 -translate-x-1/4" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 pt-14 pb-16 md:pt-20 md:pb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div>
            <div className="inline-flex items-center gap-2 bg-primary-light text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
              <ShieldCheck size={14} />
              Bangladesh&apos;s Verified Rental Platform
            </div>

            <h1 className="text-4xl md:text-[3.3rem] font-bold text-gray-900 leading-[1.1] mb-5 tracking-tight">
              Find Your Next <span className="text-primary">Home</span>,
              <br />
              Instantly.
            </h1>

            <p className="text-gray-500 text-base md:text-lg mb-8 max-w-lg leading-relaxed">
              Verified flats, mess, sublets, and properties for sale — all
              across Bangladesh. No brokers, no hassle, no fake listings.
            </p>

            {/* Search Card */}
            <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 p-3 max-w-xl">
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => setListingType("RENT")}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                    listingType === "RENT"
                      ? "bg-primary text-white shadow-sm"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  For Rent
                </button>
                <button
                  onClick={() => setListingType("SALE")}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                    listingType === "SALE"
                      ? "bg-primary text-white shadow-sm"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  For Sale
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex items-center flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3">
                  <MapPin size={18} className="text-gray-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search by area (e.g. Mirpur, Dhanmondi)"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full py-3 text-sm bg-transparent outline-none"
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  className="bg-primary hover:bg-primary-dark text-white px-6 flex items-center gap-2 shrink-0"
                >
                  <Search size={18} /> Search
                </Button>
              </div>
            </div>

            {/* Trust stats */}
            <div className="flex items-center gap-8 mt-8">
              <div className="flex items-center gap-2">
                <div className="bg-primary-light p-2 rounded-lg">
                  <Home size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-gray-900 font-bold text-sm leading-none">500+</p>
                  <p className="text-gray-400 text-xs mt-1">Listings</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-primary-light p-2 rounded-lg">
                  <ShieldCheck size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-gray-900 font-bold text-sm leading-none">100%</p>
                  <p className="text-gray-400 text-xs mt-1">Verified Owners</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-primary-light p-2 rounded-lg">
                  <Users size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-gray-900 font-bold text-sm leading-none">1,200+</p>
                  <p className="text-gray-400 text-xs mt-1">Happy Tenants</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Image with floating card */}
          <div className="relative hidden lg:block">
            <div className="relative h-[520px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1637575326945-6d4bc0fdd5c3?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Modern home interior"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Floating card: new listing alert */}
            <div className="absolute -left-8 top-10 bg-white rounded-xl shadow-xl p-4 w-56 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="bg-primary-light p-2.5 rounded-full">
                  <Home size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">New Listing</p>
                  <p className="text-xs text-gray-400">Mirpur, Dhaka</p>
                </div>
              </div>
            </div>

            {/* Floating card: verified badge */}
            <div className="absolute -right-6 bottom-10 bg-white rounded-xl shadow-xl p-4 w-52 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="bg-primary-light p-2.5 rounded-full">
                  <ShieldCheck size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Verified Owner</p>
                  <p className="text-xs text-gray-400">ID checked & approved</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}