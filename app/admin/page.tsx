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

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white border border-gray-100 rounded-2xl p-5"
            >
              <div className="bg-primary-light w-9 h-9 rounded-lg flex items-center justify-center mb-3">
                <Icon size={18} className="text-primary" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
         {/* Rent vs Sale Pie Chart */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4">
            Rent vs Sale Listings
          </h3>
          {stats.totalListings === 0 ? (
            <p className="text-gray-400 text-sm text-center py-16">
              No listings yet
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={stats.typeBreakdown}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {stats.typeBreakdown.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
            {/* Category Breakdown Pie Chart */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4">
            Listings by Category
          </h3>
          {stats.categoryBreakdown.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-16">
              No listings yet
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={stats.categoryBreakdown}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, value }) => `${name}: ${value}`}
                ></Pie>
      </div>