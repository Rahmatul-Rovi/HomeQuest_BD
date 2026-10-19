"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Swal from "sweetalert2";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Users,
  Home,
  ShieldCheck,
  CalendarCheck,
  BadgeCheck,
  Trash2,
  ShieldAlert,
} from "lucide-react";

type Stats = {
  totalUsers: number;
  totalListings: number;
  pendingVerifications: number;
  totalVisits: number;
};

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  verified: boolean;
  createdAt: string;
  _count: { listings: number };
};

type AdminListing = {
  id: string;
  title: string;
  address: string;
  price: number;
  status: string;
  images: string[];
  owner: { name: string; verified: boolean };
};

export default function AdminPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [activeTab, setActiveTab] = useState<"users" | "listings">("users");
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [listings, setListings] = useState<AdminListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/admin");
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;

    const loadData = async () => {
      setLoading(true);
      try {
        const [statsRes, usersRes, listingsRes] = await Promise.all([
          fetch("/api/admin/stats"),
          fetch("/api/admin/users"),
          fetch("/api/admin/listings"),
        ]);

        if (statsRes.status === 403) {
          setForbidden(true);
          setLoading(false);
          return;
        }

        setStats(await statsRes.json());
        setUsers(await usersRes.json());
        setListings(await listingsRes.json());
      } catch {
        Swal.fire({
          icon: "error",
          title: "Failed to load admin panel",
          confirmButtonColor: "#16A34A",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [status]);

  const toggleVerify = async (userId: string, current: boolean) => {
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verified: !current }),
    });

    if (res.ok) {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, verified: !current } : u))
      );
      Swal.fire({
        icon: "success",
        title: !current ? "Owner Verified" : "Verification Removed",
        timer: 1000,
        showConfirmButton: false,
      });
    }
  };

  if (status === "loading" || loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-10 animate-pulse space-y-4">
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="h-32 bg-gray-100 rounded-2xl" />
        </div>
        <Footer />
      </main>
    );
  }

  if (forbidden || (session?.user as { role?: string })?.role !== "ADMIN") {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-24 text-center">
          <ShieldAlert size={40} className="text-red-400 mx-auto mb-3" />
          <h1 className="text-xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-500 text-sm mt-1">
            You don&apos;t have permission to view this page.
          </p>
        </div>
        <Footer />
      </main>
    );
  }

   return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 md:px-8 py-10 w-full">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
          Admin Panel
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          Manage users, listings, and platform activity.
        </p>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Users", value: stats.totalUsers, icon: Users },
              { label: "Total Listings", value: stats.totalListings, icon: Home },
              { label: "Pending Verification", value: stats.pendingVerifications, icon: ShieldCheck },
              { label: "Visit Requests", value: stats.totalVisits, icon: CalendarCheck },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="bg-white border border-gray-100 rounded-xl p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-primary-light p-1.5 rounded-lg">
                      <Icon size={16} className="text-primary" />
                    </div>
                  </div>
                  <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-400">{stat.label}</p>
                </div>
              );
            })}
          </div>
        )}

          {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition ${
              activeTab === "users"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab("listings")}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition ${
              activeTab === "listings"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Listings ({listings.length})
          </button>
        </div>

         {/* Users Tab */}
        {activeTab === "users" && (
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="text-left px-4 py-3">Name</th>
                  <th className="text-left px-4 py-3">Role</th>
                  <th className="text-left px-4 py-3">Listings</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t border-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{u.name}</p>
                      <p className="text-xs text-gray-400">{u.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{u._count.listings}</td>
                    <td className="px-4 py-3">
                      {u.verified ? (
                        <span className="flex items-center gap-1 text-xs text-primary">
                          <BadgeCheck size={13} /> Verified
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">Not Verified</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        size="sm"
                        variant={u.verified ? "outline" : "default"}
                        onClick={() => toggleVerify(u.id, u.verified)}
                        className={
                          u.verified
                            ? "text-xs border-red-200 text-red-500 hover:bg-red-50"
                            : "text-xs bg-primary hover:bg-primary-dark text-white"
                        }
                      >
                        {u.verified ? "Unverify" : "Verify"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

         {/* Listings Tab */}
        {activeTab === "listings" && (
          <div className="space-y-3">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl p-4"
              >
                <div className="relative w-16 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  {listing.images[0] && (
                    <Image
                      src={listing.images[0]}
                      alt={listing.title}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">
                    {listing.title}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{listing.address}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Owner: {listing.owner.name}{" "}
                    {listing.owner.verified && (
                      <BadgeCheck size={12} className="inline text-primary ml-0.5" />
                    )}
                  </p>
                </div>

                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 shrink-0">
                  {listing.status}
                </span>