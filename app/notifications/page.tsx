"use client";

import { useEffect, useState, useCallback, type ElementType } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Bell,
  BellOff,
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Ban,
  BadgeCheck,
  ShieldAlert,
  Trash2,
  CheckCheck,
} from "lucide-react";

type NotificationItem = {
  id: string;
  type: string;
  title: string;
  body: string;
  link: string | null;
  read: boolean;
  createdAt: string;
};

const TYPE_STYLES: Record<
  string,
  { icon: ElementType; bg: string; text: string }
> = {
  VISIT_REQUEST: { icon: CalendarCheck, bg: "bg-amber-100", text: "text-amber-600" },
  VISIT_CONFIRMED: { icon: CheckCircle2, bg: "bg-emerald-100", text: "text-emerald-600" },
  VISIT_REJECTED: { icon: XCircle, bg: "bg-red-100", text: "text-red-500" },
  VISIT_CANCELLED: { icon: Ban, bg: "bg-gray-100", text: "text-gray-500" },
  OWNER_VERIFIED: { icon: BadgeCheck, bg: "bg-emerald-100", text: "text-emerald-600" },
  OWNER_UNVERIFIED: { icon: ShieldAlert, bg: "bg-amber-100", text: "text-amber-600" },
  LISTING_REMOVED: { icon: Trash2, bg: "bg-red-100", text: "text-red-500" },
};

function timeAgo(dateString: string) {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function NotificationsPage() {
  const router = useRouter();
  const { status } = useSession();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [loading, setLoading] = useState(true);

  // Navbar er badge count sathe sathe update korar jonno
  const refreshNavbarCounts = () =>
    window.dispatchEvent(new Event("hq:counts-refresh"));

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/notifications");
    }
  }, [status, router]);

  const load = useCallback(async () => {
    const res = await fetch("/api/notifications");
    if (res.ok) {
      const data = await res.json();
      setItems(data.notifications);
    }
    setLoading(false);
  }, []);

   useEffect(() => {
    if (status !== "authenticated") return;
    load();
  }, [status, load]);

  const handleOpen = async (item: NotificationItem) => {
    if (!item.read) {
      setItems((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
      );
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id }),
      });
      refreshNavbarCounts();
    }
    if (item.link) router.push(item.link);
  };

   const markAllRead = async () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ all: true }),
    });
    refreshNavbarCounts();
  };

  const clearAll = async () => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "Clear all notifications?",
      text: "This action cannot be undone.",
      showCancelButton: true,
      confirmButtonText: "Yes, clear all",
      confirmButtonColor: "#DC2626",
      cancelButtonColor: "#9CA3AF",
    });
    if (!confirm.isConfirmed) return;

    const res = await fetch("/api/notifications", { method: "DELETE" });
    if (res.ok) {
      setItems([]);
      refreshNavbarCounts();
    }
  };

  const unreadCount = items.filter((n) => !n.read).length;
  const visibleItems =
    filter === "unread" ? items.filter((n) => !n.read) : items;

    if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 max-w-3xl mx-auto px-4 py-10 w-full animate-pulse space-y-3">
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="h-20 bg-gray-100 rounded-xl" />
          <div className="h-20 bg-gray-100 rounded-xl" />
          <div className="h-20 bg-gray-100 rounded-xl" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 py-10 w-full">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Notifications
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Stay updated on visit requests, verification and more.
            </p>
          </div>
           {items.length > 0 && (
            <div className="flex gap-2 shrink-0">
              <Button
                variant="outline"
                onClick={markAllRead}
                disabled={unreadCount === 0}
                className="text-xs flex items-center gap-1.5"
              >
                <CheckCheck size={15} /> Mark all read
              </Button>
              <Button
                variant="outline"
                onClick={clearAll}
                className="text-xs border-red-200 text-red-500 hover:bg-red-50 flex items-center gap-1.5"
              >
                <Trash2 size={15} /> Clear all
              </Button>
            </div>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-5 border-b border-gray-200">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition ${
              filter === "all"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            All ({items.length})
          </button>