"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import {
  BadgeCheck,
  ShieldCheck,
  Clock,
  XCircle,
  Lock,
  UploadCloud,
  Loader2,
  X,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

type IdType = "NID" | "PASSPORT" | "DRIVING_LICENSE";

type VerificationInfo = {
  verified: boolean;
  request: null | {
    id: string;
    idType: IdType;
    idNumberMasked: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    adminNote: string | null;
    createdAt: string;
    reviewedAt: string | null;
  };
};


const ID_OPTIONS: { value: IdType; label: string; hasBack: boolean; placeholder: string }[] = [
  { value: "NID", label: "National ID (NID)", hasBack: true, placeholder: "10, 13 or 17 digit NID number" },
  { value: "PASSPORT", label: "Passport", hasBack: false, placeholder: "Passport number" },
  { value: "DRIVING_LICENSE", label: "Driving License", hasBack: true, placeholder: "License number" },
];

const ID_LABELS: Record<IdType, string> = {
  NID: "NID",
  PASSPORT: "Passport",
  DRIVING_LICENSE: "Driving License",
};

async function uploadPrivateImage(file: File): Promise<string> {
  const signRes = await fetch("/api/verification/sign", { method: "POST" });
  const sign = await signRes.json();
  if (!signRes.ok) throw new Error(sign.error || "Could not start the upload.");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", sign.apiKey);
  formData.append("timestamp", String(sign.timestamp));
  formData.append("signature", sign.signature);
  formData.append("folder", sign.folder);
  formData.append("type", sign.type);

   const res = await fetch(
    `https://api.cloudinary.com/v1_1/${sign.cloudName}/image/upload`,
    { method: "POST", body: formData }
  );
  const data = await res.json();
  if (!res.ok || !data.secure_url) {
    throw new Error(data?.error?.message || "Upload failed.");
  }
  return data.secure_url as string;
}

function UploadBox({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | null;
  onChange: (url: string | null) => void;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

   useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      Swal.fire({
        icon: "warning",
        title: "Unsupported file",
        text: "Please upload a JPG, PNG or WebP photo.",
        confirmButtonColor: "#16A34A",
      });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: "warning",
        title: "Photo is too large",
        text: "Please choose a photo under 5 MB.",
        confirmButtonColor: "#16A34A",
      });
      return;
    }

     setUploading(true);
    try {
      const url = await uploadPrivateImage(file);
      setPreview(URL.createObjectURL(file));
      onChange(url);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Upload failed",
        text: err instanceof Error ? err.message : "Please try again.",
        confirmButtonColor: "#16A34A",
      });
    } finally {
      setUploading(false);
    }
  };

  const remove = () => {
    setPreview(null);
    onChange(null);
  };

  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1.5 block">{label}</label>
      {value && preview ? (
        <div className="relative h-40 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt={label} className="w-full h-full object-contain" />
          <button
            type="button"
            onClick={remove}
            aria-label="Remove photo"
            className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 transition"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <label className="h-40 border-2 border-dashed border-gray-300 hover:border-primary rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition text-center px-4">
          {uploading ? (
            <Loader2 size={22} className="animate-spin text-primary" />
          ) : (
            <>
              <UploadCloud size={22} className="text-gray-400" />
              <span className="text-sm text-gray-500">Click to upload</span>
              <span className="text-xs text-gray-400">JPG, PNG or WebP, max 5 MB</span>
            </>
          )}

            <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFile}
            disabled={uploading}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
}

export default function VerificationPage() {
  const router = useRouter();
  const { status } = useSession();

  const [info, setInfo] = useState<VerificationInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const [idType, setIdType] = useState<IdType>("NID");
  const [idNumber, setIdNumber] = useState("");
  const [front, setFront] = useState<string | null>(null);
  const [back, setBack] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/verification");
    }
  }, [status, router]);

  const loadInfo = useCallback(async () => {
    try {
      const res = await fetch("/api/verification");
      if (res.ok) setInfo(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") loadInfo();
  }, [status, loadInfo]);

  const selected = ID_OPTIONS.find((o) => o.value === idType)!;

  const selectType = (type: IdType) => {
    setIdType(type);
    if (type === "PASSPORT") setBack(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!idNumber.trim() || !front || (selected.hasBack && !back)) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete details",
        text: selected.hasBack
          ? "Please enter your ID number and upload both front and back photos."
          : "Please enter your ID number and upload the photo.",
        confirmButtonColor: "#16A34A",
      });
      return;
    }

    setSubmitting(true);
    try {
       const res = await fetch("/api/verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idType, idNumber, frontImage: front, backImage: back }),
      });
      const data = await res.json();

      if (!res.ok) {
        Swal.fire({
          icon: "error",
          title: "Could not submit",
          text: data.error || "Something went wrong.",
          confirmButtonColor: "#16A34A",
        });
        return;
      }

      setIdNumber("");
      setFront(null);
      setBack(null);
      await loadInfo();

      Swal.fire({
        icon: "success",
        title: "Request submitted",
        text: "Our team will review your ID and notify you.",
        confirmButtonColor: "#16A34A",
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        confirmButtonColor: "#16A34A",
      });
    } finally {
      setSubmitting(false);
    }
  };

   const shell = (children: React.ReactNode) => (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">
        <section className="bg-gradient-to-b from-primary-light/60 to-gray-50 border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 md:px-8 py-10">
            <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
              <ShieldCheck className="text-primary" size={32} /> Get Verified
            </h1>
            <p className="text-gray-500 text-sm md:text-base mt-2 max-w-xl">
              Verify your identity to earn the Verified Owner badge and build trust with tenants.
            </p>
          </div>
        </section>
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">{children}</div>
      </main>
      <Footer />
    </div>
  );

   if (status === "loading" || loading || !info) {
    return shell(
      <div className="grid lg:grid-cols-[1fr_1.4fr] gap-6 animate-pulse">
        <div className="h-64 bg-gray-100 rounded-2xl" />
        <div className="h-96 bg-gray-100 rounded-2xl" />
      </div>
    );
  }

  // Already verified
  if (info.verified) {
    return shell(
      <div className="max-w-lg mx-auto text-center bg-white border border-gray-100 rounded-2xl shadow-sm p-10">
        <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-4">
          <BadgeCheck size={32} className="text-primary" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">You&apos;re a Verified Owner</h2>
        <p className="text-gray-500 text-sm mt-2">
          Your listings now show the Verified Owner badge.
        </p>
        <div className="flex justify-center gap-3 mt-6">
          <Link href="/listings/new">
            <Button className="bg-primary hover:bg-primary-dark text-white">List a Property</Button>
          </Link>
          <Link href="/profile">
            <Button variant="outline">My Profile</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Under review
  if (info.request?.status === "PENDING") {
    return shell(
      <div className="max-w-lg mx-auto text-center bg-white border border-gray-100 rounded-2xl shadow-sm p-10">
        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
          <Clock size={30} className="text-amber-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Under review</h2>
        <p className="text-gray-500 text-sm mt-2">
          We received your {ID_LABELS[info.request.idType]} ({info.request.idNumberMasked}) on{" "}
          {new Date(info.request.createdAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
          . You&apos;ll get a notification once it&apos;s reviewed.
        </p>
        <Link href="/dashboard">
          <Button variant="outline" className="mt-6">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

   const rejected = info.request?.status === "REJECTED" ? info.request : null;

  return shell(
    <div className="grid lg:grid-cols-[1fr_1.4fr] gap-6 items-start">
      {/* Left: why + privacy */}
      <div className="space-y-4">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-4">Why get verified?</h2>
          <ul className="space-y-3 text-sm text-gray-600">
            {[
              "A Verified Owner badge on all your listings",
              "Tenants trust verified owners more, so you get more visit requests",
              "Helps us keep fake listings off the platform",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <BadgeCheck size={17} className="text-primary shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-primary-light/50 border border-primary/15 rounded-2xl p-6">
          <h2 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Lock size={16} className="text-primary" /> Your ID stays private
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Your documents are stored privately and are only visible to HomeQuest BD admins for
            review. They are never shown on your profile or listings.
          </p>
        </div>
      </div>

      {/* Right: form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-5"
      >
        {rejected && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
            <XCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-red-800">Your last request was not approved</p>
              {rejected.adminNote && (
                <p className="text-red-700/90 mt-0.5">Reason: {rejected.adminNote}</p>
              )}
              <p className="text-red-700/80 mt-1">Please submit again with clearer photos.</p>
            </div>
          </div>
        )}

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Document type</label>
          <div className="grid sm:grid-cols-3 gap-2">
            {ID_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => selectType(opt.value)}
                className={`px-3 py-2.5 text-sm font-medium rounded-lg border transition ${
                  idType === opt.value
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary"
                }`}
              >
                {opt.label}
              </button>