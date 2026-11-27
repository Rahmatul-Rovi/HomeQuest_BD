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

  const counts = useMemo(
    () => ({
      PENDING: items.filter((i) => i.status === "PENDING").length,
      APPROVED: items.filter((i) => i.status === "APPROVED").length,
      REJECTED: items.filter((i) => i.status === "REJECTED").length,
      ALL: items.length,
    }),
    [items]
  );

  const visible = tab === "ALL" ? items : items.filter((i) => i.status === tab);

  const review = async (item: VerificationItem, action: "APPROVE" | "REJECT") => {
    let note: string | undefined;

    if (action === "APPROVE") {
      const confirm = await Swal.fire({
        icon: "question",
        title: "Approve this verification?",
        text: `${item.user.name} will get the Verified Owner badge.`,
        showCancelButton: true,
        confirmButtonText: "Yes, approve",
        confirmButtonColor: "#16A34A",
        cancelButtonColor: "#9CA3AF",
      });
      if (!confirm.isConfirmed) return;
    } else {

          const result = await Swal.fire({
        title: "Reject verification?",
        input: "textarea",
        inputLabel: "Reason (the user will see this)",
        inputPlaceholder: "e.g. The NID photo is blurry. Please upload a clearer photo.",
        inputAttributes: { maxlength: "300" },
        showCancelButton: true,
        confirmButtonText: "Reject",
        confirmButtonColor: "#DC2626",
        cancelButtonColor: "#9CA3AF",
        inputValidator: (value) =>
          !value || value.trim().length < 5
            ? "Please write a short reason (at least 5 characters)."
            : undefined,
      });
      if (!result.isConfirmed) return;
      note = String(result.value).trim();
    }

    setBusyId(item.id);
    try {
      const res = await fetch(`/api/admin/verifications/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, note }),
      });
      const data = await res.json();