"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import { BadgeCheck, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ImageUploader from "@/components/ImageUploader";
import { Button } from "@/components/ui/button";
import type { LatLng } from "@/components/map/LocationPicker";

// Leaflet browser-only, tai ssr: false
const LocationPicker = dynamic(() => import("@/components/map/LocationPicker"), {
  ssr: false,
  loading: () => (
    <div className="h-72 sm:h-80 rounded-xl bg-gray-100 animate-pulse" />
  ),
});

const CATEGORIES = [
  { label: "Full Flat", value: "FULL_FLAT", type: "RENT" },
  { label: "Mess", value: "MESS", type: "RENT" },
  { label: "Seat", value: "SEAT", type: "RENT" },
  { label: "Sublet", value: "SUBLET", type: "RENT" },
  { label: "Flat for Sale", value: "FLAT_SALE", type: "SALE" },
];

type VerifyState = "unknown" | "verified" | "pending" | "none";

export default function NewListingPage() {
  const router = useRouter();
  const { status } = useSession();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("FULL_FLAT");
  const [price, setPrice] = useState("");
  const [bedroom, setBedroom] = useState("");
  const [bathroom, setBathroom] = useState("");
  const [areaSize, setAreaSize] = useState("");
  const [bachelorAllowed, setBachelorAllowed] = useState(true);
  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState<LatLng | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [verifyState, setVerifyState] = useState<VerifyState>("unknown");

  useEffect(() => {
    if (status === "unauthenticated") {
      Swal.fire({
        icon: "info",
        title: "Login Required",
        text: "Please log in to list your property.",
        confirmButtonColor: "#16A34A",
      }).then(() => router.push("/login?redirect=/listings/new"));
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/verification")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return;
        if (data.verified) setVerifyState("verified");
        else if (data.request?.status === "PENDING") setVerifyState("pending");
        else setVerifyState("none");
      })
      .catch(() => {});
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (images.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Add at least one photo",
        confirmButtonColor: "#16A34A",
      });
      return;
    }

    if (!coords) {
      Swal.fire({
        icon: "warning",
        title: "Pin the location",
        text: "Please drop a pin on the map so tenants can find your property.",
        confirmButtonColor: "#16A34A",
      });
      return;
    }

    setSubmitting(true);
    const listingType = CATEGORIES.find((c) => c.value === category)?.type;

    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          listingType,
          category,
          price: Number(price),
          bedroom: bedroom ? Number(bedroom) : null,
          bathroom: bathroom ? Number(bathroom) : null,
          areaSize: areaSize ? Number(areaSize) : null,
          bachelorAllowed,
          address,
          lat: coords.lat,
          lng: coords.lng,
          images,
        }),
      });

      if (!res.ok) throw new Error("Failed");
      const data = await res.json();

      Swal.fire({
        icon: "success",
        title: "Listing Published!",
        text: "Your property is now live on HomeQuest BD.",
        confirmButtonColor: "#16A34A",
      }).then(() => router.push(`/listings/${data.id}`));
    } catch {
      Swal.fire({
        icon: "error",
        title: "Something Went Wrong",
        text: "Could not publish your listing. Please try again.",
        confirmButtonColor: "#16A34A",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading" || status === "unauthenticated") {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading...</p>
      </main>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 py-10 w-full">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
          List Your Property
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          Fill in the details below to publish your property on HomeQuest BD.
        </p>

        {verifyState === "none" && (
          <div className="mb-6 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
            <BadgeCheck size={20} className="text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-amber-900">Get the Verified Owner badge</p>
              <p className="text-amber-800/80 mt-0.5">
                Verified owners earn more trust from tenants.{" "}
                <Link href="/verification" className="font-semibold underline">
                  Verify your ID
                </Link>{" "}
                (takes about 2 minutes).
              </p>
            </div>
          </div>
        )}

        {verifyState === "pending" && (
          <div className="mb-6 flex items-start gap-3 bg-sky-50 border border-sky-200 rounded-xl p-4">
            <Clock size={20} className="text-sky-600 shrink-0 mt-0.5" />
            <p className="text-sm text-sky-900">
              Your ID verification is under review. You can publish your listing in the meantime.
            </p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6"
        >
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Photos</label>
            <ImageUploader images={images} onChange={setImages} />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Spacious 2-Bed Flat in Mirpur"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary bg-white"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label} ({c.type === "RENT" ? "For Rent" : "For Sale"})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Price (৳)</label>
            <input
              type="number"
              required
              min={0}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 15000"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Bedrooms</label>
              <input
                type="number"
                min={0}
                value={bedroom}
                onChange={(e) => setBedroom(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Bathrooms</label>
              <input
                type="number"
                min={0}
                value={bathroom}
                onChange={(e) => setBathroom(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Area (sqft)</label>
              <input
                type="number"
                min={0}
                value={areaSize}
                onChange={(e) => setAreaSize(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Address</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. House 12, Road 5, Mirpur 10, Dhaka"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
              Location on Map
            </label>
            <LocationPicker
              value={coords}
              onChange={setCoords}
              onAddressFound={(found) => setAddress((prev) => prev || found)}
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Description</label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the property, nearby landmarks, facilities etc."
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary resize-none"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={bachelorAllowed}
              onChange={(e) => setBachelorAllowed(e.target.checked)}
              className="accent-primary w-4 h-4"
            />
            Bachelors Allowed
          </label>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary hover:bg-primary-dark text-white py-6 text-base"
          >
            {submitting ? "Publishing..." : "Publish Listing"}
          </Button>
        </form>
      </main>

      <Footer />
    </div>
  );
}