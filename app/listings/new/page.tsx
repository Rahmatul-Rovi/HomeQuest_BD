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