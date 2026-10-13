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