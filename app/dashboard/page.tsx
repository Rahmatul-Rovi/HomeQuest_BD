"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import Swal from "sweetalert2";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Home,
  CalendarCheck,
  MapPin,
  Plus,
  Check,
  X as XIcon,
  Clock,
} from "lucide-react";

type MyListing = {
  id: string;
  title: string;
  address: string;
  price: number;
  listingType: "RENT" | "SALE";
  status: string;
  images: string[];
  _count: { visitRequests: number };
};