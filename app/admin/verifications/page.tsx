"use client";

import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { BadgeCheck, Check, X as XIcon, Clock, Phone, Mail, Inbox } from "lucide-react";

type Status = "PENDING" | "APPROVED" | "REJECTED";
type Tab = Status | "ALL";

type VerificationItem = {
  id: string;
  idType: "NID" | "PASSPORT" | "DRIVING_LICENSE";
  idNumber: string;
  frontImage: string;
  backImage: string | null;
  status: Status;
  adminNote: string | null;
  reviewedAt: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    image: string | null;
    role: string;
    verified: boolean;
  };
};

const ID_LABELS = {
  NID: "NID",
  PASSPORT: "Passport",
  DRIVING_LICENSE: "Driving License",
} as const;

const STATUS_STYLES: Record<Status, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  APPROVED: "bg-emerald-100 text-emerald-700",
  REJECTED: "bg-red-100 text-red-600",
};

const TABS: { value: Tab; label: string }[] = [
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "ALL", label: "All" },
];

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function AdminVerificationsPage() {
  const [items, setItems] = useState<VerificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("PENDING");
  const [zoom, setZoom] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/verifications");
        if (res.ok) setItems(await res.json());
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);