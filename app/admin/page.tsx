"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Home,
  ShieldCheck,
  CalendarCheck,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type Stats = {
  totalUsers: number;
  totalListings: number;
  pendingVerifications: number;
  totalVisits: number;
  typeBreakdown: { name: string; value: number }[];
  categoryBreakdown: { name: string; value: number }[];
};

const COLORS = ["#16A34A", "#86EFAC", "#15803D", "#BBF7D0", "#4ADE80", "#059669"];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return (
      <div className="p-6 md:p-10 animate-pulse space-y-4">
        <div className="h-8 w-48 bg-gray-200 rounded" />
        <div className="h-32 bg-gray-100 rounded-2xl" />
      </div>
    );
  }

   const statCards = [
    { label: "Total Users", value: stats.totalUsers, icon: Users },
    { label: "Total Listings", value: stats.totalListings, icon: Home },
    { label: "Pending Verification", value: stats.pendingVerifications, icon: ShieldCheck },
    { label: "Visit Requests", value: stats.totalVisits, icon: CalendarCheck },
  ];

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
        Dashboard
      </h1>
      <p className="text-gray-500 text-sm mb-8">
        Overview of platform activity and performance.
      </p>