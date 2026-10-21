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