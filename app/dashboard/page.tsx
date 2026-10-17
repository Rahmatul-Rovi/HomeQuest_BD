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

type VisitRequest = {
  id: string;
  visitDate: string;
  visitTime: string;
  message: string | null;
  status: string;
  listing: { title: string; address: string; images: string[] };
  tenant: { name: string; email: string };
};

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-emerald-100 text-emerald-700",
  REJECTED: "bg-red-100 text-red-700",
  COMPLETED: "bg-gray-100 text-gray-600",
  CANCELLED: "bg-gray-100 text-gray-400",
};

export default function DashboardPage() {
  const router = useRouter();
  const { status } = useSession();

  const [activeTab, setActiveTab] = useState<"listings" | "requests">("listings");
  const [listings, setListings] = useState<MyListing[]>([]);
  const [requests, setRequests] = useState<VisitRequest[]>([]);
  const [loading, setLoading] = useState(true);

   useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/dashboard");
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;

    const loadData = async () => {
      setLoading(true);
      try {
        const [listingsRes, requestsRes] = await Promise.all([
          fetch("/api/listings/my-listings"),
          fetch("/api/visits?role=owner"),
        ]);
        setListings(await listingsRes.json());
        setRequests(await requestsRes.json());
      } catch {
        Swal.fire({
          icon: "error",
          title: "Failed to load dashboard",
          confirmButtonColor: "#16A34A",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [status]);

  const handleRequestAction = async (id: string, newStatus: "CONFIRMED" | "REJECTED") => {
    try {
      const res = await fetch(`/api/visits/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed");