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

       if (!res.ok) {
        Swal.fire({
          icon: "error",
          title: "Could not update",
          text: data.error || "Something went wrong.",
          confirmButtonColor: "#16A34A",
        });
        return;
      }

      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id
            ? {
                ...i,
                status: data.status,
                adminNote: data.adminNote,
                reviewedAt: data.reviewedAt,
                user: {
                  ...i.user,
                  verified: action === "APPROVE" ? true : i.user.verified,
                },
              }
            : i
        )
      );

      Swal.fire({
        icon: "success",
        title: action === "APPROVE" ? "Owner verified" : "Request rejected",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        confirmButtonColor: "#16A34A",
      });
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6 md:p-10 animate-pulse space-y-4">
        <div className="h-8 w-56 bg-gray-200 rounded" />
        <div className="h-48 bg-gray-100 rounded-2xl" />
        <div className="h-48 bg-gray-100 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Verifications</h1>
      <p className="text-gray-500 text-sm mb-8">
        Review ID documents submitted by owners. Documents are private, visible only to admins.
      </p>

      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition ${
              tab === t.value
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label} ({counts[t.value]})
          </button>
        ))}
      </div>

        {visible.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-100 rounded-2xl">
          <Inbox size={36} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Nothing here</p>
          <p className="text-gray-400 text-sm mt-1">No requests in this category.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {visible.map((item) => (
            <div key={item.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  {item.user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.user.image}
                      alt={item.user.name}
                      referrerPolicy="no-referrer"
                      className="w-11 h-11 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold shrink-0">
                      {item.user.name.charAt(0).toUpperCase()}
                    </div>

                     )}
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 flex items-center gap-1.5 truncate">
                      {item.user.name}
                      {item.user.verified && (
                        <BadgeCheck size={15} className="text-primary shrink-0" />
                      )}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5 text-xs text-gray-500 mt-0.5">
                      <span className="flex items-center gap-1 truncate">
                        <Mail size={12} /> {item.user.email}
                      </span>
                      {item.user.phone && (
                        <span className="flex items-center gap-1">
                          <Phone size={12} /> {item.user.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${STATUS_STYLES[item.status]}`}
                >
                  {item.status}
                </span>
              </div>

               <div className="mt-4 pt-4 border-t border-gray-100 grid sm:grid-cols-[1fr_auto] gap-4">
                <div className="space-y-2 text-sm">
                  <p className="text-gray-500">
                    Document:{" "}
                    <span className="font-semibold text-gray-900">{ID_LABELS[item.idType]}</span>
                  </p>
                  <p className="text-gray-500">
                    ID number:{" "}
                    <span className="font-mono font-semibold text-gray-900">{item.idNumber}</span>
                  </p>
                  <p className="text-gray-400 text-xs flex items-center gap-1">
                    <Clock size={12} /> Submitted {formatDate(item.createdAt)}
                  </p>
                  {item.status !== "PENDING" && item.reviewedAt && (
                    <p className="text-gray-400 text-xs">
                      Reviewed {formatDate(item.reviewedAt)}
                      {item.adminNote ? ` · Note: ${item.adminNote}` : ""}
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  {[item.frontImage, item.backImage]
                    .filter((src): src is string => Boolean(src))
                    .map((src, index) => (
                      <button
                        key={src}
                        type="button"
                        onClick={() => setZoom(src)}
                        className="w-28 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 hover:border-primary transition"
                        title="Click to enlarge"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={src}
                          alt={index === 0 ? "ID front" : "ID back"}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                </div>
              </div>

              {item.status === "PENDING" && (
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                  <Button
                    onClick={() => review(item, "APPROVE")}
                    disabled={busyId === item.id}
                    className="flex-1 bg-primary hover:bg-primary-dark text-white flex items-center justify-center gap-1.5 text-sm"
                  >
                    <Check size={15} /> Approve
                  </Button>
                  <Button
                    onClick={() => review(item, "REJECT")}
                    disabled={busyId === item.id}
                    variant="outline"
                    className="flex-1 border-red-200 text-red-500 hover:bg-red-50 flex items-center justify-center gap-1.5 text-sm"
                  >
                    <XIcon size={15} /> Reject
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Image Lightbox */}
      {zoom && (
        <div
          className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4"
          onClick={() => setZoom(null)}
        >
          <button