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