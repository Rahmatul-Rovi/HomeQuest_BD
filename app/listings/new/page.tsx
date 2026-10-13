"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ImageUploader from "@/components/ImageUploader";
import { Button } from "@/components/ui/button";

const CATEGORIES = [
  { label: "Full Flat", value: "FULL_FLAT", type: "RENT" },
  { label: "Mess", value: "MESS", type: "RENT" },
  { label: "Seat", value: "SEAT", type: "RENT" },
  { label: "Sublet", value: "SUBLET", type: "RENT" },
  { label: "Flat for Sale", value: "FLAT_SALE", type: "SALE" },
  { label: "Land for Sale", value: "LAND_SALE", type: "SALE" },
];

export default function NewListingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("FULL_FLAT");
  const [price, setPrice] = useState("");
  const [bedroom, setBedroom] = useState("");
  const [bathroom, setBathroom] = useState("");
  const [areaSize, setAreaSize] = useState("");
  const [bachelorAllowed, setBachelorAllowed] = useState(true);
  const [address, setAddress] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  if (status === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading...</p>
      </main>
    );
  }

   if (status === "unauthenticated") {
    Swal.fire({
      icon: "info",
      title: "Login Required",
      text: "Please log in to list your property.",
      confirmButtonColor: "#16A34A",
    }).then(() => router.push("/login?redirect=/listings/new"));
    return null;
  }

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
          images,
          ownerId: session?.user?.id,
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

   return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 py-10 w-full">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
          List Your Property
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          Fill in the details below to publish your property on HomeQuest BD.
        </p>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
          {/* Photos */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Photos
            </label>
            <ImageUploader images={images} onChange={setImages} />
          </div>

          {/* Title */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
              Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Spacious 2-Bed Flat in Mirpur"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>