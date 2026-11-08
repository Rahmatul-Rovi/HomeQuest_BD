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