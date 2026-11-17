"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import Swal from "sweetalert2";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useWishlistStore } from "@/store/wishlistStore";
import {
  Camera,
  BadgeCheck,
  Mail,
  Phone,
  User as UserIcon,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Home,
  CalendarCheck,
  Heart,
  LayoutDashboard,
  MessageCircleMore,
  Bell,
  ShieldCheck,
  Trash2,
} from "lucide-react";

type Role = "TENANT" | "OWNER" | "ADMIN";

type Profile = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  phone: string | null;
  bio: string | null;
  role: Role;
  verified: boolean;
  createdAt: string;
  hasPassword: boolean;
  stats: { listings: number; visitRequests: number };
};

const ROLE_STYLES: Record<Role, { label: string; className: string }> = {
  TENANT: { label: "Tenant", className: "bg-sky-100 text-sky-700" },
  OWNER: { label: "Owner", className: "bg-emerald-100 text-emerald-700" },
  ADMIN: { label: "Admin", className: "bg-amber-100 text-amber-700" },
};