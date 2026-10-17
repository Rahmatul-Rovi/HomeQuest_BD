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

      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );

      Swal.fire({
        icon: "success",
        title: newStatus === "CONFIRMED" ? "Visit Confirmed" : "Request Rejected",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Something Went Wrong",
        confirmButtonColor: "#16A34A",
      });
    }
  };

  if (status === "loading" || loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-10 animate-pulse space-y-4">
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="h-40 bg-gray-100 rounded-2xl" />
          <div className="h-40 bg-gray-100 rounded-2xl" />
        </div>
        <Footer />
      </main>
    );
  }

  const pendingCount = requests.filter((r) => r.status === "PENDING").length;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 md:px-8 py-10 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage your listings and visit requests.
            </p>
          </div>
          <Link href="/listings/new">
            <Button className="bg-primary hover:bg-primary-dark text-white flex items-center gap-2">
              <Plus size={18} /> New Listing
            </Button>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("listings")}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition flex items-center gap-2 ${
              activeTab === "listings"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <Home size={16} /> My Listings ({listings.length})
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition flex items-center gap-2 relative ${
              activeTab === "requests"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <CalendarCheck size={16} /> Visit Requests ({requests.length})
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </button>
        </div>
        {/* My Listings Tab */}
        {activeTab === "listings" && (
          <div className="space-y-4">
            {listings.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <Home size={36} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No listings yet</p>
                <p className="text-gray-400 text-sm mt-1 mb-5">
                  Start by adding your first property.
                </p>
                <Link href="/listings/new">
                  <Button className="bg-primary hover:bg-primary-dark text-white">
                    List Your Property
                  </Button>
                </Link>
              </div>
            ) : (
              listings.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/listings/${listing.id}`}
                  className="flex gap-4 bg-white border border-gray-100 rounded-xl p-4 hover:shadow-sm transition"
                >
                  <div className="relative w-24 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    {listing.images[0] ? (
                      <Image
                        src={listing.images[0]}
                        alt={listing.title}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{listing.title}</h3>
                    <p className="text-gray-500 text-xs flex items-center gap-1 mt-0.5">
                      <MapPin size={12} /> {listing.address}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-primary font-bold text-sm">
                        ৳{listing.price.toLocaleString()}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                        {listing.status}
                      </span>
                      <span className="text-xs text-gray-400">
                        {listing._count.visitRequests} visit requests
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}

         {/* Visit Requests Tab */}
        {activeTab === "requests" && (
          <div className="space-y-4">
            {requests.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <CalendarCheck size={36} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No visit requests yet</p>
                <p className="text-gray-400 text-sm mt-1">
                  Requests from interested tenants will show up here.
                </p>
              </div>
            ) : (
              requests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white border border-gray-100 rounded-xl p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-3 min-w-0">
                      <div className="relative w-16 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        {req.listing.images[0] && (
                          <Image
                            src={req.listing.images[0]}
                            alt={req.listing.title}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm truncate">
                          {req.listing.title}
                        </h3>
                         <p className="text-gray-500 text-xs mt-0.5">
                          Requested by <span className="font-medium">{req.tenant.name}</span>
                        </p>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <CalendarCheck size={12} />
                            {new Date(req.visitDate).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} /> {req.visitTime}
                          </span>
                        </div>
                        {req.message && (
                          <p className="text-xs text-gray-500 mt-1.5 italic">
                            &quot;{req.message}&quot;
                          </p>
                        )}
                      </div>
                    </div>

                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${STATUS_STYLES[req.status]}`}
                    >
                      {req.status}
                    </span>
                  </div>
