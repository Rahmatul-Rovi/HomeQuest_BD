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

function PasswordField({
  label,
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
}) {
  const [show, setShow] = useState(false);

  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
        {label}
      </label>
      <div className="flex items-center border border-gray-200 rounded-lg px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition">
        <Lock size={16} className="text-gray-400 mr-2 shrink-0" />
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="w-full py-2.5 text-sm outline-none bg-transparent"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          aria-label={show ? "Hide password" : "Show password"}
          className="text-gray-400 hover:text-gray-600 shrink-0"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>